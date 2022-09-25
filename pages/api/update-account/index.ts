import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '../../../lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  console.log(data);

  if (req.method === 'POST') {
    const updateUserInfo = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: data,
    });
    res.json(updateUserInfo);
  }
  // const updatePhone = await prisma.user.update({
  //   where: {
  //     id: data.id,
  //   },
  //   data: {
  //     phone: String(data.phone),
  //   },
  // });

  // const updateManySocials = data.socials.map((social) =>
  //   prisma.social.update({
  //     where: {
  //       id: social.id,
  //     },
  //     data: social,
  //   })
  // );
  // Promise.all(updateManySocials);
}
