"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

const FRAGMENT_COLORS = [
  "#FFE4E8", // pink-100
  "#FFC0CB", // pink
  "#FFFFFF", // white
  "#E6E6FA", // lavender
  "#FFB6C1", // light pink
  "#F3E8FF", // purple-100
  "#FECDD3", // rose-200
  "#FFF1F2", // rose-50
  "#FAE8FF", // fuchsia-100
];

const createFragments = () => {
  const fragments = [];
  const count = 7 + Math.floor(Math.random() * 3); // 7-9 fragments

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 180 + Math.random() * 250;

    fragments.push({
      id: i,
      color: FRAGMENT_COLORS[i % FRAGMENT_COLORS.length],
      width: 50 + Math.random() * 90,
      height: 40 + Math.random() * 70,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.08,
      skewX: Math.random() * 20 - 10,
    });
  }
  return fragments;
};

const createParticles = () => {
  const particles = [];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 350;
    particles.push({
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 2 + Math.random() * 5,
      color: FRAGMENT_COLORS[Math.floor(Math.random() * FRAGMENT_COLORS.length)],
      delay: Math.random() * 0.12,
      duration: 0.5 + Math.random() * 0.4,
    });
  }
  return particles;
};

const ShatterFragments = ({ isActive }) => {
  const fragments = useMemo(() => createFragments(), []);
  const particles = useMemo(() => createParticles(), []);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Main fragments */}
      {fragments.map((frag) => (
        <motion.div
          key={`frag-${frag.id}`}
          className="absolute"
          style={{
            width: frag.width,
            height: frag.height,
            backgroundColor: frag.color,
            borderRadius: `${4 + Math.random() * 8}px`,
            boxShadow: `0 0 20px ${frag.color}80`,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            skewX: 0,
          }}
          animate={{
            x: frag.x,
            y: frag.y,
            opacity: 0,
            scale: 0.2,
            rotate: frag.rotation,
            skewX: frag.skewX,
          }}
          transition={{
            duration: 0.7,
            delay: frag.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={`particle-${p.id}`}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export default ShatterFragments;
