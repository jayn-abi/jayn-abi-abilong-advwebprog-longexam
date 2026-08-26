// Superseded by userModel.js for the Bulldogs Exchange schema (Lab Activity 2).
// Kept for reference only — commented out so it can't collide with the "User" model
// registered in userModel.js if this file is ever required again.
/*
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Import bcryptjs

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["admin", "editor", "viewer"],
    default: "editor",
  },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

// Pre-save hook to hash the password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
*/
