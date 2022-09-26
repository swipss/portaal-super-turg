export function getTreeDataCategories(arr) {
  return arr?.map((item) => ({
    ...item,
    hasChildren: arr?.filter((i) => i.parentId === item.id).length > 0,
  }));
}
