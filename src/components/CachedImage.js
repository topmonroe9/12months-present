import React from "react";
import { useMediaCache } from "./MediaCacheContext";

const CachedImage = ({ src, alt, className, ...props }) => {
  const { getCachedMedia } = useMediaCache();
  const cachedImage = getCachedMedia(src);

  if (cachedImage) {
    return (
      <img src={cachedImage.src} alt={alt} className={className} {...props} />
    );
  }

  return <img src={src} alt={alt} className={className} {...props} />;
};

export default CachedImage;
