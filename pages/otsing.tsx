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

  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');

  const topLevelCategory = categories?.find(
    (c) => c.name.toLowerCase() === params.category
  );

  const { data: categoryPosts, isLoading } =
    trpc.post.getPostsByCategoryIds.useQuery({
      ...params,
      categoryIds: getChildrenIds(topLevelCategory, []),
    });

  const { data: titlePosts, isLoading: titleLoading } =
    trpc.post.getPostsByTitle.useQuery(params);

  const filteredTitlePosts = titlePosts?.filter((post) => {
    if (selectedType && selectedType !== post.type) {
      return false;
    }
    if (selectedCondition && selectedCondition !== post.condition) {
      return false;
    }
    return true;
  });

  const filteredCategoryPosts = categoryPosts?.filter((post) => {
    if (selectedType && selectedType !== post.type) {
      return false;
    }
    if (selectedCondition && selectedCondition !== post.condition) {
      return false;
    }
    return true;
  });

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

  const filteredFilteredPosts = filteredPosts?.filter((post) => {
    // Filter posts by type and condition
    let isMatch = true;
    if (selectedType && post.type !== selectedType) {
      isMatch = false;
    }
    if (selectedCondition && post.condition !== selectedCondition) {
      isMatch = false;
    }
    return isMatch;
  });

  // fitler Filter posts by type and condition

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
        {/* display how many posts were found if the title was inputted */}
        {params.title && (
          <div className="mb-2 text-sm font-medium text-center text-gray-700">
            {filteredTitlePosts?.length}{' '}
            {filteredTitlePosts?.length === 1 ? 'tulemus' : 'tulemust'}{' '}
            {params.title && `otsingule "${params.title}"`}
          </div>
        )}
        <Search />

        {/* buttons for selecting post type then filtering posts by that post type */}
        <div className="flex flex-wrap gap-2 my-2">
          {typeValues.map((type) => (
            <button
              type="button"
              className={`${
                selectedType === type ? 'bg-blue-500 text-white' : 'bg-gray-100'
              } px-4 py-2 rounded-md text-gray-700 font-medium text-sm`}
              onClick={() => handleClickType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}{' '}
              {/* give the amount of posts for that type based on what posts are being rendered */}
              (
              {params.title &&
                params.category &&
                filteredPosts?.filter((post) => post.type === type).length}
              {params.title &&
                !params.category &&
                titlePosts?.filter((post) => post.type === type).length}
              {!params.title &&
                categoryPosts?.filter((post) => post.type === type).length}
              )
            </button>
          ))}
        </div>

        {/* buttons for selecting post condition */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`${
              selectedCondition === 'new'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            } px-4 py-2 rounded-md text-gray-700 text-sm font-medium`}
            onClick={() => handleClickCondition('new')}
          >
            Uus{' '}
            {/* give the amount of posts for that condition based on what posts are being rendered and what type is selected */}
            (
            {params.title &&
              params.category &&
              filteredPosts?.filter(
                (post) =>
                  (post.condition === 'new' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'new')
              ).length}
            {params.title &&
              !params.category &&
              titlePosts?.filter(
                (post) =>
                  (post.condition === 'new' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'new')
              ).length}
            {!params.title &&
              categoryPosts?.filter(
                (post) =>
                  (post.condition === 'new' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'new')
              ).length}
            )
          </button>

          <button
            type="button"
            className={`${
              selectedCondition === 'used'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100'
            } px-4 py-2 rounded-md text-gray-700 text-sm font-medium`}
            onClick={() => handleClickCondition('used')}
          >
            Kasutatud{' '}
            {/* give the amount of posts for that condition based on what posts are being rendered and what type is selected */}
            (
            {params.title &&
              params.category &&
              filteredPosts?.filter(
                (post) =>
                  (post.condition === 'used' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'used')
              ).length}
            {params.title &&
              !params.category &&
              titlePosts?.filter(
                (post) =>
                  (post.condition === 'used' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'used')
              ).length}
            {!params.title &&
              categoryPosts?.filter(
                (post) =>
                  (post.condition === 'used' && post.type == selectedType) ||
                  (selectedType === '' && post.condition === 'used')
              ).length}
            )
          </button>
        </div>

        {!params.title &&
          filteredCategoryPosts?.map((post) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}

        {params.title &&
          !params.category &&
          filteredTitlePosts?.map((post) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}

        {params.title &&
          params.category &&
          filteredFilteredPosts?.map((post) => (
            <Post
              key={post.id}
              post={post}
            />
          ))}
        {isLoading && <PostSkeleton />}
      </main>
    </Layout>
  );
};

export default SearchPage;
