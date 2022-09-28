import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import prisma from '../../lib/prisma';
import { Post as PostInterface } from '../../types';
import Form from '../../components/Form';

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
  const categories = await prisma.category.findMany();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      categories,
    },
  };
};

const Feed: NextPage<{ posts: PostInterface[]; categories: any }> = ({
  posts,
  categories,
}) => {
  return (
    <Layout>
      <div className="rounded-full sticky top-20  z-40">
        <Form categories={categories} />
      </div>
      {posts?.length === 0 && (
        <p className="text-center bg-red-200 w-max mx-auto p-3 text-red-500 rounded shadow">
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
