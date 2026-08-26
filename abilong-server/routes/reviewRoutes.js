const express = require("express");
const { getAllReviews, createReview, updateReview, deleteReview } = require("../controllers/reviewController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, adminOnly, getAllReviews).post(protect, createReview);
router.route("/:id").put(protect, updateReview).delete(protect, deleteReview);

module.exports = router;
