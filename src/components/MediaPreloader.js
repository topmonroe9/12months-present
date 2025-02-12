import React, { useState, useEffect, useCallback, useRef } from "react";
import { LoadingScreen } from "./LoadingScreen";
import { MediaCacheProvider } from "./MediaCacheContext";

const useMediaPreloader = (content) => {
  const [loadingState, setLoadingState] = useState({
    total: 0,
    loaded: 0,
    initialReady: false,
    error: null,
  });

  const mediaCacheRef = useRef(new Map());
  const isProcessingRef = useRef(false);

  const getMediaUrlsFromSlide = useCallback((slide) => {
    const urls = new Set();

    if (!slide) return urls;

    try {
      switch (slide.type) {
        case "image":
          if (slide.src) {
            console.log("Found image:", slide.src);
            urls.add({ url: slide.src, type: "image" });
          }
          break;
        case "imageGrid":
          if (Array.isArray(slide.images)) {
            slide.images.forEach((image) => {
              if (image && image.src) {
                console.log("Found grid image:", image.src);
                urls.add({ url: image.src, type: "image" });
              }
            });
          }
          break;
        case "videoWithSound":
          if (slide.src && !slide.src.includes(".mp3")) {
            console.log("Found video:", slide.src);
            urls.add({ url: slide.src, type: "video" });
          }
          break;
        case "videoGrid":
          if (Array.isArray(slide.videos)) {
            slide.videos.forEach((video) => {
              if (video && video.src && !video.src.includes(".mp3")) {
                console.log("Found grid video:", video.src);
                urls.add({ url: video.src, type: "video" });
              }
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error getting URLs from slide:", error);
    }

    return Array.from(urls);
  }, []);

  const preloadMedia = useCallback(async ({ url, type }) => {
    if (mediaCacheRef.current.has(url)) {
      console.log("Media already cached:", url);
      return mediaCacheRef.current.get(url);
    }

    console.log(`Loading ${type}:`, url);

    if (type === "image") {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          console.log("Image loaded and cached:", url);
          mediaCacheRef.current.set(url, img);
          resolve(img);
        };
        img.onerror = (error) => {
          console.error("Image load error:", url, error);
          reject(new Error(`Failed to load image: ${url}`));
        };
        img.src = url;
      });
    } else if (type === "video") {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "auto";

        video.onloadeddata = () => {
          console.log("Video loaded and cached:", url);
          mediaCacheRef.current.set(url, { src: url, element: video });
          resolve({ src: url, element: video });
        };

        video.onerror = () => {
          console.error("Video load error:", url);
          reject(new Error(`Failed to load video: ${url}`));
        };

        video.src = url;
        video.load();
      });
    }
  }, []);

  useEffect(() => {
    if (!content || !content.slides || isProcessingRef.current) {
      return;
    }

    const loadAllMedia = async () => {
      try {
        isProcessingRef.current = true;

        const mediaItems = new Set();
        content.slides.forEach((slide) => {
          const items = getMediaUrlsFromSlide(slide);
          items.forEach((item) => mediaItems.add(item));
        });

        const mediaArray = Array.from(mediaItems);
        console.log(`Found ${mediaArray.length} media items to preload`);

        if (mediaArray.length === 0) {
          setLoadingState((prev) => ({
            ...prev,
            initialReady: true,
          }));
          return;
        }

        setLoadingState((prev) => ({
          ...prev,
          total: mediaArray.length,
          loaded: 0,
          initialReady: false,
        }));

        await Promise.all(
          mediaArray.map(async (item) => {
            try {
              await preloadMedia(item);
              setLoadingState((prev) => ({
                ...prev,
                loaded: prev.loaded + 1,
              }));
            } catch (error) {
              console.error("Error preloading:", item.url, error);
              // Continue loading other items
              setLoadingState((prev) => ({
                ...prev,
                loaded: prev.loaded + 1,
              }));
            }
          })
        );

        setLoadingState((prev) => ({
          ...prev,
          initialReady: true,
        }));

        console.log("All media preloaded successfully");
      } catch (error) {
        console.error("Processing error:", error);
        setLoadingState((prev) => ({
          ...prev,
          error: error.message || "Failed to load media",
        }));
      } finally {
        isProcessingRef.current = false;
      }
    };

    loadAllMedia();

    return () => {
      mediaCacheRef.current.clear();
    };
  }, [content, getMediaUrlsFromSlide, preloadMedia]);

  return {
    ...loadingState,
    mediaCache: mediaCacheRef.current,
  };
};

const MediaPreloader = ({ content, children }) => {
  const { total, loaded, initialReady, error, mediaCache } =
    useMediaPreloader(content);

  if (!initialReady) {
    return (
      <LoadingScreen loadedImages={loaded} totalImages={Math.max(total, 1)} />
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="mb-4">Error: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MediaCacheProvider mediaCache={mediaCache}>{children}</MediaCacheProvider>
  );
};

export default MediaPreloader;
