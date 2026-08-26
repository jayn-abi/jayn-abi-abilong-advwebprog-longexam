const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Supplier = require("../models/supplierModel");
const { HttpStatus } = require("../config/constants");
const { resolveRefId, parsePagination, parseSort, escapeRegex } = require("../utils/queryHelpers");

const emptyList = (page, limit) =>
  ({ success: true, message: "Products retrieved successfully.", count: 0, page, limit, total: 0, totalPages: 0, data: [] });

const getProductsV1 = async (req, res) => {
  try {
    const { category, supplier, search, isActive, sort } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    if (category) {
      const categoryId = await resolveRefId(Category, category);
      if (categoryId === null) return res.status(HttpStatus.OK).json(emptyList(page, limit));
      filter.category = categoryId;
    }
    if (supplier) {
      const supplierId = await resolveRefId(Supplier, supplier);
      if (supplierId === null) return res.status(HttpStatus.OK).json(emptyList(page, limit));
      filter.supplier = supplierId;
    }
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

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
      success: true,
      message: "Products retrieved successfully.",
      count: products.length,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 0,
      data: products,
    });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
  }
};

const getProductV1 = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("supplier", "name");
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Product not found.", data: null });
    }
    res.status(HttpStatus.OK).json({ success: true, message: "Product retrieved successfully.", data: product });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message, data: null });
  }
};

const createProductV1 = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(HttpStatus.CREATED).json({ success: true, message: "Product created successfully.", data: product });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message, data: null });
  }
};

const updateProductV1 = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Product not found.", data: null });
    }
    res.status(HttpStatus.OK).json({ success: true, message: "Product updated successfully.", data: product });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message, data: null });
  }
};

const deleteProductV1 = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "Product not found.", data: null });
    }
    res.status(HttpStatus.OK).json({ success: true, message: "Product deleted successfully.", data: null });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: error.message, data: null });
  }
};

module.exports = { getProductsV1, getProductV1, createProductV1, updateProductV1, deleteProductV1 };
