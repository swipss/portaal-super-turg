import React, { Dispatch, SetStateAction, useState } from 'react';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import { Post } from '../types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { ConfirmationModal } from './AccountComponents/ConfirmationModal';
import { PostDropdown } from './PostComponents/PostDropdown';
import { EditingModal } from './PostComponents/EditingModal';
import { TiDelete } from 'react-icons/ti';

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/delete`, {
    method: 'DELETE',
    body: JSON.stringify({ postId: id }),
  }).then(() => window.location.reload());
}

async function deleteReservation(id: string): Promise<void> {
  await fetch(`/api/post/removeReservation`, {
    method: 'PUT',
    body: JSON.stringify({ postId: id }),
  }).then(() => window.location.reload());
}

async function deactivatePost(id: string): Promise<void> {
  await fetch(`/api/post/deactivate`, {
    method: 'PUT',
    body: JSON.stringify({ postId: id }),
  }).then(() => window.location.reload());
}

const Post: React.FC<{
  post: any;
  handleSelectPost: any | null;
  selectedPosts: any | null;
}> = ({ post, handleSelectPost = null, selectedPosts = null }) => {
  const {
    id,
    images,
    title,
    location,
    price,
    published,
    author,
    publishedOn,
    expiredOn,
    reservedUntil,
  } = post;

  const previewImage = images?.[0];
  const { data: session } = useSession();
  const postBelongsToUser = session?.user?.email === author?.email;
  console.log(postBelongsToUser, session?.user?.email, author?.email);
  const router = useRouter();
  const isPostOnHomepage = router.pathname === '/';

  const activeUntil = moment(publishedOn).add(1, 'M');
  const todayDate = moment();

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deactivateConfirmation, setDeactivateConfirmation] = useState(false);
  const [removeReservationConfirmation, setRemoveReservationConfirmation] =
    useState(false);
  const [editing, setEditing] = useState(false);

  const deactivePost = async () => {
    await fetch('/api/activate-multiple/published', {
      method: 'put',
      body: JSON.stringify([post]),
    });
  };

  if (todayDate > activeUntil && published && publishedOn) {
    deactivePost();
  }

  return (
    <>
      <Link href={`/p/${id}`}>
        <a
          className={`relative flex mt-2 justify-between bg-white rounded-lg border hover:bg-gray-100 max-w-[900px] mx-auto ${
            !published && 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <div className="flex items-center">
            <div className="flex items-center gap-5 flex-shrink-0">
              {previewImage?.secureUrl ? (
                <Image
                  src={previewImage?.secureUrl}
                  width={125}
                  height={150}
                  className="rounded-l-lg border-l s  "
                  objectFit="cover"
                  objectPosition="center"
                />
              ) : (
                <div className="flex justify-center items-center w-[125px] h-[150px] bg-gray-300 rounded-l  ">
                  <svg
                    className="w-12 h-12 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 640 512"
                  >
                    <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col items-start ml-2 gap-1">
              {router.pathname == '/account/kuulutused' && (
                <>
                  {published ? (
                    <div className="flex  items-center  gap-1 bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                      Aktiivne kuni {activeUntil.format('DD.MM')}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeactivateConfirmation(true);
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex  items-center gap-1 mt-2">
                        <span className=" bg-black text-white text-xs font-semibold  px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                          Aegus {moment(expiredOn).format('DD.MM')}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  {postBelongsToUser &&
                    router.pathname == '/account/kuulutused' && (
                      <input
                        type={'checkbox'}
                        checked={selectedPosts.some((item) => {
                          if (item.id === post.id) {
                            return true;
                          }
                          return false;
                        })}
                        className=" border w-4 h-4 rounded checked:bg-blue-500"
                        onChange={(e) => handleSelectPost(post)}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    )}
                  <p className="font-bold w-40 truncate">{title}</p>
                </div>
                <p className="text-sm text-gray-500 w-40 md:w-full truncate mb-1">
                  {location || 'Asukoht puudub'}
                </p>
                {reservedUntil && published && (
                  <div
                    className='tracking-wider animate-pulse flex  items-center gap-1
                bg-red-300 text-white text-xs font-semibold mr-2 px-2 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                '
                  >
                    BRONEERITUD KUNI {moment(reservedUntil).format('DD.MM')}
                    {router.pathname === '/account/kuulutused' && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setRemoveReservationConfirmation(true);
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex  justify-center items-center ">
            <div className="flex">
              <p className="font-bold mr-1">{price?.toFixed(2) || 0}€</p>

              {postBelongsToUser && router.pathname === '/account/kuulutused' && (
                <div className="relative mr-1">
                  <PostDropdown
                    post={post}
                    setEditing={setEditing}
                  />
                </div>
              )}
              {!published &&
                postBelongsToUser &&
                router.pathname === '/account/kuulutused' && (
                  <TiDelete
                    color="red"
                    size={25}
                    className=" hover:bg-red-200 rounded-md"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteConfirmation(true);
                    }}
                  />
                )}
            </div>
          </div>
        </a>
      </Link>
      {editing && (
        <EditingModal
          post={post}
          setEditing={setEditing}
        />
      )}

      {removeReservationConfirmation && (
        <ConfirmationModal
          setConfirmationModal={setRemoveReservationConfirmation}
          onConfirm={() => deleteReservation(id)}
          confirmationText="Kas oled kindel, et soovid valitud kuulutuse broneeringu eemaldada?"
          confirmationButtonText={'Jah, eemalda'}
        />
      )}
      {deactivateConfirmation && (
        <ConfirmationModal
          setConfirmationModal={setDeactivateConfirmation}
          onConfirm={() => deactivatePost(id)}
          confirmationText="Kas oled kindel, et soovid valitud kuulutuse deaktiveerida?"
          confirmationButtonText={'Jah, deaktiveeri'}
        />
      )}
      {deleteConfirmation && (
        <ConfirmationModal
          setConfirmationModal={setDeleteConfirmation}
          onConfirm={() => deletePost(id)}
          confirmationText="Kas oled kindel, et soovid valitud kuulutuse kustutada?"
          confirmationButtonText={'Jah, kustuta'}
        />
      )}
    </>
  );
};

export default Post;
