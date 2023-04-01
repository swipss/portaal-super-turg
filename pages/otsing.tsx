import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Post from '../components/HomeComponents/Post';
import Search from '../components/HomeComponents/Search';
import Layout from '../components/Layouts/Layout';
import PostSkeleton from '../components/Layouts/PostSkeleton';
import { trpc } from '../utils/trpc';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const { data: categories } = trpc.post.getCategories.useQuery();

  const topLevelCategory = categories?.find((c) => c.name === params.category);

  const { data: categoryPosts, isLoading } =
    trpc.post.getPostsByCategoryIds.useQuery({
      ...params,
      categoryIds: getChildrenIds(topLevelCategory, []),
    });
  console.log(getChildrenIds(topLevelCategory, []));
  function getChildrenIds(category, allIds) {
    if (category?.id) {
      allIds.push(category?.id);
    }
    const children = categories?.filter((c) => c.parentId === category?.id);
    if (children?.length) {
      for (const child of children) {
        getChildrenIds(child, allIds);
      }
    }
    return allIds;
  }

  return (
    <Layout>
      <main>
        <Search />
        <div>
          {isLoading && <PostSkeleton />}
          {categoryPosts?.map((post) => (
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
