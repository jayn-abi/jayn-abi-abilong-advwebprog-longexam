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

const router = express.Router();

router.route("/me").get(protect, restrictTo("supplier"), getMySupplier).put(protect, restrictTo("supplier"), updateMySupplier);

router.route("/").get(getSuppliers).post(protect, adminOnly, createSupplier);
router
  .route("/:id")
  .get(getSupplier)
  .put(protect, adminOnly, updateSupplier)
  .delete(protect, adminOnly, deleteSupplier);

module.exports = router;
