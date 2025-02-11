export const retryWithBackoff = async (loadFn, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await loadFn();
    } catch (error) {
      lastError = error;
      const backoffTime = Math.min(1000 * Math.pow(2, attempt), 5000); // Max 5 seconds
      console.log(
        `Attempt ${attempt + 1} failed, retrying in ${backoffTime}ms`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffTime));
    }
  }

  throw lastError;
};

export const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let timeoutId;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      img.onload = null;
      img.onerror = null;
    };

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Image load timeout"));
    }, 20000); // 20 second timeout

    img.onload = () => {
      cleanup();
      resolve(url);
    };

    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
};

export const preloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    let timeoutId;

    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      video.oncanplaythrough = null;
      video.onerror = null;
    };

    timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error("Video load timeout"));
    }, 30000); // 30 second timeout for videos

    video.oncanplaythrough = () => {
      cleanup();
      resolve(url);
    };

    video.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load video: ${url}`));
    };

    video.src = url;
    video.load();
  });
};

// Queue manager for controlling concurrent loads
export class LoadQueue {
  constructor(concurrency = 10) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    if (this.running >= this.concurrency) {
      await new Promise((resolve) => this.queue.push(resolve));
    }

    this.running++;
    try {
      return await task();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}
