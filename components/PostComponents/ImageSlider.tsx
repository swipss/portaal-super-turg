import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useState } from 'react';
import { Image as ImageInterface } from '../../types';

export const ImageSlider: React.FC<{ images: ImageInterface[] }> = ({
  images,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<ImageInterface>(
    images?.[0]
  );

  const handleImageChangeForward = () => {
    let currIndex = images?.indexOf(selectedImage);
    let nextIndex = currIndex + 1;
    console.log(currIndex, nextIndex);
    if (!images?.[nextIndex]) {
      nextIndex = 0;
    }
    setSelectedImage(images?.[nextIndex]);
  };
  const handleImageChangeBackward = () => {
    let currIndex = images?.indexOf(selectedImage);
    let nextIndex = currIndex - 1;
    console.log(currIndex, nextIndex);
    if (!images?.[nextIndex]) {
      nextIndex = images?.length - 1;
    }
    setSelectedImage(images?.[nextIndex]);
  };

  const isImageSelected = (image: ImageInterface): boolean => {
    return image.secureUrl === selectedImage.secureUrl;
  };

  return (
    <>
      <div className="p-4 flex items-center justify-center ">
        <div className="relative w-full h-96 flex items-center justify-center ">
          <FontAwesomeIcon
            onClick={() => handleImageChangeForward()}
            icon={faArrowRight}
            className="absolute z-10 right-0 text-5xl text-gray-300 cursor-pointer hover:transform hover:-translate-y-2 hover:ease-in-out duration-100 hover:text-black"
          />
          <FontAwesomeIcon
            onClick={() => handleImageChangeBackward()}
            icon={faArrowLeft}
            className="z-10 absolute left-0 text-5xl text-gray-300 cursor-pointer hover:-translate-y-2 hover:ease-in-out duration-100 hover:text-black"
          />
          <Image
            layout="fill"
            src={selectedImage?.secureUrl}
            className="h-max relative cursor-pointer object-cover-object-center"
            objectFit="contain"
            onClick={() => setIsFullscreen(!isFullscreen)}
          />
        </div>
        {isFullscreen && (
          <div className="w-full h-full absolute inset-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute cursor-pointer right-0 m-5 text-gray-800 hover:text-white z-20  text-2xl hover:transform hover:scale-125 ease-in-out duration-100"
            >
              X
            </button>
            <div>
              {images?.length > 1 && (
                <FontAwesomeIcon
                  onClick={() => handleImageChangeForward()}
                  icon={faArrowRight}
                  className="cursor-pointer text-gray-800 z-30 text-5xl absolute right-0 top-2/4 mr-5  hover:-translate-y-2 hover:ease-in-out duration-100 hover:text-white"
                />
              )}
              <Image
                layout="fill"
                objectFit="contain"
                onClick={() => setIsFullscreen(!isFullscreen)}
                src={selectedImage?.secureUrl}
                className={`cursor-pointer sm:h-screen m-auto absolute inset-0 opacity-100 z-20 `}
              />
              {images?.length > 1 && (
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  onClick={() => handleImageChangeBackward()}
                  className="cursor-pointer text-gray-800 z-30 text-5xl absolute  top-2/4 ml-5  hover:-translate-y-2 hover:ease-in-out duration-100 hover:text-white"
                />
              )}
            </div>
            <div className="bg-black w-fill h-full absolute inset-0 z-10" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-center ">
        <div className="w-11/12">
          <div className="flex gap-2  flex-wrap ">
            {images?.map((image) => (
              <div
                className={`${
                  isImageSelected(image) &&
                  'transform ease-in-out duration-200 scale-110  shadow-gray-400'
                } hover:transform hover:ease-in-out hover:duration-200 hover:scale-110 w-20 h-20 shadow-md object-center object-cover flex items-center z-0 justify-center cursor-pointer`}
              >
                <Image
                  width={100}
                  height={100}
                  onClick={() => setSelectedImage(image)}
                  key={image.secureUrl}
                  src={image.secureUrl}
                  className="object-cover object-center"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
