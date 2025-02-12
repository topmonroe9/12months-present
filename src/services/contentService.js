// services/contentService.js
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isDevelopment = process.env.NODE_ENV === "development";

let localContent;
let validPincodes;

// Only import in development
if (isDevelopment) {
  import("../data/localContent").then((module) => {
    localContent = module.localContent;
    validPincodes = module.validPincodes;
  });
}

export const fetchContent = async (pincode) => {
  try {
    // Use local data in development mode
    if (isDevelopment) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!validPincodes.has(pincode)) {
        return {
          success: false,
          message: "Invalid pincode",
        };
      }

      return {
        success: true,
        data: localContent,
      };
    }

    // Use API in production
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
