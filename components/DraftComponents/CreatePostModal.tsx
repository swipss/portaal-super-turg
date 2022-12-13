import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { LocationAutocomplete } from '../LocationAutocomplete';
import Spinner from '../Layouts/Spinner';
import CategoryPicker from './CategoryPicker';
import ImageUploader from './ImageUploader';
import { useRouter } from 'next/router';
import PostTypes from './PostTypes';
import { AiFillInfoCircle } from 'react-icons/ai';

const CreatePostModal: React.FC<any> = ({
  setNewPostModal,
  categories,
  setPosts,
  posts,
  notify,
}) => {
  const [newPost, setNewPost] = useState<any>({});
  const [categorySearchValue, setCategorySearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const createNew = trpc.drafts.createNewPost.useMutation();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const [isPopover, setIsPopover] = useState(false);

  const areAllFieldsFilled =
    newPost.title != '' &&
    newPost.category &&
    newPost.content != '' &&
    // newPost.conditionRating > 0 &&
    newPost.conditionInfo != '' &&
    newPost.price > 0 &&
    newPost.location &&
    newPost.images?.length > 0 &&
    newPost.type;

  const handleCreateNewPost = (e) => {
    e.preventDefault();
    setIsLoading(true);
    createNew.mutate(newPost, {
      onError: (error) => {
        console.log(error);
      },
      onSuccess: (res) => {
        setPosts([...posts, res]);
        setNewPostModal(false);
        setIsLoading(false);
        notify();
        // router.push(`/kuulutus/${res.id}`);
      },
    });
  };

  console.log(newPost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <form
        onSubmit={handleCreateNewPost}
        className="w-[600px] h-[80vh]  z-50 bg-white top-52 rounded overflow-scroll p-6 m-2"
      >
        <h1 className="inline-block title">Uus kuulutus</h1>
        <button
          onClick={() => setNewPostModal(false)}
          className="float-right w-10 h-10 font-medium text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          X
        </button>

        <h1 className="mt-2">Pealkiri</h1>
        <input
          maxLength={50}
          autoFocus
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          type={'text'}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          required
        />

        {/* Category Picker */}
        <h1 className="mt-2">Kategooria</h1>
        <input
          value={categorySearchValue}
          onChange={(e) => setCategorySearchValue(e.target.value)}
          type={'text'}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          required={!newPost.category?.title}
        />
        {categorySearchValue !== '' && (
          <>
            {categories
              ?.filter((el) =>
                el.name
                  .toLowerCase()
                  .includes(categorySearchValue.toLowerCase())
              )
              .map((category) => (
                <div key={category.id}>
                  <CategoryPicker
                    setNewPost={setNewPost}
                    newPost={newPost}
                    categories={categories}
                    category={category}
                    parentId={category.parentId}
                  />
                </div>
              ))}
          </>
        )}
        {/* End Category Picker */}

        <h1 className="mt-2">Tehingu tüüp</h1>
        <PostTypes
          obj={newPost}
          setObj={setNewPost}
        />

        <h1 className="mt-2">Sisu</h1>
        <textarea
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="w-full px-3 py-2 bg-gray-200 rounded"
          rows={6}
          required
        />

        <h1>Seisukord</h1>
        <div>
          <button
            type="button"
            onClick={() =>
              setNewPost({
                ...newPost,
                condition: 'new',
                conditionRating: null,
              })
            }
            className={` px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
              newPost.condition === 'new' ? 'bg-gray-200' : 'bg-gray-100'
            } rounded hover:bg-gray-200 min-w-max`}
          >
            Uus
          </button>
          <button
            type="button"
            onClick={() => setNewPost({ ...newPost, condition: 'used' })}
            className={` px-4 py-2 m-1 text-sm font-medium text-gray-700  ${
              newPost.condition === 'used' ? 'bg-gray-200' : 'bg-gray-100'
            } rounded hover:bg-gray-200 min-w-max`}
          >
            Kasutatud
          </button>
        </div>
        {/* Rating Picker */}
        {newPost?.condition === 'used' && (
          <>
            <div className="relative flex items-center gap-1">
              <h1>Seisukorra hinnang</h1>
              <button
                type="button"
                onMouseOver={() => setIsPopover(true)}
                onMouseOut={() => setIsPopover(false)}
              >
                <AiFillInfoCircle
                  size={16}
                  className="text-slate-900/75"
                />
              </button>
              <div
                className={`${!isPopover && 'hidden'}
                 absolute z-50 text-sm font-light text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm bottom-7  `}
              >
                <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Seisukorra hinnang
                  </h3>
                </div>
                <div className="px-3 py-2">
                  <p>1 - väga halvas korras</p>
                  <p>2 - halvas korras</p>
                  <p>3 - keskmises korras</p>
                  <p>4 - heas korras</p>
                  <p>5 - väga heas korras, nagu uus</p>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
            <div className="flex my-2 w-max">
              {/* <span className="mr-2 text-sm text-slate-400">väga halb</span> */}
              <button
                type="button"
                onClick={() => setNewPost({ ...newPost, conditionRating: 1 })}
                className={`w-10 h-10 rounded hover:bg-red-500 shadow-md transition-all duration-50 ${
                  newPost.conditionRating === 1 && 'bg-red-500'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setNewPost({ ...newPost, conditionRating: 2 })}
                className={`w-10 h-10 rounded hover:bg-orange-500 shadow-md ml-2 transition-all duration-50  ${
                  newPost.conditionRating === 2 && 'bg-orange-500'
                }`}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => setNewPost({ ...newPost, conditionRating: 3 })}
                className={`w-10 h-10 rounded hover:bg-yellow-500 shadow-md ml-2 transition-all duration-50  ${
                  newPost.conditionRating === 3 && 'bg-yellow-500'
                }`}
              >
                3
              </button>
              <button
                type="button"
                onClick={() => setNewPost({ ...newPost, conditionRating: 4 })}
                className={`w-10 h-10 rounded hover:bg-lime-500 shadow-md ml-2 transition-all duration-50  ${
                  newPost.conditionRating === 4 && 'bg-lime-500'
                }`}
              >
                4
              </button>
              <button
                type="button"
                onClick={() => setNewPost({ ...newPost, conditionRating: 5 })}
                className={`w-10 h-10 rounded hover:bg-green-500 shadow-md ml-2 transition-all duration-50  ${
                  newPost.conditionRating === 5 && 'bg-green-500'
                }`}
              >
                5
              </button>
              {/* <span className="ml-2 text-sm text-slate-400">väga hea</span> */}
            </div>
            {/* End Rating Picker */}
          </>
        )}

        <h1 className="mt-2">Seisukorra põhjendus</h1>
        <textarea
          onChange={(e) =>
            setNewPost({ ...newPost, conditionInfo: e.target.value })
          }
          className="w-full px-3 py-2 bg-gray-200 rounded"
          rows={6}
          required
        />

        <h1 className="mt-2">Hind</h1>
        <input
          onChange={(e) => setNewPost({ ...newPost, price: +e.target.value })}
          min={0}
          type={'number'}
          className="w-full h-10 px-3 py-2 bg-gray-200 rounded"
          required
        />
        <h1 className="mt-2">Asukoht</h1>

        <LocationAutocomplete
          postData={newPost}
          setPostData={setNewPost}
        />

        <h1 className="mt-2">
          Pildid{' '}
          <span className="text-sm text-gray-400">(lisa vähemalt üks)</span>
        </h1>
        <ImageUploader
          newPost={newPost}
          setNewPost={setNewPost}
          setIsUploading={setIsUploading}
          isUploading={isUploading}
        />

        <button
          disabled={!areAllFieldsFilled || isUploading}
          type="submit"
          className="flex justify-center w-full py-2 mt-2 text-white transition-all duration-75 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? <Spinner /> : 'Postita'}
        </button>
      </form>
    </div>
  );
};

export default CreatePostModal;
