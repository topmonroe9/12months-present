"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Gift, Calendar, Clock } from "lucide-react";
import Gift1 from "./Gift1";
import FloatingHeart from "./FloatingHeart";
import Gift2Transition from "./Gift2Transition";
import html2canvas from "html2canvas";

const GiftCalendar = ({ content, onTransitionComplete }) => {
  const [openedGifts, setOpenedGifts] = useState([]);
  const [timeUntilNext, setTimeUntilNext] = useState("");
  const [selectedGift, setSelectedGift] = useState(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gift2JustUnlocked, setGift2JustUnlocked] = useState(false);
  const [screenshotCanvas, setScreenshotCanvas] = useState(null);

  const backgroundMusicRef = useRef(null);
  const calendarRef = useRef(null);

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
    if (!content) return;

    backgroundMusicRef.current = new Audio(content.backgroundMusic);
    backgroundMusicRef.current.loop = true;

    const saved = localStorage.getItem("giftCalendarV2");
    if (saved) {
      try {
        const { openedGifts: savedGifts } = JSON.parse(saved);
        if (savedGifts) setOpenedGifts(savedGifts);
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

  const isGift2Available = openedGifts.includes(0);

  const toggleBackgroundMusic = () => {
    if (!backgroundMusicRef.current) return;

    if (isBackgroundMusicPlaying) {
      backgroundMusicRef.current.pause();
    } else {
      backgroundMusicRef.current.play().catch(console.error);
    }
    setIsBackgroundMusicPlaying(!isBackgroundMusicPlaying);
  };

  const saveState = (newOpenedGifts, extra = {}) => {
    try {
      const saved = localStorage.getItem("giftCalendarV2");
      let state = {};
      try {
        state = JSON.parse(saved) || {};
      } catch (e) {}
      localStorage.setItem(
        "giftCalendarV2",
        JSON.stringify({ ...state, openedGifts: newOpenedGifts, ...extra })
      );
    } catch (error) {
      console.error("Error saving gift state:", error);
    }
  };

  const openGift = (giftIndex) => {
    // Gift 2 — capture screenshot then start shatter transition
    if (giftIndex === 1) {
      if (!isGift2Available) return;

      window.scrollTo({ top: 0, behavior: "instant" });

      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
      }

      if (!openedGifts.includes(1)) {
        const newOpenedGifts = [...openedGifts, 1];
        setOpenedGifts(newOpenedGifts);
        saveState(newOpenedGifts);
      }

      // Capture the calendar DOM, then start transition
      if (calendarRef.current) {
        html2canvas(calendarRef.current, {
          scale: Math.min(window.devicePixelRatio || 1, 2),
          logging: false,
        })
          .then((canvas) => {
            setScreenshotCanvas(canvas);
            setIsTransitioning(true);
          })
          .catch(() => {
            // Fallback: transition without screenshot
            setIsTransitioning(true);
          });
      } else {
        setIsTransitioning(true);
      }
      return;
    }

    // Gift 1 — open slideshow
    setSelectedGift(giftIndex);

    if (!openedGifts.includes(giftIndex)) {
      const newOpenedGifts = [...openedGifts, giftIndex];
      setOpenedGifts(newOpenedGifts);
      saveState(newOpenedGifts);
    }

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = true;
    }
  };

  const handleGiftClose = () => {
    setSelectedGift(null);

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.muted = false;
      if (isBackgroundMusicPlaying) {
        backgroundMusicRef.current.play().catch(console.error);
      }
    }

    // Trigger unlock animation if gift 1 was just completed
    if (openedGifts.includes(0) && !gift2JustUnlocked) {
      setGift2JustUnlocked(true);
    }
  };

  const updateTimer = () => {
    if (!content) return;
    const now = new Date();
    const nextDate = new Date(
      now.getFullYear(),
      now.getMonth() + (now.getDate() >= 16 ? 1 : 0),
      16
    );

    const diff = nextDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setTimeUntilNext(`${days}д ${hours}ч ${minutes}м ${seconds}с`);
  };

  if (!content) return null;

  return (
    <>
      {/* Gift 1 Slideshow */}
      {selectedGift === 0 && content.gift1 && (
        <Gift1 content={content.gift1} onClose={handleGiftClose} />
      )}

      {/* Shatter Transition */}
      {isTransitioning && (
        <Gift2Transition screenshotCanvas={screenshotCanvas} onComplete={onTransitionComplete} />
      )}

      {/* Original calendar UI — shrinks during transition */}
      <motion.div
        ref={calendarRef}
        className="min-h-screen bg-gradient-to-b from-pink-100 to-purple-100 p-4 relative overflow-hidden"
        animate={
          isTransitioning
            ? {
                scale: 0.5,
                borderRadius: "24px",
                rotateX: 8,
                rotateY: -3,
                filter: "brightness(0.7) saturate(0.5)",
              }
            : {
                scale: 1,
                borderRadius: "0px",
                rotateX: 0,
                rotateY: 0,
                filter: "brightness(1) saturate(1)",
              }
        }
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformOrigin: "center center", perspective: 1200 }}
      >
        {/* Music toggle */}
        <button
          onClick={toggleBackgroundMusic}
          className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg"
        >
          {isBackgroundMusicPlaying ? "🔇" : "🔊"}
        </button>

        {/* Floating hearts */}
        {[...Array(30)].map((_, index) => (
          <FloatingHeart key={index} index={index} />
        ))}

        {/* Title — same as original */}
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-4">
          Твои 12 историй
        </h1>

        {/* Timer — same as original */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-2">
            До следующего подарка:
          </h2>
          <div className="text-2xl font-bold text-pink-600">{timeUntilNext}</div>
        </div>

        {/* Gift grid — original 12-month layout */}
        <div className="grid grid-cols-2 gap-4">
          {months.map((month, index) => {
            const isOpened = openedGifts.includes(index);
            // Gift 1 (index 0): always available
            // Gift 2 (index 1): available after gift 1 is watched
            // Gifts 3-12 (index 2+): locked ("Скоро")
            const isAvailable = index === 0 || (index === 1 && isGift2Available);

            return (
              <motion.div
                key={month}
                className={`relative bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 ${
                  isOpened ? "bg-pink-50" : ""
                }`}
                animate={
                  index === 1 && gift2JustUnlocked
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(236, 72, 153, 0)",
                          "0 0 30px rgba(236, 72, 153, 0.5)",
                          "0 0 15px rgba(236, 72, 153, 0.3)",
                          "0 0 5px rgba(236, 72, 153, 0.1)",
                        ],
                        scale: [1, 1.05, 1],
                      }
                    : {}
                }
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    {month}
                  </span>
                  {isOpened ? (
                    <Gift className="w-5 h-5 text-pink-500" />
                  ) : (
                    <Calendar className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {!isAvailable && !isOpened ? (
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Скоро
                  </div>
                ) : (
                  <button
                    onClick={() => openGift(index)}
                    className={`w-full text-sm rounded-lg py-1 transition-colors ${
                      isOpened
                        ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                        : "bg-pink-500 text-white hover:bg-pink-600"
                    }`}
                  >
                    {isOpened ? "Смотреть снова ✨" : "Открыть"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
};

export default GiftCalendar;
