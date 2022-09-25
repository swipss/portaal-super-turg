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

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: 'DELETE',
  });
  await Router.push('/');
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
  // console.log(level, items);

  return (
    <>
      {items.map((item) => (
        <div
          className={`${level !== 0 && 'ml-10'} mx-2`}
          key={item.id}
        >
          <div className="flex gap-2 p-3 relative">
            {level !== 0 && (
              <div
                className={`h-32 border-l-2 border-b-2 w-10 rounded-bl-md absolute bottom-[70px] left-[-10px] -z-10`}
              />
            )}
            <Link href={`user/${item.author?.id}`}>
              <a>
                <img
                  src={item?.author?.image}
                  className="h-10 w-10 rounded-full shadow-md hover:border-2 hover:border-blue-500 object-cover object-center"
                />
              </a>
            </Link>
            <div>
              <div className="bg-gray-100 px-3 py-2 rounded-2xl">
                <div className="flex gap-1">
                  <p className="font-bold">{item?.author?.name}</p>
                  {author?.email === item.author?.email && (
                    <span className=" bg-blue-100 text-blue-800 text-sm font-medium  px-2.5 py-0 rounded dark:bg-green-200 dark:text-green-900">
                      Kuulutaja
                    </span>
                  )}
                </div>
                <p>{item.content}</p>
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  className="text-sm ml-3 font-bold text-gray-400 hover:text-blue-500"
                  onClick={() => setSelectedComment(item.id)}
                >
                  Vasta
                </button>
                <p className="text-sm text-gray-400">
                  {moment(item.createdAt).fromNow()}
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
    </>
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
  } = post;

  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState();
  const [selectedComment, setSelectedComment] = useState(null);

  const [treeData, setTreeData] = useState(getTreeData(post?.comments));
  console.log(treeData.length, 'treedata');

  const [currentImageIndex, setCurrentImageIndex] = useState<
    number | undefined
  >(0);

  const { data: session, status } = useSession();
  console.log(session);
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
    await postComment(comment);
    setComment(null);
    setSelectedComment(null);
    window.location.reload();
  };

  const isValidComment = (comment) => {
    return comment?.content?.length;
  };

  return (
    <Layout>
      <div>
        <div className="w-full flex justify-center mt-5">
          {published ? (
            <span className=" bg-green-100 text-green-800 text-sm font-medium  px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
              Aktiivne
            </span>
          ) : (
            <>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900">
                Aegunud
              </span>

              {!published && userHasValidSession && postBelongsToUser && (
                <>
                  {loading ? (
                    <button
                      disabled
                      type="button"
                      className="px-2.5 py-0.5 ml-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700  inline-flex items-center"
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Aktiveerin...
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => publishPost(id, setLoading)}
                      className="px-2.5 py-0.5 ml-2  text-sm font-medium text-gray-900 focus:outline-none bg-white rounded border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 "
                    >
                      Aktiveeri
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <p className="my-2 text-center text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </p>
        <div className="flex my-3 gap-2 justify-center text-center text-2xl font-bold items-center tracking-tight">
          <p className="bg-slate-900 text-white py-2 px-3 rounded-lg shadow-md">
            {' '}
            € {price?.toFixed(2) || '0.00'}
          </p>
        </div>
        {images.length ? (
          <div className="slide-container">
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
        ) : null}
        <p className="mx-2 mt-5 text-2xl font-bold tracking-tight text-gray-900">
          Müüja kirjeldus
        </p>
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

        <div className="bg-gray-100 p-5 rounded border w-6/12 mx-auto flex flex-col items-center justify-center mt-5">
          <p className="font-bold text-center">
            {location || 'Asukoht puudub'}
          </p>
          <Link href={`/user/${author?.id}`}>
            <div className="bg-white p-2 border rounded flex gap-2 items-center shadow-md mt-2 hover:bg-gray-100 cursor-pointer">
              <BsFillPersonFill size={24} />
              <a>{author?.name}</a>
            </div>
          </Link>
          <div className="flex mt-3 gap-1">
            <AiFillPhone size={24} />
            <p>{author?.phone}</p>
          </div>
        </div>
        <p className="mx-2 mt-5 text-2xl font-bold tracking-tight text-gray-900">
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
              className=" bg-gray-100 py-2 px-3 rounded-full w-full"
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
