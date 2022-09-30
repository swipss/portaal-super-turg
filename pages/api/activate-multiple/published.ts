import prisma from '../../../lib/prisma';

// PUT request to change published

export default async function handle(req, res) {
  const data = JSON.parse(req.body);
  console.log(data, 'data');
  const posts = data.map(async (item) => {
    if (item.published) {
      await prisma.post.update({
        where: {
          id: item.id,
        },
        data: {
          published: false,
        },
      });
    } else {
      await prisma.post.update({
        where: {
          id: item.id,
        },
        data: {
          published: true,
        },
      });
    }

    res.json(posts);
  });
}
