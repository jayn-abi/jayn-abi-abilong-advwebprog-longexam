const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { HttpStatus } = require("../config/constants");

const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price");
    if (!cart || cart.items.length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.price,
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    cart.items = [];
    await cart.save();

    res.status(HttpStatus.CREATED).json(order);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ orders });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).populate("user", "firstName lastName email").sort({ createdAt: -1 });
    res.status(HttpStatus.OK).json({ orders });
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "firstName lastName email");
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });

    const isOwner = order.user._id.toString() === req.user.id;
    if (!isOwner && req.user.type !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Not authorized to view this order" });
    }
    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    res.status(HttpStatus.OK).json(order);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(HttpStatus.NOT_FOUND).json({ message: "Order not found" });
    res.status(HttpStatus.OK).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getAllOrders, getOrder, updateOrderStatus, deleteOrder };
