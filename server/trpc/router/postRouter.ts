import { z } from 'zod';

import { router, publicProcedure } from '../trpc';

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
});
