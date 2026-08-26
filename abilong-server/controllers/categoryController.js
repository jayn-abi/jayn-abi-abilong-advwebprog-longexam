const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(HttpStatus.OK).json({ categories });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json(category);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(HttpStatus.CREATED).json(category);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json(category);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(HttpStatus.NOT_FOUND).json({ message: "Category not found" });
    res.status(HttpStatus.OK).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
