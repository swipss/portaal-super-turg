import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Post from '../components/HomeComponents/Post';
import Search from '../components/HomeComponents/Search';
import Layout from '../components/Layouts/Layout';
import PostSkeleton from '../components/Layouts/PostSkeleton';
import { trpc } from '../utils/trpc';
import { typeValues } from '../components/DraftComponents/PostTypes';
import { useState } from 'react';

const SearchPage: NextPage = () => {
  const router = useRouter();
  const params = router.query;
  const { data: categories } = trpc.post.getCategories.useQuery();

  const [selectedType, setSelectedType] = useState<
    string | string[] | undefined
  >(params?.type);
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  const topLevelCategory = categories?.find(
    (c) => c.name.toLowerCase() === params.category
  );

  const { data: posts, isLoading } = trpc.post.getPostsByCategoryIds.useQuery({
    ...params,
    categoryIds: getChildrenIds(topLevelCategory, []),
  });

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

  // filter posts by type and condition if they have been clicked
  const filteredPosts = posts?.filter((post) => {
    if (selectedType && selectedCondition) {
      return post.type === selectedType && post.condition === selectedCondition;
    } else if (selectedType) {
      return post.type === selectedType;
    } else if (selectedCondition) {
      return post.condition === selectedCondition;
    } else {
      return post;
    }
  });

  function handleClickType(type: string): void {
    // if the clicked type is the same as the selected type, deselect it, otherwise select it
    if (selectedType === type) {
      setSelectedType('');
    } else {
      setSelectedType(type);
    }
  }

  function handleClickCondition(condition: string): void {
    if (selectedCondition === condition) {
      setSelectedCondition('');
    } else {
      setSelectedCondition(condition);
    }
  }
  return (
    <Layout>
      <main>
        <Search />
        {params?.title && (
          <p className="mt-2 text-center text-gray-900 bold">
            <strong>{posts?.length}</strong> tulemu
            {posts?.length == 1 ? 's' : 'st'} otsingule "{params.title}"
          </p>
        )}
        <div className="flex flex-wrap mt-2">
          {typeValues.map((type) => (
            <button
              type="button"
              className={`${
                selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }  px-2 py-2 m-1 ${
                selectedType === type
                  ? '!bg-blue-500 text-white'
                  : 'bg-gray-100'
              }  px-4 py-2 rounded-md text-gray-700 font-medium text-sm`}
              onClick={() => handleClickType(type)}
            >
              {type.charAt(0).toUpperCase() +
                type.slice(1) +
                ' (' +
                posts?.filter((post) => post.type === type).length +
                ')'}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap mt-2">
          <button
            type="button"
            className={`${
              selectedCondition === 'new'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }  px-2 py-2 m-1 ${
              selectedCondition === 'new'
                ? '!bg-blue-500 text-white'
                : 'bg-gray-100'
            }  px-4 py-2 rounded-md text-gray-700 font-medium text-sm`}
            onClick={() => handleClickCondition('new')}
          >
            Uus{' ('}
            {
              posts?.filter(
                (post) => post.condition === 'new' && post.type === selectedType
              ).length
            }
            )
          </button>
          <button
            type="button"
            className={`${
              selectedCondition === 'used'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            }  px-2 py-2 m-1 ${
              selectedCondition === 'used'
                ? '!bg-blue-500 text-white'
                : 'bg-gray-100'
            }  px-4 py-2 rounded-md text-gray-700 font-medium text-sm`}
            onClick={() => handleClickCondition('used')}
          >
            Kasutatud{' ('}
            {
              posts?.filter(
                (post) =>
                  post.condition === 'used' && post.type === selectedType
              ).length
            }
            )
          </button>
        </div>

        {filteredPosts?.map((post) => (
          <Post post={post} />
        ))}
        {isLoading && <PostSkeleton />}
      </main>
    </Layout>
  );
};

export default SearchPage;
