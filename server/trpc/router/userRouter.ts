import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, publicProcedure, protectedProcedure } from '../trpc';

export const userRouter = router({
  getUser: protectedProcedure.query(({ ctx }) => {
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
        images: {
          select: { secureUrl: true },
        },
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
        content: z.string(),
        conditionRating: z.number(),
        conditionInfo: z.string(),
        price: z.number(),
        location: z.string(),
        images: z.array(
          z.object({
            secureUrl: z.string(),
            publicId: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      const {
        title,
        category,
        content,
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
          content: content,
          conditionRating: conditionRating,
          conditionInfo: conditionInfo,
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
  // editPost: protectedProcedure
  //   .input(
  //     z.object({
  //       title: z.string(),
  //       content: z.string(),
  //       conditionRating: z.number(),
  //       conditionInfo: z.string(),
  //       price: z.number(),
  //       location: z.string(),

  //     })
  //   )
  //   .mutation(({ ctx, input }) => {
  //     const {
  //       title,
  //       content,
  //       conditionRating,
  //       conditionInfo,
  //       price,
  //       location,
  //     } = input;
  //     return ctx.prisma.post.update({
  //       where: {

  //       }
  //       data: {
  //         title: title,
  //         category: { connect: { id: category } },
  //         content: content,
  //         conditionRating: conditionRating,
  //         conditionInfo: conditionInfo,
  //         price: price,
  //         location: location,
  //         publishedOn: new Date(),
  //         author: { connect: { email: ctx.session.user?.email ?? '' } },
  //         images: {
  //           createMany: {
  //             data: images,
  //           },
  //         },
  //       },
  //       include: {
  //         author: true,
  //         images: true,
  //       },
  //     });
  //   }),
});
