import { useRef, useCallback } from "react";

const useAudioPlayer = ({
  audioRef,
  totalDuration,
  currentTime,
  setCurrentTime,
  onClose,
  slides,
  currentSlide,
  setCurrentSlide,
  isHolding,
}) => {
  const backgroundMusicRef = useRef(
    window?.parent?.backgroundMusicRef?.current
  );

  const handleVideoPlay = () => {
    console.log("Video starting, muting audio");
    if (audioRef.current) {
      audioRef.current.muted = true;
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = true;
    }
  };

  // Keep handleVideoEnd simple as a backup
  const handleVideoEnd = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = false;
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;

    const currentAudioTime = audioRef.current.currentTime;
    setCurrentTime(currentAudioTime);

    // Find which slide we should be on based on the current time
    let targetSlideIndex = -1;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const nextSlide = slides[i + 1];

      if (
        currentAudioTime >= slide.startTime &&
        (!nextSlide || currentAudioTime < nextSlide.startTime)
      ) {
        targetSlideIndex = i;
        break;
      }
    }

    // If we found a valid target slide and it's different from current
    if (targetSlideIndex !== -1 && targetSlideIndex !== currentSlide) {
      console.log(
        `Time: ${currentAudioTime.toFixed(
          2
        )}, Moving from slide ${currentSlide} to ${targetSlideIndex}`
      );

      // Check if we're moving away from a video slide
      const currentSlideData = slides[currentSlide];
      const targetSlideData = slides[targetSlideIndex];

      if (
        currentSlideData?.type === "videoWithSound" ||
        (targetSlideData && targetSlideData.type !== "videoWithSound")
      ) {
        console.log(
          "Moving away from video or to non-video slide, unmuting audio"
        );
        audioRef.current.muted = false;
        if (!isHolding && audioRef.current.paused) {
          audioRef.current.play().catch(console.error);
        }
      }

      setCurrentSlide(targetSlideIndex);
    }

    // Handle end of presentation
    if (currentAudioTime >= totalDuration) {
      onClose();
      return;
    }
  }, [
    currentSlide,
    slides,
    totalDuration,
    onClose,
    setCurrentSlide,
    setCurrentTime,
  ]);

  return {
    handleVideoPlay,
    handleVideoEnd,
    handleTimeUpdate,
  };
};

const useSlideNavigation = ({
  currentSlide,
  slides,
  audioRef,
  setCurrentSlide,
}) => {
  const handleSlideClick = (index) => {
    if (audioRef.current && slides[index]) {
      // Stop current instance and reset
      audioRef.current.pause();

      // Make sure audio is unmuted when navigating manually
      audioRef.current.muted = false;

      // Set new time
      audioRef.current.currentTime = slides[index].startTime;

      // Resume playback
      audioRef.current.play().catch(console.error);

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

  const handleTouchStart = () => {
    handleHoldStart();
  };

  return {
    handleHoldStart,
    handleHoldEnd,
    handleTouchStart,
  };
};

export { useAudioPlayer, useSlideNavigation, useGestureHandling };
