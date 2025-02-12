// services/contentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isDevelopment = process.env.NODE_ENV === "development";

// Safely try to get local content
const getLocalContent = async () => {
  if (!isDevelopment) return null;

  try {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = await import("@/data/localContent.js");
    return module;
  } catch (error) {
    console.warn("Local content file not found, using API instead");
    return null;
  }
};

export const fetchContent = async (pincode) => {
  try {
    // Try to use local data in development mode
    if (isDevelopment) {
      const localModule = await getLocalContent();

      if (localModule) {
        // Simulate network delay
        // await new Promise((resolve) => setTimeout(resolve, 500));

        const pincodeNum = Number(pincode);
        console.log("Checking pincode:", pincodeNum);

        if (localModule.validPincode !== pincodeNum) {
          console.log("Invalid pincode");
          return {
            success: false,
            message: "Invalid pincode",
          };
        }

        console.log("Valid pincode, returning content");
        return {
          success: true,
          data: localModule.localContent,
        };
      }
    }

    // Fallback to API if local content is not available or in production
    const response = await fetch(`${API_URL}/api/content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pincode }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return {
      success: false,
      message: "Failed to fetch content",
    };
  }
};

export const savePincode = (pincode) => {
  localStorage.setItem("giftPincode", pincode);
};

export const getPincode = () => {
  return localStorage.getItem("giftPincode");
};
