// Gift1.js
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import SparklingText from "./SparklingText";
import VideoWithSound from "./VideoWithSound";

const Gift1 = ({ content, onClose }) => {
  const audioRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const { slides, music, totalDuration } = content;

  useEffect(() => {
    const audio = new Audio(music);
    audioRef.current = audio;

    audio.addEventListener("canplaythrough", () => {
      setIsLoading(false);
    });

    audio.load();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [music]);

  useEffect(() => {
    if (!isLoading && audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      const startPlayback = async () => {
        try {
          if (!isHolding) {
            await audioRef.current.play();
          }
        } catch (error) {
          console.error("Playback failed:", error);
        }
      };

      if (!isHolding) {
        startPlayback();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isLoading, isHolding]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    // Check if we've reached the end of the presentation
    if (time >= totalDuration) {
      handleClose({ stopPropagation: () => {} });
      return;
    }

    const slideIndex = slides.findIndex(
      (slide, index) =>
        time >= slide.startTime &&
        time < (slide.endTime || slides[index + 1]?.startTime || totalDuration)
    );

    if (slideIndex !== -1 && slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const handleSlideClick = (index) => {
    if (audioRef.current && slides[index]) {
      audioRef.current.currentTime = slides[index].startTime;
      setCurrentSlide(index);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  const handleHoldStart = () => {
    setIsHolding(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        const nextIndex = currentSlide + 1;
        if (nextIndex < slides.length) handleSlideClick(nextIndex);
      } else if (e.key === "ArrowLeft") {
        const prevIndex = currentSlide - 1;
        if (prevIndex >= 0) handleSlideClick(prevIndex);
      } else if (e.key === "Escape") {
        handleClose({ stopPropagation: () => {} });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length]);

  const currentSlideData = slides[currentSlide];

  const calculateProgress = () => {
    if (!currentSlideData) return 0;
    const slideStart = currentSlideData.startTime;
    const slideEnd =
      currentSlideData.endTime ||
      slides[currentSlide + 1]?.startTime ||
      totalDuration;
    const progress =
      ((currentTime - slideStart) / (slideEnd - slideStart)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const handleVideoPlay = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  };

  const handleVideoEnd = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
    }
  };

  // Handle touch swipe
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const diffX = touch.clientX - startX;

      if (Math.abs(diffX) > 50) {
        // Threshold for swipe
        if (diffX > 0 && currentSlide > 0) {
          handleSlideClick(currentSlide - 1);
        } else if (diffX < 0 && currentSlide < slides.length - 1) {
          handleSlideClick(currentSlide + 1);
        }
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener(
      "touchend",
      () => {
        document.removeEventListener("touchmove", handleTouchMove);
      },
      { once: true }
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="mb-4">Подготавливаем твой подарок...</div>
          <div className="w-32 h-1 bg-gray-700 rounded-full">
            <div
              className="h-full bg-pink-500 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (loadedImages.size /
                    slides.filter(
                      (s) =>
                        s.type === "image" ||
                        (s.type === "imageGrid" && s.images)
                    ).length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 select-none"
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onMouseLeave={handleHoldEnd}
      onTouchStart={(e) => {
        handleTouchStart(e);
        handleHoldStart();
      }}
      onTouchEnd={handleHoldEnd}
      animate={{
        background: currentSlideData?.backgroundColor || "rgba(0, 0, 0, 0.9)",
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
        <div
          className="h-full bg-pink-500 transition-all duration-200"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Navigation buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (currentSlide > 0) handleSlideClick(currentSlide - 1);
        }}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-500 transition-colors text-4xl z-50 opacity-50 hover:opacity-100"
      >
        ‹
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          if (currentSlide < slides.length - 1)
            handleSlideClick(currentSlide + 1);
        }}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-500 transition-colors text-4xl z-50 opacity-50 hover:opacity-100"
      >
        ›
      </button>

      <div className="w-full max-w-2xl p-8 relative select-none">
        <div className="relative min-h-[70vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {/* Slide content rendering ... */}
            {currentSlideData?.type === "text" ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                <SparklingText
                  content={currentSlideData.content}
                  className={currentSlideData.className}
                />
              </motion.div>
            ) : currentSlideData?.type === "image" ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <Image
                  src={currentSlideData.src}
                  alt={currentSlideData.alt || "Slide image"}
                  width={800}
                  height={600}
                  className={currentSlideData.className}
                  priority={true}
                />
                {currentSlideData.caption && (
                  <p className={currentSlideData.captionClassName}>
                    {currentSlideData.caption}
                  </p>
                )}
              </motion.div>
            ) : currentSlideData?.type === "videoGrid" ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <div className={currentSlideData.className}>
                  {currentSlideData.videos.map((video, index) => (
                    <div key={index} className="relative">
                      <video
                        src={video.src}
                        className={currentSlideData.videoClassName}
                        autoPlay
                        loop
                        muted={true}
                        playsInline
                      />
                      {video.caption && (
                        <p className={currentSlideData.captionClassName}>
                          {video.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {currentSlideData.content && (
                  <SparklingText
                    content={currentSlideData.content}
                    className={`text-center mt-4 ${
                      currentSlideData.contentClassName || ""
                    }`}
                  />
                )}
              </motion.div>
            ) : currentSlideData?.type === "videoWithSound" ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <div className={currentSlideData.className}>
                  <VideoWithSound
                    src={currentSlideData.src}
                    className={currentSlideData.videoClassName}
                    loop={currentSlideData.loop !== false}
                    onPlay={handleVideoPlay}
                    onEnded={handleVideoEnd}
                    isPaused={isHolding}
                  />
                </div>
                {currentSlideData.content && (
                  <SparklingText
                    content={currentSlideData.content}
                    className={`text-center mt-4 ${
                      currentSlideData.contentClassName || ""
                    }`}
                  />
                )}
              </motion.div>
            ) : currentSlideData?.type === "imageGrid" ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col gap-4"
              >
                <div className={currentSlideData.className}>
                  {currentSlideData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image.src}
                        alt={image.alt || `Grid image ${index + 1}`}
                        width={400}
                        height={300}
                        className={currentSlideData.imageClassName}
                        priority={true}
                      />
                      {image.caption && (
                        <p className={currentSlideData.captionClassName}>
                          {image.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {currentSlideData.content && (
                  <SparklingText
                    content={currentSlideData.content}
                    className={`text-center mt-4 ${
                      currentSlideData.contentClassName || ""
                    }`}
                  />
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Navigation dots */}
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentSlide >= index ? "bg-pink-500" : "bg-gray-500"
              } transition-colors`}
              onClick={() => handleSlideClick(index)}
            />
          ))}
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 text-white hover:text-pink-500 transition-colors text-xl z-50"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default Gift1;
