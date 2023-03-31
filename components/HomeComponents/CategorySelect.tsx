import { useEffect, useState } from 'react';
import { AiFillCaretDown, AiFillCaretRight } from 'react-icons/ai';
import { trpc } from '../../utils/trpc';

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

  useEffect(() => {
    console.log('selected category', selectedCategory);
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    if (selectedCategory === category.name) {
      setSelectedCategory('');
      setIsExpanded(false);
      setSearchParams({ ...searchParams, category: null });
    } else {
      setSelectedCategory(category.name);
      setIsExpanded(true);
      setSearchParams({ ...searchParams, category: category.name });
    }
  };

  if (!children?.length) return null;
  return (
    <>
      <div className="mb-2 border-b">
        {children?.map((category) => (
          <>
            <button
              type="button"
              className={`hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all px-2 py-1 mb-2 mr-2 bg-white border rounded-lg ${
                selectedCategory === category.name &&
                'bg-[#3B81F6] border-[#3B81F6] text-white'
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
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
