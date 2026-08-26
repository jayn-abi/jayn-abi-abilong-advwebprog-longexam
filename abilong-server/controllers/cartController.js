const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { HttpStatus } = require("../config/constants");

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product", "name price images");
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(HttpStatus.NOT_FOUND).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    res.status(HttpStatus.CREATED).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(HttpStatus.NOT_FOUND).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.product.toString() === req.params.productId);
    if (!item) return res.status(HttpStatus.NOT_FOUND).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(HttpStatus.NOT_FOUND).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(HttpStatus.NOT_FOUND).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();
    res.status(HttpStatus.OK).json(cart);
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
  }
};

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
