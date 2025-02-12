import React, { useRef, useEffect } from "react";
import { useMediaCache } from "./MediaCacheContext";

const CachedVideo = ({
  src,
  className,
  autoPlay = true,
  loop = true,
  muted = false,
  playsInline = true,
  onPlay,
  onEnded,
  isPaused,
  isWithSound = false,
  ...props
}) => {
  const videoRef = useRef(null);
  const { getCachedMedia } = useMediaCache();
  const cachedVideo = getCachedMedia(src);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (isWithSound) {
      video.volume = 1;
      // Don't mute videos with sound
      video.muted = false;
    }

    // Start playing if autoPlay is true and not paused
    if (autoPlay && !isPaused) {
      video.play().catch((error) => {
        console.error("Video autoplay failed:", error);
        // Try playing muted if initial autoplay fails
        if (!isWithSound) {
          video.muted = true;
          video.play().catch((e) => console.error("Muted autoplay failed:", e));
        }
      });
    }
  }, [autoPlay, isPaused, isWithSound]);

  // Handle pause state changes
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    }
  }, [isPaused]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={!isWithSound && muted}
      playsInline={playsInline}
      onPlay={onPlay}
      onEnded={onEnded}
      controls={false}
      {...props}
    />
  );
};

export default CachedVideo;
