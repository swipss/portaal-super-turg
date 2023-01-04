import { NextPage } from 'next';
import Layout from '../components/Layouts/Layout';
import { Post as PostInterface } from '../types';
import { trpc } from '../utils/trpc';
import PostSkeleton from '../components/Layouts/PostSkeleton';
import Post from '../components/HomeComponents/Post';
import Search from '../components/HomeComponents/Search';

const Home: NextPage<{
  posts: PostInterface[];
  categories: any;
}> = ({ posts, categories }) => {
  const { data: allPosts, isLoading } = trpc.post.getAll.useQuery();

  return (
    <Layout>
      <main>
        <Search />
        <div>
          {isLoading && <PostSkeleton />}
          {allPosts?.map((post) => (
            <div key={post.id}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
