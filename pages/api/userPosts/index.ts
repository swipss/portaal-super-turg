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

  const userPosts = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
    include: {
      posts: true,
    },
  });
  res.json(userPosts);
}
