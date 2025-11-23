import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Clear existing data
await connection.execute('DELETE FROM orderItems');
await connection.execute('DELETE FROM orders');
await connection.execute('DELETE FROM cartItems');
await connection.execute('DELETE FROM products');
await connection.execute('DELETE FROM subcategories');
await connection.execute('DELETE FROM categories');

// Insert main categories
const categories = [
  { name: 'Photos', slug: 'photos', description: 'Impressions photographiques en différents formats', image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=300&fit=crop' },
  { name: 'Livres Photos', slug: 'livres-photos', description: 'Livres photo reliés et personnalisés', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=300&fit=crop' },
  { name: 'Calendriers Photos', slug: 'calendriers-photos', description: 'Calendriers personnalisés avec vos photos', image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=300&fit=crop' },
  { name: 'Cadeaux', slug: 'cadeaux', description: 'Cadeaux personnalisés et articles spéciaux', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop' },
];

const categoryMap = {};
for (const cat of categories) {
  const [result] = await connection.execute(
    'INSERT INTO categories (name, slug, description, image) VALUES (?, ?, ?, ?)',
    [cat.name, cat.slug, cat.description, cat.image]
  );
  categoryMap[cat.slug] = result.insertId;
}

// Insert subcategories
const subcategoriesData = {
  'photos': [
    { name: '10x15 cm', slug: '10x15-cm', description: 'Format 10x15 cm' },
    { name: '13x18 cm', slug: '13x18-cm', description: 'Format 13x18 cm' },
    { name: '20x25 cm', slug: '20x25-cm', description: 'Format 20x25 cm' },
    { name: '9x13 cm', slug: '9x13-cm', description: 'Format 9x13 cm' },
    { name: '18x24 cm', slug: '18x24-cm', description: 'Format 18x24 cm' },
    { name: '21x30 cm (A4)', slug: '21x30-cm-a4', description: 'Format 21x30 cm (A4)' },
    { name: '30x40 cm', slug: '30x40-cm', description: 'Format 30x40 cm' },
  ],
  'livres-photos': [
    { name: 'Petit Format', slug: 'petit-format', description: 'Livres photo petit format' },
    { name: 'Format Standard', slug: 'format-standard', description: 'Livres photo format standard' },
    { name: 'Grand Format', slug: 'grand-format', description: 'Livres photo grand format' },
    { name: 'Carré', slug: 'carre', description: 'Livres photo format carré' },
  ],
  'calendriers-photos': [
    { name: 'Calendrier Mural', slug: 'calendrier-mural', description: 'Calendriers muraux' },
    { name: 'Calendrier Bureau', slug: 'calendrier-bureau', description: 'Calendriers de bureau' },
    { name: 'Calendrier Chevalet', slug: 'calendrier-chevalet', description: 'Calendriers chevalet' },
  ],
  'cadeaux': [
    { name: 'Mugs Personnalisés', slug: 'mugs-personnalises', description: 'Mugs avec vos photos' },
    { name: 'Coussins Photo', slug: 'coussins-photo', description: 'Coussins personnalisés' },
    { name: 'T-shirts Photo', slug: 't-shirts-photo', description: 'T-shirts avec vos photos' },
    { name: 'Cartes de Voeux', slug: 'cartes-voeux', description: 'Cartes de voeux personnalisées' },
  ],
};

const subcategoryMap = {};
for (const [categorySlug, subcats] of Object.entries(subcategoriesData)) {
  const categoryId = categoryMap[categorySlug];
  for (const subcat of subcats) {
    const [result] = await connection.execute(
      'INSERT INTO subcategories (categoryId, name, slug, description) VALUES (?, ?, ?, ?)',
      [categoryId, subcat.name, subcat.slug, subcat.description]
    );
    subcategoryMap[`${categorySlug}-${subcat.slug}`] = result.insertId;
  }
}

// Insert products
const products = [
  // Photos - 10x15 cm
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-10x15-cm'],
    name: 'Photo 10x15 cm - Brillant',
    slug: 'photo-10x15-brillant',
    description: 'Tirage photo 10x15 cm finition brillante',
    price: 299,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-10x15-cm'],
    name: 'Photo 10x15 cm - Mat',
    slug: 'photo-10x15-mat',
    description: 'Tirage photo 10x15 cm finition mate',
    price: 299,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 0,
  },
  // Photos - 13x18 cm
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-13x18-cm'],
    name: 'Photo 13x18 cm - Brillant',
    slug: 'photo-13x18-brillant',
    description: 'Tirage photo 13x18 cm finition brillante',
    price: 399,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  // Photos - 20x25 cm
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-20x25-cm'],
    name: 'Photo 20x25 cm - Brillant',
    slug: 'photo-20x25-brillant',
    description: 'Tirage photo 20x25 cm finition brillante',
    price: 699,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  // Photos - 21x30 cm (A4)
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-21x30-cm-a4'],
    name: 'Photo 21x30 cm (A4) - Brillant',
    slug: 'photo-21x30-a4-brillant',
    description: 'Tirage photo 21x30 cm (A4) finition brillante',
    price: 799,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  // Photos - 30x40 cm
  {
    categoryId: categoryMap['photos'],
    subcategoryId: subcategoryMap['photos-30x40-cm'],
    name: 'Photo 30x40 cm - Brillant',
    slug: 'photo-30x40-brillant',
    description: 'Tirage photo 30x40 cm finition brillante',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  // Livres Photos
  {
    categoryId: categoryMap['livres-photos'],
    subcategoryId: subcategoryMap['livres-photos-petit-format'],
    name: 'Livre Photo Petit Format - Couverture Rigide',
    slug: 'livre-photo-petit-rigide',
    description: 'Livre photo petit format avec couverture rigide',
    price: 2999,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    stock: 50,
    featured: 1,
  },
  {
    categoryId: categoryMap['livres-photos'],
    subcategoryId: subcategoryMap['livres-photos-format-standard'],
    name: 'Livre Photo Format Standard - Couverture Rigide',
    slug: 'livre-photo-standard-rigide',
    description: 'Livre photo format standard avec couverture rigide',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    stock: 50,
    featured: 1,
  },
  {
    categoryId: categoryMap['livres-photos'],
    subcategoryId: subcategoryMap['livres-photos-grand-format'],
    name: 'Livre Photo Grand Format - Couverture Rigide',
    slug: 'livre-photo-grand-rigide',
    description: 'Livre photo grand format avec couverture rigide',
    price: 6999,
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=500&fit=crop',
    stock: 50,
    featured: 1,
  },
  // Calendriers Photos
  {
    categoryId: categoryMap['calendriers-photos'],
    subcategoryId: subcategoryMap['calendriers-photos-calendrier-mural'],
    name: 'Calendrier Mural 2025',
    slug: 'calendrier-mural-2025',
    description: 'Calendrier mural personnalisé 2025',
    price: 1999,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=500&fit=crop',
    stock: 75,
    featured: 1,
  },
  {
    categoryId: categoryMap['calendriers-photos'],
    subcategoryId: subcategoryMap['calendriers-photos-calendrier-bureau'],
    name: 'Calendrier Bureau 2025',
    slug: 'calendrier-bureau-2025',
    description: 'Calendrier de bureau personnalisé 2025',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500&h=500&fit=crop',
    stock: 100,
    featured: 0,
  },
  // Cadeaux
  {
    categoryId: categoryMap['cadeaux'],
    subcategoryId: subcategoryMap['cadeaux-mugs-personnalises'],
    name: 'Mug Personnalisé',
    slug: 'mug-personnalise',
    description: 'Mug avec votre photo personnalisée',
    price: 999,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
    stock: 100,
    featured: 1,
  },
  {
    categoryId: categoryMap['cadeaux'],
    subcategoryId: subcategoryMap['cadeaux-coussins-photo'],
    name: 'Coussin Personnalisé',
    slug: 'coussin-personnalise',
    description: 'Coussin avec votre photo personnalisée',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
    stock: 50,
    featured: 1,
  },
  {
    categoryId: categoryMap['cadeaux'],
    subcategoryId: subcategoryMap['cadeaux-t-shirts-photo'],
    name: 'T-shirt Personnalisé',
    slug: 't-shirt-personnalise',
    description: 'T-shirt avec votre photo personnalisée',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop',
    stock: 75,
    featured: 1,
  },
];

for (const product of products) {
  await connection.execute(
    'INSERT INTO products (categoryId, subcategoryId, name, slug, description, price, originalPrice, image, stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [product.categoryId, product.subcategoryId, product.name, product.slug, product.description, product.price, product.originalPrice || null, product.image, product.stock, product.featured]
  );
}

console.log('Database seeded successfully with categories, subcategories, and products!');
await connection.end();
