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

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)} className="cursor-pointer rounded-md w-52 transform hover:-translate-y-3 ease-out duration-100  hover:shadow-black overflow-hidden mb-4 flex flex-col items-center justify-center border ">
      {post?.images?.length > 0 && (
        <Image width={300} height={300} src={post?.images?.[0]?.secureUrl} className="z-0  h-52 object-cover object-center hover:scale-110 ease-in-out duration-100"/>

      )}
      <div className="p-4 overflow-hidden z-10 w-full bg-white">
        <h2 className="text-center">{post.title}</h2>
        <p className="flex justify-center font-bold text-xs">{post.price || '0'} EUR</p>

      </div>
      {/* <ReactMarkdown children={post.content} /> */}
      
    </div>
  );
};

export default Post;
