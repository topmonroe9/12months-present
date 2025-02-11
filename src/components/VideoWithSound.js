import React, { useRef, useEffect, useState } from "react";

const VideoWithSound = ({
  src,
  className,
  loop = true,
  onPlay,
  onEnded,
  slideEndTime,
  currentTime,
  isPaused,
}) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const isPlayingRef = useRef(false);

  // Handle pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPaused) {
      video.pause();
    } else {
      video.play().catch((error) => console.error("Play failed:", error));
    }
  }, [isPaused]);

  // Check if we should end based on slide timing
  useEffect(() => {
    if (slideEndTime && currentTime >= slideEndTime && isPlayingRef.current) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        isPlayingRef.current = false;
        onEnded?.();
      }
    }
  }, [currentTime, slideEndTime, onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingRef.current) return;

    const startPlaying = async () => {
      if (isPlayingRef.current || isPaused) return;

      try {
        onPlay?.();
        await video.play();
        video.volume = 1.0;
        isPlayingRef.current = true;
      } catch (error) {
        console.error("Play failed:", error);
        isPlayingRef.current = false;
      }
    };

    const handleEnded = () => {
      isPlayingRef.current = false;
      onEnded?.();
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (!isPlayingRef.current && !isPaused) {
        startPlaying();
      }
    };

    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("ended", handleEnded);

    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("ended", handleEnded);

      if (isPlayingRef.current) {
        video.pause();
        isPlayingRef.current = false;
        onEnded?.();
      }
    };
  }, [src, onPlay, onEnded, isPaused]);

  // Reset state when src changes
  useEffect(() => {
    isPlayingRef.current = false;
    setIsLoading(true);
  }, [src]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <video
        ref={videoRef}
        key={src}
        src={src}
        className={className}
        playsInline
        loop={loop}
        muted={false}
        preload="auto"
      />
    </div>
  );
};

export default VideoWithSound;
