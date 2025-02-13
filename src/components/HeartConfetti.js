import React, { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SparklingText from "./SparklingText";
import { slideAnimation } from "./SlideContent";
const HeartConfetti = ({ isActive = false, intensity = "medium" }) => {
  const getHeartCount = useCallback(() => {
    switch (intensity) {
      case "low":
        return 20;
      case "high":
        return 100;
      default:
        return 50; // medium
    }
  }, [intensity]);

  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!isActive) {
      setHearts([]);
      return;
    }

    const newHearts = Array.from({ length: getHeartCount() }, (_, i) => ({
      id: `heart-${i}-${Date.now()}`,
      x: Math.random() * 100, // Random starting X position (0-100%)
      delay: Math.random() * 0.5, // Random delay (0-0.5s)
      duration: 1 + Math.random() * 2, // Random duration (1-3s)
      size: 16 + Math.random() * 24, // Random size (16-40px)
      rotation: Math.random() * 360, // Random rotation
      color: [
        "text-pink-300",
        "text-pink-400",
        "text-pink-500",
        "text-red-300",
        "text-red-400",
      ][Math.floor(Math.random() * 5)],
    }));

    setHearts(newHearts);

    const timeout = setTimeout(() => {
      setHearts([]);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isActive, getHeartCount]);

  return (
    <AnimatePresence>
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{
            opacity: 1,
            x: `${heart.x}vw`,
            y: "100vh",
          }}
          animate={{
            opacity: 0,
            x: `${heart.x + (Math.random() * 20 - 10)}vw`,
            y: "-20vh",
            rotate: heart.rotation + Math.random() * 360,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeOut",
          }}
          className="fixed pointer-events-none z-50"
        >
          <Heart size={heart.size} className={`${heart.color} fill-current`} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

const PulsingText = ({ content, className }) => {
  // BPM of the song (Harley by Deep Motion is around 128 BPM)
  const bpm = 128;
  const beatsPerSecond = bpm / 60;
  const pulseDuration = 1 / beatsPerSecond;

  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: pulseDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <SparklingText content={content} className={className} />
    </motion.div>
  );
};

export const TextWithHeartsSlide = ({
  content,
  className,
  intensity = "medium",
}) => {
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    setShowHearts(true);
    const timer = setTimeout(() => setShowHearts(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      {...slideAnimation}
      className="w-full h-full flex items-center justify-center relative"
    >
      <HeartConfetti isActive={showHearts} intensity={intensity} />
      <PulsingText content={content} className={className} />
    </motion.div>
  );
};

export default HeartConfetti;
