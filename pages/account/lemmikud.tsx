import React from 'react';
import Layout from '../../components/Layouts/Layout';
import { trpc } from '../../utils/trpc';
import Post from '../../components/HomeComponents/Post';
import { NextPage } from 'next';

const FavouritePosts: NextPage = () => {
  const {
    data: posts,
    isLoading,
    isError,
  } = trpc.account.getLikedPosts.useQuery();

  if (isLoading) {
    return <p>loading</p>;
  }
  return (
    <Layout>
      {posts?.map((post) => (
        <Post post={post} />
      ))}
    </Layout>
  );
};

export default FavouritePosts;
