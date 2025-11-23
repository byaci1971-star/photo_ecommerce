import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAuthContext(userId: number): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `test-user-${userId}`,
      email: `test${userId}@example.com`,
      name: `Test User ${userId}`,
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Products Router", () => {
  it("should get all categories", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty("id");
    expect(categories[0]).toHaveProperty("name");
  });

  it("should get featured products", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.getFeatured();

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("price");
  });

  it("should get products by category", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      throw new Error("No categories found");
    }

    const products = await caller.products.getByCategory({ categoryId });

    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]?.categoryId).toBe(categoryId);
  });

  it("should get product by id", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      throw new Error("No categories found");
    }

    const products = await caller.products.getByCategory({ categoryId });
    const productId = products[0]?.id;

    if (!productId) {
      throw new Error("No products found");
    }

    const product = await caller.products.getById({ id: productId });

    expect(product).toBeDefined();
    expect(product?.id).toBe(productId);
    expect(product?.name).toBeDefined();
  });
});

describe("Cart Router", () => {
  it("should add item to cart", async () => {
    const userId = 1;
    const ctx = createAuthContext(userId);
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      throw new Error("No categories found");
    }

    const products = await caller.products.getByCategory({ categoryId });
    const productId = products[0]?.id;

    if (!productId) {
      throw new Error("No products found");
    }

    await caller.cart.addItem({ productId, quantity: 2 });
    const cartItems = await caller.cart.getItems();

    expect(Array.isArray(cartItems)).toBe(true);
    expect(cartItems.length).toBeGreaterThan(0);
    expect(cartItems.some(item => item.productId === productId)).toBe(true);
  });

  it("should get cart items for authenticated user", async () => {
    const userId = 2;
    const ctx = createAuthContext(userId);
    const caller = appRouter.createCaller(ctx);

    const cartItems = await caller.cart.getItems();

    expect(Array.isArray(cartItems)).toBe(true);
    expect(cartItems.every(item => item.userId === userId)).toBe(true);
  });

  it("should remove item from cart", async () => {
    const userId = 3;
    const ctx = createAuthContext(userId);
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      throw new Error("No categories found");
    }

    const products = await caller.products.getByCategory({ categoryId });
    const productId = products[0]?.id;

    if (!productId) {
      throw new Error("No products found");
    }

    await caller.cart.addItem({ productId, quantity: 1 });
    let cartItems = await caller.cart.getItems();
    const cartItemId = cartItems.find(item => item.productId === productId)?.id;

    if (!cartItemId) {
      throw new Error("No cart items found");
    }

    await caller.cart.removeItem({ cartItemId });
    cartItems = await caller.cart.getItems();

    expect(cartItems.find(item => item.productId === productId)).toBeUndefined();
  });

  it("should clear cart", async () => {
    const userId = 4;
    const ctx = createAuthContext(userId);
    const caller = appRouter.createCaller(ctx);

    const categories = await caller.products.getCategories();
    const categoryId = categories[0]?.id;

    if (!categoryId) {
      throw new Error("No categories found");
    }

    const products = await caller.products.getByCategory({ categoryId });
    const productId = products[0]?.id;

    if (!productId) {
      throw new Error("No products found");
    }

    await caller.cart.addItem({ productId, quantity: 1 });
    let cartItems = await caller.cart.getItems();
    expect(cartItems.length).toBeGreaterThan(0);

    await caller.cart.clear();
    cartItems = await caller.cart.getItems();

    expect(cartItems.filter(item => item.userId === userId).length).toBe(0);
  });
});
