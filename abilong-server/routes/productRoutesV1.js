const express = require("express");
const {
  getProductsV1,
  getProductV1,
  createProductV1,
  updateProductV1,
  deleteProductV1,
} = require("../controllers/productControllerV1");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(getProductsV1).post(protect, adminOnly, createProductV1);
router
  .route("/:id")
  .get(getProductV1)
  .put(protect, adminOnly, updateProductV1)
  .delete(protect, adminOnly, deleteProductV1);

module.exports = router;
