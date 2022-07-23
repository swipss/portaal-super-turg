// handle post requests

import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content

export default async function handle (req, res) {
    const { title, content, price, address, imagesData } = req.body
    console.log(imagesData)
    const session = await getSession({ req })

    
    
    const postResult = await prisma.post.create({
        data: {
            title: title,
            content: content,
            price: price,
            location: address,
            isActive: true,
            author: { connect: { email: session?.user?.email }},

        }
    })

    const imagesDataWithPostId = imagesData.map(data => ({...data, postId: postResult.id}))
    

    console.log('post id', imagesDataWithPostId)

    console.log('POST RESULT', postResult)

    const imageResult = await prisma.image.createMany({
        data: imagesDataWithPostId

    })

    

    console.log(imageResult)
    res.json(postResult, imageResult)
}
