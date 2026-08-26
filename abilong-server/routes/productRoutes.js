const express = require("express");
const {
  getProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { getProductReviews, createReview } = require("../controllers/reviewController");
const { protect, adminOnly, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getProducts).post(protect, restrictTo("admin", "supplier"), createProduct);
router.get("/mine", protect, restrictTo("supplier"), getMyProducts);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, restrictTo("admin", "supplier"), updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.route("/:productId/reviews").get(getProductReviews);

module.exports = router;
