import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, categories, subcategories, products, cartItems, orders, orderItems, productAttributes } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Product queries
 */
export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories);
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.categoryId, categoryId));
}

export async function getSubcategoriesByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(subcategories).where(eq(subcategories.categoryId, categoryId));
}

export async function getSubcategoryById(subcategoryId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subcategories).where(eq(subcategories.id, subcategoryId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsBySubcategory(subcategoryId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.subcategoryId, subcategoryId));
}

export async function getFeaturedProducts(limit = 6) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.featured, 1)).limit(limit);
}

export async function getProductById(productId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchProducts(query: string) {
  const db = await getDb();
  if (!db) return [];
  if (!query || query.trim().length === 0) return [];
  
  try {
    // Get all products and filter in memory (simple approach)
    const allProducts = await db.select().from(products);
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
    );
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Cart queries
 */
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addToCart(userId: number, productId: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if item already in cart
  const existing = await db.select().from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1);
  
  if (existing.length > 0) {
    // Update quantity
    return await db.update(cartItems)
      .set({ quantity: existing[0].quantity + quantity })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    // Insert new item
    return await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
    });
  }
}

export async function removeFromCart(cartItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
}

export async function clearCart(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

/**
 * Order queries
 */
export async function createOrder(userId: number, total: number, shippingAddress: string, billingAddress: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(orders).values({
    userId,
    total,
    shippingAddress,
    billingAddress,
    status: "pending",
  });
  
  return result;
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function addOrderItems(orderId: number, items: Array<{ productId: number; productName: string; price: number; quantity: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(orderItems).values(
    items.map(item => ({
      orderId,
      ...item,
    }))
  );
}


/**
 * Product attributes queries
 */
export async function getProductAttributes(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productAttributes).where(eq(productAttributes.productId, productId));
}

export async function getAttributesByType(productId: number, type: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productAttributes)
    .where(and(eq(productAttributes.productId, productId), eq(productAttributes.type, type)));
}

/**
 * Stripe customer queries
 */
export async function updateUserStripeCustomerId(userId: number, stripeCustomerId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(users)
    .set({ stripeCustomerId })
    .where(eq(users.id, userId));
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
