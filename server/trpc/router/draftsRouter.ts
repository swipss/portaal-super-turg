import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const draftsRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user) {
      return null;
    }
    return ctx.prisma.user.findUnique({
      where: {
        email: ctx.session.user?.email ?? '',
      },
      include: {
        posts: true,
      },
    });
  }),
  getUserPosts: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        author: { email: ctx.session.user?.email },
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
        images: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),
  createNewPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        category: z.string(),
        type: z.string(),
        content: z.string(),
        condition: z.string().nullish(),
        conditionRating: z.number().nullish(),
        conditionInfo: z.string(),
        price: z.number(),
        location: z.string(),
        images: z.array(
          z.object({
            secureUrl: z.string(),
            publicId: z.string(),
            orderIndex: z.number(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      const {
        title,
        category,
        type,
        content,
        condition,
        conditionRating,
        conditionInfo,
        price,
        location,
        images,
      } = input;
      return ctx.prisma.post.create({
        data: {
          title: title,
          category: { connect: { id: category } },
          type: type,
          content: content,
          conditionRating: conditionRating,
          conditionInfo: conditionInfo,
          condition: condition,
          price: price,
          location: location,
          publishedOn: new Date(),
          author: { connect: { email: ctx.session.user?.email ?? '' } },
          images: {
            createMany: {
              data: images,
            },
          },
        },
        include: {
          author: true,
          images: true,
        },
      });
    }),
  deactivatePost: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: { id: input },
        data: {
          published: false,
          expiredOn: new Date(),
          publishedOn: null,
        },
      });
    }),
  activatePost: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: { id: input },
        data: {
          published: true,
          publishedOn: new Date(),
          expiredOn: null,
        },
      });
    }),
  deactivateMultiple: protectedProcedure
    .input(z.array(z.string()).nullish())
    .mutation(({ ctx, input }) => {
      if (!input) return;
      return ctx.prisma.post.updateMany({
        where: {
          id: {
            in: input,
          },
        },
        data: {
          published: false,
          expiredOn: new Date(),
          publishedOn: null,
        },
      });
    }),
  activateMultiple: protectedProcedure
    .input(z.array(z.string()).nullish())
    .mutation(({ ctx, input }) => {
      if (!input) return;
      return ctx.prisma.post.updateMany({
        where: {
          id: {
            in: input,
          },
        },
        data: {
          published: true,
          publishedOn: new Date(),
          expiredOn: null,
        },
      });
    }),
  deletePost: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.delete({
        where: {
          id: input,
        },
      });
    }),
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().nullish(),
        category: z
          .object({
            id: z.string(),
            name: z.string(),
            parentId: z.string().nullish(),
          })
          .nullish(),
        content: z.string().nullish(),
        condition: z.string().nullish(),
        conditionRating: z.number().nullish(),
        conditionInfo: z.string().nullish(),
        price: z.number().nullish(),
        location: z.string().nullish(),
        images: z.array(
          z.object({
            id: z.string(),
            postId: z.string(),
            secureUrl: z.string(),
            publicId: z.string(),
            orderIndex: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const {
        id,
        title,
        category,
        content,
        condition,
        conditionRating,
        conditionInfo,
        price,
        location,
        images,
      } = input;
      images.forEach(async (image) => {
        await ctx.prisma.image.update({
          where: {
            id: image.id,
          },
          data: {
            id: image.id,
            postId: image.postId,
            orderIndex: image.orderIndex,
            secureUrl: image.secureUrl,
            publicId: image.publicId,
          },
        });
      });
      return ctx.prisma.post.update({
        where: {
          id: id,
        },
        data: {
          title: title,
          category: { connect: { id: category?.id } },
          content: content,
          condition: condition,
          conditionRating: conditionRating,
          conditionInfo: conditionInfo,
          price: price,
          location: location,
        },
      });
    }),
  addReservation: publicProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          reservedUntil: input.date,
        },
      });
    }),
});
