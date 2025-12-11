import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories for the e-commerce platform
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: varchar("image", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Product subcategories
 */
export const subcategories = mysqlTable("subcategories", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = typeof subcategories.$inferInsert;

/**
 * Products in the catalog
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  categoryId: int("categoryId").notNull(),
  subcategoryId: int("subcategoryId"),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: int("price").notNull(), // Price in cents
  originalPrice: int("originalPrice"), // Original price for discounts
  image: varchar("image", { length: 512 }).notNull(),
  images: text("images"), // JSON array of image URLs
  stock: int("stock").default(0).notNull(),
  featured: int("featured").default(0).notNull(), // Boolean as int
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Shopping cart items for users
 */
export const cartItems = mysqlTable("cartItems", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = typeof cartItems.$inferInsert;

/**
 * Orders placed by users
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  total: int("total").notNull(), // Total price in cents
  shippingAddress: text("shippingAddress"), // JSON
  billingAddress: text("billingAddress"), // JSON
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Individual items in an order
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  productName: varchar("productName", { length: 255 }).notNull(),
  price: int("price").notNull(), // Price at time of order
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Product attributes (sizes, colors, materials)
 */
export const productAttributes = mysqlTable("productAttributes", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("productId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'size', 'color', 'material'
  value: varchar("value", { length: 255 }).notNull(), // e.g., '10x15 cm', 'Red', 'Paper'
  priceModifier: int("priceModifier").default(0), // Additional price in cents
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProductAttribute = typeof productAttributes.$inferSelect;
export type InsertProductAttribute = typeof productAttributes.$inferInsert;

/**
 * Custom photo products (photos, books, calendars, gifts)
 */
export const customProducts = mysqlTable("customProducts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'photo', 'book', 'calendar', 'gift'
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  basePrice: int("basePrice").notNull(), // Price in cents
  customizationOptions: text("customizationOptions"), // JSON string with selected options
  uploadedImages: text("uploadedImages"), // JSON array of image URLs
  previewImage: varchar("previewImage", { length: 512 }),
  status: varchar("status", { length: 50 }).default("draft").notNull(), // 'draft', 'ready', 'ordered'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomProduct = typeof customProducts.$inferSelect;
export type InsertCustomProduct = typeof customProducts.$inferInsert;

/**
 * Photo print options
 */
export const photoPrintOptions = mysqlTable("photoPrintOptions", {
  id: int("id").autoincrement().primaryKey(),
  customProductId: int("customProductId").notNull(),
  size: varchar("size", { length: 50 }).notNull(), // '10x15', '13x18', '20x25', etc.
  finish: varchar("finish", { length: 50 }).notNull(), // 'glossy', 'matte', 'satin'
  quantity: int("quantity").notNull(),
  pricePerUnit: int("pricePerUnit").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhotoPrintOption = typeof photoPrintOptions.$inferSelect;
export type InsertPhotoPrintOption = typeof photoPrintOptions.$inferInsert;

/**
 * Photo book options
 */
export const photoBookOptions = mysqlTable("photoBookOptions", {
  id: int("id").autoincrement().primaryKey(),
  customProductId: int("customProductId").notNull(),
  size: varchar("size", { length: 50 }).notNull(), // 'A5', 'A4', 'A3'
  pages: int("pages").notNull(),
  cover: varchar("cover", { length: 50 }).notNull(), // 'softcover', 'hardcover'
  binding: varchar("binding", { length: 50 }).notNull(), // 'perfect', 'spiral'
  pricePerBook: int("pricePerBook").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PhotoBookOption = typeof photoBookOptions.$inferSelect;
export type InsertPhotoBookOption = typeof photoBookOptions.$inferInsert;

/**
 * Calendar options
 */
export const calendarOptions = mysqlTable("calendarOptions", {
  id: int("id").autoincrement().primaryKey(),
  customProductId: int("customProductId").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'wall', 'desk', 'pocket'
  size: varchar("size", { length: 50 }).notNull(),
  year: int("year").notNull(),
  language: varchar("language", { length: 10 }).notNull(), // 'fr', 'de', 'en', 'ar'
  pricePerCalendar: int("pricePerCalendar").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CalendarOption = typeof calendarOptions.$inferSelect;
export type InsertCalendarOption = typeof calendarOptions.$inferInsert;

/**
 * Gift item options
 */
export const giftOptions = mysqlTable("giftOptions", {
  id: int("id").autoincrement().primaryKey(),
  customProductId: int("customProductId").notNull(),
  itemType: varchar("itemType", { length: 50 }).notNull(), // 'mug', 'tshirt', 'cushion', 'keychain'
  color: varchar("color", { length: 50 }).notNull(),
  size: varchar("size", { length: 50 }),
  material: varchar("material", { length: 50 }),
  pricePerItem: int("pricePerItem").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GiftOption = typeof giftOptions.$inferSelect;
export type InsertGiftOption = typeof giftOptions.$inferInsert;


/**
 * Studio projects - user's creative workspace projects
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  projectType: varchar("projectType", { length: 50 }).notNull(), // 'photo', 'book', 'calendar', 'gift'
  thumbnailUrl: varchar("thumbnailUrl", { length: 512 }),
  data: text("data"), // JSON stringified project data
  status: varchar("status", { length: 50 }).default("draft").notNull(), // 'draft', 'completed', 'archived'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project images - images used in projects
 */
export const projectImages = mysqlTable("projectImages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  imageUrl: varchar("imageUrl", { length: 512 }).notNull(),
  originalFileName: varchar("originalFileName", { length: 255 }),
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;

/**
 * Project elements - individual elements within a project (text, images, etc)
 */
export const projectElements = mysqlTable("projectElements", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  elementType: varchar("elementType", { length: 50 }).notNull(), // 'image', 'text', 'shape'
  elementData: text("elementData").notNull(), // JSON stringified element properties
  zIndex: int("zIndex").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProjectElement = typeof projectElements.$inferSelect;
export type InsertProjectElement = typeof projectElements.$inferInsert;
