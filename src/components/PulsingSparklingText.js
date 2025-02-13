import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SparklingText from "./SparklingText";
import HeartConfetti from "./HeartConfetti";
import { slideAnimation } from "./SlideContent";

const PulsingSparklingText = ({ content, className }) => {
  // BPM of the song (Harley by Deep Motion is around 128 BPM)
  const bpm = 128;
  const beatsPerSecond = bpm / 60;
  const pulseDuration = 1 / beatsPerSecond;

  const pulseAnimation = {
    scale: [1, 1.1, 1],
    transition: {
      duration: pulseDuration,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <motion.div animate={pulseAnimation} className="w-full">
      <SparklingText content={content} className={className} />
    </motion.div>
  );
};

export const TextWithHeartsAndPulse = ({
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
      <PulsingSparklingText content={content} className={className} />
    </motion.div>
  );
};

export default PulsingSparklingText;
