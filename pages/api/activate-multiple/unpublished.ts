import prisma from '../../../lib/prisma';

// PUT request to change published

export default async function handle(req, res) {
  const data = JSON.parse(req.body);
  const postIds = data.map((item) => item.id);
  const posts = await prisma.post.updateMany({
    where: {
      id: {
        in: postIds,
      },
    },
    data: {
      published: true,
      publishedOn: new Date(),
    },
  });

  res.json(posts);
}
