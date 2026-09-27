require("dotenv").config();

const MONGO_DB_URL = process.env.MONGO_URI;
// const SALT = parseInt(process.env.SALT);
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER || "bulldogs-exchange/products";

module.exports = {
  MONGO_DB_URL,
  PORT,
  SECRET_KEY,
  NODE_ENV,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
};