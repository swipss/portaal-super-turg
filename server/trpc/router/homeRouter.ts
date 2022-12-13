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
});
