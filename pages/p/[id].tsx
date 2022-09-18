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
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Rating } from '@mui/material';
import { TiStar } from 'react-icons/ti';
import { BsFillPersonFill } from 'react-icons/bs';
import Link from 'next/link';

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

const Post: React.FC<{ post: any }> = ({ post }) => {
  const {
    images,
    author,
    published,
    content,
    price,
    comments,
    id,
    location,
    conditionRating,
    conditionInfo,
  } = post;

  const [currentImageIndex, setCurrentImageIndex] = useState<
    number | undefined
  >();

  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Login sisse...</div>;
  }

  const imageURLs = images?.map((image) => image.secureUrl);

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === author?.email;

  let title = post?.title;
  if (!published) {
    title = `${title} (Draft)`;
  }

  const indicators = (index) => (
    <div
      className={`w-[75px] h-[75px] cursor-pointer ml-2 my-1 border border-gray-300 rounded shadow-md p-1  ${
        index == currentImageIndex &&
        'transform -translate-y-2 ease-in-out duration-200 bg-blue-500'
      }`}
    >
      <img
        src={images?.[index].secureUrl}
        className={`h-full w-full object-cover object-center `}
      />
    </div>
  );

  return (
    <Layout>
      <div>
        <div className="w-full flex justify-center mt-5">
          {published ? (
            <span className=" bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
              Aktiivne
            </span>
          ) : (
            <span className="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
              Aegunud
            </span>
          )}
        </div>
        <p className="my-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </p>
        {images.length && (
          <div className="slide-container">
            <Slide
              indicators={indicators}
              autoplay={false}
              canSwipe={true}
              transitionDuration={250}
              easing="cubic"
              onChange={(prevIndex, nextIndex) =>
                setCurrentImageIndex(nextIndex)
              }
            >
              {imageURLs.map((slideImage, index) => (
                <div
                  className="each-slide "
                  key={index}
                >
                  <div
                    style={{
                      backgroundImage: `url(${slideImage})`,
                    }}
                  ></div>
                </div>
              ))}
            </Slide>
          </div>
        )}
        <ReactMarkdown
          children={content}
          className="mt-5 mx-2 bg-gray-100 rounded p-5  border"
        />
        <div className="flex mx-2 mt-5 items-center gap-2">
          <p className="text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Seisukord
          </p>

          <div className="flex items-center gap-2 bg-slate-900 py-1 px-1 rounded-lg my-3 shadow-md">
            <span className="font-bold border py-1 px-2 rounded-lg bg-white">
              {conditionRating} / 5
            </span>
            <Rating
              value={conditionRating}
              readOnly
              icon={
                <TiStar
                  size={24}
                  color="orange"
                />
              }
              emptyIcon={
                <TiStar
                  size={24}
                  color="#666"
                />
              }
            />
          </div>
        </div>

        <ReactMarkdown
          children={conditionInfo}
          className=" mx-2 bg-gray-100 rounded p-5  border"
        />
        <div className="flex my-5 gap-2 justify-center text-center text-2xl font-bold items-center tracking-tight">
          <p className="">Hind</p>
          <p className="bg-slate-900 text-white py-2 px-3 rounded-lg shadow-md">
            {' '}
            {price?.toFixed(2) || '0.00'} €
          </p>
        </div>
        <div className="bg-gray-100 p-5 rounded border w-6/12 mx-auto flex flex-col items-center justify-center ">
          <p className="font-bold">{location || 'Asukoht puudub'}</p>
          <div className="bg-white p-2 border rounded flex gap-2 items-center">
            <BsFillPersonFill size={24} />
            <Link href={`/user/${author.id}`}>
              <a>{author.name}</a>
            </Link>
          </div>
        </div>

        <Messages
          comments={comments}
          id={id}
        />

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
