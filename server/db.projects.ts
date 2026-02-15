import { getDb } from './db';
import { projects } from '../drizzle/schema';
import { eq, and, desc, like, inArray } from 'drizzle-orm';

export interface ProjectWithStats {
  id: number;
  name: string;
  type: 'photo' | 'book' | 'calendar' | 'gift';
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  elementCount: number;
}

/**
 * Get all projects for a user with pagination
 */
export async function getUserProjects(
  userId: number,
  limit: number = 12,
  offset: number = 0
): Promise<ProjectWithStats[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.updatedAt))
    .limit(limit)
    .offset(offset);

  return userProjects.map((p: any) => ({
    id: p.id,
    name: p.name,
    type: p.projectType as 'photo' | 'book' | 'calendar' | 'gift',
    thumbnailUrl: p.thumbnailUrl,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    elementCount: 0,
  }));
}

/**
 * Get total count of projects for a user
 */
export async function getUserProjectCount(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db
    .select({ count: projects.id })
    .from(projects)
    .where(eq(projects.userId, userId));

  return result.length;
}

/**
 * Get projects filtered by type
 */
export async function getUserProjectsByType(
  userId: number,
  type: string,
  limit: number = 12,
  offset: number = 0
): Promise<ProjectWithStats[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const userProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.projectType, type)))
    .orderBy(desc(projects.updatedAt))
    .limit(limit)
    .offset(offset);

  return userProjects.map((p: any) => ({
    id: p.id,
    name: p.name,
    type: p.projectType as 'photo' | 'book' | 'calendar' | 'gift',
    thumbnailUrl: p.thumbnailUrl,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    elementCount: 0,
  }));
}

/**
 * Search projects by name
 */
export async function searchUserProjects(
  userId: number,
  searchTerm: string,
  limit: number = 12,
  offset: number = 0
): Promise<ProjectWithStats[]> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const userProjects = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.userId, userId),
        like(projects.name, `%${searchTerm}%`)
      )
    )
    .orderBy(desc(projects.updatedAt))
    .limit(limit)
    .offset(offset);

  return userProjects.map((p: any) => ({
    id: p.id,
    name: p.name,
    type: p.projectType as 'photo' | 'book' | 'calendar' | 'gift',
    thumbnailUrl: p.thumbnailUrl,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    elementCount: 0,
  }));
}

/**
 * Duplicate a project
 */
export async function duplicateProject(
  projectId: number,
  userId: number
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const originalProject = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);

  if (!originalProject.length) {
    throw new Error('Project not found');
  }

  const original = originalProject[0];
  const newName = `${original.name} (Copy)`;

  const result = await db!.insert(projects).values({
    userId,
    name: newName,
    projectType: original.projectType,
    thumbnailUrl: original.thumbnailUrl,
    data: original.data,
  });

  return (result as any).insertId || 0;
}

/**
 * Rename a project
 */
export async function renameProject(
  projectId: number,
  userId: number,
  newName: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(projects)
    .set({ name: newName, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

/**
 * Update project thumbnail
 */
export async function updateProjectThumbnail(
  projectId: number,
  userId: number,
  thumbnailUrl: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .update(projects)
    .set({ thumbnailUrl, updatedAt: new Date() })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

/**
 * Delete a project
 */
export async function deleteProject(
  projectId: number,
  userId: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  await db
    .delete(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
}

/**
 * Delete multiple projects
 */
export async function deleteMultipleProjects(
  projectIds: number[],
  userId: number
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const result = await db
    .delete(projects)
    .where(
      and(
        eq(projects.userId, userId),
        inArray(projects.id, projectIds)
      )
    );

  return (result as any).changes || 0;
}
