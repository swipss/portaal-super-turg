import moment from 'moment';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillHeart, AiFillPhone, AiOutlineHeart } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layouts/Layout';
import { Loader } from '../../components/Layouts/Loader';
import CategoryTree from '../../components/PostComponents/CategoryTree';
import Comments from '../../components/PostComponents/Comments';
import ConditionRating from '../../components/PostComponents/Rating';
import Slider from '../../components/PostComponents/Slider';
import { trpc } from '../../utils/trpc';
import { BiCopy } from 'react-icons/bi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReportModal from '../../components/ReportModal';

const PostsCarousel = ({ carouselPosts, postId }) => {
  return (
    <div className="w-full overflow-scroll">
      <div className="flex gap-4 overflow-scroll w-max">
        {carouselPosts?.map((post) => (
          <div
            className={`${
              post.id === postId && 'border-2 border-slate-900'
            } text-sm text-center flex flex-col`}
          >
            <Image
              src={post.images[0].secureUrl}
              width={125}
              height={75}
              objectFit="cover"
              objectPosition={'center center'}
            />
            <Link href={`/kuulutus/${post.id}`}>
              <a className="underline">{post.title}</a>
            </Link>
            <p className="font-bold">{post.price.toFixed()}€</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const NewPostPage: NextPage = () => {
  const router = useRouter();
  const { id: postId } = router.query;
  const [loading, setLoading] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { data, isLoading, isError } = trpc.post.getSingle.useQuery({
    postId: String(postId),
  });
  const { data: carouselPosts } = trpc.post.getAll.useQuery();
  const categories = trpc.post.getCategories.useQuery();
  const likePost = trpc.post.likePost.useMutation();
  const unlikePost = trpc.post.removeLike.useMutation();

  const { data: session } = useSession();

  const YouTubeLinkParser = (string) => {
    const youtubeLinks = string?.match(
      /https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+/g
    );

    return youtubeLinks?.map((link) => link.replace('watch?v=', 'embed/'));
  };
  const videos = YouTubeLinkParser(data?.content);

  const postLikes = data?.likes;
  const [hasUserLikedPost, setHasUserLikedPost] = useState(
    postLikes?.some((like) => like?.user?.email === session?.user?.email)
  );

  const handleLikePost = () => {
    if (!session) {
      return router.push('/signin');
    }
    setLoading(true);

    likePost.mutate(
      {
        postId: String(data?.id),
        user: String(session?.user?.email),
      },
      {
        onSuccess: () => {
          console.log('liked post');
          setLoading(false);
          setHasUserLikedPost(true);
        },
      }
    );
  };
  const handleUnlikePost = async () => {
    if (!session) {
      return router.push('/signin');
    }
    setLoading(true);

    unlikePost.mutateAsync(
      {
        postId: String(data?.id),
        user: String(session?.user?.email),
      },
      {
        onSuccess: () => {
          console.log('unliked post');
          setLoading(false);
          setHasUserLikedPost(false);
        },
      }
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Kuulutuse link kopeeritud', {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Tekkis viga</div>;
  }
  return (
    <>
      <Layout>
        <PostsCarousel
          carouselPosts={carouselPosts}
          postId={data?.id}
        />
        <div className="relative p-4 bg-white rounded shadow-xl">
          {data?.reservedUntil && (
            <p className="p-1 my-2 text-lg font-medium tracking-wider text-center text-white bg-red-400 rounded animate-pulse">
              BRONEERITUD KUNI {moment(data?.reservedUntil).format('DD.MM')}
            </p>
          )}
          {data?.expiredOn && (
            <p className="p-1 my-2 text-lg font-medium tracking-wider text-center text-white rounded bg-slate-900 animate-pulse">
              MITTEAKTIIVNE KUULUTUS! Aegus{' '}
              {moment(data?.expiredOn).format('DD.MM')}
            </p>
          )}
          <div className="flex items-center justify-center">
            <CategoryTree
              category={data?.category}
              parentId={data?.category?.parentId ?? ''}
              categories={categories.data}
            />
          </div>
          <h1 className="text-center title">{data?.title}</h1>
          <p className="p-3 mx-auto my-2 text-xl font-bold text-center text-white rounded w-max bg-slate-900">
            €{data?.price?.toFixed(2) ?? 0}
          </p>
          <Slider images={data?.images} />
          <ReactMarkdown
            children={data?.content ?? 'Sisu puudub'}
            className="p-5 my-2 bg-gray-100 border rounded"
          />
          <div className="flex gap-2 my-2 overflow-scroll">
            {videos?.map((video) => (
              <iframe
                src={video}
                className="rounded-md shadow-md shadow-blue-500 "
                frameBorder={0}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ))}
          </div>
          <ConditionRating conditionRating={data?.conditionRating ?? 0} />
          <ReactMarkdown
            children={data?.conditionInfo ?? 'Seisukorra põhjendus puudub'}
            className="p-5 my-2 bg-gray-100 border rounded"
          />
          <div className="p-5 text-center bg-gray-100 border rounded">
            {data?.location ?? 'Asukoht määramata'}
            <Link href={`/user/${data?.author?.id}`}>
              <a className="flex items-center justify-center gap-1 p-2 mx-auto my-2 bg-white border rounded shadow w-max hover:bg-gray-100">
                <img
                  src={data?.author?.image ?? ''}
                  className="w-10 h-10 rounded"
                />
                {data?.author?.name ?? 'Kasutaja puudub'}
              </a>
            </Link>
            <AiFillPhone
              size={24}
              className="inline-block m-0 mr-1"
            />
            {data?.author?.phone ?? '(puudub)'}
          </div>
          <div className="px-2 mx-auto my-2 text-sm text-white bg-green-500 rounded w-max">
            Aktiivne kuni{' '}
            {moment(data?.publishedOn).add(1, 'month').format('DD.MM')}
          </div>
          {hasUserLikedPost ? (
            <div className="flex items-center gap-1">
              <AiFillHeart
                size={20}
                color="red"
              />
              <button
                onClick={handleUnlikePost}
                className={`${loading && 'opacity-20 animate-pulse'}`}
              >
                Eemalda lemmikutest
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <AiOutlineHeart size={20} />
              <button
                onClick={handleLikePost}
                className={`${loading && 'opacity-20 animate-pulse'}`}
              >
                Lisa lemmikuks
              </button>
            </div>
          )}
          <ToastContainer />
          <div className="flex items-center gap-1">
            <BiCopy size={20} />
            <button onClick={() => handleCopyLink()}>Kopeeri link</button>
          </div>
          <button onClick={() => setIsReportModalOpen(true)}>Teata</button>
          <h1 className="my-2 title">Kommentaarid</h1>
          <Comments
            postComments={data?.comments}
            session={session}
            post={data}
          />
        </div>
      </Layout>
      {isReportModalOpen && (
        <ReportModal
          setIsReportModalOpen={setIsReportModalOpen}
          postId={data?.id!}
        />
      )}
    </>
  );
};

export default NewPostPage;
