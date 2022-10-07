import React, { useState } from 'react';

export const EditingModal = ({ post, setEditing }) => {
  const [editedPost, setEditedPost] = useState(post);
  console.log(editedPost, 'edited');
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0  right-0 left-0 bg-black bg-opacity-50 mx-auto flex justify-center z-50 w-full bg md:inset-0 h-[100vh] md:h-full">
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
          <div className="p-6 space-y-6 h-[80vh] overflow-scroll">
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
            <button className="button">Salvesta</button>
          </div>
          {/* <!-- Modal footer --> */}
          {/* <div className="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  I accept
                </button>
                <button
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Decline
                </button>
              </div> */}
        </div>
      </div>
    </div>
  );
};
