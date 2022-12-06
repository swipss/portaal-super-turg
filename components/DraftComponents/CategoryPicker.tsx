const CategoryPicker = ({
  categories,
  category,
  setNewPost,
  newPost,
  parentId = null,
  level = 0,
}) => {
  const parentCategory = categories.find((item) => item.id === parentId);
  return (
    <>
      {!parentCategory ? (
        <div>
          {level === 0 ? (
            <button
              onClick={(e) => setNewPost({ ...newPost, category: category.id })}
              type="button"
              className={`${
                newPost?.category === category.id && 'bg-gray-200 '
              } border rounded-lg px-2.5 my-1 hover:bg-gray-100`}
            >
              {category.name}
            </button>
          ) : (
            <>{category.name}</>
          )}
        </div>
      ) : (
        <div className="flex">
          <CategoryPicker
            categories={categories}
            newPost={newPost}
            setNewPost={setNewPost}
            category={parentCategory}
            parentId={parentCategory.parentId}
            level={level + 1}
          />
          <div>
            {'>'}
            {level === 0 ? (
              <button
                onClick={(e) =>
                  setNewPost({ ...newPost, category: category.id })
                }
                type="button"
                className={`${
                  newPost?.category?.id === category.id && 'bg-gray-200'
                } border rounded-lg px-2.5 ml-1 hover:bg-gray-100`}
              >
                {category.name + ' '}
              </button>
            ) : (
              <>{category.name}</>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryPicker;
