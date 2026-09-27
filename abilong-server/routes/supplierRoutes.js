const express = require("express");
const {
  getSuppliers,
  getSupplier,
  getMySupplier,
  updateMySupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { protect, adminOnly, restrictTo } = require("../middleware/auth");
const { supplierValidation, updateSupplierValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");

const router = express.Router();

router.route("/me").get(protect, restrictTo("supplier"), getMySupplier).put(protect, restrictTo("supplier"), writeLimiter, updateSupplierValidation, updateMySupplier);

router.route("/").get(getSuppliers).post(protect, adminOnly, writeLimiter, supplierValidation, createSupplier);
router
  .route("/:id")
  .get(getSupplier)
  .put(protect, adminOnly, writeLimiter, updateSupplierValidation, updateSupplier)
  .delete(protect, adminOnly, writeLimiter, deleteSupplier);

module.exports = router;
