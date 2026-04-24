const mongoose = require('mongoose');
const Product = require('./models/products');

const productsData = [
  {
    name: 'Daikin FTL 3-Star Fixed Speed',
    slug: 'daikin-ftl-3star',
    description: 'Reliable cooling for consistent environments. High-performance non-inverter technology.',
    category: 'Room AC',
    image: '/products/daikin_ftl_3star_1776342800676.png',
    variants: [
      { type: '1.0 TR', price: 32500, model: 'FTL28U' },
      { type: '1.5 TR', price: 41200, model: 'FTL50U' },
      { type: '2.0 TR', price: 54800, model: 'FTL60U' }
    ]
  },
  {
    name: 'Daikin FTKL 3-Star Inverter',
    slug: 'daikin-ftkl-3star-inverter',
    description: 'The Smart choice for energy efficiency and powerful cooling. Our best-selling model.',
    category: 'Room AC',
    image: '/products/daikin_ftkl_best_seller_1776343022422.png',
    variants: [
      { type: '1.0 TR', price: 36800, model: 'FTKL28TV' },
      { type: '1.5 TR', price: 44500, model: 'FTKL50TV' },
      { type: '2.0 TR', price: 59200, model: 'FTKL60TV' }
    ]
  },
  {
    name: 'Daikin FTKG 5-Star Inverter',
    slug: 'daikin-ftkg-5star-inverter',
    description: 'Premium efficiency with air purification. Ideal for health-conscious environments.',
    category: 'Room AC',
    image: '/products/daikin_ftkg_premium_1776343081832.png',
    variants: [
      { type: '1.0 TR', price: 48500, model: 'FTKG28TV' },
      { type: '1.5 TR', price: 56900, model: 'FTKG50TV' }
    ]
  },
  {
    name: 'Daikin JTKJ 5-Star Premium Inverter',
    slug: 'daikin-jtkj-5star-premium',
    description: 'The ultimate in climate luxury. Unmatched efficiency with high-fidelity air filtration.',
    category: 'Room AC',
    image: '/products/daikin_jtkj_toptier_1776343163911.png',
    variants: [
      { type: '1.0 TR', price: 52400, model: 'JTKJ28TV' },
      { type: '1.5 TR', price: 62800, model: 'JTKJ50TV' }
    ]
  },
  {
    name: 'Daikin FTQ 2-Star Inverter',
    slug: 'daikin-ftq-2star-inverter',
    description: 'Advanced inverter cooling at a value-driven price point for efficient everyday use.',
    category: 'Room AC',
    image: '/products/daikin_ftq_2star_1776342731832.png',
    variants: [
      { type: '1.0 TR', price: 34200, model: 'FTQ28TV' },
      { type: '1.5 TR', price: 42100, model: 'FTQ50TV' },
      { type: '2.0 TR', price: 55400, model: 'FTQ60TV' }
    ]
  },
  {
    name: 'Daikin VRV X System',
    slug: 'daikin-vrv-x-commercial',
    description: 'State-of-the-art Variable Refrigerant Volume technology for commercial buildings.',
    category: 'Commercial AC',
    image: '',
    variants: [
      { type: 'Setup A', price: 250000, model: 'VRV-X Outdoor' },
      { type: 'Setup B', price: 450000, model: 'VRV-X High Capacity' }
    ]
  },
  {
    name: 'Round Flow Cassette',
    slug: 'daikin-cassette-ac',
    description: '360° airflow for optimal temperature distribution.',
    category: 'Commercial AC',
    image: '',
    variants: [
      { type: '2.0 TR', price: 65000, model: 'FCA60' },
      { type: '3.0 TR', price: 85000, model: 'FCA100' },
      { type: '4.0 TR', price: 110000, model: 'FCA125' }
    ]
  }
];

mongoose.connect('mongodb://localhost:27017/rakshit-ai')
  .then(async () => {
    console.log('Connected to DB');
    await Product.deleteMany({});
    const created = await Product.create(productsData);
    console.log(`Seeded ${created.length} products`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
