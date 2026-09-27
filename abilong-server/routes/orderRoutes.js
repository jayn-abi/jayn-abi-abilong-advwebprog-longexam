const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");
const { orderValidation, updateOrderStatusValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.route("/").post(protect, writeLimiter, orderValidation, createOrder);
router.route("/mine").get(protect, getMyOrders);
router.route("/admin").get(protect, adminOnly, getAllOrders);
router.route("/:id").get(protect, getOrder).delete(protect, adminOnly, writeLimiter, deleteOrder);
router.route("/:id/status").put(protect, adminOnly, writeLimiter, updateOrderStatusValidation, updateOrderStatus);

module.exports = router;
