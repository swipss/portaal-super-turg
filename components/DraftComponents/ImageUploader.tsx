import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ListManager } from 'react-beautiful-dnd-grid';
import { useDropzone } from 'react-dropzone';
import Spinner from '../Layouts/Spinner';

const MAX_SIZE_IN_BYTES = 10000000;

const ImageUploader = ({
  newPost,
  setNewPost,
  setIsUploading,
  isUploading,
}) => {
  const [images, setImages] = useState<any>([]);
  let orderIndex = 0;

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setIsUploading(true);
    console.log('hello');
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result]);
        const readerRes = reader.result;
        axios
          .post('/api/cloudinary', { readerRes })
          .then((res) => {
            handleChange(res.data);
          })
          .catch((e) => console.log(e));
      };
      reader.readAsDataURL(file);
    });
  }, []);
  useEffect(() => {
    if (images.length === newPost.images?.length) {
      setIsUploading(false);
    }
  }, [newPost.images]);
  const handleChange = (image) => {
    setNewPost((prev) => {
      setNewPost({
        ...prev,
        images: [
          ...(prev.images ?? []),
          {
            secureUrl: image.secure_url,
            publicId: image.public_id,
            orderIndex: orderIndex,
          },
        ],
      });
    });
    orderIndex++;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    multiple: true,
    maxSize: MAX_SIZE_IN_BYTES,
  });

  const reorderImages = (sourceIndex, destinationIndex) => {
    const arr = [...newPost?.images];
    const [removedElement] = arr.splice(sourceIndex, 1);
    arr.splice(destinationIndex, 0, removedElement);
    const arrWithIndexes = arr.map((image, index) => ({
      ...image,
      orderIndex: index,
    }));
    setNewPost({ ...newPost, images: [...arrWithIndexes] });
  };

  const deleteImage = (publicId) => {
    const newArr = newPost.images.filter(
      (image) => image.publicId !== publicId
    );
    setNewPost({ ...newPost, images: [...newArr] });
    images.pop();
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`dropzone h-20 cursor-pointer rounded bg-gray-200 flex items-center justify-center border mt-2 ${
          isDragActive && 'bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          ></path>
        </svg>
        <p className="ml-1">Lohista või vali failid</p>
      </div>

      {isUploading ? (
        <div className="flex items-center justify-center h-20 mt-2 bg-gray-100 rounded">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {newPost?.images?.length > 0 && (
            <ListManager
              items={newPost?.images}
              direction="horizontal"
              maxItems={4}
              render={(image) => (
                <div className="relative transition-all duration-75 hover:-translate-y-1">
                  <img
                    src={image.secureUrl}
                    key={image}
                    className={`w-20 h-20   object-cover object-center rounded mr-2 mt-2`}
                  />
                  <button
                    onClick={() => deleteImage(image.publicId)}
                    className="absolute flex items-center justify-center w-5 h-5 text-white bg-red-500 rounded -top-1 right-1 hover:bg-red-600"
                  >
                    <svg
                      className="w-3 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </div>
              )}
              onDragEnd={(sourceIndex, destinationIndex) => {
                reorderImages(sourceIndex, destinationIndex);
              }}
            />
          )}
        </div>
      )}
      {/* )} */}
    </>
  );
};

export default ImageUploader;
