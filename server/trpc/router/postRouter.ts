import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const postRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        images: true,
        author: true,
      },
    });
  }),
  getSingle: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findUnique({
        where: {
          id: input?.postId,
        },
        include: {
          images: true,
          category: true,
          comments: {
            include: {
              author: true,
            },
          },
          author: true,
          likes: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      });
    }),
  getCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  postComment: publicProcedure
    .input(
      z.object({
        content: z.string(),
        postId: z.string(),
        parent_comment_id: z.string().nullish(),
        author: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          parent_comment_id: input.parent_comment_id,
          author: { connect: { email: input.author } },
          post: { connect: { id: input.postId } },
        },
        include: {
          author: true,
        },
      });
    }),
  deleteComment: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),

  createReport: protectedProcedure
    .input(
      z.object({
        reason: z.string(),
        postId: z.string(),
        reportedBy: z.string().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.report.create({
        data: {
          reason: input.reason,
          post: { connect: { id: input.postId } },
          reportedBy: { connect: { email: input.reportedBy ?? '' } },
          date: new Date(),
        },
      });
    }),
  createLike: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        user: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.likeOnPost.create({
        data: {
          post: { connect: { id: input.postId } },
          user: { connect: { email: input.user } },
        },
      });
    }),
  deleteLike: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.likeOnPost.delete({
        where: {
          id: input,
        },
      });
    }),
  incrementPostViews: publicProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.post.update({
        where: {
          id: input,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }),
  getPostsByCategoryIds: publicProcedure
    .input(
      z.object({
        categoryIds: z.array(z.string()).nullish(),
        title: z.string().nullish(),
        location: z.string().nullish(),
        minPrice: z.string().nullish(),
        maxPrice: z.string().nullish(),
        type: z.string().nullish(),
      })
    )
    .query(({ input, ctx }) => {
      const where: any = {
        published: true,
        title: {
          contains: input.title ?? '',
          mode: 'insensitive',
        },
        location: {
          contains: input.location ?? '',
          mode: 'insensitive',
        },
        price: {
          gt: Number(input.minPrice) || 0,
          lt: Number(input.maxPrice) || 999999999999,
        },
        type: {
          contains: input.type ?? '',
          mode: 'insensitive',
        },
      };

      if (input.categoryIds?.length) {
        where.category = {
          id: {
            in: input.categoryIds,
          },
        };
      }

      return ctx.prisma.post.findMany({
        where,
        include: {
          images: true,
          author: true,
        },
      });
    }),
});
