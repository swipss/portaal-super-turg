import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import NewPostModal from '../../components/DraftComponents/CreatePostModal';
import Layout from '../../components/Layouts/Layout';
import PostSkeleton from '../../components/Layouts/PostSkeleton';
import { trpc } from '../../utils/trpc';
import Unauthorized from '../unauthorized';
import 'react-toastify/dist/ReactToastify.css';
import DraftsPost from '../../components/DraftComponents/DraftsPost';

const Drafts: NextPage = () => {
  const [posts, setPosts] = useState<any>();

  const { data, isLoading, isError, refetch } =
    trpc.drafts.getUserPosts.useQuery();
  const categories = trpc.post.getCategories.useQuery();

  const deactivate = trpc.drafts.deactivatePost.useMutation();
  const activate = trpc.drafts.activatePost.useMutation();
  const deactivateMultiple = trpc.drafts.deactivateMultiple.useMutation();
  const activateMultiple = trpc.drafts.activateMultiple.useMutation();
  const deletePostMutation = trpc.drafts.deletePost.useMutation();

  const [loading, setLoading] = useState(false);
  const [newPostModal, setNewPostModal] = useState(false);

  const publishedPosts = posts
    ?.filter((post) => post.published === true)
    .sort((a, b) => {
      const dateA = new Date(a.publishedOn).getTime();
      const dateB = new Date(b.publishedOn).getTime();
      return dateB > dateA ? 1 : -1;
    });

  const unpublishedPosts = posts
    ?.filter((post) => post.published !== true)
    .sort((a, b) => {
      const dateA = new Date(a.expiredOn).getTime();
      const dateB = new Date(b.expiredOn).getTime();
      return dateB > dateA ? 1 : -1;
    });

  const [selectedPublishedPosts, setSelectedPublishedPosts] = useState<
    string[]
  >([]);
  const [selectedUnpublishedPosts, setSelectedUnpublishedPosts] = useState<
    string[]
  >([]);

  const deactivatePost = (id) => {
    setLoading(true);
    deactivate.mutate(id, {
      onSuccess: (res) => {
        refetch();
        setLoading(false);
      },
    });
  };

  const activatePost = (id) => {
    setLoading(true);
    activate.mutate(id, {
      onSuccess: (res) => {
        refetch();
        setLoading(false);
      },
    });
  };

  const notify = () =>
    toast.success('Kuulutus postitatud', {
      position: 'top-center',
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleSelectAllPublishedPosts = () => {
    if (selectedPublishedPosts.length === publishedPosts.length) {
      setSelectedPublishedPosts([]);
    } else {
      setSelectedPublishedPosts(publishedPosts.map((post) => post.id));
    }
  };

  const handleSelectAllUnpublishedPosts = () => {
    if (selectedUnpublishedPosts.length === unpublishedPosts.length) {
      setSelectedUnpublishedPosts([]);
    } else {
      setSelectedUnpublishedPosts(unpublishedPosts.map((post) => post.id));
    }
  };

  const handleSelectPublishedPost = (id) => {
    if (selectedPublishedPosts.some((item) => item === id)) {
      const newArr = selectedPublishedPosts.filter((item) => item !== id);
      setSelectedPublishedPosts(newArr);
    } else {
      setSelectedPublishedPosts([...selectedPublishedPosts, id]);
    }
  };

  const handleSelectUnpublishedPost = (id) => {
    if (selectedUnpublishedPosts.some((item) => item === id)) {
      const newArr = selectedUnpublishedPosts.filter((item) => item !== id);
      setSelectedUnpublishedPosts(newArr);
    } else {
      setSelectedUnpublishedPosts([...selectedUnpublishedPosts, id]);
    }
  };

  const handleSelectPost = (post) => {
    post.published
      ? handleSelectPublishedPost(post.id)
      : handleSelectUnpublishedPost(post.id);
  };

  const isChecked = (id: string): boolean =>
    selectedPublishedPosts.includes(id) ||
    selectedUnpublishedPosts.includes(id);

  const handleDeactivateMultiple = () => {
    deactivateMultiple.mutate(selectedPublishedPosts, {
      onSuccess: (res) => {
        refetch();
        setSelectedPublishedPosts([]);
      },
    });
  };
  const handleActivateMultiple = () => {
    activateMultiple.mutate(selectedUnpublishedPosts, {
      onSuccess: (res) => {
        refetch();
        setSelectedUnpublishedPosts([]);
      },
    });
  };

  const deletePost = (id) => {
    deletePostMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  useEffect(() => {
    setPosts(data);
  }, [data]);

  if (isLoading)
    return (
      <Layout>
        <PostSkeleton />
      </Layout>
    );

  if (isError)
    return (
      <Unauthorized>
        Kuulutuse kuvamiseks
        <Link
          href="/api/auth/signin"
          legacyBehavior
        >
          <a className="ml-1 underline">logi sisse</a>
        </Link>
      </Unauthorized>
    );

  return (
    <Layout>
      <ToastContainer />
      <div>
        <button
          onClick={() => setNewPostModal(true)}
          className="flex items-center justify-center float-right w-10 h-10 text-sm font-medium text-center text-white transition-all duration-75 ease-in-out bg-blue-500 rounded-lg shadow-lg b from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 hover:-translate-y-1"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </button>
        <h1 className="pb-2 font-bold w-max">
          Minu kuulutused ({posts?.length})
        </h1>
        {publishedPosts?.length > 0 && (
          <h1 className="mt-2 title">
            Aktiivsed kuulutused ({publishedPosts?.length})
          </h1>
        )}
        {publishedPosts?.length > 0 && (
          <button
            onClick={handleSelectAllPublishedPosts}
            className="mt-2 text-white bg-blue-500 button hover:bg-blue-600"
          >
            Vali kõik
          </button>
        )}
        {selectedPublishedPosts?.length > 0 && (
          <button
            onClick={handleDeactivateMultiple}
            className="mt-2 ml-2 text-white bg-blue-500 button hover:bg-blue-600"
          >
            Deaktiveeri ({selectedPublishedPosts.length})
          </button>
        )}
        {publishedPosts?.map((post) => (
          <div key={post.id}>
            <DraftsPost
              activatePost={activatePost}
              deactivatePost={deactivatePost}
              post={post}
              loading={loading}
              handleSelectPost={handleSelectPost}
              isChecked={isChecked}
              deletePost={deletePost}
              refetch={refetch}
            />
          </div>
        ))}
        {unpublishedPosts?.length > 0 && (
          <h1 className="my-2 title">
            Mitteaktiivsed kuulutused ({unpublishedPosts?.length})
          </h1>
        )}
        {unpublishedPosts?.length > 0 && (
          <button
            onClick={handleSelectAllUnpublishedPosts}
            className="mt-2 text-white bg-blue-500 button hover:bg-blue-600"
          >
            Vali kõik
          </button>
        )}
        {selectedUnpublishedPosts?.length > 0 && (
          <button
            onClick={handleActivateMultiple}
            className="mt-2 ml-2 text-white bg-blue-500 button hover:bg-blue-600"
          >
            Aktiveeri ({selectedUnpublishedPosts.length})
          </button>
        )}
        {unpublishedPosts?.map((post) => (
          <div key={post.id}>
            <DraftsPost
              activatePost={activatePost}
              deactivatePost={deactivatePost}
              post={post}
              loading={loading}
              handleSelectPost={handleSelectPost}
              isChecked={isChecked}
              deletePost={deletePost}
              refetch={refetch}
            />
          </div>
        ))}
      </div>
      {newPostModal && (
        <NewPostModal
          setNewPostModal={setNewPostModal}
          categories={categories.data}
          setPosts={setPosts}
          posts={posts}
          notify={notify}
        />
      )}
    </Layout>
  );
};

export default Drafts;
