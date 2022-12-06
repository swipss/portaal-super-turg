import moment from 'moment';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AiFillPhone } from 'react-icons/ai';
import ReactMarkdown from 'react-markdown';
import Layout from '../../components/Layouts/Layout';
import { Loader } from '../../components/Layouts/Loader';
import CategoryTree from '../../components/PostComponents/CategoryTree';
import Comments from '../../components/PostComponents/Comments';
import ConditionRating from '../../components/PostComponents/Rating';
import Slider from '../../components/PostComponents/Slider';
import { trpc } from '../../utils/trpc';

const NewPostPage: NextPage = () => {
  const router = useRouter();
  const { id: postId } = router.query;

  const { data, isLoading, isError } = trpc.post.getSingle.useQuery({
    postId: String(postId),
  });

  const categories = trpc.post.getCategories.useQuery();

  const { data: session } = useSession();

  const videos = YouTubeLinkParser(data?.content);

  function YouTubeLinkParser(string) {
    // Use a regular expression to find all YouTube links in the string
    const youtubeLinks = string?.match(
      /https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9]+/g
    );

    // Return the YouTube links as embeddable URLs
    return youtubeLinks?.map((link) => link.replace('watch?v=', 'embed/'));
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Tekkis viga</div>;
  }
  return (
    <Layout>
      <div className="p-4 bg-white rounded shadow-xl">
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
        <h1 className="my-2 title">Kommentaarid</h1>
        <Comments
          postComments={data?.comments}
          session={session}
          post={data}
        />
      </div>
    </Layout>
  );
};

export default NewPostPage;
