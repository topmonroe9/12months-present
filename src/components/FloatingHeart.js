"use client";
import React, { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";

const FloatingHeart = ({ index }) => {
  const [styles, setStyles] = useState({
    left: "0%",
    animationDelay: "0s",
    animationDuration: "4s",
  });
  const [heartProps, setHeartProps] = useState({
    size: "w-4 h-4",
    color: "text-pink-300",
  });

  useEffect(() => {
    // Generate random values on client-side only
    setStyles({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${4 + Math.random() * 4}s`,
    });

    const sizes = [
      "w-4 h-4",
      "w-5 h-5",
      "w-6 h-6",
      "w-4 h-5",
      "w-5 h-4",
      "w-6 h-5",
      "w-5 h-6",
      "w-4 h-6",
      "w-6 h-4",
    ];
    const colors = ["text-pink-300", "text-pink-400", "text-pink-500"];

    setHeartProps({
      size: sizes[Math.floor(Math.random() * sizes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }, []);

  return (
    <div className="absolute bottom-0 animate-float opacity-20" style={styles}>
      <Heart className={`${heartProps.size} ${heartProps.color}`} />
    </div>
  );
};

// Usage in GiftCalendar:
const hearts = [...Array(30)].map((_, index) => (
  <FloatingHeart key={index} index={index} />
));

export default FloatingHeart;
