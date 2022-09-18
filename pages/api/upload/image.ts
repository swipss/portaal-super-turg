import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { data: postData, imageData } = JSON.parse(req.body);

  const imageResult = await prisma.image.create({
    data: {
      secureUrl: imageData.secure_url,
      width: imageData.width,
      height: imageData.height,
      publicId: imageData.public_id,
      versionId: imageData.version_id,
      resourceType: imageData.resource_type,
      bytes: imageData.bytes,
      url: imageData.url,
      format: imageData.format,
      version: String(imageData.version),
      postId: postData.id,
    },
  });

  res.json(imageResult);
}