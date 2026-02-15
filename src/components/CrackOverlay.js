"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Generate branching crack tree procedurally
function generateCrackTree() {
  const cracks = [];
  const sparks = [];

  // Recursive branch generator
  function branch(x, y, angle, depth, length, id) {
    if (depth > 5 || length < 3) return;

    const segments = 3 + Math.floor(Math.random() * 3);
    let path = `M ${x} ${y}`;
    let cx = x,
      cy = y;

    for (let i = 0; i < segments; i++) {
      const segLen = length / segments;
      const jitter = (Math.random() - 0.5) * 25;
      cx += Math.cos(((angle + jitter) * Math.PI) / 180) * segLen;
      cy += Math.sin(((angle + jitter) * Math.PI) / 180) * segLen;
      cx = Math.max(2, Math.min(98, cx));
      cy = Math.max(2, Math.min(98, cy));
      path += ` L ${cx.toFixed(1)} ${cy.toFixed(1)}`;

      // Sparks at segment joints
      if (Math.random() > 0.4) {
        sparks.push({
          x: cx,
          y: cy,
          delay: id * 0.04 + i * 0.02,
          size: 0.5 + Math.random() * 1.5,
        });
      }
    }

    cracks.push({
      path,
      delay: id * 0.04,
      width: Math.max(0.3, 1.2 - depth * 0.2),
      glowWidth: Math.max(1, 4 - depth * 0.7),
      depth,
    });

    // Sub-branches
    const numBranches = depth < 2 ? 2 + Math.floor(Math.random() * 2) : Math.random() > 0.4 ? 1 : 0;
    for (let b = 0; b < numBranches; b++) {
      const branchAngle = angle + (Math.random() - 0.5) * 120;
      const branchLen = length * (0.4 + Math.random() * 0.3);
      branch(cx, cy, branchAngle, depth + 1, branchLen, cracks.length);
    }
  }

  // Start 3-5 main cracks from near center
  const numMain = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numMain; i++) {
    const startAngle = (360 / numMain) * i + (Math.random() - 0.5) * 40;
    const startX = 50 + (Math.random() - 0.5) * 8;
    const startY = 50 + (Math.random() - 0.5) * 8;
    branch(startX, startY, startAngle, 0, 35 + Math.random() * 20, cracks.length);
  }

  return { cracks, sparks };
}

const CrackOverlay = ({ isActive }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isActive && !data) {
      setData(generateCrackTree());
    }
  }, [isActive, data]);

  if (!isActive || !data) return null;

  return (
    <svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="none"
      style={{ filter: "url(#crack-glow)" }}
    >
      <defs>
        {/* Intense glow filter */}
        <filter id="crack-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Glow for light bleeding through cracks */}
        <filter id="light-bleed" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>

        {/* Spark glow */}
        <radialGradient id="spark-gradient">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="40%" stopColor="#ffd700" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ff6b00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Layer 1: Deep golden light bleeding through cracks */}
      {data.cracks.map((crack, i) => (
        <motion.path
          key={`bleed-${i}`}
          d={crack.path}
          fill="none"
          stroke="rgba(255, 200, 50, 0.35)"
          strokeWidth={crack.glowWidth * 2}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#light-bleed)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.4, 0.7, 0.5] }}
          transition={{
            pathLength: { duration: 0.3, delay: crack.delay, ease: "easeOut" },
            opacity: {
              duration: 0.8,
              delay: crack.delay,
              repeat: Infinity,
              repeatType: "mirror",
            },
          }}
        />
      ))}

      {/* Layer 2: White-hot crack core */}
      {data.cracks.map((crack, i) => (
        <motion.path
          key={`core-${i}`}
          d={crack.path}
          fill="none"
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth={crack.width}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 0.25, delay: crack.delay, ease: "easeOut" },
            opacity: { duration: 0.05, delay: crack.delay },
          }}
        />
      ))}

      {/* Layer 3: Golden glow around cracks */}
      {data.cracks.map((crack, i) => (
        <motion.path
          key={`glow-${i}`}
          d={crack.path}
          fill="none"
          stroke="rgba(255, 170, 50, 0.5)"
          strokeWidth={crack.glowWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0.5] }}
          transition={{
            pathLength: { duration: 0.28, delay: crack.delay, ease: "easeOut" },
            opacity: { duration: 0.4, delay: crack.delay },
          }}
        />
      ))}

      {/* Layer 4: Sparks flying from crack intersections */}
      {data.sparks.map((spark, i) => (
        <motion.circle
          key={`spark-${i}`}
          cx={spark.x}
          cy={spark.y}
          r={spark.size}
          fill="url(#spark-gradient)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.5, 0.8, 0],
            cx: spark.x + (Math.random() - 0.5) * 6,
            cy: spark.y - Math.random() * 8,
          }}
          transition={{
            duration: 0.6,
            delay: spark.delay + 0.1,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center impact point glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="3"
        fill="none"
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="0.5"
        filter="url(#light-bleed)"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: [0, 8, 5], opacity: [0, 0.8, 0.4] }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
};

export default CrackOverlay;
