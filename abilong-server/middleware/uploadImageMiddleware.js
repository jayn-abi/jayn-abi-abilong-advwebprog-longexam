const path = require("path");
const multer = require("multer");
const { HttpStatus } = require("../config/constants");

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB


const ALLOWED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};


const storage = multer.memoryStorage();

const invalidTypeError = () => {
  const error = new Error("Only JPEG, PNG, and WEBP image files are allowed.");
  error.status = HttpStatus.BAD_REQUEST;
  return error;
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ALLOWED_TYPES[file.mimetype];
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions && allowedExtensions.includes(extension)) {
      cb(null, true);
    } else {
      cb(invalidTypeError());
    }
  },
});


const detectImageType = (buffer) => {
  if (!buffer || buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngSignature.every((byte, i) => buffer[i] === byte)) return "image/png";

  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return "image/webp";

  return null;
};

// Rejects files that only pretend to be images 
// Runs after multer, and does nothing when no file was sent.
const verifyImageSignature = (req, res, next) => {
  if (!req.file) return next();

  const detectedType = detectImageType(req.file.buffer);
  if (!detectedType || detectedType !== req.file.mimetype) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: "The uploaded file is not a valid image. Only real JPEG, PNG, and WEBP files are allowed.",
    });
  }
  next();
};

const MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: `Image is too large. Maximum size is ${MAX_IMAGE_SIZE / (1024 * 1024)} MB.`,
  LIMIT_FILE_COUNT: "Only one image can be uploaded at a time.",
  LIMIT_UNEXPECTED_FILE: 'Unexpected file field. Upload the image using the "image" field.',
};

// Turns multer errors into 400 responses; used by the global error handler
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const status = err.code === "LIMIT_FILE_SIZE" ? HttpStatus.PAYLOAD_TOO_LARGE : HttpStatus.BAD_REQUEST;
    return res.status(status).json({ message: MULTER_ERROR_MESSAGES[err.code] || err.message });
  }
  next(err);
};

module.exports = upload;
module.exports.verifyImageSignature = verifyImageSignature;
module.exports.handleUploadError = handleUploadError;
module.exports.MAX_IMAGE_SIZE = MAX_IMAGE_SIZE;
