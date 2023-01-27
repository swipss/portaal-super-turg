import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

export const adminRouter = router({
  getReports: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.report.findMany({
      include: {
        post: {
          include: {
            images: true,
            author: {
              include: {
                reports: true,
              },
            },
          },
        },
        reportedBy: true,
      },
    });
  }),
  resolveReport: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.update({
        where: {
          id: input,
        },
        data: {
          resolved: true,
        },
      });
    }),
  deleteReport: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.delete({
        where: {
          id: input,
        },
      });
    }),
  unresolveReport: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.report.update({
        where: {
          id: input,
        },
        data: {
          resolved: false,
        },
      });
    }),
});
