const cloudinary = require('cloudinary').v2;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1gb',
    },
  },
};

export default async function handle(req, res) {
  try {
    if (req.method != 'POST') {
      return res.status(400).json({ message: 'Invalid method' });
    }
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    const { readerRes } = req.body;

    // let promises: any = [];
    const response = await cloudinary.uploader.upload(readerRes, {
      width: 1920,
      height: 1080,
      crop: 'fit',
      quality: 80,
      folder: 'portaal',
    });
    // images.forEach(async (image) => {
    //   promises.push(
    // cloudinary.uploader.upload(image, {
    //   width: 1920,
    //   height: 1080,
    //   crop: 'fit',
    //   quality: 80,
    //   folder: 'portaal',
    // })
    //   );
    // });

    // const response = await Promise.all(promises);

    res.json(response);
  } catch (error) {
    return res.status(400).send({ message: 'Error processing request' });
  }
}
