const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body("firstName")
    .isString().withMessage("First name must be a string")
    .isLength({ min: 2 }).withMessage("First name must be at least 2 characters long"),
  body("lastName")
    .isString().withMessage("Last name must be a string")
    .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long"),
  body("username")
    .isString().withMessage("Username must be a string")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("email")
    .isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  body("contactNumber")
    .isString().withMessage("Contact number must be a string")
    .isLength({ min: 7 }).withMessage("Contact number must be at least 7 characters long"),
  body("address")
    .isString().withMessage("Address must be a string")
    .isLength({ min: 5 }).withMessage("Address must be at least 5 characters long"),
  body("type")
    .optional()
    .isIn(["customer", "supplier", "admin"]).withMessage("Invalid account type"),

  handleValidation,
];

const loginValidation = [
  body("email")
    .isEmail().withMessage("Invalid email address"),
  body("password")
    .notEmpty().withMessage("Password is required"),

  handleValidation,
];

const updateUserValidation = [
  body("firstName").optional().isString().isLength({ min: 2 }).withMessage("First name must be at least 2 characters long"),
  body("lastName").optional().isString().isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long"),
  body("username").optional().isString().isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
  body("contactNumber").optional().isString().isLength({ min: 7 }).withMessage("Contact number must be at least 7 characters long"),
  body("address").optional().isString().isLength({ min: 5 }).withMessage("Address must be at least 5 characters long"),
  body("password").optional().isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

  handleValidation,
];

const productValidation = [
  body("name").isString().trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters long"),
  body("description").isString().trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
  body("price").isFloat({ min: 0 }).withMessage("Price cannot be negative"),
  body("stock").isInt({ min: 1 }).withMessage("Stock must be greater than 0"),
  body("category").isMongoId().withMessage("A valid category is required"),

  handleValidation,
];

const updateProductValidation = [
  body("name").optional().isString().trim().isLength({ min: 2 }).withMessage("Product name must be at least 2 characters long"),
  body("description").optional().isString().trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price cannot be negative"),
  body("stock").optional().isInt({ min: 1 }).withMessage("Stock must be greater than 0"),
  body("category").optional().isMongoId().withMessage("Invalid category"),

  handleValidation,
];

const categoryValidation = [
  body("name").isString().trim().isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long"),
  body("description").optional().isString(),

  handleValidation,
];

const updateCategoryValidation = [
  body("name").optional().isString().trim().isLength({ min: 2 }).withMessage("Category name must be at least 2 characters long"),
  body("description").optional().isString(),

  handleValidation,
];

const cartItemValidation = [
  body("productId").isMongoId().withMessage("A valid product is required"),
  body("quantity").optional().isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  handleValidation,
];

const updateCartItemValidation = [
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),

  handleValidation,
];

const orderValidation = [
  body("shippingAddress").isString().trim().isLength({ min: 5 }).withMessage("Shipping address must be at least 5 characters long"),
  body("paymentMethod").optional().isIn(["COD", "Card", "GCash"]).withMessage("Invalid payment method"),

  handleValidation,
];

const updateOrderStatusValidation = [
  body("status")
    .isIn(["pending", "confirmed", "ready_for_claiming", "claimed", "cancelled"])
    .withMessage("Invalid order status"),

  handleValidation,
];

const reviewValidation = [
  body("productId").isMongoId().withMessage("A valid product is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").isString().trim().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters long"),

  handleValidation,
];

const updateReviewValidation = [
  body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
  body("comment").optional().isString().trim().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters long"),

  handleValidation,
];

const supplierValidation = [
  body("name").isString().trim().isLength({ min: 2 }).withMessage("Supplier name must be at least 2 characters long"),
  body("contactEmail").optional().isEmail().withMessage("Invalid email address"),
  body("phone").optional().isString(),
  body("address").optional().isString(),

  handleValidation,
];

const updateSupplierValidation = [
  body("name").optional().isString().trim().isLength({ min: 2 }).withMessage("Supplier name must be at least 2 characters long"),
  body("contactEmail").optional().isEmail().withMessage("Invalid email address"),
  body("phone").optional().isString(),
  body("address").optional().isString(),

  handleValidation,
];

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
  productValidation,
  updateProductValidation,
  categoryValidation,
  updateCategoryValidation,
  cartItemValidation,
  updateCartItemValidation,
  orderValidation,
  updateOrderStatusValidation,
  reviewValidation,
  updateReviewValidation,
  supplierValidation,
  updateSupplierValidation,
};
