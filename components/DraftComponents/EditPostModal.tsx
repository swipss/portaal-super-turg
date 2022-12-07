import { useState } from 'react';
import { LocationAutocomplete } from '../LocationAutocomplete';
import Modal from '../Layouts/Modal';
import ImageUploader from './ImageUploader';
import { ListManager } from 'react-beautiful-dnd-grid';
import { trpc } from '../../utils/trpc';
import Spinner from '../Layouts/Spinner';

const EditPostModal = ({ setModalOpen, post, refetch }) => {
  const [editedPost, setEditedPost] = useState<any>(post);
  const { mutateAsync, isLoading } = trpc.user.editPost.useMutation();

  const reorderImages = (sourceIndex, destinationIndex) => {
    const arr = [...editedPost?.images];
    const [removedElement] = arr.splice(sourceIndex, 1);
    arr.splice(destinationIndex, 0, removedElement);
    const arrWithIndexes = arr.map((image, index) => ({
      ...image,
      orderIndex: index,
    }));
    setEditedPost({ ...editedPost, images: [...arrWithIndexes] });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    mutateAsync(editedPost, {
      onSuccess: (res) => {
        setModalOpen(false);
        refetch();
      },
      onError: (error) => console.log(error),
    });
  };

  return (
    <Modal setModalOpen={setModalOpen}>
      <h1 className=" title">Muuda postitust {post.title}</h1>
      <form>
        <h1 className="mt-2">Pealkiri</h1>
        <input
          autoFocus
          type={'text'}
          value={editedPost?.title || post.title}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          required
          onChange={(e) =>
            setEditedPost({ ...editedPost, title: e.target.value })
          }
        />

        {/* Category Picker */}
        <h1 className="mt-2">Kategooria</h1>

        <input
          type={'text'}
          disabled
          value={editedPost.category.name}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded disabled:italic disabled:opacity-50"
        />

        <h1 className="mt-2">Sisu</h1>
        <textarea
          className="w-full px-3 py-2 bg-gray-200 rounded"
          rows={6}
          required
          value={editedPost.content || post.content}
          onChange={(e) =>
            setEditedPost({ ...editedPost, content: e.target.value })
          }
        />

        {/* Rating Picker */}
        <h1>Seisukorra hinnang</h1>
        <div className="mx-auto my-2 w-max">
          <span className="mr-2 text-sm text-slate-400">väga halb</span>
          <button
            type="button"
            className={`w-10 h-10 rounded hover:bg-red-500 shadow-md transition-all duration-50 ${
              editedPost.conditionRating === 1 && 'bg-red-500'
            }`}
            onClick={() => setEditedPost({ ...editedPost, conditionRating: 1 })}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => setEditedPost({ ...editedPost, conditionRating: 2 })}
            className={`w-10 h-10 rounded hover:bg-orange-500 shadow-md ml-2 transition-all duration-50  ${
              editedPost.conditionRating === 2 && 'bg-orange-500'
            }`}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => setEditedPost({ ...editedPost, conditionRating: 3 })}
            className={`w-10 h-10 rounded hover:bg-yellow-500 shadow-md ml-2 transition-all duration-50  ${
              editedPost.conditionRating === 3 && 'bg-yellow-500'
            }`}
          >
            3
          </button>
          <button
            type="button"
            onClick={() => setEditedPost({ ...editedPost, conditionRating: 4 })}
            className={`w-10 h-10 rounded hover:bg-lime-500 shadow-md ml-2 transition-all duration-50  ${
              editedPost.conditionRating === 4 && 'bg-lime-500'
            }`}
          >
            4
          </button>
          <button
            type="button"
            onClick={() => setEditedPost({ ...editedPost, conditionRating: 5 })}
            className={`w-10 h-10 rounded hover:bg-green-500 shadow-md ml-2 transition-all duration-50  ${
              editedPost.conditionRating === 5 && 'bg-green-500'
            }`}
          >
            5
          </button>
          <span className="ml-2 text-sm text-slate-400">väga hea</span>
        </div>
        {/* End Rating Picker */}

        <h1 className="mt-2">Seisukorra põhjendus</h1>
        <textarea
          value={editedPost.conditionInfo || post.conditionInfo}
          onChange={(e) =>
            setEditedPost({ ...editedPost, conditionInfo: e.target.value })
          }
          className="w-full px-3 py-2 bg-gray-200 rounded"
          rows={6}
          required
        />

        <h1 className="mt-2">Hind</h1>
        <input
          value={editedPost.price}
          onChange={(e) =>
            setEditedPost({ ...editedPost, price: +e.target.value })
          }
          min={0}
          type={'number'}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          required
        />
        <h1 className="mt-2">Asukoht</h1>

        <LocationAutocomplete
          postData={editedPost || post}
          setPostData={setEditedPost}
        />

        <h1 className="mt-2">
          Pildid{' '}
          <span className="text-sm text-gray-400">
            (ainult ümbertõstmine ja kustutamine)
          </span>
        </h1>
        <div className="flex flex-col items-center">
          {editedPost?.images?.length > 0 && (
            <ListManager
              items={editedPost?.images.sort(
                (a, b) => a.orderIndex - b.orderIndex
              )}
              direction="horizontal"
              maxItems={4}
              render={(image) => (
                <div className="relative transition-all duration-75 hover:-translate-y-1">
                  <img
                    src={image.secureUrl}
                    key={image}
                    className={`w-20 h-20   object-cover object-center rounded mr-2 mt-2`}
                  />
                </div>
              )}
              onDragEnd={(sourceIndex, destinationIndex) => {
                reorderImages(sourceIndex, destinationIndex);
              }}
            />
          )}
        </div>

        <button
          type="submit"
          onClick={handleEdit}
          disabled={isLoading}
          className="flex justify-center w-full py-2 mt-2 text-white transition-all duration-75 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : 'Salvesta'}
        </button>
      </form>
    </Modal>
  );
};

export default EditPostModal;
