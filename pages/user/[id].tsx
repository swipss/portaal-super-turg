import moment from 'moment';
import React from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { AiFillPhone } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { BsFillChatFill } from 'react-icons/bs';

export async function getStaticProps({ params }) {
  const user = await prisma.user.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      posts: {
        where: {
          published: true,
        },
      },
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
  const { data: session } = useSession();
  const profileBelongsToSessionUser = session?.user?.email === user?.email;
  console.log(profileBelongsToSessionUser);
  return (
    <Layout>
      <div className="max-w-[700px] mx-auto p-6 ">
        <div className="flex-col flex gap-3 items-center justify-center md:flex-row md:justify-start">
          <img
            src={user?.image}
            className="w-52 h-52 rounded-full"
          />
          <div className="flex flex-col items-center justify-center md:items-start">
            <p className="font-bold text-2xl">{user?.name}</p>
            <p className="font-medium text-sm">
              Liitus {moment(user?.createrAt).format('DD/MM/YY')}
            </p>
            {!profileBelongsToSessionUser && (
              <div className="flex gap-2 items-center">
                <button className=" text-white flex items-center gap-2 bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg mt-2 text-sm px-3 py-2.5   dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 ">
                  <AiOutlineUserAdd
                    size={24}
                    color="white"
                  />
                  Lisa sõbraks
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 mt-2 py-2.5  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                  <BsFillChatFill
                    size={24}
                    color="darkgrey"
                  />
                  Suhtle
                </button>
              </div>
            )}
            {/* <div className="flex gap-1 items-center">
              <AiFillPhone size={24} />
              <p className="block text-sm my-2 font-medium text-gray-900">
                {user?.phone}
              </p>
            </div> */}
          </div>
        </div>
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 mt-10">
          <li className="mr-2">
            <a
              href="#"
              className="inline-block py-3 px-4 text-white bg-blue-600 rounded-lg active"
              aria-current="page"
            >
              Andmed
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block py-3 px-4 rounded-lg hover:text-gray-900 hover:bg-gray-100 "
            >
              Postitused
              <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full ">
                {user?.posts?.length}
              </span>
            </a>
          </li>
        </ul>
        <div className="flex items-center ">
          <p className="block text-sm my-2 text-gray-900 ">Nimi</p>
          <p className=" text-gray-900 text-sm font-medium mx-auto">
            {user?.name}
          </p>
        </div>
        <div className="flex items-center ">
          <p className="block text-sm my-2 text-gray-900 ">Telefon</p>
          <p className=" text-gray-900 text-sm font-medium mx-auto">
            {user?.phone}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default User;
