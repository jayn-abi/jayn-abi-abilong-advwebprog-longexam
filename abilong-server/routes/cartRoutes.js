const express = require("express");
const { getCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");
const { cartItemValidation, updateCartItemValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.route("/").get(protect, getCart).post(protect, writeLimiter, cartItemValidation, addItem).delete(protect, writeLimiter, clearCart);
router.route("/:productId").put(protect, writeLimiter, updateCartItemValidation, updateItem).delete(protect, writeLimiter, removeItem);

module.exports = router;
