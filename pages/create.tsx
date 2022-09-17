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

export const getStaticProps: GetStaticProps = async () => {
  const categories = await prisma.category.findMany();
  return {
    props: {
      categories,
    },
  };
};

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

const Draft: React.FC<Props> = (props: Props) => {
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
  const onSubmit = async (e): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/post', {
      method: 'post',
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then((data) => {
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
              fetch('api/upload/image', {
                method: 'post',
                body: JSON.stringify({ data, imageData }),
              });
            });
        });
      });
    setLoading(false);
  };
  if (loading) return <p>Postitan...</p>;
  return (
    <Layout>
      <div className="max-w-xl mx-auto shadow-md p-6 rounded-md border h-[75vh] overflow-scroll mt-10">
        <div className="mb-4">
          <h1 className="font-bold text-xl ">Uus kuulutus</h1>
          <p className="text-sm text-red-500 ">
            Kohustuslikud väljad on märgitud *-ga
          </p>
        </div>
        <form onSubmit={onSubmit}>
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
              <span className="text-red-500">*</span>
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

          <button
            type="submit"
            className="px-7 py-3 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Postita
          </button>

          <button
            type="button"
            className="ml-5 border-2 px-7 py-3 rounded-md hover:bg-gray-200"
          >
            Salvesta mustandina
          </button>
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
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
