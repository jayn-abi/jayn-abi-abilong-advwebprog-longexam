const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { PORT } = require("./config/config");
const { HttpStatus } = require("./config/constants");
const { auditLoggerMiddleware } = require("./middleware/auditLoggerMiddleware");
const { handleUploadError } = require("./middleware/uploadImageMiddleware");
const userRoutes = require("./routes/userRoutes");
// const articleRoutes = require("./routes/articleRoutes"); // unused, kept for later
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const productRoutesV1 = require("./routes/productRoutesV1");
const supplierRoutes = require("./routes/supplierRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

connectDB().catch((err) => {
  console.error("MongoDB connection error:", err);
});

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: "sameorigin" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(auditLoggerMiddleware);

app.use("/api/users", userRoutes);
// app.use("/api/articles", articleRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/v1/products", productRoutesV1);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/logs", logRoutes);

// File size / file count / wrong field errors from multer
app.use(handleUploadError);

app.use((err, req, res, next) => {
  console.error(err.stack || err);

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(HttpStatus.BAD_REQUEST).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(HttpStatus.BAD_REQUEST).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(HttpStatus.CONFLICT).json({ message: `${field} already in use` });
  }

  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message || "Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;