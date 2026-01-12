import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as dbTemplates from './db.templates';

describe('Templates Database Functions', () => {
  describe('getTemplates', () => {
    it('should return all public templates', async () => {
      const templates = await dbTemplates.getTemplates({});
      expect(Array.isArray(templates)).toBe(true);
    });

    it('should filter templates by category', async () => {
      const templates = await dbTemplates.getTemplates({ category: 'photo' });
      expect(Array.isArray(templates)).toBe(true);
      if (templates.length > 0) {
        expect(templates[0].category).toBe('photo');
      }
    });

    it('should filter templates by featured flag', async () => {
      const templates = await dbTemplates.getTemplates({ featured: true });
      expect(Array.isArray(templates)).toBe(true);
      if (templates.length > 0) {
        expect(templates[0].featured).toBe(1);
      }
    });
  });

  describe('getTemplateById', () => {
    it('should return a template by id', async () => {
      const templates = await dbTemplates.getTemplates({});
      if (templates.length > 0) {
        const template = await dbTemplates.getTemplateById(templates[0].id);
        expect(template).not.toBeNull();
        expect(template?.id).toBe(templates[0].id);
      }
    });

    it('should return null for non-existent template', async () => {
      const template = await dbTemplates.getTemplateById(99999);
      expect(template).toBeNull();
    });
  });

  describe('getFeaturedTemplates', () => {
    it('should return featured templates only', async () => {
      const templates = await dbTemplates.getFeaturedTemplates();
      expect(Array.isArray(templates)).toBe(true);
      if (templates.length > 0) {
        expect(templates[0].featured).toBe(1);
        expect(templates[0].isPublic).toBe(1);
      }
    });

    it('should return maximum 6 featured templates', async () => {
      const templates = await dbTemplates.getFeaturedTemplates();
      expect(templates.length).toBeLessThanOrEqual(6);
    });
  });

  describe('addTemplateFavorite', () => {
    it('should add a template to user favorites', async () => {
      const templates = await dbTemplates.getTemplates({});
      if (templates.length > 0) {
        const result = await dbTemplates.addTemplateFavorite(1, templates[0].id);
        expect(result).toBeDefined();
      }
    });
  });

  describe('removeTemplateFavorite', () => {
    it('should remove a template from user favorites', async () => {
      const templates = await dbTemplates.getTemplates({});
      if (templates.length > 0) {
        await dbTemplates.addTemplateFavorite(1, templates[0].id);
        const result = await dbTemplates.removeTemplateFavorite(1, templates[0].id);
        expect(result).toBeDefined();
      }
    });
  });

  describe('getUserTemplateFavorites', () => {
    it('should return user favorite templates', async () => {
      const templates = await dbTemplates.getUserTemplateFavorites(1);
      expect(Array.isArray(templates)).toBe(true);
    });
  });

  describe('createTemplate', () => {
    it('should create a new template', async () => {
      const newTemplate = {
        name: 'Test Template',
        description: 'A test template',
        category: 'photo',
        subcategory: 'test',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        previewUrl: 'https://example.com/preview.jpg',
        templateData: JSON.stringify({ test: true }),
        tags: 'test,template',
        featured: false,
        sortOrder: 100,
      };
      const result = await dbTemplates.createTemplate(newTemplate);
      expect(result).toBeDefined();
    });
  });
});
