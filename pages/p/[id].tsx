import { useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import { Post } from '../../types';
import { ImageSlider } from '../../components/PostComponents/ImageSlider';
import { Messages } from '../../components/PostComponents/Messages';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post: Post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      images: true,
      comments: {
        include: {
          replies: {
            include: {
              author: true,
            },
          },
          author: true,
        },
      },
      categories: true,
      author: true,
    },
  });
  console.log(post);
  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
  };
};

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  await Router.push('/');
}

const Post: React.FC<{ post: Post }> = ({ post }) => {
  const { images, author, published, content, price, comments, id, location } =
    post;

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Login sisse...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === author?.email;

  let title = post?.title;
  if (!published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2 className="text-center font-bold text-2xl my-4">{title}</h2>
        <p className="text-center my-4">
          Postitatud {author?.name || 'Unknown author'} poolt
        </p>
        <ImageSlider images={images} />
        <ReactMarkdown
          children={content}
          className="my-5 mx-2"
        />
        <div className="flex justify-center items-center">
          <select
            name="currency"
            id="currency"
            className="border mr-2"
          >
            <option>EUR</option>
            <option>USD</option>
            <option>RUB</option>
          </select>
          <p className="font-bold text-3xl">{price?.toFixed(2) || '0.00'}€</p>
        </div>
        <p className="text-center font-bold my-5">{location}</p>
        <hr className="mx-3"></hr>
        <div className="flex justify-between mt-5 m-5 ">
          <div className="flex flex-col">
            <span>34,5</span>
            <span>Prindi</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-5 ">
            <button>Muuda</button>
            <p>Kuulutus aktiivne 18.02.2018 - 02.03.2018</p>
          </div>
          <div className="flex flex-col ">
            <span>Lisa lemmikuks</span>
            <span className="text-right">Teata</span>
          </div>
        </div>

        <div className="flex">
          <div className="flex bg-gray-400 p-5">
            <p>Müüja</p>
          </div>
          <div className="flex bg-gray-300 p-5">
            <p>Küsimused</p>
          </div>
        </div>
        <Messages
          comments={comments}
          id={id}
        />
        <p className="text-right mr-5 text-blue-600 text-xs">
          Salvesta kuulutuse kõvatõmmis
        </p>
        <div className="bg-blue-600 flex items-center justify-center gap-5 p-2">
          <p className="text-white hover:text-gray-300 cursor-pointer">
            Reklaam
          </p>
          <p className="text-white hover:text-gray-300 cursor-pointer">
            Tingimused
          </p>
          <p className="text-white hover:text-gray-300 cursor-pointer">
            Kontakt
          </p>
        </div>
        {!published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(id)}>Avalda</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(id)}>Kustuta</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
