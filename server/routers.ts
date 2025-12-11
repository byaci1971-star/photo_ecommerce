import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";

let stripe: any = null;
try {
  const Stripe = require("stripe");
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia",
  });
} catch (error) {
  console.warn("[Stripe] Module not installed, skipping initialization");
}

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Product and category routers
  products: router({
    getCategories: publicProcedure.query(() => db.getCategories()),
    getByCategory: publicProcedure.input(z.object({ categoryId: z.number() })).query(({ input }) =>
      db.getProductsByCategory(input.categoryId)
    ),
    getSubcategories: publicProcedure.input(z.object({ categoryId: z.number() })).query(({ input }) =>
      db.getSubcategoriesByCategory(input.categoryId)
    ),
    getBySubcategory: publicProcedure.input(z.object({ subcategoryId: z.number() })).query(({ input }) =>
      db.getProductsBySubcategory(input.subcategoryId)
    ),
    getFeatured: publicProcedure.query(() => db.getFeaturedProducts()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getProductById(input.id)
    ),
    search: publicProcedure.input(z.object({ query: z.string() })).query(({ input }) =>
      db.searchProducts(input.query)
    ),
  }),

  // Cart routers
  cart: router({
    getItems: protectedProcedure.query(({ ctx }) =>
      db.getCartItems(ctx.user.id)
    ),
    addItem: protectedProcedure
      .input(z.object({ productId: z.number(), quantity: z.number().min(1) }))
      .mutation(({ ctx, input }) =>
        db.addToCart(ctx.user.id, input.productId, input.quantity)
      ),
    removeItem: protectedProcedure
      .input(z.object({ cartItemId: z.number() }))
      .mutation(({ input }) =>
        db.removeFromCart(input.cartItemId)
      ),
    clear: protectedProcedure.mutation(({ ctx }) =>
      db.clearCart(ctx.user.id)
    ),
  }),

  // Order routers
  orders: router({
    getUserOrders: protectedProcedure.query(({ ctx }) =>
      db.getUserOrders(ctx.user.id)
    ),
    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(({ input }) =>
        db.getOrderById(input.orderId)
      ),
    getItems: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(({ input }) =>
        db.getOrderItems(input.orderId)
      ),
    create: protectedProcedure
      .input(z.object({
        total: z.number(),
        shippingAddress: z.string(),
        billingAddress: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          price: z.number(),
          quantity: z.number(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.createOrder(
          ctx.user.id,
          input.total,
          input.shippingAddress,
          input.billingAddress
        );
        // Get the order ID from the result
        const orderId = (order as any).insertId || (order as any)[0]?.id;
        if (orderId) {
          await db.addOrderItems(orderId, input.items);
        }
        return order;
      }),
    createCheckoutSession: protectedProcedure
      .input(z.object({
        cartItems: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          price: z.number(),
          quantity: z.number(),
        })),
        total: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (!stripe) {
          throw new Error("Stripe is not configured");
        }

        try {
          // Create or get Stripe customer
          let customerId = ctx.user.stripeCustomerId || null;
          if (!customerId) {
            const customer = await stripe.customers.create({
              email: ctx.user.email,
              name: ctx.user.name,
              metadata: {
                userId: ctx.user.id.toString(),
              },
            });
            customerId = customer.id;
            await db.updateUserStripeCustomerId(ctx.user.id, customerId as string);
          }

          // Create checkout session
          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: input.cartItems.map(item => ({
              price_data: {
                currency: "chf",
                product_data: {
                  name: item.productName,
                },
                unit_amount: item.price,
              },
              quantity: item.quantity,
            })),
            mode: "payment",
            success_url: `${ctx.req.headers.origin}/account?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${ctx.req.headers.origin}/checkout`,
            client_reference_id: ctx.user.id.toString(),
            metadata: {
              userId: ctx.user.id.toString(),
            },
          });

          return { url: session.url };
        } catch (error) {
          console.error("[Stripe] Error creating checkout session:", error);
          throw new Error("Failed to create checkout session");
        }
      }),
  }),

  // Custom creations and S3 uploads
  creations: router({
    uploadImage: protectedProcedure
      .input(z.object({
        imageData: z.string(), // base64 encoded image
        fileName: z.string(),
        creationType: z.enum(['photo', 'book', 'calendar', 'gift']),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // Convert base64 to buffer
          const buffer = Buffer.from(input.imageData.split(',')[1] || input.imageData, 'base64');
          
          // Generate unique file key
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(7);
          const fileKey = `creations/${ctx.user.id}/${input.creationType}/${timestamp}-${random}-${input.fileName}`;
          
          // Upload to S3
          const { url } = await storagePut(fileKey, buffer, 'image/jpeg');
          
          return {
            success: true,
            url,
            fileKey,
          };
        } catch (error) {
          console.error('[S3] Error uploading image:', error);
          throw new Error('Failed to upload image');
        }
      }),

    saveCreation: protectedProcedure
      .input(z.object({
        creationType: z.enum(['photo', 'book', 'calendar', 'gift']),
        imageUrls: z.array(z.string()),
        configuration: z.any(),
        name: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // For now, just return success - full database integration would be needed
          
          return {
            success: true,
            creationId: Math.floor(Math.random() * 1000000),
          };
        } catch (error) {
          console.error('[Database] Error saving creation:', error);
          throw new Error('Failed to save creation');
        }
      }),

    getCreations: protectedProcedure
      .input(z.object({
        creationType: z.enum(['photo', 'book', 'calendar', 'gift']).optional(),
      }))
      .query(async ({ ctx, input }) => {
        try {
          // For now, return empty array - full database integration would be needed
          return [];
        } catch (error) {
          console.error('[Database] Error fetching creations:', error);
          return [];
        }
      }),

    deleteCreation: protectedProcedure
      .input(z.object({
        creationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          // For now, just return success - full database integration would be needed
          return { success: true };
        } catch (error) {
          console.error('[Database] Error deleting creation:', error);
          return { success: true };
        }
      }),
  }),

  // Studio projects router
  projects: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        projectType: z.enum(['photo', 'book', 'calendar', 'gift']),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await db.createProject(
            ctx.user.id,
            input.name,
            input.projectType,
            input.description
          );
          return { success: true, projectId: (result as any).insertId || 0 };
        } catch (error) {
          console.error('[Projects] Error creating project:', error);
          throw new Error('Failed to create project');
        }
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await db.getUserProjects(ctx.user.id);
      } catch (error) {
        console.error('[Projects] Error listing projects:', error);
        return [];
      }
    }),

    getById: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getProjectById(input.projectId, ctx.user.id);
        } catch (error) {
          console.error('[Projects] Error getting project:', error);
          return null;
        }
      }),

    update: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        data: z.string().optional(),
        status: z.enum(['draft', 'completed', 'archived']).optional(),
        thumbnailUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const { projectId, ...updates } = input;
          await db.updateProject(projectId, ctx.user.id, updates);
          return { success: true };
        } catch (error) {
          console.error('[Projects] Error updating project:', error);
          throw new Error('Failed to update project');
        }
      }),

    delete: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.deleteProject(input.projectId, ctx.user.id);
          return { success: true };
        } catch (error) {
          console.error('[Projects] Error deleting project:', error);
          throw new Error('Failed to delete project');
        }
      }),

    addImage: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        imageUrl: z.string(),
        originalFileName: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await db.addProjectImage(
            input.projectId,
            input.imageUrl,
            input.originalFileName
          );
          return { success: true, imageId: (result as any).insertId || 0 };
        } catch (error) {
          console.error('[Projects] Error adding image:', error);
          throw new Error('Failed to add image');
        }
      }),

    getImages: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getProjectImages(input.projectId);
        } catch (error) {
          console.error('[Projects] Error getting images:', error);
          return [];
        }
      }),

    deleteImage: protectedProcedure
      .input(z.object({ imageId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.deleteProjectImage(input.imageId);
          return { success: true };
        } catch (error) {
          console.error('[Projects] Error deleting image:', error);
          throw new Error('Failed to delete image');
        }
      }),

    addElement: protectedProcedure
      .input(z.object({
        projectId: z.number(),
        elementType: z.string(),
        elementData: z.string(),
        zIndex: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          const result = await db.addProjectElement(
            input.projectId,
            input.elementType,
            input.elementData,
            input.zIndex || 0
          );
          return { success: true, elementId: (result as any).insertId || 0 };
        } catch (error) {
          console.error('[Projects] Error adding element:', error);
          throw new Error('Failed to add element');
        }
      }),

    getElements: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ ctx, input }) => {
        try {
          return await db.getProjectElements(input.projectId);
        } catch (error) {
          console.error('[Projects] Error getting elements:', error);
          return [];
        }
      }),

    updateElement: protectedProcedure
      .input(z.object({
        elementId: z.number(),
        elementData: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.updateProjectElement(input.elementId, input.elementData);
          return { success: true };
        } catch (error) {
          console.error('[Projects] Error updating element:', error);
          throw new Error('Failed to update element');
        }
      }),

    deleteElement: protectedProcedure
      .input(z.object({ elementId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await db.deleteProjectElement(input.elementId);
          return { success: true };
        } catch (error) {
          console.error('[Projects] Error deleting element:', error);
          throw new Error('Failed to delete element');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
