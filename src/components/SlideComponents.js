import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SparklingText from "./SparklingText";
import VideoWithSound from "./VideoWithSound";

const slideAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 },
};

export const TextSlide = ({ content, className }) => (
  <motion.div
    {...slideAnimation}
    className="min-h-[70vh] flex items-center justify-center"
  >
    <div style={{ fontFamily: "serif" }}>
      <SparklingText content={content} className={className} />
    </div>
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
    <Image
      src={src}
      alt={alt || "Slide image"}
      width={800}
      height={600}
      className={className}
    />
    {caption && <p className={`${captionClassName} font-serif`}>{caption}</p>}
  </motion.div>
);

export const VideoGridSlide = ({
  videos,
  className,
  videoClassName,
  content,
  contentClassName,
}) => (
  <motion.div
    {...slideAnimation}
    className="w-full h-full flex items-center justify-center"
  >
    <div className="w-[600px]">
      <div
        className={className}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
      >
        {videos.map((video, index) => (
          <div key={index} className="relative pt-[100%]">
            <video
              src={video.src}
              className={videoClassName}
              autoPlay
              loop
              muted={true}
              playsInline
            />
          </div>
        ))}
      </div>
    </div>
    {content && (
      <SparklingText
        content={content}
        className={`text-center mt-4 font-serif ${contentClassName || ""}`}
      />
    )}
  </motion.div>
);

export const VideoWithSoundSlide = ({
  src,
  className,
  videoClassName,
  content,
  contentClassName,
  loop = true,
  onPlay,
  onEnded,
  isPaused,
}) => (
  <motion.div {...slideAnimation} className="flex flex-col gap-4">
    <div className={className}>
      <VideoWithSound
        src={src}
        className={videoClassName}
        loop={loop}
        onPlay={onPlay}
        onEnded={onEnded}
        isPaused={isPaused}
      />
    </div>
    {content && (
      <SparklingText
        content={content}
        className={`text-center mt-4 font-serif ${contentClassName || ""}`}
      />
    )}
  </motion.div>
);

export const ImageGridSlide = ({
  images,
  className,
  imageClassName,
  captionClassName,
  content,
  contentClassName,
}) => (
  <motion.div {...slideAnimation} className="flex flex-col gap-4">
    <div className={className}>
      {images.map((image, index) => (
        <div key={index} className="relative">
          <Image
            src={image.src}
            alt={image.alt || `Grid image ${index + 1}`}
            width={400}
            height={300}
            className={imageClassName}
          />
          {image.caption && (
            <p className={`${captionClassName} font-serif`}>{image.caption}</p>
          )}
        </div>
      ))}
    </div>
    {content && (
      <SparklingText
        content={content}
        className={`text-center mt-4 font-serif ${contentClassName || ""}`}
      />
    )}
  </motion.div>
);
