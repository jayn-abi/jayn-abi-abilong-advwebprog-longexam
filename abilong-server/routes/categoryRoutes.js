const express = require("express");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, adminOnly } = require("../middleware/auth");
const { categoryValidation, updateCategoryValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.route("/").get(getCategories).post(protect, adminOnly, writeLimiter, categoryValidation, createCategory);
router
  .route("/:id")
  .get(getCategory)
  .put(protect, adminOnly, writeLimiter, updateCategoryValidation, updateCategory)
  .delete(protect, adminOnly, writeLimiter, deleteCategory);

module.exports = router;
