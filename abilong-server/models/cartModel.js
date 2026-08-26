const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
    totalPrice: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

cartSchema.pre("save", function () {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
});

module.exports = mongoose.model("Cart", cartSchema);
