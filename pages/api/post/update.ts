import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// delete post

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  console.log(data);

  if (req.method === 'PUT') {
    const post = await prisma.post.update({
      where: { id: String(data.id) },
      data: {
        title: data.title,
        content: data.content,
        conditionRating: Number(data.conditionRating),
        conditionInfo: data.conditionInfo,
        price: Number(data.price),
        location: data.location,
      },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route`
    );
  }
}
