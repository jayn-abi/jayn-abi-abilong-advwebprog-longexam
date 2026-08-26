const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");
const { resolveRefId, parsePagination, parseSort } = require("../utils/queryHelpers");

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

const createProduct = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.user.type === "supplier") {
      if (!req.user.supplier) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "No supplier profile linked to this account" });
      }
      payload.supplier = req.user.supplier;
    }

    const product = new Product(payload);
    await product.save();
    res.status(HttpStatus.CREATED).json(product);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });

    if (req.user.type === "supplier") {
      const ownsProduct = req.user.supplier && product.supplier?.toString() === req.user.supplier.toString();
      if (!ownsProduct) {
        return res.status(HttpStatus.FORBIDDEN).json({ message: "You can only edit your own products" });
      }
      delete req.body.supplier; // suppliers cannot reassign ownership
    }

    Object.assign(product, req.body);
    await product.save();
    res.status(HttpStatus.OK).json(product);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });
    res.status(HttpStatus.OK).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { getProducts, getProduct, getMyProducts, createProduct, updateProduct, deleteProduct };
