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
  const topLevelCategory = categories?.find(
    (c) => c.name.toLowerCase() === params.category
  );
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const { data: categoryPosts, isLoading } =
    trpc.post.getPostsByCategoryIds.useQuery({
      ...params,
      categoryIds: getChildrenIds(topLevelCategory, []),
    });
  const { data: titlePosts, isLoading: titleLoading } =
    trpc.post.getPostsByTitle.useQuery(params);

  const filteredPosts = [
    ...(categoryPosts ?? []),
    ...(titlePosts?.filter(
      (post) =>
        !categoryPosts?.some(
          (categoryPost) =>
            categoryPost.id === post.id && categoryPost.title === post.title
        )
    ) ?? []),
  ];

  const conditionFilteredPosts = selectedCondition
    ? filteredPosts?.filter((post) => {
        if (selectedCondition === 'new') {
          return (
            post.conditionRating === null &&
            (!selectedType || post.type === selectedType)
          );
        } else {
          return (
            post.conditionRating !== null &&
            post.conditionRating >= 1 &&
            post.conditionRating <= 5 &&
            (!selectedType || post.type === selectedType)
          );
        }
      })
    : filteredPosts.filter(
        (post) => !selectedType || post.type === selectedType
      );

  function handleTypeClick(type: string) {
    if (selectedType === type) {
      setSelectedType(null);
    } else {
      setSelectedType(type);
    }
  }

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

  function handleConditionClick(condition: string) {
    if (selectedCondition === condition) {
      setSelectedCondition(null);
    } else {
      setSelectedCondition(condition);
    }
  }
  return (
    <Layout>
      <main>
        {params.title && (
          <p className="my-2 text-center">
            Märksõna "{params.title}" järgi leiti <b>{categoryPosts?.length}</b>{' '}
            postitust{' '}
          </p>
        )}
        <Search />
        {filteredPosts?.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {typeValues.map((type) => (
              <button
                type="button"
                onClick={() => handleTypeClick(type)}
                className={`px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
                  selectedType === type
                    ? 'bg-blue-500 rounded-md text-white'
                    : 'bg-gray-100 rounded-md hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} (
                {filteredPosts?.filter((p) => p.type === type).length})
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap mt-2">
          <button
            type="button"
            onClick={() => handleConditionClick('new')}
            className={`px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
              selectedCondition === 'new'
                ? 'bg-blue-500 rounded-md text-white'
                : 'bg-gray-100 rounded-md hover:bg-gray-200'
            }`}
          >
            Uus ({filteredPosts?.filter((p) => p.condition === 'new').length})
          </button>
          <button
            type="button"
            onClick={() => handleConditionClick('used')}
            className={`px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
              selectedCondition === 'used'
                ? 'bg-blue-500 rounded-md text-white'
                : 'bg-gray-100 rounded-md hover:bg-gray-200'
            }`}
          >
            Kasutatud (
            {filteredPosts?.filter((p) => p.condition === 'used').length})
          </button>
        </div>
        <div>
          {isLoading && titleLoading && <PostSkeleton />}
          {/* if the user didnt specify the text search, render posts by category */}
          {!params.title ? (
            <div>
              {categoryPosts?.map((post) => (
                <div key={post.id}>
                  <Post post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div>
              {conditionFilteredPosts?.map((post) => (
                <div key={post.id}>
                  <Post post={post} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SearchPage;
