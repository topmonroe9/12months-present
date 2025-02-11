import React, { useEffect, useRef, useState } from "react";

const usePresentationController = (content, onClose) => {
  const audioRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(content.music);
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
  }, []);

  // Setup playback after loading
  useEffect(() => {
    if (!isLoading && audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      const startPlayback = async () => {
        try {
          await audioRef.current.play();
        } catch (error) {
          console.error("Playback failed:", error);
        }
      };

      startPlayback();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, [isLoading]);

  // Handle pause/play interactions
  useEffect(() => {
    const preventPause = (e) => e.target.closest("button, a");

    const handleTouchStart = (e) => {
      if (preventPause(e)) return;
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPaused(true);
      }
    };

    const handleTouchEnd = (e) => {
      if (preventPause(e)) return;
      if (audioRef.current) {
        audioRef.current.play();
        setIsPaused(false);
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("mousedown", handleTouchStart);
    window.addEventListener("mouseup", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("mousedown", handleTouchStart);
      window.removeEventListener("mouseup", handleTouchEnd);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    const slideIndex = content.slides.findIndex(
      (slide, index) =>
        time >= slide.startTime &&
        time <
          (slide.endTime ||
            content.slides[index + 1]?.startTime ||
            content.totalDuration)
    );

    if (slideIndex !== -1 && slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const handleSlideClick = (index) => {
    if (audioRef.current && content.slides[index]) {
      audioRef.current.currentTime = content.slides[index].startTime;
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

  const calculateProgress = () => {
    const currentSlideData = content.slides[currentSlide];
    if (!currentSlideData) return 0;

    const slideStart = currentSlideData.startTime;
    const slideEnd =
      currentSlideData.endTime ||
      content.slides[currentSlide + 1]?.startTime ||
      content.totalDuration;
    const progress =
      ((currentTime - slideStart) / (slideEnd - slideStart)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return {
    currentSlide,
    currentTime,
    isPaused,
    isLoading,
    handleSlideClick,
    handleClose,
    calculateProgress,
    audio: audioRef.current,
  };
};

export default usePresentationController;
