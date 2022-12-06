const CategoryTree = ({ category, parentId = '', level = 0, categories }) => {
  const parentCategory = categories?.find((item) => item.id === parentId);
  return (
    <>
      {!parentCategory ? (
        <div className="font-medium text-slate-900">{category?.name}</div>
      ) : (
        <div className="flex font-medium text-slate-900">
          <CategoryTree
            category={parentCategory}
            parentId={parentCategory?.parentId}
            level={level + 1}
            categories={categories}
          />
          <div>
            {'->'}
            {category?.name}
          </div>
        </div>
      )}
    </>
  );
};
export default CategoryTree;
