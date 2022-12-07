import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Post from '../components/HomeComponents/Post';
import Search from '../components/HomeComponents/Search';
import Layout from '../components/Layouts/Layout';
import PostSkeleton from '../components/Layouts/PostSkeleton';
import { trpc } from '../utils/trpc';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const { data: posts, isLoading } = trpc.post.getByParams.useQuery(params);
  console.log(posts);
  console.log(params, 'params');
  return (
    <Layout>
      <main>
        <Search />
        <div>
          {isLoading && <PostSkeleton />}
          {posts?.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default SearchPage;
