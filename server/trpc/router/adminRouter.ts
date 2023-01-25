import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const adminRouter = router({
  getReports: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.report.findMany({
      include: {
        post: {
          include: {
            images: true,
            author: true,
          },
        },
        reportedBy: true,
      },
    });
  }),
});
