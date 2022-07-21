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
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)} className="w-52 hover:shadow-sm  hover:shadow-black mb-4 flex flex-col items-center justify-center border">
      <img src={post.images?.[0].secureUrl} className="h-52 object-cover object-center"/>
      <div className="p-4">
        <h2 className="text-center">{post.title}</h2>
        <p className="flex justify-center font-bold text-xs">{post.price || '0'}€</p>

      </div>
      {/* <ReactMarkdown children={post.content} /> */}
      
    </div>
  );
};

export default Post;
