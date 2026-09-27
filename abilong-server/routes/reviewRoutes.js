const express = require("express");
const { getAllReviews, createReview, updateReview, deleteReview } = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");
const { reviewValidation, updateReviewValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.route("/").get(protect, adminOnly, getAllReviews).post(protect, writeLimiter, reviewValidation, createReview);
router.route("/:id").put(protect, writeLimiter, updateReviewValidation, updateReview).delete(protect, writeLimiter, deleteReview);

module.exports = router;
