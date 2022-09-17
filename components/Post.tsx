import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { Post } from '../types';
import Link from 'next/link';

const Post: React.FC<{ post: any }> = ({ post }) => {
  const { id, images, title, location, price, published } = post;
  const previewImage = images?.[0];
  console.log(previewImage?.secureUrl);
  return (
    <Link href={`/p/${id}`}>
      <a className="flex mt-2 justify-between bg-white rounded-lg border hover:bg-gray-100 ">
        <div className="flex items-center">
          <div className="flex items-center gap-5">
            {previewImage?.secureUrl && (
              <Image
                src={previewImage?.secureUrl}
                width={150}
                height={150}
              />
            )}
          </div>
          <div className="flex flex-col items-start ml-2 gap-1">
            <span className="mt-2 bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
              Aegunud
            </span>
            <p className="font-bold">{title}</p>
            <p className="text-sm text-gray-500">
              {location || 'Asukoht puudub'}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="font-bold mr-2">{price?.toFixed(2)} EUR</p>
        </div>
      </a>
    </Link>
  );
};

export default Post;
