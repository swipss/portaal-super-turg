import React, { useState } from 'react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { TiDelete } from 'react-icons/ti';
import { LocationAutocomplete } from '../LocationAutocomplete';

export const EditingModal = ({ post, setEditing }) => {
  const [editedPost, setEditedPost] = useState(post);
  const [list, setList] = useState(post?.images);
  const areChangesValid = () => {
    if (
      editedPost.conditionRating < 6 &&
      editedPost.conditionRating > 0 &&
      editedPost.price > 0 &&
      editedPost.price < 10000000
    ) {
      return true;
    }
    return false;
  };

  const updatePost = async () => {
    if (!areChangesValid()) {
      console.log('invalid', areChangesValid());
      return;
    }
    await fetch('/api/post/update', {
      method: 'PUT',
      body: JSON.stringify(editedPost),
    }).then(() => window.location.reload());
  };

  const handleDropList = (src, dest) => {
    // Ignore drop outside droppable container
    const updatedList = [...list];
    // const postDataUpdatedList = [...postData?.files];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(src, 1);
    // const [postDataReorderedItem] = postDataUpdatedList.splice(src, 1);

    // Add dropped item
    updatedList.splice(dest, 0, reorderedItem);
    // postDataUpdatedList.splice(dest, 0, reorderedItem);
    // Update State
    setList(updatedList);
    // setPostData({ ...postData, files: postDataUpdatedList });

    // setItemList(updatedList);
  };
  return (
    <div className="py-10 overflow-y-auto overflow-x-hidden fixed top-0  right-0 left-0 bg-black bg-opacity-50 mx-auto flex justify-center z-50 w-full bg md:inset-0 h-[100vh] md:h-full">
      <div className="relative p-4  w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b ">
            <h3 className="text-xl font-semibold text-gray-900 ">
              Muuda kuulutust {post.title}
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                setEditing(false);
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center "
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <button className="sr-only">Close modal</button>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6 overflow-scroll">
            <div>
              <label className="text-sm font-medium">Pealkiri</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder={editedPost.title}
                value={editedPost.title}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, title: e.target.value })
                }
                min={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kirjeldus</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder={editedPost.content}
                value={editedPost.content}
                onChange={(e) =>
                  setEditedPost({ ...editedPost, content: e.target.value })
                }
                min={5}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Seisukord</label>
              <input
                type="number"
                className="border rounded p-2 w-20"
                value={editedPost.conditionRating}
                onChange={(e) =>
                  setEditedPost({
                    ...editedPost,
                    conditionRating: e.target.value,
                  })
                }
                min={1}
                max={5}
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Seisukorra kirjeldus
              </label>
              <input
                type="text"
                className="border rounded p-2 w-full"
                value={editedPost.conditionInfo}
                onChange={(e) =>
                  setEditedPost({
                    ...editedPost,
                    conditionInfo: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Hind</label>
              <input
                type="number"
                className="border rounded p-2 w-full"
                value={editedPost.price}
                onChange={(e) =>
                  setEditedPost({
                    ...editedPost,
                    price: e.target.value,
                  })
                }
                max={10000000}
                min={1}
              />
            </div>
            <LocationAutocomplete
              postData={editedPost}
              setPostData={setEditedPost}
            />
            {list.length ? (
              <div className="grid items-center justify-center mt-2">
                <ListManager
                  items={JSON.parse(JSON.stringify(list))}
                  direction="horizontal"
                  maxItems={4}
                  render={(item) => (
                    <div
                      className="relative"
                      z-10
                    >
                      <img
                        src={item.secureUrl}
                        className="w-32 p-1 bg-white m-1 h-32 object-cover object-center rounded shadow-md border"
                      />
                      <TiDelete
                        color="red"
                        size={25}
                        className="z-10 absolute -right-2 -top-2 hover:bg-red-200 rounded-full"
                        onClick={() => {}}
                      />
                    </div>
                  )}
                  onDragEnd={(src, dest) => handleDropList(src, dest)}
                />
              </div>
            ) : null}
            <button
              className="button"
              onClick={() => updatePost()}
            >
              Salvesta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
