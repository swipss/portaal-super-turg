import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import Post from '../../components/Post';
import prisma from '../../lib/prisma';
import { Post as PostInterface } from '../../types';

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

const UserPosts: React.FC<Props> = (props) => {
  return (
    <AccountLayout>
      <Link href="/create">
        <a>
          <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
            Lisa kuulutus
          </button>
        </a>
      </Link>
      <div className="h-[475px] overflow-scroll">
        {props?.drafts?.map((post) => (
          <div key={post.id}>
            <Post post={post} />
          </div>
        ))}
      </div>
    </AccountLayout>
  );
};

export default UserPosts;
