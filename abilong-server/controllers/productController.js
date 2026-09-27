const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");
const { resolveRefId, parsePagination, parseSort } = require("../utils/queryHelpers");
const { uploadImageBuffer, deleteImage } = require("../utils/cloudinaryHelpers");

const EMPTY_IMAGE = { url: "", publicId: "" };


const canManageProduct = (user, product) =>
  user.type === "admin" ||
  Boolean(user.supplier && product.supplier?.toString() === user.supplier.toString());


const uploadProductFile = async (file) => {
  try {
    const result = await uploadImageBuffer(file);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    const uploadError = new Error(`Image upload failed: ${error.message}`);
    uploadError.status = HttpStatus.INTERNAL_SERVER_ERROR;
    throw uploadError;
  }
};

const isTruthyFlag = (value) => value === true || value === "true";

const getProducts = async (req, res) => {
  try {
    const { category, search, isActive, sort } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (category) {
      const categoryId = await resolveRefId(Category, category);
      if (categoryId === null) {
        return res.status(HttpStatus.OK).json({ products: [], page, limit, total: 0, totalPages: 0 });
      }
      filter.category = categoryId;
    }
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name")
        .populate("supplier", "name")
        .sort(parseSort(sort))
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(HttpStatus.OK).json({
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("supplier", "name");
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Products belonging to the logged-in supplier
const getMyProducts = async (req, res) => {
  try {
    if (!req.user.supplier) {
      return res.status(HttpStatus.OK).json({ products: [] });
    }
    const products = await Product.find({ supplier: req.user.supplier })
      .populate("category", "name")
      .sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ products });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// Accepts JSON or multipart/form-data with an optional "image" file
const createProduct = async (req, res) => {
  try {
    // Image fields are only set from an uploaded file, never from the body
    const { image, removeImage, ...payload } = req.body;

    if (payload.stock !== undefined && Number(payload.stock) <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Stock must be greater than 0" });
    }

    if (req.user.type === "supplier") {
      if (!req.user.supplier) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "No supplier profile linked to this account" });
      }
      payload.supplier = req.user.supplier;
    }

    const product = new Product(payload);
    await product.validate(); // fail fast before uploading anything

    if (req.file) product.image = await uploadProductFile(req.file);

    try {
      await product.save();
    } catch (error) {
      await deleteImage(product.image?.publicId); 
      throw error;
    }

    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    res.status(error.status || HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

// Accepts JSON or multipart/form-data. Send an "image" file to replace the
// current image, or removeImage=true to remove it.
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });

    const { image, removeImage, ...updates } = req.body;

    if (updates.stock !== undefined && Number(updates.stock) <= 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Stock must be greater than 0" });
    }

    if (!canManageProduct(req.user, product)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only edit your own products" });
    }
    if (req.user.type === "supplier") delete updates.supplier; // suppliers cannot reassign ownership

    Object.assign(product, updates);
    await product.validate();

    const previousPublicId = product.image?.publicId;
    let imageChanged = false;

    if (req.file) {
      product.image = await uploadProductFile(req.file);
      imageChanged = true;
    } else if (isTruthyFlag(removeImage)) {
      product.image = EMPTY_IMAGE;
      imageChanged = true;
    }

    try {
      await product.save();
    } catch (error) {
      if (req.file) await deleteImage(product.image?.publicId);
      throw error;
    }

    // Only remove the old asset once the new state is safely saved
    if (imageChanged) await deleteImage(previousPublicId);

    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    res.status(error.status || HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
    await deleteImage(product.image?.publicId);
    res.status(HttpStatus.OK).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

//uploads/replaces a product's image
const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'No image provided. Upload a file in the "image" field.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Product not found" });

    if (!canManageProduct(req.user, product)) {
      return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "You can only edit your own products" });
    }

    const previousPublicId = product.image?.publicId;
    product.image = await uploadProductFile(req.file);

    try {
      await product.save();
    } catch (error) {
      await deleteImage(product.image.publicId);
      throw error;
    }

    await deleteImage(previousPublicId);

    res.status(HttpStatus.OK).json({
      success: true,
      imageUrl: product.image.url,
      publicId: product.image.publicId,
      product,
    });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id/image — removes a product's image
const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Product not found" });

    if (!canManageProduct(req.user, product)) {
      return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "You can only edit your own products" });
    }

    if (!product.image?.publicId) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "This product has no uploaded image" });
    }

    const previousPublicId = product.image.publicId;
    product.image = EMPTY_IMAGE;
    await product.save();
    await deleteImage(previousPublicId);

    res.status(HttpStatus.OK).json({ success: true, message: "Product image deleted successfully", product });
  } catch (error) {
    res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};
