const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("./config");

const globalWithMongoose = global;
let cached = globalWithMongoose._mongoose;

if (!cached) {
  cached = globalWithMongoose._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_DB_URL) {
    throw new Error("MONGO_URI environment variable is required");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_DB_URL, {}).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  console.log(`MongoDB connected: ${cached.conn.connection.host}`);
  return cached.conn;
};

module.exports = connectDB;