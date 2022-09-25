import moment from 'moment';
import React from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { AiFillPhone } from 'react-icons/ai';

export async function getStaticProps({ params }) {
  const user = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
  });
  // console.log(post);
  return {
    props: { user: JSON.parse(JSON.stringify(user)) },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany();

  return {
    paths: users.map((user) => ({
      params: {
        id: user.id.toString(),
      },
    })),
    fallback: 'blocking',
  };
}

const User = ({ user }) => {
  return (
    <Layout>
      <div className="w-[700px] mx-auto p-6 ">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-2xl">{user?.name}</p>
            <div className="flex gap-1 items-center">
              <AiFillPhone size={24} />
              <p className="block text-sm my-2 font-medium text-gray-900">
                {user?.phone}
              </p>
            </div>
          </div>
          <img
            src={user?.image}
            className="w-52 h-52 rounded-full"
          />
        </div>
      </div>
    </Layout>
  );
};

export default User;
