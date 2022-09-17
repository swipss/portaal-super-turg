// handle post requests

import { Image } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, info, conditionRating, conditionInfo, price, location } =
    JSON.parse(req.body);
  const session: Session = await getSession({ req });
  const postResult = await prisma.post.create({
    data: {
      title: title,
      content: info,
      conditionRating: conditionRating,
      conditionInfo: conditionInfo,
      price: price,
      location: location,
      author: { connect: { email: session?.user?.email } },
    },
  });
  // returns empty array
  // const imageRes = await prisma.image.createMany({
  //   data: data,
  // });

  res.json(postResult);
}
