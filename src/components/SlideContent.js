// SlideComponents.js
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SparklingText from "./SparklingText";
import VideoWithSound from "./VideoWithSound";
import CachedImage from "./CachedImage";
import CachedVideo from "./CachedVideo";
import HeartConfetti, { TextWithHeartsSlide } from "./HeartConfetti"; // Add this line
import { TextWithHeartsAndPulse } from "./PulsingSparklingText";
import OptimizedVideoGridSlide from "./OptimizedVideoGridSlide";

export const slideAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
};

export const NavigationDots = ({ slides, currentSlide, onSlideClick }) => (
  <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
    {slides.map((_, index) => (
      <button
        key={index}
        className={`w-2 h-2 rounded-full ${
          currentSlide >= index ? "bg-pink-500" : "bg-gray-500"
        } transition-colors`}
        onClick={() => onSlideClick(index)}
      />
    ))}
  </div>
);

export const TextSlide = ({ content, className }) => (
  <motion.div
    {...slideAnimation}
    className="w-full h-full flex items-center justify-center"
  >
    <SparklingText content={content} className={className} />
  </motion.div>
);

export const ImageSlide = ({
  src,
  alt,
  className,
  caption,
  captionClassName,
}) => (
  <motion.div {...slideAnimation} className="relative">
    <CachedImage src={src} alt={alt || "Slide image"} className={className} />
    {caption && <p className={captionClassName}>{caption}</p>}
  </motion.div>
);

// Update VideoWithSoundSlide
export const VideoWithSoundSlide = ({
  src,
  className,
  videoClassName,
  content,
  contentClassName,
  loop,
  onPlay,
  onEnded,
  isPaused,
}) => (
  <motion.div {...slideAnimation} className="flex flex-col gap-4">
    <div className={className}>
      <CachedVideo
        src={src}
        className={videoClassName}
        loop={loop !== false}
        onPlay={onPlay}
        onEnded={onEnded}
        isPaused={isPaused}
        isWithSound={true}
        autoPlay={true}
        muted={false}
        playsInline={true}
        controls={false}
      />
    </div>
    {content && (
      <SparklingText
        content={content}
        className={`text-center mt-4 ${contentClassName || ""}`}
      />
    )}
  </motion.div>
);

export const VideoGridSlide = ({
  videos,
  className,
  content,
  contentClassName,
}) => {
  const isSingleVideo = videos.length === 1;
  const isMultiVideo = videos.length > 4; // For the 28-video grid case

  return (
    <motion.div
      {...slideAnimation}
      className="flex flex-col gap-4 w-full h-full"
    >
      <div className={`${className} ${isMultiVideo ? "h-[70vh]" : ""} w-full`}>
        {videos.map((video, index) => (
          <div key={index} className="relative w-full h-full">
            {isMultiVideo ? (
              // Multi-video case (28 videos grid)
              <div className="absolute inset-0 p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <CachedVideo
                    src={video.src}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    isWithSound={false}
                  />
                </div>
              </div>
            ) : (
              // Single video case
              <CachedVideo
                src={video.src}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                isWithSound={false}
              />
            )}
          </div>
        ))}
      </div>
      {content && (
        <SparklingText
          content={content}
          className={`text-center mt-4 ${contentClassName || ""}`}
        />
      )}
    </motion.div>
  );
};

export const ImageGridSlide = ({
  images,
  className,
  imageClassName,
  captionClassName,
  content,
  contentClassName,
}) => (
  <motion.div {...slideAnimation} className="flex flex-col h-full">
    <div className={`flex-grow ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <CachedImage
            src={image.src}
            alt={image.alt || `Grid image ${index + 1}`}
            className={imageClassName}
          />
          {image.caption && <p className={captionClassName}>{image.caption}</p>}
        </div>
      ))}
    </div>
    {content && (
      <SparklingText
        content={content}
        className={`mt-2 ${contentClassName || ""}`}
      />
    )}
  </motion.div>
);

export const SlideContent = ({
  slide,
  currentSlide,
  handleVideoPlay,
  handleVideoEnd,
  isHolding,
}) => {
  if (!slide) return null;

  const slideProps = {
    ...slide,
    onPlay: handleVideoPlay,
    onEnded: handleVideoEnd,
    isPaused: isHolding,
  };

  switch (slide.type) {
    case "text":
      return <TextSlide {...slideProps} />;
    case "hearts":
      return <TextWithHeartsAndPulse {...slideProps} />;
    case "image":
      return <ImageSlide {...slideProps} />;
    // case "videoGrid":
    //   return <VideoGridSlide {...slideProps} />;
    case "videoGrid":
      return slide.videos.length > 4 ? (
        <OptimizedVideoGridSlide {...slideProps} />
      ) : (
        <VideoGridSlide {...slideProps} />
      );
    case "videoWithSound":
      return <VideoWithSoundSlide {...slideProps} />;
    case "imageGrid":
      return <ImageGridSlide {...slideProps} />;
    default:
      return null;
  }
};

export const ProgressBar = ({ progress }) => (
  <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
    <div
      className="h-full bg-pink-500 transition-all duration-200"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export const NavigationControls = ({ onPrevious, onNext, onClose }) => (
  <>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onPrevious();
      }}
      className="fixed left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-500 transition-colors text-4xl z-50 opacity-50 hover:opacity-100"
    >
      ‹
    </button>

    <button
      onClick={(e) => {
        e.stopPropagation();
        onNext();
      }}
      className="fixed right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-500 transition-colors text-4xl z-50 opacity-50 hover:opacity-100"
    >
      ›
    </button>

    <button
      onClick={onClose}
      className="fixed top-4 right-4 text-white hover:text-pink-500 transition-colors text-xl z-50"
    >
      ✕
    </button>
  </>
);
