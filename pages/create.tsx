import React, { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { Image } from 'cloudinary-react';
import { useDropzone } from 'react-dropzone';
import PlacesAutocomplete from 'react-places-autocomplete';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import { Category } from '../types';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { TiDelete } from 'react-icons/ti';

export type Props = {
  categories: Category[];
};

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

const Draft: React.FC<any> = ({ props, setModalOpen }) => {
  const [postData, setPostData] = useState<IPostData>();

  const [loading, setLoading] = useState<boolean>(false);

  const handleDrop = (droppedItem) => {
    // Ignore drop outside droppable container
    if (!droppedItem.destination) return;
    const updatedList = [...postData?.files];
    // Remove dragged item
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1);
    // Add dropped item
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
    // Update State
    setPostData({ ...postData, files: updatedList });
    // setItemList(updatedList);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    accept: {
      'image/*': [],
    },
    maxSize: MAX_SIZE_IN_BYTES,
    onDrop: (acceptedFiles, rejectedFiles) => {
      // TODO: check for duplicates

      const newFiles: ImageFile[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPostData({
        ...postData,
        files: [...(postData?.files || []), ...newFiles],
      });
      if (rejectedFiles.length > 0) {
        alert('Failid ületavad mahupiiri 10MB või on sobimatus formaadis.');
      }
    },
  });
  const handleDelete = (name) => {
    const newFiles = postData?.files?.filter((file) => file.name !== name);
    setPostData({ ...postData, files: newFiles });
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
          {/* TODO: Category selection with autocomplete */}
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
                Lohista pildid või vajuta üleslaadimiseks (limit 10MB)
              </p>
            </div>
          </div>

          <div className="overflow-scroll">
            <DragDropContext onDragEnd={handleDrop}>
              <Droppable
                droppableId="list-container"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    className="flex gap-2 mt-4 items-center justify-center w-max"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {postData?.files?.map((item, index) => (
                      <Draggable
                        key={item.preview}
                        draggableId={item.preview}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            className="relative"
                          >
                            <TiDelete
                              color="red"
                              size={25}
                              className="absolute -right-2 -top-2"
                              onClick={() => handleDelete(item.name)}
                            />
                            <img
                              src={item.preview}
                              className="h-32 w-32 object-cover border-2 border-gray-300 rounded-md shadow-md p-1 mb-3"
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
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

export default Draft;
