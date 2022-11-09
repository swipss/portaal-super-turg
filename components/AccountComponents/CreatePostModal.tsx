import React, { useState } from 'react';
import Router from 'next/router';
import { useDropzone } from 'react-dropzone';
import { LocationAutocomplete } from '../LocationAutocomplete';
import { TiDelete } from 'react-icons/ti';
import { ListManager } from 'react-beautiful-dnd-grid';
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';

export interface IPostData {
  title: string;
  info?: string;
  conditionRating?: number;
  conditionInfo?: string;
  price: number;
  location?: string;
  files?: ImageFile[];
}

interface ImageFile extends File {
  preview: string;
}

const MAX_SIZE_IN_BYTES = 10000000;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`;

const CreatePostModal: React.FC<any> = ({ setModalOpen, categories }) => {
  const [postData, setPostData] = useState<any>();

  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  const [categorySearchValue, setCategorySearchValue] = useState('');

  const handleDropList = (src, dest) => {
    const updatedList = [...list];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(src, 1);

    // Add dropped item
    updatedList.splice(dest, 0, reorderedItem);
    // Update State
    const updatedListWithOrderedIndexes = updatedList.map((item) => {
      return { ...item, orderIndex: updatedList.indexOf(item) };
    });
    setList(updatedListWithOrderedIndexes);

    setPostData({ ...postData, files: updatedListWithOrderedIndexes });
  };

  // Drag & Drop images
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/*': [],
    },
    maxSize: MAX_SIZE_IN_BYTES,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // TODO: check for duplicates

      const newFiles: ImageFile[] = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          orderIndex: index,
        })
      );
      setPostData({
        ...postData,
        files: [...(postData?.files || []), ...newFiles],
      });
      setList([...list, ...newFiles]);
      if (rejectedFiles.length > 0) {
        alert('Failid ületavad mahupiiri 10MB või on sobimatus formaadis.');
      }
    },
  });

  const handleDelete = (preview) => {
    const newFiles = postData?.files?.filter(
      (file) => file.preview !== preview
    );
    setPostData({ ...postData, files: newFiles });
    setList(newFiles);
  };

  const isValidForm = () => {
    if (postData?.title && postData?.price) return true;
  };

  const onSubmit = async (e, setModalOpen): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/post', {
      method: 'post',
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!postData?.files?.length) {
          Router.push('/account/kuulutused');
          setModalOpen(false);
          setLoading(false);
        }
        const fd = new FormData();
        postData?.files?.forEach(async (file) => {
          fd.append('file', file);
          fd.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);

          await fetch(CLOUDINARY_URL, {
            method: 'post',
            body: fd,
          })
            .then((res) => res.json())
            .then((imageData) => {
              fetch('/api/upload/image', {
                method: 'post',
                body: JSON.stringify({ data, imageData }),
              }).then(() => {
                Router.push('/account/kuulutused');
                setModalOpen(false);
                setLoading(false);
              });
            });
        });
      });
  };

  const CategoryTree = ({ category, parentId = null, level = 0 }) => {
    const parentCategory = categories.find((item) => item.id === parentId);
    console.log(parentCategory?.name, category?.name, level);
    return (
      <>
        {!parentCategory ? (
          <p className={`${level === 0 && 'font-bold'}`}>{category.name}</p>
        ) : (
          <div className="flex">
            <CategoryTree
              category={parentCategory}
              parentId={parentCategory.parentId}
              level={level + 1}
            />
            <p className={`${level == 0 && 'font-bold'}`}>
              {' '}
              {'>'}
              {category.name}
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="max-w-xl mx-auto">
        <form onSubmit={(e) => onSubmit(e, setModalOpen)}>
          <div>
            <label className="font-bold ">
              Pealkiri <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              placeholder="Pealkiri"
              type={'text'}
            />
          </div>
          {/* Categories */}
          <div className="mt-4">
            <label className="font-bold ">
              Kategooria <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Otsi..."
              onChange={(e) => setCategorySearchValue(e.target.value)}
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
                    // takes category
                    // displays category
                    // checks if has children
                    // if has children loop again
                    <CategoryTree
                      category={category}
                      parentId={category.parentId}
                    />
                  ))}
              </>
            )}
          </div>
          <div className="mt-4">
            <label className="font-bold">Kuulutuse sisu</label>
            <textarea
              onChange={(e) =>
                setPostData({ ...postData, info: e.target.value })
              }
              placeholder="Kuulutuse sisu"
              rows={6}
            />
          </div>
          <div className="mt-4"></div>

          <div className="mt-4">
            <label className="font-bold ">
              Seisukorra hinnang (1 - halb seisukord, 5 - väga hea seisukord){' '}
            </label>
            <select
              className="border p-2 mt-1 rounded-md"
              onChange={(e) =>
                setPostData({ ...postData, conditionRating: +e.target.value })
              }
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>

          <div className="mt-4">
            <label className="font-bold">Seisukorra põhjendus</label>
            <textarea
              onChange={(e) =>
                setPostData({ ...postData, conditionInfo: e.target.value })
              }
              placeholder="Seisukorra põhjendus"
              rows={6}
            />
          </div>

          <div className="mt-4">
            <label className="font-bold">
              Hind <span className="text-red-500">*</span>
            </label>
            <input
              onChange={(e) =>
                setPostData({ ...postData, price: Number(e.target.value) })
              }
              placeholder="Hind"
              type={'number'}
              min={1}
              max={1000000}
            />
          </div>
          <div className="mt-4 ">
            <label className="font-bold">Asukoht</label>
            <LocationAutocomplete
              postData={postData}
              setPostData={setPostData}
            />
          </div>
          <div className="mt-4">
            <label className="font-bold">Pildid</label>
            <div
              {...getRootProps()}
              className={`flex items-center justify-center p-5 border-2 rounded-md ${
                isDragActive ? 'border-blue-500' : 'border-gray-300'
              } flex justify-center items-center text-2xl cursor-pointer`}
            >
              <input {...getInputProps()} />
              <p className="text-center text-lg text-gray-500">
                Lohista pildid või vajuta üleslaadimiseks (limiit 10MB)
              </p>
            </div>
          </div>
          {list.length ? (
            <div className="grid items-center justify-center mt-2">
              <ListManager
                items={JSON.parse(JSON.stringify(list))}
                direction="horizontal"
                maxItems={4}
                render={(item) => (
                  <div className="relative">
                    <img
                      src={item.preview}
                      className="w-32 p-1 bg-white m-1 h-32 object-cover object-center rounded shadow-md border"
                    />
                    <TiDelete
                      color="red"
                      size={25}
                      className="z-10 absolute -right-2 -top-2 hover:bg-red-200 rounded-full"
                      onClick={() => handleDelete(item.preview)}
                    />
                  </div>
                )}
                onDragEnd={(src, dest) => handleDropList(src, dest)}
              />
            </div>
          ) : null}

          {loading ? (
            <button
              disabled
              type="button"
              className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="#1C64F2"
                />
              </svg>
              Postitan...
            </button>
          ) : (
            <button
              disabled={!isValidForm()}
              type="submit"
              className={`py-2.5 px-5 mr-2 text-white text-sm font-medium  bg-blue-500 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700  inline-flex items-center ${
                !isValidForm() &&
                'bg-blue-400 cursor-not-allowed hover:bg-blue-400 hover:text-slate-50 '
              }`}
            >
              Postita
            </button>
          )}
        </form>
      </div>
      <style jsx>{`
        input[type='text'],
        input[type='number'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 1px solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
};

export default CreatePostModal;
