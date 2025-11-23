import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Clear existing data
await connection.execute('DELETE FROM orderItems');
await connection.execute('DELETE FROM orders');
await connection.execute('DELETE FROM cartItems');
await connection.execute('DELETE FROM products');
await connection.execute('DELETE FROM categories');

// Insert categories
const categories = [
  { name: 'Photo Books', slug: 'photo-books', description: 'Beautiful hardcover and softcover photo books', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop' },
  { name: 'Calendars', slug: 'calendars', description: 'Custom photo calendars for every month', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=300&fit=crop' },
  { name: 'Prints', slug: 'prints', description: 'High-quality photo prints in various sizes', image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=300&fit=crop' },
  { name: 'Greeting Cards', slug: 'greeting-cards', description: 'Personalized greeting cards for any occasion', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=300&fit=crop' },
];

const categoryIds = [];
for (const cat of categories) {
  const [result] = await connection.execute(
    'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
    [cat.name, cat.slug, cat.description, cat.image]
  );
  categoryIds.push(result.insertId);
}

// Insert products
const products = [
  {
    categoryId: categoryIds[0],
    name: 'Premium Hardcover Photo Book - A4',
    slug: 'premium-hardcover-a4',
    description: 'Beautiful hardcover photo book with premium paper quality',
    price: 4999, // CHF 49.99
    originalPrice: 6999,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    stock: 50,
    featured: 1,
  },
  {
    categoryId: categoryIds[0],
    name: 'Softcover Photo Book - A5',
    slug: 'softcover-a5',
    description: 'Lightweight softcover photo book perfect for travel',
    price: 2999, // CHF 29.99
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  {
    categoryId: categoryIds[1],
    name: '2025 Wall Calendar',
    slug: 'wall-calendar-2025',
    description: 'Beautiful 12-month wall calendar with your photos',
    price: 1999, // CHF 19.99
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=500&fit=crop',
    stock: 75,
    featured: 1,
  },
  {
    categoryId: categoryIds[1],
    name: 'Desk Calendar 2025',
    slug: 'desk-calendar-2025',
    description: 'Compact desk calendar perfect for your workspace',
    price: 1499, // CHF 14.99
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=500&fit=crop',
    stock: 60,
    featured: 0,
  },
  {
    categoryId: categoryIds[2],
    name: 'Photo Print 20x30cm',
    slug: 'photo-print-20x30',
    description: 'High-quality glossy photo print',
    price: 999, // CHF 9.99
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 200,
    featured: 1,
  },
  {
    categoryId: categoryIds[2],
    name: 'Photo Print 30x40cm',
    slug: 'photo-print-30x40',
    description: 'Premium large format photo print',
    price: 1999, // CHF 19.99
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 150,
    featured: 0,
  },
  {
    categoryId: categoryIds[3],
    name: 'Greeting Card Set (5 cards)',
    slug: 'greeting-card-set-5',
    description: 'Set of 5 personalized greeting cards',
    price: 1499, // CHF 14.99
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  {
    categoryId: categoryIds[3],
    name: 'Birthday Greeting Card',
    slug: 'birthday-greeting-card',
    description: 'Beautiful birthday greeting card with custom photo',
    price: 399, // CHF 3.99
    originalPrice: null,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
    stock: 150,
    featured: 0,
  },
];

for (const product of products) {
  await connection.execute(
    'INSERT INTO products (categoryId, name, slug, description, price, originalPrice, image, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product.categoryId, product.name, product.slug, product.description, product.price, product.originalPrice, product.image, product.stock, product.featured]
  );
}

console.log('Database seeded successfully!');
await connection.end();
