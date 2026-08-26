require("dotenv").config();

const MONGO_DB_URL = process.env.MONGO_URI;
// const SALT = parseInt(process.env.SALT);
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
  MONGO_DB_URL,
  PORT,
  SECRET_KEY,
  NODE_ENV,
};