import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState } from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import Layout from '../../components/Layout';
import Post from '../../components/Post';
import prisma from '../../lib/prisma';
import { Post as PostInterface } from '../../types';
import Draft from '../create';

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
    orderBy: {
      createdAt: 'desc',
    },
  });
  return {
    props: { drafts: JSON.parse(JSON.stringify(drafts)) },
  };
};

type Props = {
  drafts: PostInterface[];
};

const UserPosts: React.FC<any> = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [publishedPosts, setPublishedPosts] = useState(
    props?.drafts?.filter((post) => post.published === true)
  );
  const [unpublishedPosts, setUnpublishedPosts] = useState(
    props?.drafts?.filter((post) => post.published !== true)
  ).sort((a, b) => b.expiredOn - a.expiredOn);

  const [sortByPrice, setSortByPrice] = useState('descending');
  const [sortByPublishedDate, setSortByPublishedDate] = useState('descending');

  const sortPostsByPrice = (arr, setPostType) => {
    const copyArray = [...arr];

    copyArray.sort((a, b) => {
      return sortByPrice === 'descending'
        ? a.price - b.price
        : b.price - a.price;
    });

    setPostType(copyArray);
    setSortByPrice(sortByPrice === 'ascending' ? 'descending' : 'ascending');
  };

  const sortPostsByPublishedDate = (arr, setPostType) => {
    const copyArray = [...arr];
    copyArray.sort((a, b) => {
      const dateA = new Date(a.publisedOn).getTime();
      const dateB = new Date(b.publishedOn).getTime();
      return dateA < dateB ? 1 : -1;
    });
    console.log(copyArray);

    setPostType(copyArray);
    setSortByPublishedDate(
      sortByPublishedDate === 'ascending' ? 'descending' : 'ascending'
    );
  };

  return (
    <AccountLayout>
      <div className="flex justify-end">
        <button
          onClick={() => setModalOpen(!modalOpen)}
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
        >
          Lisa kuulutus
        </button>
      </div>
      <div>
        <p className="mx-2  text-2xl font-bold tracking-tight text-gray-900">
          Aktiivseid kuulutusi: {publishedPosts.length}
        </p>
        <div className="flex justify-between items-center mt-5 mb-1 ">
          <div className="flex w-full items-center justify-between mr-1">
            <div className="flex items-center w-full justify-end">
              <button
                onClick={() =>
                  sortPostsByPrice(publishedPosts, setPublishedPosts)
                }
                className="border px-2 py-0.5 rounded bg-gray-50"
              >
                Sorteeri hinna järgi
              </button>
              <button
                onClick={() =>
                  sortPostsByPublishedDate(publishedPosts, setPublishedPosts)
                }
                className="border px-2 py-0.5 rounded bg-gray-50 ml-2"
              >
                Olek
              </button>
            </div>
          </div>
        </div>

        <div className="h-[400px] overflow-scroll">
          {publishedPosts?.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-10 mb-1">
          <p className="mx-2  text-2xl font-bold tracking-tight text-gray-900">
            Mitteaktiivseid kuulutusi: {unpublishedPosts.length}
          </p>
          <div className="flex w-full items-end justify-end mr-1">
            <button
              onClick={() =>
                sortPostsByPrice(unpublishedPosts, setUnpublishedPosts)
              }
              className="border px-2 py-0.5 rounded bg-gray-50"
            >
              Sorteeri hinna järgi
            </button>
            <button
              onClick={() =>
                sortPostsByPublishedDate(unpublishedPosts, setUnpublishedPosts)
              }
              className="border px-2 py-0.5 rounded bg-gray-50 ml-2"
            >
              Olek
            </button>
          </div>
        </div>
        <div className="h-[400px]  overflow-scroll">
          {unpublishedPosts?.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
      {modalOpen && (
        <div className="overflow-y-auto overflow-x-hidden fixed top-0  right-0 left-0 bg-black bg-opacity-50 mx-auto flex justify-center z-50 w-full bg md:inset-0 h-[100vh] md:h-full">
          <div className="relative p-4  w-full max-w-2xl h-full md:h-auto">
            {/* <!-- Modal content --> */}
            <div className="relative bg-white rounded-lg shadow">
              {/* <!-- Modal header --> */}
              <div className="flex justify-between items-start p-4 rounded-t border-b ">
                <h3 className="text-xl font-semibold text-gray-900 ">
                  Uus kuulutus
                </h3>

                <button
                  onClick={() => setModalOpen(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="sr-only"
                  >
                    Close modal
                  </button>
                </button>
              </div>
              {/* <!-- Modal body --> */}
              <div className="p-6 space-y-6 h-max overflow-scroll">
                <Draft setModalOpen={setModalOpen} />
              </div>
              {/* <!-- Modal footer --> */}
              {/* <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Decline
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default UserPosts;
