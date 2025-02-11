"use client";
import GiftCalendar from "../components/GiftCalendar";
import { useEffect, useState } from "react";
import PincodeEntry from "../components/PincodeEntry";
import { fetchContent, getPincode } from "../services/contentService";

const Home = () => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeContent = async () => {
      const savedPincode = getPincode();
      if (savedPincode) {
        try {
          const response = await fetchContent(savedPincode);
          if (response.success && response.data) {
            setContent(response.data);
          }
        } catch (error) {
          console.error("Error loading content:", error);
        }
      }
      setIsLoading(false);
    };

    initializeContent();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <PincodeEntry onSuccess={setContent} />;
  }

  return <GiftCalendar content={content} />;
};

export default Home;
