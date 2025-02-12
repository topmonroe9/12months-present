import React, { createContext, useContext } from "react";

export const MediaCacheContext = createContext({
  mediaCache: new Map(),
  getCachedMedia: () => null,
});

export const useMediaCache = () => useContext(MediaCacheContext);

export const MediaCacheProvider = ({ mediaCache, children }) => {
  const getCachedMedia = (src) => {
    return mediaCache.get(src);
  };

  return (
    <MediaCacheContext.Provider value={{ mediaCache, getCachedMedia }}>
      {children}
    </MediaCacheContext.Provider>
  );
};
