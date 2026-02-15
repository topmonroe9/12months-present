"use client";
import GiftCalendar from "../components/GiftCalendar";
import CalendarV2 from "../components/CalendarV2";
import { useEffect, useState } from "react";
import PincodeEntry from "../components/PincodeEntry";
import { fetchContent, getPincode } from "../services/contentService";

// Normalize content shape — handles both old (flat) and new (gift1/gift2) backend formats
const normalizeContent = (data) => {
  if (data.gift1) return data; // Already new format
  // Old format: flat object with slides, music, totalDuration, backgroundMusic
  const { backgroundMusic, startDate, ...gift1Data } = data;
  return { backgroundMusic, gift1: gift1Data };
};

const Home = () => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showV2, setShowV2] = useState(false);

  useEffect(() => {
    const initializeContent = async () => {
      const savedPincode = getPincode();
      if (savedPincode) {
        try {
          const response = await fetchContent(savedPincode);
          if (response.success && response.data) {
            setContent(normalizeContent(response.data));
          }
        } catch (error) {
          console.error("Error loading content:", error);
        }
      }

      // Check if v2 calendar should be shown
      try {
        const saved = localStorage.getItem("giftCalendarV2");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.showV2) setShowV2(true);
        }
      } catch (e) {}

      setIsLoading(false);
    };

    initializeContent();
  }, []);

  const handleTransitionComplete = () => {
    setShowV2(true);
    try {
      const saved = localStorage.getItem("giftCalendarV2");
      let state = {};
      try {
        state = JSON.parse(saved) || {};
      } catch (e) {}
      state.showV2 = true;
      localStorage.setItem("giftCalendarV2", JSON.stringify(state));
    } catch (e) {}
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return (
      <PincodeEntry
        onSuccess={(data) => setContent(normalizeContent(data))}
      />
    );
  }

  if (showV2) {
    return <CalendarV2 content={content} />;
  }

  return (
    <GiftCalendar
      content={content}
      onTransitionComplete={handleTransitionComplete}
    />
  );
};

export default Home;
