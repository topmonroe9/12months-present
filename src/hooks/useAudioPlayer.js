// hooks/useAudioPlayer.js
import { useRef } from "react";

const useAudioPlayer = ({
  music,
  totalDuration,
  currentTime,
  setCurrentTime,
  onClose,
  slides,
  currentSlide,
  setCurrentSlide,
}) => {
  const audioRef = useRef(null);

  const handleVideoPlay = () => {
    if (audioRef.current) {
      // Mute the background music but don't pause it
      audioRef.current.muted = true;
    }
  };

  const handleVideoEnd = () => {
    if (audioRef.current) {
      // Unmute the background music
      audioRef.current.muted = false;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    const time = audioRef.current.currentTime;
    setCurrentTime(time);

    if (time >= totalDuration) {
      onClose({ stopPropagation: () => {} });
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

  return {
    audioRef,
    handleVideoPlay,
    handleVideoEnd,
    handleTimeUpdate,
  };
};

// hooks/useSlideNavigation.js
const useSlideNavigation = ({
  currentSlide,
  slides,
  audioRef,
  setCurrentSlide,
}) => {
  const handleSlideClick = (index) => {
    if (audioRef.current && slides[index]) {
      audioRef.current.currentTime = slides[index].startTime;
      setCurrentSlide(index);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      handleSlideClick(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      handleSlideClick(currentSlide + 1);
    }
  };

  return {
    handleSlideClick,
    handlePrevious,
    handleNext,
  };
};

// hooks/useGestureHandling.js
const useGestureHandling = ({
  setIsHolding,
  audioRef,
  currentSlide,
  slides,
  handleSlideClick,
}) => {
  const handleHoldStart = () => {
    setIsHolding(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error resuming playback:", error);
      });
    }
  };

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

  return {
    handleHoldStart,
    handleHoldEnd,
    handleTouchStart,
  };
};

export { useAudioPlayer, useSlideNavigation, useGestureHandling };
