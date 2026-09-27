import totebag from '../assets/img/totebag.jpg';
import hydroCoffeeTumbler from '../assets/img/hydroCoffeeTumbler.jpg';
import lamp from '../assets/img/lamp.jpg';
import sweater2 from '../assets/img/sweater2.jpg';
import lanyard from '../assets/img/lanyard.jpg';
import shirt1 from '../assets/img/shirt1.jpg';
import shirt2 from '../assets/img/shirt2.jpg';
import shirt3 from '../assets/img/shirt3.jpg';
import waterjugs from '../assets/img/waterjugs.jpg';
import products from '../assets/img/products.jpg';

const imagesByFilename = {
  'totebag.jpg': totebag,
  'hydroCoffeeTumbler.jpg': hydroCoffeeTumbler,
  'lamp.jpg': lamp,
  'sweater2.jpg': sweater2,
  'lanyard.jpg': lanyard,
  'shirt1.jpg': shirt1,
  'shirt2.jpg': shirt2,
  'shirt3.jpg': shirt3,
  'waterjugs.jpg': waterjugs,
  'products.jpg': products,
};

// Prefers the Cloudinary image, then falls back to the legacy images array
export const resolveProductImage = (product) => {
  if (product?.image?.url) return product.image.url;

  const filename = product?.images?.[0];
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  return imagesByFilename[filename] ?? null;
};

// Must match the server's uploadImageMiddleware limits
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const detectImageType = (bytes) => {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((byte, i) => bytes[i] === byte)) return 'image/png';
  const ascii = (start, end) => String.fromCharCode(...bytes.slice(start, end));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  return null;
};

// Returns an error message, or '' when the file is a valid image.
// Checks the real file contents so renamed non-images are rejected.
export const validateImageFile = async (file) => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Invalid image type. Only JPEG, PNG, and WEBP files are allowed.';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `Image is too large (${sizeMb} MB). Maximum size is 5 MB.`;
  }
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (detectImageType(header) !== file.type) {
    return 'This file is not a real image. Please choose a valid JPEG, PNG, or WEBP file.';
  }
  return '';
};
