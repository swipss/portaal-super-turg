import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Layout from '../components/Layout';
import Search from '../components/Search';
import prisma from '../lib/prisma';
import Post from '../components/Post';
import { Post as PostInterface } from '../types';
import { getSession } from 'next-auth/react';

export const getStaticProps: GetStaticProps = async (context) => {
  const posts: PostInterface[] = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      images: true,
      author: true,
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

const Home: NextPage<{
  posts: PostInterface[];
  categories: any;
}> = ({ posts, categories }) => {
  return (
    <Layout>
      <main>
        <div className="rounded-full sticky top-20  z-40">
          <Search categories={categories} />
        </div>
        <div>
          {posts?.map((post) => (
            <div key={post.id}>
              <Post
                post={post}
                handleSelectPost={{}}
                selectedPosts={{}}
              />
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
