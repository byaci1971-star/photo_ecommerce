import { getDb } from './db';
import { templates, templateFavorites } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function getTemplates(filters: {
  category?: string;
  subcategory?: string;
  featured?: boolean;
}) {
  const db = await getDb();
  if (!db) return [];

  try {
    let conditions = [eq(templates.isPublic, 1)];

    if (filters.category) {
      conditions.push(eq(templates.category, filters.category));
    }
    if (filters.subcategory) {
      conditions.push(eq(templates.subcategory, filters.subcategory));
    }
    if (filters.featured) {
      conditions.push(eq(templates.featured, 1));
    }

    return await db.select().from(templates)
      .where(and(...conditions))
      .orderBy(templates.sortOrder);
  } catch (error) {
    console.error('[Templates] Error fetching templates:', error);
    return [];
  }
}

export async function getTemplateById(templateId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(templates).where(eq(templates.id, templateId));
    return result[0] || null;
  } catch (error) {
    console.error('[Templates] Error fetching template:', error);
    return null;
  }
}

export async function getFeaturedTemplates() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(templates)
      .where(and(eq(templates.isPublic, 1), eq(templates.featured, 1)))
      .orderBy(templates.sortOrder)
      .limit(6);
  } catch (error) {
    console.error('[Templates] Error fetching featured templates:', error);
    return [];
  }
}

export async function addTemplateFavorite(userId: number, templateId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(templateFavorites).values({
      userId,
      templateId,
    });
    return result;
  } catch (error) {
    console.error('[Templates] Error adding favorite:', error);
    throw error;
  }
}

export async function removeTemplateFavorite(userId: number, templateId: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    return await db.delete(templateFavorites)
      .where(and(eq(templateFavorites.userId, userId), eq(templateFavorites.templateId, templateId)));
  } catch (error) {
    console.error('[Templates] Error removing favorite:', error);
    throw error;
  }
}

export async function getUserTemplateFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    const favorites = await db.select().from(templateFavorites)
      .where(eq(templateFavorites.userId, userId));
    
    const templateIds = favorites.map(f => f.templateId);
    if (templateIds.length === 0) return [];

    const result = await Promise.all(
      templateIds.map(id => db.select().from(templates).where(eq(templates.id, id)))
    );
    return result.flat() as any[];
  } catch (error) {
    console.error('[Templates] Error fetching favorites:', error);
    return [];
  }
}

export async function createTemplate(data: {
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  thumbnailUrl: string;
  previewUrl?: string;
  templateData: string;
  tags?: string;
  featured?: boolean;
  sortOrder?: number;
}) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(templates).values({
      name: data.name,
      description: data.description,
      category: data.category,
      subcategory: data.subcategory,
      thumbnailUrl: data.thumbnailUrl,
      previewUrl: data.previewUrl,
      templateData: data.templateData,
      tags: data.tags,
      featured: data.featured ? 1 : 0,
      sortOrder: data.sortOrder || 0,
      isPublic: 1,
    });
    return result;
  } catch (error) {
    console.error('[Templates] Error creating template:', error);
    throw error;
  }
}
