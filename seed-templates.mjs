import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'photo_ecommerce',
});

const templates = [
  {
    name: 'Vintage Memories',
    description: 'Un design vintage classique avec des filtres sépia et des bordures rétro',
    category: 'photo',
    subcategory: 'vintage',
    thumbnailUrl: 'https://via.placeholder.com/300x300?text=Vintage+Memories',
    previewUrl: 'https://via.placeholder.com/600x600?text=Vintage+Memories',
    templateData: JSON.stringify({
      width: 800,
      height: 600,
      elements: [
        {
          type: 'image',
          x: 50,
          y: 50,
          width: 700,
          height: 500,
          filters: { sepia: 0.8, brightness: 1.1 }
        }
      ]
    }),
    tags: 'vintage,classic,sepia',
    featured: 1,
    sortOrder: 1,
  },
  {
    name: 'Modern Minimalist',
    description: 'Design épuré et moderne avec beaucoup d\'espace blanc',
    category: 'photo',
    subcategory: 'modern',
    thumbnailUrl: 'https://via.placeholder.com/300x300?text=Modern+Minimalist',
    previewUrl: 'https://via.placeholder.com/600x600?text=Modern+Minimalist',
    templateData: JSON.stringify({
      width: 800,
      height: 600,
      elements: [
        {
          type: 'image',
          x: 100,
          y: 100,
          width: 600,
          height: 400,
          filters: { brightness: 1.2, contrast: 1.1 }
        }
      ]
    }),
    tags: 'modern,minimalist,clean',
    featured: 1,
    sortOrder: 2,
  },
  {
    name: 'Photo Book Classic',
    description: 'Mise en page classique pour livres photo avec deux colonnes',
    category: 'book',
    subcategory: 'classic',
    thumbnailUrl: 'https://via.placeholder.com/300x300?text=Photo+Book+Classic',
    previewUrl: 'https://via.placeholder.com/600x600?text=Photo+Book+Classic',
    templateData: JSON.stringify({
      pages: 20,
      layout: 'two-column',
      elements: []
    }),
    tags: 'book,classic,layout',
    featured: 1,
    sortOrder: 3,
  },
  {
    name: 'Calendar 2025 Modern',
    description: 'Calendrier moderne avec design épuré',
    category: 'calendar',
    subcategory: 'modern',
    thumbnailUrl: 'https://via.placeholder.com/300x300?text=Calendar+2025',
    previewUrl: 'https://via.placeholder.com/600x600?text=Calendar+2025',
    templateData: JSON.stringify({
      year: 2025,
      type: 'wall',
      layout: 'monthly'
    }),
    tags: 'calendar,2025,modern',
    featured: 1,
    sortOrder: 4,
  },
  {
    name: 'Custom Mug Design',
    description: 'Design personnalisé pour mug avec votre photo',
    category: 'gift',
    subcategory: 'mug',
    thumbnailUrl: 'https://via.placeholder.com/300x300?text=Custom+Mug',
    previewUrl: 'https://via.placeholder.com/600x600?text=Custom+Mug',
    templateData: JSON.stringify({
      itemType: 'mug',
      size: 'standard',
      color: 'white'
    }),
    tags: 'gift,mug,custom',
    featured: 0,
    sortOrder: 5,
  },
];

try {
  for (const template of templates) {
    await connection.execute(
      `INSERT INTO templates (name, description, category, subcategory, thumbnailUrl, previewUrl, templateData, tags, featured, sortOrder, isPublic, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        template.name,
        template.description,
        template.category,
        template.subcategory,
        template.thumbnailUrl,
        template.previewUrl,
        template.templateData,
        template.tags,
        template.featured,
        template.sortOrder,
      ]
    );
    console.log(`✓ Inserted template: ${template.name}`);
  }
  console.log('\n✓ All templates inserted successfully!');
} catch (error) {
  console.error('Error inserting templates:', error);
} finally {
  await connection.end();
}
