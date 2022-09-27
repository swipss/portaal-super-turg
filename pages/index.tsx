import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import Form from '../components/Form';
import prisma from '../lib/prisma';
import Post from '../components/Post';
import { Post as PostInterface } from '../types';

export const getStaticProps: GetStaticProps = async (context) => {
  const posts: PostInterface[] = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      images: true,
    },
    // orderBy: {

    // }
  });
  const categories = await prisma.category.findMany();
  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      categories,
    },
    revalidate: 10,
  };
};

const Home: NextPage<{ posts: PostInterface[]; categories: any }> = ({
  posts,
  categories,
}) => {
  return (
    <Layout>
      <main>
        <div className="rounded-full sticky top-20  z-50">
          <Form categories={categories} />
        </div>
        <div>
          {posts?.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
