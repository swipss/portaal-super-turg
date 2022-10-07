import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import Router from 'next/router';
import React, { useRef, useState } from 'react';
import AccountLayout from '../../components/AccountComponents/AccountLayout';
import { ConfirmationModal } from '../../components/AccountComponents/ConfirmationModal';
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
    props?.drafts
      ?.filter((post) => post.published === true)
      .sort((a, b) => {
        const dateA = new Date(a.publishedOn).getTime();
        const dateB = new Date(b.publishedOn).getTime();
        return dateB > dateA ? 1 : -1;
      })
  );
  const [unpublishedPosts, setUnpublishedPosts] = useState(
    props?.drafts
      ?.filter((post) => post.published !== true)
      .sort((a, b) => {
        const dateA = new Date(a.expiredOn).getTime();
        const dateB = new Date(b.expiredOn).getTime();
        return dateB > dateA ? 1 : -1;
      })
  );

  const [sortedPublishedPosts, setSortedPublishedPosts] =
    useState(publishedPosts);
  const [sortedUnpublihsedPosts, setSortedUnpublishedPosts] =
    useState(unpublishedPosts);

  // Change order based on last value for published posts
  const [sortByPricePublished, setSortByPricePublished] =
    useState('descending');
  const [sortByPublishedDatePublished, setSortByPublishedDatePublished] =
    useState('descending');
  const [selectedSortPublished, setSelectedSortPublished] = useState('');

  // Change order based on last value for unpublished posts
  const [sortByPriceUnpublished, setSortByPriceUnpublished] =
    useState('descending');
  const [sortByPublishedDateUnpublished, setSortByPublishedDateUnpublished] =
    useState('descending');
  const [selectedSortUnpublished, setSelectedSortUnpublished] = useState('');

  const [selectedPublishedPosts, setSelectedPublishedPosts] = useState([]);
  const [selectedUnpublishedPosts, setSelectedUnpublishedPosts] = useState([]);

  const [confirmationModal, setConfirmationModal] = useState(false);

  const sortPublishedPostsByPrice = () => {
    const copyArray = [...publishedPosts];

    copyArray.sort((a, b) => {
      return sortByPricePublished === 'descending'
        ? a.price - b.price
        : b.price - a.price;
    });

    setSortedPublishedPosts(copyArray);
    setSortByPricePublished(
      sortByPricePublished === 'ascending' ? 'descending' : 'ascending'
    );
    setSelectedSortPublished('price');
  };

  const sortUnpublishedPostsByPrice = () => {
    const copyArray = [...unpublishedPosts];

    copyArray.sort((a, b) => {
      return sortByPriceUnpublished === 'descending'
        ? a.price - b.price
        : b.price - a.price;
    });

    setSortedUnpublishedPosts(copyArray);
    setSortByPriceUnpublished(
      sortByPriceUnpublished === 'ascending' ? 'descending' : 'ascending'
    );
    setSelectedSortUnpublished('price');
  };

  const handleSelectPublishedPost = (post) => {
    let newArray = [...selectedPublishedPosts, post];
    if (selectedPublishedPosts.includes(post)) {
      newArray = newArray.filter((item) => item.id !== post.id);
    }
    setSelectedPublishedPosts(newArray);
  };
  const handleSelectUnpublishedPost = (post) => {
    let newArray = [...selectedUnpublishedPosts, post];
    if (selectedUnpublishedPosts.includes(post)) {
      newArray = newArray.filter((item) => item.id !== post.id);
    }
    setSelectedUnpublishedPosts(newArray);
  };

  // const handleSelectAllPublishedPosts = () => {
  //   if (selectedPublishedPosts.length) {
  //     setSelectedPublishedPosts([]);
  //   } else {
  //     setSelectedPublishedPosts(sortedPublishedPosts);
  //   }
  // };

  const deactivateMultiplePublishedPosts = async () => {
    if (!selectedPublishedPosts.length) return;
    await fetch('/api/activate-multiple/published', {
      method: 'PUT',
      body: JSON.stringify(selectedPublishedPosts),
    }).then((res) => window.location.reload());
  };

  const activateMultiplePublishedPosts = async () => {
    if (!selectedUnpublishedPosts.length) return;
    await fetch('/api/activate-multiple/unpublished', {
      method: 'PUT',
      body: JSON.stringify(selectedUnpublishedPosts),
    }).then((res) => window.location.reload());
  };
  console.log(selectedPublishedPosts, 'published');
  console.log(selectedUnpublishedPosts, 'unpublished');

  const handleSelectAllPublishedPosts = () => {
    if (!selectedPublishedPosts.length) {
      setSelectedPublishedPosts(publishedPosts);
    } else {
      setSelectedPublishedPosts([]);
    }
  };
  const handleSelectAllUnpublishedPosts = () => {
    if (!selectedPublishedPosts.length) {
      setSelectedUnpublishedPosts(unpublishedPosts);
    } else {
      setSelectedUnpublishedPosts([]);
    }
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
        <div className="flex items-center justify-between mb-1">
          <p className="mx-2  text-2xl font-bold tracking-tight text-gray-900">
            Aktiivseid kuulutusi: {publishedPosts.length}
          </p>
          <div className="flex w-full items-end justify-end mr-1">
            <button
              onClick={() => sortPublishedPostsByPrice()}
              className={`${
                selectedSortPublished === 'price' && 'bg-blue-600 text-white'
              } border px-2 py-0.5 rounded bg-gray-50`}
            >
              Hind
            </button>
          </div>
        </div>
        {/* <button
          onClick={() => handleSelectAllPublishedPosts()}
          className={` border px-2 py-0.5 rounded bg-gray-50`}
        >
          Vali kõik
        </button> */}
        <div className="h-[400px] overflow-scroll ">
          {publishedPosts.length ? (
            sortedPublishedPosts?.map((post) => (
              <div key={post.id}>
                <Post
                  post={post}
                  handleSelectPost={handleSelectPublishedPost}
                  selectedPosts={selectedPublishedPosts}
                />
              </div>
            ))
          ) : (
            <p>Aktiivsed postitused puuduvad</p>
          )}
        </div>
        <button
          onClick={() => handleSelectAllPublishedPosts()}
          className=" mt-2 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
        >
          Vali kõik
        </button>
        {selectedPublishedPosts.length ? (
          <button
            onClick={() => setConfirmationModal(true)}
            className=" mt-2 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
          >
            Deaktiveeri ({selectedPublishedPosts.length})
          </button>
        ) : null}

        <div className="flex items-center justify-between mt-10 mb-1">
          <p className="mx-2  text-2xl font-bold tracking-tight text-gray-900">
            Mitteaktiivseid kuulutusi: {unpublishedPosts.length}
          </p>
          <div className="flex w-full items-end justify-end mr-1">
            <button
              onClick={() => sortUnpublishedPostsByPrice()}
              className={`${
                selectedSortUnpublished === 'price' && 'bg-blue-600 text-white'
              } border px-2 py-0.5 rounded bg-gray-50`}
            >
              Hind
            </button>
          </div>
        </div>
        <div className="h-[400px]  overflow-scroll">
          {sortedUnpublihsedPosts.length ? (
            sortedUnpublihsedPosts?.map((post) => (
              <div key={post.id}>
                <Post
                  post={post}
                  handleSelectPost={handleSelectUnpublishedPost}
                  selectedPosts={selectedUnpublishedPosts}
                />
              </div>
            ))
          ) : (
            <p>Mitteaktiivsed postitused puuduvad</p>
          )}
        </div>
      </div>
      {confirmationModal && (
        <ConfirmationModal
          setConfirmationModal={setConfirmationModal}
          onConfirm={deactivateMultiplePublishedPosts}
          confirmationText="Kas oled kindel, et soovid valitud kuulutused deaktiveerida?"
          confirmationButtonText={'Jah, deaktiveeri'}
        />
      )}

      <button
        onClick={() => handleSelectAllUnpublishedPosts()}
        className=" mt-2 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
      >
        Vali kõik
      </button>
      {selectedUnpublishedPosts.length ? (
        <button
          onClick={() => activateMultiplePublishedPosts()}
          className="mt-2 text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-1  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
        >
          Aktiveeri ({selectedUnpublishedPosts.length})
        </button>
      ) : null}

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
              <div className="p-6 space-y-6 h-[80vh] overflow-scroll">
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
