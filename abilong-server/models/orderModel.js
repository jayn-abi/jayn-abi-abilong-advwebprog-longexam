const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (items) => items.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    shippingAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "Card", "GCash"],
      default: "COD",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready_for_claiming", "claimed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
