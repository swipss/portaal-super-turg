import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import prisma from '../../lib/prisma';
import { Post as PostInterface } from '../../types';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { title, location, minPrice, maxPrice, category } = query;
  console.log(query);
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      title: {
        contains: String(title),
        mode: 'insensitive',
      },
      location: {
        contains: String(location),
        mode: 'insensitive',
      },
      price: {
        gte: Number(minPrice),
        lte: Number(maxPrice) || 10000000000000,
      },
      // categories: {
      //   some: {
      //     name: {
      //       contains: String(category),
      //     },
      //   },
      // },
    },
    include: {
      author: {
        select: { name: true },
      },
      images: {
        select: {
          secureUrl: true,
        },
      },
    },
  });

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};

const Feed: NextPage<{ posts: PostInterface[] }> = ({ posts }) => {
  return (
    <Layout>
      {posts?.length === 0 && (
        <p className="text-center">
          Valitud parameetritele ei vasta ükski postitus.
        </p>
      )}
      {posts?.map((post) => (
        <Post post={post} />
      ))}
    </Layout>
  );
};

export default Feed;
