import { describe, it, expect, beforeEach } from 'vitest';
import * as dbPages from './db.pages';

describe('Pages Module', () => {
  describe('generateProjectPages', () => {
    it('should generate multiple pages for photo books', async () => {
      const canvasState = {
        elements: Array(12).fill(null).map((_, i) => ({
          id: `elem-${i}`,
          type: 'image',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        })),
      };

      const result = await dbPages.generateProjectPages(1, canvasState, 'book');

      expect(result.projectId).toBe(1);
      expect(result.totalPages).toBe(3);
      expect(result.pages.length).toBe(3);
      expect(result.pages[0].number).toBe(1);
      expect(result.pages[0].elements?.length).toBe(4);
      expect(result.pages[2].elements?.length).toBe(4);
    });

    it('should generate multiple pages for calendars', async () => {
      const canvasState = {
        elements: Array(24).fill(null).map((_, i) => ({
          id: `elem-${i}`,
          type: 'image',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        })),
      };

      const result = await dbPages.generateProjectPages(1, canvasState, 'calendar');

      expect(result.projectId).toBe(1);
      expect(result.totalPages).toBe(2);
      expect(result.pages.length).toBe(2);
      expect(result.pages[0].elements?.length).toBe(12);
      expect(result.pages[1].elements?.length).toBe(12);
    });

    it('should generate single page for posters', async () => {
      const canvasState = {
        elements: Array(5).fill(null).map((_, i) => ({
          id: `elem-${i}`,
          type: 'image',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        })),
      };

      const result = await dbPages.generateProjectPages(1, canvasState, 'poster');

      expect(result.projectId).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.pages.length).toBe(1);
      expect(result.pages[0].number).toBe(1);
      expect(result.pages[0].elements?.length).toBe(5);
    });

    it('should handle empty canvas state', async () => {
      const canvasState = { elements: [] };

      const result = await dbPages.generateProjectPages(1, canvasState, 'book');

      expect(result.projectId).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.pages.length).toBe(1);
      expect(result.pages[0].elements?.length).toBe(0);
    });

    it('should generate correct page IDs', async () => {
      const canvasState = {
        elements: Array(8).fill(null).map((_, i) => ({
          id: `elem-${i}`,
          type: 'image',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        })),
      };

      const result = await dbPages.generateProjectPages(42, canvasState, 'book');

      expect(result.pages[0].id).toBe('page-42-1');
      expect(result.pages[1].id).toBe('page-42-2');
    });
  });

  describe('cacheProjectPages', () => {
    it('should cache pages in global memory', async () => {
      const pages = {
        projectId: 1,
        pages: [
          { id: 'page-1', number: 1, content: '', elements: [] },
          { id: 'page-2', number: 2, content: '', elements: [] },
        ],
        totalPages: 2,
      };

      await dbPages.cacheProjectPages(pages);

      const cached = (global as any)['project-pages-1'];
      expect(cached).toBeDefined();
      expect(cached.projectId).toBe(1);
      expect(cached.totalPages).toBe(2);
    });
  });

  describe('getProjectPages', () => {
    beforeEach(() => {
      delete (global as any)['project-pages-1'];
      delete (global as any)['project-pages-2'];
    });

    it('should retrieve cached pages', async () => {
      const pages = {
        projectId: 1,
        pages: [
          { id: 'page-1', number: 1, content: 'data1', elements: [] },
        ],
        totalPages: 1,
      };

      await dbPages.cacheProjectPages(pages);
      const retrieved = await dbPages.getProjectPages(1);

      expect(retrieved).toEqual(pages);
    });

    it('should return null if pages not cached', async () => {
      const retrieved = await dbPages.getProjectPages(999);
      expect(retrieved).toBeNull();
    });
  });

  describe('updatePageContent', () => {
    beforeEach(async () => {
      delete (global as any)['project-pages-1'];
      const pages = {
        projectId: 1,
        pages: [
          { id: 'page-1', number: 1, content: 'old', elements: [] },
          { id: 'page-2', number: 2, content: '', elements: [] },
        ],
        totalPages: 2,
      };
      await dbPages.cacheProjectPages(pages);
    });

    it('should update page content', async () => {
      const updated = await dbPages.updatePageContent(1, 1, 'new-content', [{ id: 'elem-1' }]);

      expect(updated?.content).toBe('new-content');
      expect(updated?.elements).toEqual([{ id: 'elem-1' }]);
    });

    it('should throw error for invalid page number', async () => {
      await expect(
        dbPages.updatePageContent(1, 999, 'content')
      ).rejects.toThrow();
    });
  });

  describe('getPageByNumber', () => {
    beforeEach(async () => {
      delete (global as any)['project-pages-1'];
      const pages = {
        projectId: 1,
        pages: [
          { id: 'page-1', number: 1, content: 'content1', elements: [{ id: 'elem-1' }] },
          { id: 'page-2', number: 2, content: 'content2', elements: [{ id: 'elem-2' }] },
        ],
        totalPages: 2,
      };
      await dbPages.cacheProjectPages(pages);
    });

    it('should retrieve page by number', async () => {
      const page = await dbPages.getPageByNumber(1, 1);

      expect(page?.number).toBe(1);
      expect(page?.content).toBe('content1');
      expect(page?.elements).toEqual([{ id: 'elem-1' }]);
    });

    it('should return null for invalid page number', async () => {
      const page = await dbPages.getPageByNumber(1, 999);
      expect(page).toBeNull();
    });

    it('should return correct page for valid page number', async () => {
      const page = await dbPages.getPageByNumber(1, 2);
      expect(page?.number).toBe(2);
      expect(page?.content).toBe('content2');
    });
  });

  describe('exportPagesToImages', () => {
    beforeEach(async () => {
      delete (global as any)['project-pages-1'];
      const pages = {
        projectId: 1,
        pages: [
          { id: 'page-1', number: 1, content: 'data:image/png;base64,abc', elements: [] },
          { id: 'page-2', number: 2, content: 'data:image/png;base64,def', elements: [] },
          { id: 'page-3', number: 3, content: '', elements: [] },
        ],
        totalPages: 3,
      };
      await dbPages.cacheProjectPages(pages);
    });

    it('should export only pages with content', async () => {
      const images = await dbPages.exportPagesToImages(1);

      expect(images.length).toBe(2);
      expect(images[0]).toBe('data:image/png;base64,abc');
      expect(images[1]).toBe('data:image/png;base64,def');
    });

    it('should return empty array if no pages cached', async () => {
      const images = await dbPages.exportPagesToImages(999);
      expect(images).toEqual([]);
    });

    it('should handle project with no pages', async () => {
      delete (global as any)['project-pages-1'];
      const images = await dbPages.exportPagesToImages(1);
      expect(images).toEqual([]);
    });
  });
});
