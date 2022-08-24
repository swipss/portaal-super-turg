// handle post requests

import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

// POST /api/post
// Required fields in body: title
// Optional fields in body: content

export default async function handle (req, res) {
    const { title, content, price, address, imagesData, categoryId } = req.body
    const session = await getSession({ req })
    
    const postResult = await prisma.post.create({
        data: {
            title: title,
            content: content,
            price: price,
            location: address,
            isActive: true,
            author: { connect: { email: session?.user?.email } },
            categories: {
                connect: { id: categoryId}
            }

        }
    })

    const imagesDataWithPostId = imagesData.map(data => ({...data, postId: postResult.id}))

    const imageResult = await prisma.image.createMany({
        data: imagesDataWithPostId

    })

    res.json(postResult, imageResult)
}
