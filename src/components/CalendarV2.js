"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Play, Gift } from "lucide-react";
import Gift1 from "./Gift1";

const CalendarV2 = ({ content }) => {
  const [selectedGift, setSelectedGift] = useState(null);
  const [isBackgroundMusicPlaying, setIsBackgroundMusicPlaying] = useState(false);
  const backgroundMusicRef = useRef(null);

  useEffect(() => {
    if (!content?.backgroundMusic) return;

    backgroundMusicRef.current = new Audio(content.backgroundMusic);
    backgroundMusicRef.current.loop = true;

    return () => {
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
      backgroundMusicRef.current.play().catch(console.error);
    }
    setIsBackgroundMusicPlaying(!isBackgroundMusicPlaying);
  };

  const openGift = (giftKey) => {
    setSelectedGift(giftKey);
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
  };

  const giftContent = selectedGift ? content[selectedGift] : null;

  return (
    <>
      {/* Gift slideshow overlay */}
      {selectedGift && giftContent && (
        <Gift1 content={giftContent} onClose={handleGiftClose} />
      )}

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6 relative overflow-hidden">
        {/* Ambient floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`,
              }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -30, -60],
              }}
              transition={{
                duration: 4 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Music toggle */}
        <button
          onClick={toggleBackgroundMusic}
          className="fixed top-4 right-4 z-50 bg-white/10 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/10 hover:bg-white/15 transition-colors"
        >
          <span className="text-white/70 text-sm">
            {isBackgroundMusicPlaying ? "🔇" : "🔊"}
          </span>
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12 pt-8"
        >
          <h1 className="text-3xl font-serif font-bold text-white/90 mb-2">
            Наша история
          </h1>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-3 mb-2" />
          <p className="text-sm text-white/35 font-serif">
            Каждый момент — подарок
          </p>
        </motion.div>

        {/* Gift cards */}
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {/* Gift 1 — Месяц отношений */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => openGift("gift1")}
            className="relative bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.08] hover:border-pink-500/25 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500/15 to-rose-500/15 rounded-xl flex items-center justify-center border border-pink-500/15 group-hover:border-pink-500/30 transition-colors">
                <Heart className="w-7 h-7 text-pink-400/80 fill-pink-400/30" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white/85">
                  Месяц отношений
                </h2>
                <p className="text-sm text-white/35">Февраль 2025</p>
              </div>
            </div>
            <button className="w-full bg-white/[0.04] hover:bg-white/[0.08] text-white/60 rounded-xl py-3 font-medium transition-all border border-white/[0.06] flex items-center justify-center gap-2 group-hover:text-white/80">
              <Play className="w-4 h-4" />
              Смотреть снова
            </button>
          </motion.div>

          {/* Gift 2 — Год отношений */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            onClick={() => openGift("gift2")}
            className="relative bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/[0.08] hover:border-amber-500/25 transition-all cursor-pointer group"
          >
            {/* Subtle glow on hover */}
            <div className="absolute -inset-px bg-gradient-to-r from-amber-500/5 via-pink-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-sm" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500/15 to-pink-500/15 rounded-xl flex items-center justify-center border border-amber-500/15 group-hover:border-amber-500/30 transition-colors">
                <Star className="w-7 h-7 text-amber-400/80 fill-amber-400/30" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white/85">
                  Год отношений
                </h2>
                <p className="text-sm text-white/35">Февраль 2026</p>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 hover:from-amber-500/20 hover:to-pink-500/20 text-white/70 rounded-xl py-3 font-medium transition-all border border-amber-500/10 flex items-center justify-center gap-2 group-hover:text-white/90">
              <Gift className="w-4 h-4" />
              Открыть
            </button>
          </motion.div>
        </div>

        {/* Bottom subtle text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center text-white/15 text-xs mt-16 font-serif"
        >
          с любовью
        </motion.p>
      </div>
    </>
  );
};

export default CalendarV2;
