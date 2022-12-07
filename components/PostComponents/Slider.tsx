import Image from 'next/image';
import { useState } from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Slider: React.FC<{ images: any }> = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageURLs = images
    ?.sort((a, b) => a.orderIndex - b.orderIndex)
    .map((image) => image.secureUrl);

  const indicators = (index) => {
    return (
      <div
        className={`${
          isFullscreen && 'hidden'
        } w-[75px] h-[75px] cursor-pointer ml-2 my-1 border border-gray-300 rounded p-0.5 ${
          index == currentImageIndex &&
          'transform -translate-y-2 ease-in-out duration-200 bg-black   '
        } `}
      >
        <img
          src={images?.[index].secureUrl ?? ''}
          className={`h-full w-full object-cover object-center `}
        />
      </div>
    );
  };
  return (
    <div
      className={`${
        isFullscreen ? 'slide-container-fullscreen' : 'slide-container'
      }`}
    >
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="absolute z-10 flex items-center justify-center w-8 h-8 text-sm font-medium text-white rounded top-5 right-5 hover:bg-white hover:text-black"
        >
          X
        </button>
      )}
      <Slide
        indicators={indicators}
        autoplay={false}
        canSwipe={true}
        transitionDuration={250}
        easing="cubic"
        defaultIndex={0}
        onChange={(prevIndex, nextIndex) => setCurrentImageIndex(nextIndex)}
      >
        {imageURLs?.map((slideImage, index) => (
          <div
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`${
              isFullscreen ? 'each-slide-fullscreen' : 'each-slide'
            } cursor-pointer`}
            key={index}
          >
            {/* <div
              style={{
                backgroundImage: `url(${slideImage})`,
              }}
                /> */}
            <img
              src={slideImage}
              className="h-[500px] mx-auto rounded object-contain"
            />
          </div>
        ))}
      </Slide>
    </div>
  );
};

export default Slider;
