import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// delete post

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId: string = String(req.query.id);
  const comment: string = req.body;
  const session: Session = await getSession({ req });

  if (req.method === 'DELETE') {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else if (req.method === 'POST') {
    console.log('COMMENT', comment);
    const post = await prisma.comment.create({
      data: {
        content: comment,
        author: { connect: { email: session?.user?.email } },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route`
    );
  }
}
