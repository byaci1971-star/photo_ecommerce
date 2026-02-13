export interface PageData {
  id: string;
  number: number;
  content: string;
  elements?: any[];
}

export interface ProjectPages {
  projectId: number;
  pages: PageData[];
  totalPages: number;
}

/**
 * Generate pages from canvas state for multi-page products
 */
export async function generateProjectPages(
  projectId: number,
  canvasState: any,
  productType: 'book' | 'calendar' | 'poster'
): Promise<ProjectPages> {
  try {
    const pages: PageData[] = [];

    if (productType === 'book' || productType === 'calendar') {
      const itemsPerPage = productType === 'book' ? 4 : 12;
      const totalPages = Math.ceil((canvasState.elements?.length || 1) / itemsPerPage);

      for (let i = 0; i < totalPages; i++) {
        const startIdx = i * itemsPerPage;
        const endIdx = Math.min(startIdx + itemsPerPage, canvasState.elements?.length || 0);
        const pageElements = canvasState.elements?.slice(startIdx, endIdx) || [];

        pages.push({
          id: `page-${projectId}-${i + 1}`,
          number: i + 1,
          content: '',
          elements: pageElements,
        });
      }
    } else {
      pages.push({
        id: `page-${projectId}-1`,
        number: 1,
        content: '',
        elements: canvasState.elements || [],
      });
    }

    return {
      projectId,
      pages,
      totalPages: pages.length,
    };
  } catch (error) {
    console.error('[Pages] Error generating pages:', error);
    throw new Error('Failed to generate pages');
  }
}

/**
 * Get pages for a specific project
 */
export async function getProjectPages(projectId: number): Promise<ProjectPages | null> {
  try {
    const cacheKey = `project-pages-${projectId}`;
    const cached = (global as any)[cacheKey];

    if (cached) {
      return cached;
    }

    return null;
  } catch (error) {
    console.error('[Pages] Error fetching pages:', error);
    return null;
  }
}

/**
 * Cache pages for a project
 */
export async function cacheProjectPages(pages: ProjectPages): Promise<void> {
  try {
    const cacheKey = `project-pages-${pages.projectId}`;
    (global as any)[cacheKey] = pages;
  } catch (error) {
    console.error('[Pages] Error caching pages:', error);
  }
}

/**
 * Update page content
 */
export async function updatePageContent(
  projectId: number,
  pageNumber: number,
  content: string,
  elements?: any[]
): Promise<PageData | null> {
  try {
    const pages = await getProjectPages(projectId);
    if (!pages) return null;

    const pageIndex = pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pages.pages.length) {
      throw new Error('Invalid page number');
    }

    pages.pages[pageIndex].content = content;
    if (elements) {
      pages.pages[pageIndex].elements = elements;
    }

    await cacheProjectPages(pages);
    return pages.pages[pageIndex];
  } catch (error) {
    console.error('[Pages] Error updating page:', error);
    throw new Error('Failed to update page');
  }
}

/**
 * Get page by number
 */
export async function getPageByNumber(
  projectId: number,
  pageNumber: number
): Promise<PageData | null> {
  try {
    const pages = await getProjectPages(projectId);
    if (!pages) return null;

    const pageIndex = pageNumber - 1;
    if (pageIndex < 0 || pageIndex >= pages.pages.length) {
      return null;
    }

    return pages.pages[pageIndex];
  } catch (error) {
    console.error('[Pages] Error fetching page:', error);
    return null;
  }
}

/**
 * Export all pages as images
 */
export async function exportPagesToImages(
  projectId: number
): Promise<string[]> {
  try {
    const pages = await getProjectPages(projectId);
    if (!pages) return [];

    return pages.pages
      .filter((p) => p.content)
      .map((p) => p.content);
  } catch (error) {
    console.error('[Pages] Error exporting pages:', error);
    return [];
  }
}
