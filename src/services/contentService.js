const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchContent = async (pincode) => {
  try {
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
