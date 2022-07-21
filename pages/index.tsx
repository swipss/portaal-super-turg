import React from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from "../lib/prisma"
import Categories from "../components/Categories"

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: {published: true},
    include: {
      author: {
        select: {name: true}
      },
      images: {
        select: {
          secureUrl: true
        }
      },
    }
  })

  

  return { 
    props: { feed }, 
    revalidate: 10 
  }
}


type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div>
        <main>
          <Categories />
          <div className="flex flex-wrap justify-center gap-1">
            {props.feed.map((post) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
