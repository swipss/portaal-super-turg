import prisma from '../../../lib/prisma';

// PUT request to change published

export default async function handle(req, res) {
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true, publishedOn: new Date() },
  });
  res.json(post);
}
