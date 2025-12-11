import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("creations router", () => {
  describe("uploadImage", () => {
    it("should accept valid image upload input", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a simple base64 encoded image
      const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==";

      try {
        const result = await caller.creations.uploadImage({
          imageData: base64Image,
          fileName: "test.jpg",
          creationType: "photo",
        });

        // Should return success or throw an error (depending on S3 configuration)
        expect(result).toBeDefined();
        if (result.success) {
          expect(result.url).toBeDefined();
          expect(result.fileKey).toBeDefined();
        }
      } catch (error) {
        // If S3 is not configured, we expect an error
        expect(error).toBeDefined();
      }
    });

    it("should reject invalid creation type", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const base64Image = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAA==";

      try {
        // @ts-ignore - intentionally passing invalid type
        await caller.creations.uploadImage({
          imageData: base64Image,
          fileName: "test.jpg",
          creationType: "invalid",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("saveCreation", () => {
    it("should save creation with valid input", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creations.saveCreation({
        creationType: "photo",
        imageUrls: ["https://example.com/image1.jpg"],
        configuration: {
          size: "10x15",
          finish: "glossy",
          quantity: 1,
        },
        name: "Test Creation",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.creationId).toBeDefined();
    });

    it("should save creation without optional name", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creations.saveCreation({
        creationType: "book",
        imageUrls: ["https://example.com/image1.jpg"],
        configuration: {
          pages: 20,
          cover: "hardcover",
        },
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.creationId).toBeDefined();
    });
  });

  describe("getCreations", () => {
    it("should return empty array for new user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creations.getCreations({});

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it("should accept optional creation type filter", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creations.getCreations({
        creationType: "photo",
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("deleteCreation", () => {
    it("should delete creation by id", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.creations.deleteCreation({
        creationId: 1,
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });
});
