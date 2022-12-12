import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/trpc/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = JSON.parse(req.body);
  const locationData = data.locations;

  if (req.method === 'POST') {
    const updateUserInfo = await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        image: data.image,
        phone: data.phone,
      },
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
