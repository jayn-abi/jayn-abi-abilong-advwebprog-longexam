const express = require("express");
const { getCart, addItem, updateItem, removeItem, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, getCart).post(protect, addItem).delete(protect, clearCart);
router.route("/:productId").put(protect, updateItem).delete(protect, removeItem);

module.exports = router;
