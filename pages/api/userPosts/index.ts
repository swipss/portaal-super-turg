import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// delete post

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    res.statusCode = 403;
  }

  const userPosts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
      published: true,
    },
  });
  res.json(userPosts);
}
