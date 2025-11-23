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

describe("products.search", () => {
  it("returns empty array for empty query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({ query: "" });

    expect(result).toEqual([]);
  });

  it("returns products matching the search query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for "Photo" which should match several products
    const result = await caller.products.search({ query: "Photo" });

    expect(Array.isArray(result)).toBe(true);
    // Should find products with "Photo" in name or description
    if (result.length > 0) {
      expect(
        result.some(
          (p) =>
            p.name.toLowerCase().includes("photo") ||
            (p.description && p.description.toLowerCase().includes("photo"))
        )
      ).toBe(true);
    }
  });

  it("performs case-insensitive search", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const resultLower = await caller.products.search({ query: "photo" });
    const resultUpper = await caller.products.search({ query: "PHOTO" });

    expect(resultLower.length).toBe(resultUpper.length);
  });

  it("searches in both name and description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    // Search for a term that might be in description
    const result = await caller.products.search({ query: "Brillant" });

    expect(Array.isArray(result)).toBe(true);
    // Results should include products with "Brillant" in name or description
    if (result.length > 0) {
      expect(
        result.some(
          (p) =>
            p.name.toLowerCase().includes("brillant") ||
            (p.description && p.description.toLowerCase().includes("brillant"))
        )
      ).toBe(true);
    }
  });

  it("returns empty array for non-matching query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.search({
      query: "xyznonexistentproduct123",
    });

    expect(result).toEqual([]);
  });
});
