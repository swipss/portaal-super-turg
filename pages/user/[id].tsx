import moment from 'moment';
import React from 'react';
import Layout from '../../components/Layouts/Layout';
import { prisma } from '../../server/trpc/prisma';
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
  return (
    <Layout>
      <div className="max-w-[700px] mx-auto p-6 ">
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-start">
          <img
            src={user?.image}
            className="rounded-full w-52 h-52"
          />
          <div className="flex flex-col items-center justify-center md:items-start">
            <p className="text-2xl font-bold">{user?.name}</p>
            <p className="text-sm font-medium">
              Liitus {moment(user?.createdAt).format('DD/MM/YY')}
            </p>
            {!profileBelongsToSessionUser && (
              <div className="flex items-center gap-2">
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
            {/* <div className="flex items-center gap-1">
              <AiFillPhone size={24} />
              <p className="block my-2 text-sm font-medium text-gray-900">
                {user?.phone}
              </p>
            </div> */}
          </div>
        </div>
        <ul className="flex flex-wrap mt-10 text-sm font-medium text-center text-gray-500">
          <li className="mr-2">
            <a
              href="#"
              className="inline-block px-4 py-3 text-white bg-blue-600 rounded-lg active"
              aria-current="page"
            >
              Andmed
            </a>
          </li>
          <li className="mr-2">
            <a
              href="#"
              className="inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 "
            >
              Postitused
              <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full ">
                {user?.posts?.length}
              </span>
            </a>
          </li>
        </ul>
        <div className="flex items-center ">
          <p className="block my-2 text-sm text-gray-900 ">Nimi</p>
          <p className="mx-auto text-sm font-medium text-gray-900 ">
            {user?.name}
          </p>
        </div>
        <div className="flex items-center ">
          <p className="block my-2 text-sm text-gray-900 ">Telefon</p>
          <p className="mx-auto text-sm font-medium text-gray-900 ">
            {user?.phone}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default User;
