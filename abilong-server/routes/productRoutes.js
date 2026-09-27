const express = require("express");
const {
  getProducts,
  getProduct,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
} = require("../controllers/productController");
const { getProductReviews, createReview } = require("../controllers/reviewController");
const { protect, adminOnly, restrictTo } = require("../middleware/auth");
const { productValidation, updateProductValidation } = require("../middleware/validationMiddleware");
const { writeLimiter } = require("../middleware/rateLimiterMiddleware");
const upload = require("../middleware/uploadImageMiddleware.js");
const { verifyImageSignature } = upload;

const router = express.Router();


router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    restrictTo("admin", "supplier"),
    writeLimiter,
    upload.single("image"),
    verifyImageSignature,
    productValidation,
    createProduct
  );
router.get("/mine", protect, restrictTo("supplier"), getMyProducts);
router
  .route("/:id")
  .get(getProduct)
  .put(
    protect,
    restrictTo("admin", "supplier"),
    writeLimiter,
    upload.single("image"),
    verifyImageSignature,
    updateProductValidation,
    updateProduct
  )
  .delete(protect, adminOnly, writeLimiter, deleteProduct);

router.post(
  "/:id/upload-image",
  protect,
  restrictTo("admin", "supplier"),
  writeLimiter,
  upload.single("image"),
  verifyImageSignature,
  uploadProductImage
);
router.delete("/:id/image", protect, restrictTo("admin", "supplier"), writeLimiter, deleteProductImage);

router.route("/:productId/reviews").get(getProductReviews);

module.exports = router;
