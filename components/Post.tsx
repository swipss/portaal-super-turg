import React from 'react';
import Router from 'next/router';
import Image from 'next/image';
import { Post } from '../types';
import Link from 'next/link';

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const { id, images, title, location, price } = post;
  return (
    <div
      // onClick={() => Router.push('/p/[id]', `/p/${id}`)}
      className="flex justify-between items-center pr-3 border my-3 rounded-lg"
    >
      {/* Left section */}
      <div className="flex items-center flex-shrink-0 gap-3">
        {images?.length > 0 && (
          <Image
            src={images?.[0]?.secureUrl}
            width={150}
            height={100}
            className="object-cover object-center rounded-l-lg"
          />
        )}
        <Link href={`/p/${id}`}>
          <a className="underline">{title}</a>
        </Link>
      </div>

      {/* Right section */}
      <div className="flex gap-2">
        <p className="text-sm text-gray-400">{location}</p>
        <p className="text-sm font-bold">{price.toFixed(2)} EUR</p>
      </div>
    </div>
  );
};

export default Post;
