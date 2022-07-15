import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

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
  images: string[];


};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)} className="w-52 hover:shadow-sm  hover:shadow-black mb-4">
      <div className="bg-gray-300 w-full h-40 flex items-center justify-center ">
        <span>PILT</span>
      </div>
      <div className="p-4">
        <h2 className="text-center">{post.title}</h2>
        <p className="flex justify-center font-bold text-xs">{post.price || '0'}€</p>

      </div>
      {/* <ReactMarkdown children={post.content} /> */}
      
    </div>
  );
};

export default Post;
