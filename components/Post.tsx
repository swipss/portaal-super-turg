import React, { Dispatch, SetStateAction } from 'react';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import { Post } from '../types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import moment from 'moment';

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
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
  } = post;
  const previewImage = images?.[0];
  const { data: session } = useSession();
  const postBelongsToUser = session?.user?.email === author?.email;
  const router = useRouter();
  const isPostOnHomepage = router.pathname === '/';

  const activeUntil = moment(publishedOn).add(1, 'M');
  const todayDate = moment();
  const expired = moment();

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
    <Link href={`/p/${id}`}>
      <a
        className={`flex mt-2 justify-between bg-white rounded-lg border hover:bg-gray-100 ${
          !published && 'bg-gray-200 hover:bg-gray-300'
        }`}
      >
        <div className="flex items-center">
          <div className="flex items-center gap-5 flex-shrink-0">
            {previewImage?.secureUrl ? (
              <Image
                src={previewImage?.secureUrl}
                width={150}
                height={150}
                className="rounded-l-lg border-l s  "
                objectFit="cover"
                objectPosition="center"
              />
            ) : (
              <div className="flex justify-center items-center w-[150px] h-[150px] bg-gray-300 rounded-l  ">
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
            {published ? (
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                Aktiivne kuni {activeUntil.format('DD.MM')}
              </span>
            ) : (
              <div className="flex items-center">
                <span className=" bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                  Aegus {expired.format('DD.MM')}
                </span>
                <button
                  onClick={() => publishPost(id)}
                  type="button"
                  className="px-2.5 py-0.5  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
                >
                  Aktiveeri
                </button>
              </div>
            )}
            <div className="flex gap-2 items-center">
              {postBelongsToUser ||
                (!isPostOnHomepage && (
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
                ))}
              <p className="font-bold">{title}</p>
            </div>
            <p className="text-sm text-gray-500">
              {location || 'Asukoht puudub'}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <p className="font-bold mr-2">{price?.toFixed(2)} EUR</p>
        </div>
      </a>
    </Link>
  );
};

export default Post;
