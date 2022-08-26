import prisma from '../../../lib/prisma';

export default async function getFeed(searchText: string = undefined) {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: searchText,
        mode: 'insensitive',
      },
    },
    include: {
      author: {
        select: { name: true },
      },
      images: {
        select: {
          secureUrl: true,
        },
      },
    },
  });
  return feed;
}
