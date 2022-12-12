import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { colors } from '../PostComponents/Rating';

const Post = ({ post }) => {
  return (
    <div className="relative block mt-4 bg-white rounded shadow sm:flex">
      {post.images?.length ? (
        <div className="sm:h-[150px] h-[250px] w-full sm:w-[300px] relative rounded ">
          <Image
            src={post.images?.[0]?.secureUrl}
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full sm:w-[300px] rounded h-[200px] bg-gray-300 shadow relative">
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
      <div className="relative flex items-center w-full p-2">
        <div className="w-full">
          {post.reservedUntil && post.published && (
            <span className="text-red-400 bg-red-200 label">
              Broneeritud kuni {moment(post.reservedUntil).format('DD.MM')}
            </span>
          )}

          <div className="flex items-center justify-center gap-2 w-max">
            <span
              className={`font-medium label tex-twhite ${
                post?.condition === 'new'
                  ? 'bg-green-500'
                  : colors[post.conditionRating ?? 0]
              }`}
            >
              {post.conditionRating ?? 'Uus'}
            </span>
            <div className="flex items-center gap-2">
              {post?.type && (
                <span className="mt-1 text-yellow-700 bg-yellow-200 label">
                  {post?.type?.charAt(0).toUpperCase() + post?.type?.slice(1)}
                </span>
              )}
              <Link href={`/kuulutus/${post.id}`}>
                <a className="underline title">{post.title}</a>
              </Link>
            </div>
          </div>
          <p className="flex items-center gap-1 text-gray-500">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            {post.location}
          </p>
          <p className="font-bold title">€{post.price?.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Post;
