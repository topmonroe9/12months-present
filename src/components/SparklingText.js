import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Sparkle = ({ color = "#FFB6C1", size = 10, style = {} }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="absolute pointer-events-none"
    style={{
      width: size,
      height: size,
      ...style,
    }}
  >
    <svg viewBox="0 0 24 24" fill={color} className="w-full h-full">
      <path d="M12 0L14 9L21 12L14 15L12 24L10 15L3 12L10 9z" />
    </svg>
  </motion.div>
);

const SparklingText = ({ content = "", className = "" }) => {
  const [sparkles, setSparkles] = useState([]);
  const containerRef = useRef(null);
  const colors = ["#FFB6C1", "#FFD700", "#FFC0CB", "#FF69B4"];
  const maxSparkles = 3;

  const createSparkle = (rect) => ({
    id: Math.random(),
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 8,
    style: {
      left: Math.random() * rect.width + "px",
      top: Math.random() * rect.height + "px",
    },
  });

  useEffect(() => {
    const addSparkle = () => {
      if (containerRef.current && sparkles.length < maxSparkles) {
        const rect = containerRef.current.getBoundingClientRect();
        const newSparkle = createSparkle(rect);
        setSparkles((current) => [...current, newSparkle]);
        setTimeout(() => {
          setSparkles((current) =>
            current.filter((s) => s.id !== newSparkle.id)
          );
        }, 700);
      }
    };

    const interval = setInterval(() => {
      if (Math.random() < 0.7) {
        addSparkle();
      }
    }, 200);

    return () => clearInterval(interval);
  }, [sparkles.length]);

  // Default classes that match the working example
  const defaultClasses =
    "text-5xl font-serif font-semibold text-pink-400 text-center";

  // Combine default classes with any custom classes
  const finalClassName = className || defaultClasses;

  // Split content by newline
  const lines = content.split("\n");

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div ref={containerRef} className="relative inline-block">
        {lines.map((line, index) => (
          <div
            key={index}
            className={finalClassName}
            style={{
              marginBottom: index < lines.length - 1 ? "0.5rem" : 0,
            }}
          >
            {line}
          </div>
        ))}
        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <Sparkle
              key={sparkle.id}
              color={sparkle.color}
              size={sparkle.size}
              style={sparkle.style}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SparklingText;
