import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const postId = req.query.id;
  const { comment, commentId } = req.body;
  const session = await getSession({ req });

  // if (req.method === 'POST') {
  //   console.log('COMMENT', comment, commentId);
  //   const post = await prisma.reply.create({
  //     data: {
  //       content: comment,
  //       author: { connect: { email: session?.user?.email } },
  //       comment: {
  //         connect: {
  //           id: commentId,
  //         },
  //       },
  //     },
  //   });
  //   res.json(post);
  // } else {
  //   throw new Error(
  //     `The HTTP ${req.method} method is not supported at this route`
  //   );
  // }
}
