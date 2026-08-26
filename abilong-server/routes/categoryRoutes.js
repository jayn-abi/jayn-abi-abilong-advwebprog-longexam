const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getCategories).post(protect, adminOnly, createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, adminOnly, updateCategory)
  .delete(protect, adminOnly, deleteCategory);

module.exports = router;
