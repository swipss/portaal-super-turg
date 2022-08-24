import React, { useEffect, useRef, useState } from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import getFeed from "./api/feed/getFeed"
import Form from "../components/Form"


export const getStaticProps: GetStaticProps = async () => {
  const feed = await getFeed()
  return {
    props: {
      feed,
      
    },
    revalidate: 10,
  }
}


export type Props = {
  feed: PostProps[],
}







const Blog: React.FC<Props> = (props: Props) => {
  
  return (
    <Layout>
        <main>
          <Form />
          <div className="">
            {props?.feed?.map((post) => (
              <div key={post.id}>
                <Post post={post} />
              </div>
            ))}
          </div>
        </main>
    </Layout>
  )
}

export default Blog
