import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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
    getFeatured: publicProcedure.query(() => db.getFeaturedProducts()),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
      db.getProductById(input.id)
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
  }),
});

export type AppRouter = typeof appRouter;
