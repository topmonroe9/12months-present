import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import CachedVideo from "./CachedVideo";
import SparklingText from "./SparklingText";

const OptimizedVideoGridSlide = ({
  videos,
  className,
  content,
  contentClassName,
}) => {
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const gridRef = useRef(null);

  // Group videos into rows and columns for better organization
  const gridLayout = useMemo(() => {
    const rows = Math.ceil(Math.sqrt(videos.length));
    // const cols = Math.ceil(videos.length / rows);
    const cols =
      Math.ceil(videos.length / rows) >= 5
        ? 4
        : Math.ceil(videos.length / rows);
    return { rows, cols };
  }, [videos.length]);

  // Set up intersection observer to only play videos when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Start loading when 10% visible
      }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  // Load videos in batches when visible
  useEffect(() => {
    if (!isIntersecting) {
      return;
    }

    const batchSize = 7; // Load 7 videos at a time
    const loadNextBatch = (startIndex) => {
      if (startIndex >= videos.length) {
        return;
      }

      const nextBatch = videos.slice(startIndex, startIndex + batchSize);
      setVisibleVideos((prev) => [...prev, ...nextBatch]);

      // Schedule next batch
      setTimeout(() => {
        loadNextBatch(startIndex + batchSize);
      }, 100); // 100ms delay between batches
    };

    loadNextBatch(0);

    return () => {
      setVisibleVideos([]);
    };
  }, [isIntersecting, videos]);

  return (
    <motion.div
      className="flex flex-col gap-4 w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        ref={gridRef}
        className={`${className} h-[70vh] w-full grid`}
        style={{
          gridTemplateColumns: `repeat(${gridLayout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridLayout.rows}, 1fr)`,
          gap: "4px",
        }}
      >
        {videos.map((video, index) => {
          const isVisible = visibleVideos.includes(video);
          return (
            <div key={index} className="relative w-full h-full">
              <div className="absolute inset-0 p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  {isVisible ? (
                    <CachedVideo
                      src={video.src}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      isWithSound={false}
                      // Reduce quality for better performance
                      style={{
                        filter: "contrast(1.1)",
                        transform: "translateZ(0)",
                        willChange: "transform",
                      }}
                      // HTML5 video optimization attributes
                      preload="auto"
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                  ) : (
                    // Placeholder while video loads
                    <div className="absolute inset-0 bg-gray-900 rounded-full" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {content && (
        <SparklingText
          content={content}
          className={`text-center mt-4 ${contentClassName || ""}`}
        />
      )}
    </motion.div>
  );
};

export default OptimizedVideoGridSlide;
