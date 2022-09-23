export function getTreeData(arr) {
  return arr?.map((item) => ({
    ...item,
    hasChildren: arr?.filter((i) => i.parent_comment_id === item.id).length > 0,
  }));
}
