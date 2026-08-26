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

const router = express.Router();

router.route("/").post(protect, createOrder);
router.route("/mine").get(protect, getMyOrders);
router.route("/admin").get(protect, adminOnly, getAllOrders);
router.route("/:id").get(protect, getOrder).delete(protect, adminOnly, deleteOrder);
router.route("/:id/status").put(protect, adminOnly, updateOrderStatus);

module.exports = router;
