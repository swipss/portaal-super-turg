import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  price: number;
  published: boolean;
  isActive: boolean;
  location: string;
  images: Image[];
  comments: Comment[]
  
};

export type Comment = {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
  }
  authorId: string;
  replies: Reply[];
  post: PostProps;
  postId: string

}

export type Reply = {
  id: string;
  content: string;
  author: {
    name: string;
    email: string
  }
  comment: Comment;
  commentId: string

}

export type Image = {
  id: string;
  secureUrl: string;
  publicId: string;
  format: string;
  version: string;
  post: PostProps;
  postId: string;
}

export type Category = {
  id: string;
  name: string;
  posts: PostProps[]
}

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  return (
    
    
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)} className="flex justify-between items-center pr-3  border my-1 rounded-lg hover:cursor-pointer hover:bg-gray-200">
      {/* Left section */}
      <div className="flex items-center flex-shrink-0">
        {post?.images?.length > 0 && (
          <Image  src={post?.images?.[0]?.secureUrl} width={150} height={100}  className="object-cover object-center rounded-l-lg"/>  
        )}
        <p className="mx-5 ">{post.title}</p>
      </div>

      {/* Right section */}
      <div className="flex gap-2">
        <p className="text-sm text-gray-400">{post.location}</p>
        <p className="text-sm font-bold">{post.price.toFixed(2)} EUR</p>
      </div>
      
      {/* {post?.images?.length > 0 && (
        <Image width={300} height={300} src={post?.images?.[0]?.secureUrl} className="z-0  h-52 object-cover object-center hover:scale-110 ease-in-out duration-100"/>

      )}
      <div className="p-4 overflow-hidden z-10 w-full bg-white">
        <h2 className="text-center">{post.title}</h2>
        <p className="flex justify-center font-bold text-xs">{post.price || '0'} EUR</p>

      </div>
      <ReactMarkdown children={post.content} /> */}
      
    </div>
  );
};

export default Post;
