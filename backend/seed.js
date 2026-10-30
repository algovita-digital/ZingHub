import Product from './models/Product.js';

export const DEFAULT_SLUG = 'mini-car-vacuum-cleaner';

/** Creates the first product if the database is empty. Edit it later from MongoDB or the admin page. */
export async function ensureDefaultProduct() {
  const existing = await Product.findOne({ slug: DEFAULT_SLUG });
  if (existing) return existing;

  const product = await Product.create({
    name: 'Mini Vacuum Cleaner',
    slug: DEFAULT_SLUG,
    tagline: 'Small size, big power. Clean your car and home in minutes.',
    description:
      'A portable, wireless 2-in-1 blower and vacuum cleaner with washable filter. Charges over USB and works anywhere: car seats, keyboards, sofa corners and more.',
    price: 299,
    mrp: null,
    features: [
      'Wireless & USB rechargeable',
      'Powerful suction for dust, pet hair and spills',
      '2-in-1 blower + vacuum',
      'Washable, reusable filter',
      'Compact and portable for car & home',
      'Multiple nozzles included',
    ],
    images: [],
  });
  console.log('Seeded default product');
  return product;
}
