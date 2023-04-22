import { Category, Post } from '@prisma/client';
import { useEffect, useState } from 'react';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';
import { trpc } from '../../utils/trpc';

interface TCategory extends Category {
  posts: Post[];
}

const Categories = ({
  categories,
  parentId = null,
  depth,
  setSearchParams,
  searchParams,
}) => {
  const parentCategory = categories?.find((c) => c.id === parentId);
  const children = categories?.filter((c) => c.parentId === parentId);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  function handleCategoryClick(category: TCategory): void {
    if (selectedCategory === category.name) {
      setSelectedCategory('');
      setIsExpanded(false);
      const { category: _, ...rest } = searchParams;
      setSearchParams(rest);
    } else {
      setSelectedCategory(category.name);
      setIsExpanded(true);
      setSearchParams({
        ...searchParams,
        category: category.name.toLowerCase(),
      });
    }
  }

  function countPosts(category: TCategory, categories: TCategory[]): number {
    let postCount = category.posts.length;
    const children = categories.filter((c) => c.parentId === category.id);
    if (children.length) {
      children.forEach((child) => {
        postCount += countPosts(child, categories);
      });
    }
    return postCount;
  }

  if (!children?.length) return null;
  return (
    <>
      <div className="border-y">
        {children?.map((category) => (
          <>
            <button
              type="button"
              className={`${
                selectedCategory === category.name
                  ? '!bg-blue-500 text-white'
                  : 'bg-gray-100'
              } px-2 py-2 m-1 text-xs font-medium text-gray-700 rounded hover:bg-blue-500 hover:text-white  transition-all duration-75`}
              onClick={() => handleCategoryClick(category)}
            >
              {`${category.name} (${countPosts(category, categories)})`}
            </button>
            {selectedCategory === category.name && isExpanded && (
              <Categories
                categories={categories}
                parentId={category.id}
                depth={depth + 1}
                setSearchParams={setSearchParams}
                searchParams={searchParams}
              />
            )}
          </>
        ))}
      </div>
    </>
  );
};

const CategorySelect = ({ setSearchParams, searchParams }) => {
  const { data: categories } = trpc.post.getCategories.useQuery();

  return (
    <div>
      <Categories
        categories={categories}
        parentId={null}
        depth={0}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
    </div>
  );
};

export default CategorySelect;
