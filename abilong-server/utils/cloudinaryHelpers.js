const cloudinary = require("../config/cloudinary");
const { CLOUDINARY_FOLDER } = require("../config/config");

// Uploads an in-memory multer file (memoryStorage has no req.file.path)
const uploadImageBuffer = (file, folder = CLOUDINARY_FOLDER) => {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
};

// Removes an image from Cloudinary. Failures are logged, not thrown,
// so a missing remote asset never blocks a product update or delete.
const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    console.error(`Failed to delete Cloudinary image ${publicId}:`, error.message);
  }
};

module.exports = { uploadImageBuffer, deleteImage };
