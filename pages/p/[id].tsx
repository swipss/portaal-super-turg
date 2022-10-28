import { Dispatch, isValidElement, SetStateAction, useState } from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import { Post } from '../../types';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Rating } from '@mui/material';
import { TiStar } from 'react-icons/ti';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiFillPhone } from 'react-icons/ai';
import Link from 'next/link';
import { getTreeData } from '../../lib/getTreeData';
import moment from 'moment';
import { AiOutlineArrowRight } from 'react-icons/ai';
import Image from 'next/image';

const DEFAULT_IMAGE =
  'https://st2.depositphotos.com/4111759/12123/v/450/depositphotos_121232442-stock-illustration-male-default-placeholder-avatar-profile.jpg?forcejpeg=true';

export async function getStaticProps({ params }) {
  const post: Post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      images: true,
      comments: {
        include: {
          author: true,
        },
      },
      categories: true,
      author: true,
    },
  });
  // console.log(post);
  return {
    props: { post: JSON.parse(JSON.stringify(post)) },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const posts = await prisma.post.findMany();

  return {
    paths: posts.map((post) => ({
      params: {
        id: post.id.toString(),
      },
    })),
    fallback: 'blocking',
  };
}

async function postComment(comment) {
  const result = await fetch('/api/comment', {
    method: 'POST',
    body: JSON.stringify(comment),
  });
  const response = result.json();
  return response;
}

async function publishPost(
  id: string,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> {
  setLoading(true);
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
  setLoading(false);
}

const Tree = ({
  treeData,
  parentId = null,
  level = 0,
  comment,
  setComment,
  setTreeData,
  selectedComment,
  setSelectedComment,
  handleChange,
  handleSubmit,
  isValidComment,
  author,
  session,
}) => {
  const items = treeData
    .filter((item) => item.parent_comment_id === parentId)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA < dateB ? 1 : -1;
    });
  if (!items.length) return null;

  return (
    <div>
      {items.map((item) => (
        <div
          className={`${level !== 0 && 'ml-10'} mx-2`}
          key={item.id}
        >
          <div className="flex gap-2 p-3 relative ">
            {level !== 0 && (
              <div
                className={`h-32 border-l-2 border-b-2 w-10 rounded-bl-md absolute bottom-[70px] left-[-10px] -z-10`}
              />
            )}
            <Link href={`/user/${item.author?.id}`}>
              <a className="flex flex-shrink-0">
                <img
                  src={item?.author?.image}
                  className="h-10 w-10 rounded-full  shadow-md hover:border-2 hover:border-blue-500 object-cover object-center"
                />
              </a>
            </Link>
            <div className="overflow-auto">
              <div className="bg-gray-100 px-3 py-2 rounded-2xl ">
                <div className="flex gap-1">
                  <p className="font-bold">{item?.author?.name}</p>
                  {author?.email === item.author?.email && (
                    <span className=" bg-blue-100 text-blue-800 text-sm font-medium  px-2.5 py-0 rounded dark:bg-green-200 dark:text-green-900">
                      Kuulutaja
                    </span>
                  )}
                </div>
                <p className="break-words">{item.content}</p>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  className="text-sm ml-3 font-bold text-gray-400 hover:text-blue-500"
                  onClick={() => setSelectedComment(item.id)}
                >
                  Vasta
                </button>
                <p className="text-sm text-gray-400">
                  {moment(item.createdAt).format('DD.MM h:mm')} (
                  {moment(item.createdAt).fromNow()})
                </p>
              </div>
            </div>
          </div>
          {selectedComment === item.id && (
            <form onSubmit={(e) => handleSubmit(comment, e)}>
              <div className="relative flex">
                <div className="absolute border-l-2 h-20 bottom-7  left-[30px] -z-10" />
                <input
                  type={'text'}
                  disabled={!session}
                  placeholder={`${
                    !session
                      ? 'Kommenteerimiseks logi sisse'
                      : `Vasta kasutajale ${item.author?.name}`
                  } `}
                  className=" bg-gray-100 py-2 px-3 rounded-full w-full"
                  onChange={(e) => handleChange(e, setComment, item.id)}
                />
                <button
                  type="submit"
                  disabled={!isValidComment(comment) && selectedComment}
                  className="bg-blue-500 rounded-full w-11 ml-1 flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:opacity-50"
                >
                  <AiOutlineArrowRight
                    color="white"
                    size={20}
                  />
                </button>
              </div>
            </form>
          )}
          <Tree
            treeData={treeData}
            parentId={item.id}
            level={level + 1}
            comment={comment}
            setComment={setComment}
            setTreeData={setTreeData}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isValidComment={isValidComment}
            author={author}
            session={session}
          />
        </div>
      ))}
    </div>
  );
};

const Post: React.FC<{ post: any }> = ({ post }) => {
  const {
    images,
    author,
    published,
    content,
    price,
    id,
    location,
    conditionRating,
    conditionInfo,
    createdAt,
    reservedUntil,
    expiredOn,
  } = post;

  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  const [comments, setComments] = useState(post?.comments);
  const [treeData, setTreeData] = useState(getTreeData(comments));

  const [currentImageIndex, setCurrentImageIndex] = useState<
    number | undefined
  >(0);

  const [fullScreen, setFullScreen] = useState(false);

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
      className={`bg-white w-[75px] h-[75px] cursor-pointer ml-2 my-1 border border-gray-300 rounded shadow-md p-1 ${
        index == currentImageIndex &&
        'transform -translate-y-2 ease-in-out duration-200 bg-blue-500'
      } `}
    >
      <img
        src={images?.[index].secureUrl}
        className={`h-full w-full object-cover object-center `}
      />
    </div>
  );

  const handleChange = (e, setComment, parent = null) => {
    setComment({
      content: e.target.value,
      postId: id,
      parent_comment_id: parent,
      author: session?.user?.email,
    });
  };
  const handleSubmit = async (comment, e) => {
    e.preventDefault();
    if (!comment) return;
    const result = await postComment(comment);
    console.log(result, 'result');
    const newComments = getTreeData([...treeData, result]);
    setTreeData(newComments);
    setComment(null);
    setSelectedComment(null);
  };

  const isValidComment = (comment) => {
    return comment?.content?.length;
  };

  return (
    <Layout>
      <div>
        {reservedUntil && (
          <div className="mt-1">
            <p className="bg-red-200 text-lg tracking-wider text-center  font-medium text-white px-2 py-1 rounded-md animate-pulse">
              BRONEERITUD KUNI {moment(reservedUntil).format('DD.MM') ?? ''}
            </p>
          </div>
        )}
        {!published && (
          <div className="mt-1">
            <p className="bg-black text-lg tracking-wider text-center font-medium text-white px-2 py-1 rounded-md animate-pulse">
              MITTEAKTIIVNE KUULUTUS! Aegus{' '}
              {moment(expiredOn).format('DD.MM') ?? ''}
            </p>
          </div>
        )}
        <div className="text-center flex items-center justify-center  my-2 text-xl font-bold tracking-tight text-gray-900 mx-auto max-w-[600px]">
          <p>{title}</p>
        </div>
        <div className="flex my-3 gap-2 justify-center text-center text-2xl font-bold items-center tracking-tight">
          <p className="bg-slate-900 text-white py-2 px-3 rounded-lg shadow-md">
            {' '}
            € {price.toFixed(2) || '0.00'}
          </p>
        </div>
        {images.length ? (
          <div
            className={`${
              fullScreen ? 'slide-container-fullscreen' : 'slide-container '
            } `}
          >
            {fullScreen && (
              <button
                onClick={() => setFullScreen(false)}
                type="button"
                className="text-gray-400 absolute right-0 top-0 m-2 z-10 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
            <Slide
              indicators={indicators}
              autoplay={false}
              canSwipe={true}
              transitionDuration={250}
              easing="cubic"
              defaultIndex={0}
              onChange={(prevIndex, nextIndex) =>
                setCurrentImageIndex(nextIndex)
              }
            >
              {imageURLs.map((slideImage, index) => (
                <div
                  onClick={() => setFullScreen(!fullScreen)}
                  className={`${
                    fullScreen ? 'each-slide-fullscreen' : 'each-slide'
                  }`}
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
        ) : null}

        <ReactMarkdown
          children={content}
          className="mt-2 mx-2 bg-gray-100 rounded p-5  border"
        />
        <div className="flex mx-2 mt-5 items-center gap-2">
          <p className="text-center text-2xl font-bold tracking-tight text-gray-900 ">
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

        <div className="bg-gray-100 p-5 rounded border  mx-2 flex flex-col items-center justify-center mt-5">
          <p className="font-bold text-center">
            {location || 'Asukoht puudub'}
          </p>
          <Link href={`/user/${author?.id}`}>
            <div className="bg-white p-2 border rounded flex gap-2 items-center shadow-md mt-2 hover:bg-gray-100 cursor-pointer">
              <img
                src={author?.image}
                className="w-10 h-10 rounded-full object-cover object-center"
              />

              <a>{author?.name}</a>
            </div>
          </Link>
          <div className="flex mt-3 gap-1">
            <AiFillPhone size={24} />
            <p>{author?.phone}</p>
          </div>
        </div>
        <p className="ml-2 mt-5 text-2xl font-bold tracking-tight text-gray-900">
          Kommentaarid
        </p>
        <Tree
          treeData={treeData}
          comment={comment}
          setComment={setComment}
          setTreeData={setTreeData}
          selectedComment={selectedComment}
          setSelectedComment={setSelectedComment}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isValidComment={isValidComment}
          author={author}
          session={session}
        />

        <form onSubmit={(e) => handleSubmit(comment, e)}>
          <div className="flex gap-2 mt-2 mx-2">
            <input
              type={'text'}
              disabled={!session}
              placeholder={
                !session ? 'Kommenteerimiseks logi sisse' : 'Postita kommentaar'
              }
              className=" bg-gray-100 py-2  px-3 rounded-full w-full"
              onChange={(e) => handleChange(e, setComment)}
              onClick={() => setSelectedComment(null)}
            />
            <button
              type="submit"
              disabled={!isValidComment(comment) || selectedComment || !session}
              className="bg-blue-500 rounded-full w-11 h-10 flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:opacity-50"
            >
              <AiOutlineArrowRight
                color="white"
                size={20}
              />
            </button>
          </div>
        </form>
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
