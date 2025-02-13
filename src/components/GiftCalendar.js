"use client";
import React, { useState, useEffect, useRef } from "react";
import { Gift, Calendar, Clock } from "lucide-react";
import Gift1 from "./Gift1";
import FloatingHeart from "./FloatingHeart";
import PincodeEntry from "./PincodeEntry";
import {
  fetchContent,
  getPincode,
  savePincode,
} from "../services/contentService";

const GiftCalendar = () => {
  const [content, setContent] = useState(null);
  const [openedGifts, setOpenedGifts] = useState([]);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backgroundMusicRef = useRef(null);

  const months = [
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
    "Январь 2026",
  ];

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

  useEffect(() => {
    if (!content) return;

    backgroundMusicRef.current = new Audio("/background-music.mp3");
    backgroundMusicRef.current.loop = true;

    const saved = localStorage.getItem("giftCalendarState");
    if (saved) {
      try {
        const { openedGifts: saved_gifts } = JSON.parse(saved);
        setOpenedGifts(saved_gifts);
      } catch (error) {
        console.error("Error parsing saved state:", error);
      }
    }

    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
    };
  }, [content]);

  const toggleBackgroundMusic = () => {
    if (!backgroundMusicRef.current) return;

    if (isBackgroundMusicPlaying) {
      backgroundMusicRef.current.pause();
    } else {
      backgroundMusicRef.current.play().catch((error) => {
        console.error("Error playing background music:", error);
      });
    }
    setIsBackgroundMusicPlaying(!isBackgroundMusicPlaying);
  };

  const openGift = (monthIndex) => {
    console.log("Opening gift:", monthIndex);
    console.log("Current content:", content);

    // If the gift is already opened, allow replay
    if (openedGifts.includes(monthIndex)) {
      setSelectedGift(monthIndex);
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.muted = true;
        // Don't update isBackgroundMusicPlaying since we're just muting, not stopping
      }
      return;
    }

    // For new gifts, check availability
    if (!isGiftAvailable(monthIndex)) {
      console.log("Gift not available yet");
      return;
    }

    setSelectedGift(monthIndex);

    // Add to opened gifts
    const newOpenedGifts = [...openedGifts, monthIndex];
    setOpenedGifts(newOpenedGifts);
    try {
      localStorage.setItem(
        "giftCalendarState",
        JSON.stringify({
          openedGifts: newOpenedGifts,
        })
      );
    } catch (error) {
      console.error("Error saving gift state:", error);
    }

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = true;
      // Don't update isBackgroundMusicPlaying since we're just muting, not stopping
    }
  };

  const handleGiftClose = () => {
    setSelectedGift(null);
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = false;
      if (isBackgroundMusicPlaying) {
        backgroundMusicRef.current.play().catch((error) => {
          console.error("Error resuming background music:", error);
        });
      }
    }
  };

  const updateTimer = () => {
    if (!content) return;
    const START_DATE = new Date(content.startDate);
    const now = new Date();

    if (now < START_DATE) {
      const diff = START_DATE - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNext(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
      return;
    }

    const nextDate = new Date(
      now.getFullYear(),
      now.getMonth() + (now.getDate() >= 16 ? 1 : 0),
      16
    );

    const diff = nextDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilNext(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
  };

  const isGiftAvailable = (monthIndex) => {
    if (!content) return false;
    const START_DATE = new Date(content.startDate);
    const now = new Date();

    if (now < START_DATE) return false;

    const giftDate = new Date(START_DATE);
    giftDate.setMonth(START_DATE.getMonth() + monthIndex);

    return now >= giftDate;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <PincodeEntry onSuccess={setContent} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 relative overflow-hidden">
      <button
        onClick={toggleBackgroundMusic}
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg"
      >
        {isBackgroundMusicPlaying ? "🔇" : "🔊"}
      </button>

      {[...Array(30)].map((_, index) => (
        <FloatingHeart key={index} index={index} />
      ))}

      <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">
        Твои 12 историй
      </h1>

      <div className="bg-white rounded-xl p-4 shadow-lg mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-2">
          {new Date() < new Date(content.startDate)
            ? "До первого подарка:"
            : "До следующего подарка:"}
        </h2>
        <div className="text-2xl font-bold text-pink-600">{timeUntilNext}</div>
      </div>

      {selectedGift === 0 && content && (
        <Gift1 content={content} onClose={handleGiftClose} />
      )}

      {selectedGift !== null && selectedGift !== 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-pink-600 mb-4">
              {months[selectedGift]}
            </h2>
            <p className="text-gray-600 mb-4">Этот подарок ещё готовится...</p>
            <button
              onClick={handleGiftClose}
              className="w-full bg-pink-500 text-white rounded-lg py-2 hover:bg-pink-600 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {months.map((month, index) => (
          <div
            key={month}
            className={`relative bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 ${
              openedGifts.includes(index) ? "bg-pink-50" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{month}</span>
              {openedGifts.includes(index) ? (
                <Gift className="w-5 h-5 text-pink-500" />
              ) : (
                <Calendar className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {!openedGifts.includes(index) && !isGiftAvailable(index) ? (
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Скоро
              </div>
            ) : (
              <button
                onClick={() => openGift(index)}
                className={`w-full text-sm rounded-lg py-1 transition-colors ${
                  openedGifts.includes(index)
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                {openedGifts.includes(index) ? "Смотреть снова ✨" : "Открыть"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftCalendar;
