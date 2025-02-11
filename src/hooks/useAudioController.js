import { useEffect, useRef, useState } from "react";

export const useAudioController = (musicSrc, totalDuration, onTimeUpdate) => {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    const audio = new Audio(musicSrc);
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      // Throttle updates to prevent rapid slide transitions
      if (audio.currentTime - lastUpdateTimeRef.current >= 0.1) {
        lastUpdateTimeRef.current = audio.currentTime;
        onTimeUpdate(audio.currentTime);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);

    audio.addEventListener("canplaythrough", () => {
      setIsLoading(false);
      if (!isHolding) {
        audio.play();
      }
    });

    audio.load();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.pause();
      audio.remove();
    };
  }, [musicSrc]); // Only recreate when music source changes

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

  const handleClose = (onClose) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onClose();
  };

  return {
    isLoading,
    isHolding,
    handleHoldStart,
    handleHoldEnd,
    handleVideoPlay,
    handleVideoEnd,
    handleClose,
    audio: audioRef.current,
  };
};
