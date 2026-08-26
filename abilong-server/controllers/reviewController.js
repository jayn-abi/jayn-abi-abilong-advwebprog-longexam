const Review = require("../models/reviewModel");
const { HttpStatus } = require("../config/constants");

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ reviews });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

// All reviews across all products (admin moderation view)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "firstName lastName")
      .populate("product", "name")
      .sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ reviews });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
    });
    res.status(HttpStatus.CREATED).json(review);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(HttpStatus.CONFLICT).json({ message: "You already reviewed this product" });
    }
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(HttpStatus.NOT_FOUND).json({ message: "Review not found" });

    const isOwner = review.user.toString() === req.user.id;
    if (!isOwner && req.user.type !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Not authorized to edit this review" });
    }

    const { rating, comment } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    await review.save();

    res.status(HttpStatus.OK).json(review);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(HttpStatus.NOT_FOUND).json({ message: "Review not found" });

    if (review.user.toString() !== req.user.id && req.user.type !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.status(HttpStatus.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { getProductReviews, getAllReviews, createReview, updateReview, deleteReview };
