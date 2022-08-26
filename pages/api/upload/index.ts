import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const file = JSON.parse(req.body);

  const result = await prisma.image.create({
    data: {
      secureUrl: file.url,
      publicId: file.public_id,
      version: file.version.toString(),
      format: file.format,
    },
  });
  res.json(result);
}
