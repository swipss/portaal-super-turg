import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const accountRouter = router({
  getLikedPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        likes: {
          some: {
            user: {
              email: ctx.session.user?.email ?? '',
            },
          },
        },
      },
      include: {
        images: true,
        author: true,
      },
    });
  }),
});
