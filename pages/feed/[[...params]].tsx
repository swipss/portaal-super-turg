import { GetServerSideProps } from "next"
import { Props } from ".."
import Layout from "../../components/Layout"
import Post from "../../components/Post"
import prisma from "../../lib/prisma"

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title, location, minPrice, maxPrice, category } = query
  console.log(title)
  console.log(category)
  const feed = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: String(title),
        mode: 'insensitive'
      },
      location: {
        contains: String(location),
        mode: 'insensitive'
      },
      price: {
        gte: Number(minPrice),
        lte: Number(maxPrice) || 10000000000000,
      },
      categories: {
        some: {
          name: {
            contains: String(category)
          }
        }
      }
    },
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
    props: {
      feed
    },
  }
}

 const Feed: React.FC<Props> = (props: Props) => {
    
    return (
        <Layout>
            {props.feed.length === 0 && (
              <p className="text-center">Valitud parameetritele ei vasta ükski postitus.</p>
            )}
            {props?.feed?.map(post => (
              <Post post={post} />
            ))}
        </Layout>
    )
 }

 export default Feed