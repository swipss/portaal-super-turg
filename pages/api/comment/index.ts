import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const data = JSON.parse(req.body);
  if (req.method === 'POST') {
    console.log(data);
    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        parent_comment_id: data.parent_comment_id,
        author: { connect: { email: session?.user?.email } },
        post: { connect: { id: data.postId } },
      },
      include: {
        author: true,
      },
    });
    res.json(comment);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route`
    );
  }
}
