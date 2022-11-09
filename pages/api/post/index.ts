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
  const {
    title,
    info,
    conditionRating,
    conditionInfo,
    price,
    location,
    category,
  } = JSON.parse(req.body);
  const session: Session = await getSession({ req });
  const postResult = await prisma.post.create({
    data: {
      title: title,
      content: info,
      conditionRating: conditionRating,
      conditionInfo: conditionInfo,
      price: price,
      location: location,
      publishedOn: new Date(),
      author: { connect: { email: session?.user?.email } },
      category: { connect: { id: category.id } },
    },
  });

  res.json(postResult);
}
