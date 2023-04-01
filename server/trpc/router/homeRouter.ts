import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const homeRouter = router({
  getUser: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include: {
        posts: {
          where: {
            published: true,
          },
        },
      },
    });
  }),
  addRecentSearch: protectedProcedure
    .input(
      z.object({
        user: z.string(),
        searchText: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // add search to user's recent searches array
      return await ctx.prisma.user.update({
        where: {
          email: input.user,
        },
        data: {
          searches: {
            push: input.searchText,
          },
        },
      });
    }),
});
