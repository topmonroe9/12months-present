// Gift1.js
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ProgressBar,
  NavigationDots,
  SlideContent,
  NavigationControls,
} from "./SlideContent";
import {
  useAudioPlayer,
  useSlideNavigation,
  useGestureHandling,
} from "../hooks/useAudioPlayer";

const Gift1 = ({ content, onClose }) => {
  const { slides, music, totalDuration } = content;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const { audioRef, handleVideoPlay, handleVideoEnd, handleTimeUpdate } =
    useAudioPlayer({
      music,
      totalDuration,
      currentTime,
      setCurrentTime,
      onClose,
      slides,
      currentSlide,
      setCurrentSlide,
    });

  const { handleSlideClick, handlePrevious, handleNext } = useSlideNavigation({
    currentSlide,
    slides,
    audioRef,
    setCurrentSlide,
  });

  const { handleHoldStart, handleHoldEnd, handleTouchStart } =
    useGestureHandling({
      setIsHolding,
      audioRef,
      currentSlide,
      slides,
      handleSlideClick,
    });

  useEffect(() => {
    if (!content) return;

    const audio = new Audio(music);
    audioRef.current = audio;
    audio.addEventListener("canplaythrough", () => setIsLoading(false));
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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length]);

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

  const currentSlideData = slides[currentSlide];
  const progress = calculateProgress(
    currentTime,
    currentSlideData,
    slides,
    totalDuration,
    currentSlide
  );

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
      <ProgressBar progress={progress} />

      <NavigationControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onClose={onClose}
      />

      <div className="w-full max-w-2xl p-8 relative select-none">
        <div className="relative min-h-[70vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <SlideContent
              slide={currentSlideData}
              currentSlide={currentSlide}
              handleVideoPlay={handleVideoPlay}
              handleVideoEnd={handleVideoEnd}
              isHolding={isHolding}
            />
          </AnimatePresence>
        </div>

        <NavigationDots
          slides={slides}
          currentSlide={currentSlide}
          onSlideClick={handleSlideClick}
        />
      </div>
    </motion.div>
  );
};

const calculateProgress = (
  currentTime,
  currentSlideData,
  slides,
  totalDuration,
  currentSlide
) => {
  if (!currentSlideData) return 0;

  const slideStart = currentSlideData.startTime;
  const slideEnd =
    currentSlideData.endTime ||
    slides[currentSlide + 1]?.startTime ||
    totalDuration;

  const progress = ((currentTime - slideStart) / (slideEnd - slideStart)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};

export default Gift1;
