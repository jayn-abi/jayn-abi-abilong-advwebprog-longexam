import totebag from './img/totebag.jpg';
import hydroCoffeeTumbler from './img/hydroCoffeeTumbler.jpg';
import lamp from './img/lamp.jpg';
import sweater2 from './img/sweater2.jpg';
import lanyard from './img/lanyard.jpg';
import shirt1 from './img/shirt1.jpg';
import shirt2 from './img/shirt2.jpg';
import shirt3 from './img/shirt3.jpg';
import waterjugs from './img/waterjugs.jpg';
import products from './img/products.jpg';

const productList = [
  {
    name: 'campus-tote-bag',
    title: 'Campus Tote Bag',
    category: 'Bags',
    price: 'PHP 499',
    image: totebag,
    content: [
      'A roomy everyday tote for books, gym clothes, chargers, and quick campus errands.',
      'Made with thick canvas, reinforced handles, and a clean monochrome print.',
      'Best for students who want one simple carry-all bag for class and after-class plans.',
    ],
  },
  {
    name: 'nu-lady-bulldogs-merch',
    title: 'NU Lady Bulldogs Merch',
    category: 'Merchandise',
    price: 'PHP 249',
    image: shirt2,
    content: [
      'Comfortable pieces for class days, commute days, and weekends.',
    ],
  },
  {
    name: 'hydro-coffee-tumbler',
    title: 'Hydro Coffee Tumbler',
    category: 'Drinkware',
    price: 'PHP 599',
    image: hydroCoffeeTumbler,
    content: [
      'A double-wall tumbler built for water, coffee, or tea during long school days.',
      'The matte finish keeps the look simple while the lid helps reduce spills in your bag.',
      'Fits most side pockets and keeps drinks ready between classes.',
    ],
  },
  {
    name: 'water-jug-set',
    title: 'Water Jug Set',
    category: 'Drinkware',
    price: 'PHP 449',
    image: waterjugs,
    content: [
      'Large-capacity water jugs built for hydration through full school days and gym sessions.',
      'Wide-mouth design makes refilling and cleaning easy between classes.',
      'Durable BPA-free build that holds up daily use in bags and lockers.',
    ],
  },
  {
    name: 'wireless-study-lamp',
    title: 'Wireless Study Lamp',
    category: 'Tech',
    price: 'PHP 899',
    image: lamp,
    content: [
      'A compact rechargeable lamp for dorm desks, night study sessions, and small workspaces.',
      'It has three brightness levels and a foldable body that stores neatly after use.',
      'Good for reading, writing, and focused desk work without taking too much space.',
    ],
  },
  {
    name: 'hoodie-jacket',
    title: 'Hoodie Jacket',
    category: 'Apparel',
    price: 'PHP 1,199',
    image: sweater2,
    content: [
      'A soft everyday hoodie with a relaxed fit for classrooms, commute days, and weekends.',
      'The heavy cotton blend keeps structure while staying comfortable for regular wear.',
      'Available through preorder so sizes can be reserved before release.',
    ],
  },
  {
    name: 'campus-essentials-kit',
    title: 'Campus Essentials Kit',
    category: 'Bundles',
    price: 'PHP 349',
    image: products,
    content: [
      'A bundled set of everyday campus items packed for convenience.',
      'Includes key accessories, stationery, and quick-grab essentials for busy school days.',
      'Keeps daily tools visible without adding clutter.',
    ],
  },
  {
    name: 'id-lanyard-set',
    title: 'ID Lanyard Set',
    category: 'Accessories',
    price: 'PHP 179',
    image: lanyard,
    content: [
      'A durable lanyard and card holder set for IDs, access cards, and small passes.',
      'The clip is easy to detach when scanning or presenting credentials.',
      'Simple enough for daily use and sturdy enough for a full semester.',
    ],
  },
  {
    name: 'exam-week-care-pack',
    title: 'Exam Week Care Pack',
    category: 'Bundles',
    price: 'PHP 399',
    image: shirt1,
    content: [
      'A compact bundle with snacks, tabs, pens, and quick notes for busy review weeks.',
      'Packed for convenience so students can grab one kit and focus on studying.',
      'Ideal as a personal prep item or a small gift for classmates.',
    ],
  },
  {
    name: 'nu-bulldogs-shirt',
    title: 'NU Bulldogs Shirt',
    category: 'Apparel',
    price: 'PHP 299',
    image: shirt3,
    content: [
      'A classic NU Bulldogs shirt for game days, school events, and everyday wear.',
      'Lightweight cotton fabric with a comfortable relaxed fit.',
      'Show your school pride with the iconic Bulldogs branding.',
    ],
  },
];

export default productList;
