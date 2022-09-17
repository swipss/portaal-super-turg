import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import Post from '../components/Post';
import prisma from '../lib/prisma';
import { Post as PostInterface } from '../types';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    // user is not authenticated
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    // get drafts
    where: {
      author: { email: session.user.email },
      published: false,
    },
    include: {
      author: {
        select: { name: true },
      },
      images: {
        select: { secureUrl: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostInterface[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Layout>
        <h1>Minu kuulutused</h1>
        <div>Pead olema sisse logitud, et seda lehte näha.</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="page">
        <h1 className="mt-20 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Minu kuulutused
        </h1>
        <main className="flex  flex-col">
          {props.drafts.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;
