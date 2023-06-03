import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.todo.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
  }),

  create: privateProcedure
    .input(z.object({ todoText: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const todo = await ctx.prisma.todo.create({
        data: {
          userId,
          todoText: input.todoText,
        },
      });

      return todo;
    }),
});
