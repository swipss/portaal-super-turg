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
  changeUsername: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          name: input,
        },
      });
    }),
  changePhoneNumber: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          phone: input,
        },
      });
    }),
  changePhoneNumberVisibilityOnProfile: protectedProcedure
    .input(z.boolean())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          isPhoneNumberVisible: input,
        },
      });
    }),
  changePrimaryAddress: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          primaryAddress: input,
        },
      });
    }),
  changeSecondaryAddress: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          secondaryAddress: input,
        },
      });
    }),
  changePrimaryLanguage: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          primaryLanguage: input,
        },
      });
    }),
  // mutation to add a new language to the user's languages with the level
  addLanguage: protectedProcedure
    .input(z.object({ language: z.string(), level: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          otherLanguages: {
            create: {
              language: input.language,
              level: input.level,
            },
          },
        },
      });
    }),
  deleteLanguage: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.otherLanguages.delete({
        where: {
          id: input,
        },
      });
    }),
  addAdditionalInfo: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          additionalInfoText: input,
        },
      });
    }),
  addNewChannel: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        link: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          socials: {
            create: {
              name: input.name,
              link: input.link,
            },
          },
        },
      });
    }),
  deleteChannel: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.social.delete({
        where: {
          id: input,
        },
      });
    }),
  addNewAddress: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          otherAddresses: {
            push: input,
          },
        },
      });
    }),
  // delete addres by name
  deleteAddress: protectedProcedure
    .input(z.array(z.string()))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          email: ctx.session.user?.email ?? '',
        },
        data: {
          otherAddresses: {
            set: input,
          },
        },
      });
    }),
});
