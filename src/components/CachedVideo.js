import React, { useRef, useEffect, useState } from "react";
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
  const [isLoaded, setIsLoaded] = useState(false);
  const playAttemptRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    let mounted = true;

    const handleCanPlay = () => {
      if (!mounted) return;
      setIsLoaded(true);

      if (autoPlay && !isPaused) {
        // Clear any existing play attempt
        if (playAttemptRef.current) {
          clearTimeout(playAttemptRef.current);
        }

        // Attempt to play with a slight delay to ensure video is ready
        playAttemptRef.current = setTimeout(() => {
          if (!mounted) return;

          video.play().catch((error) => {
            // Only log error if component is still mounted
            if (mounted) {
              console.error("Video play failed:", error);
              // If not a sound video, try muted playback
              if (!isWithSound) {
                video.muted = true;
                video.play().catch((e) => {
                  if (mounted) {
                    console.error("Muted playback failed:", e);
                  }
                });
              }
            }
          });
        }, 100);
      }
    };

    video.addEventListener("canplay", handleCanPlay);

    if (isWithSound) {
      video.volume = 1;
      video.muted = false;
    }

    // Check if video is already ready to play
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      mounted = false;
      // Clear any pending play attempts
      if (playAttemptRef.current) {
        clearTimeout(playAttemptRef.current);
      }
      // Remove event listeners
      video.removeEventListener("canplay", handleCanPlay);
      // Ensure video is stopped
      if (!video.paused) {
        video.pause();
      }
    };
  }, [autoPlay, isPaused, isWithSound]);

  // Handle pause state changes
  useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    const video = videoRef.current;
    let mounted = true;

    if (isPaused) {
      video.pause();
    } else if (mounted && autoPlay) {
      video.play().catch((error) => {
        if (mounted) {
          console.error("Video play state change failed:", error);
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [isPaused, isLoaded, autoPlay]);

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      autoPlay={false} // We handle autoplay in useEffect
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
