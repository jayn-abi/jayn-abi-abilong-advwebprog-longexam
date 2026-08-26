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

export const resolveProductImage = (images) => {
  const filename = images?.[0];
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  return imagesByFilename[filename] ?? null;
};
