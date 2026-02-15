"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CrackOverlay from "./CrackOverlay";
import ShatterScene from "./ShatterScene";

const PHASES = {
  FRAME: "FRAME",
  CRACK: "CRACK",
  SHATTER: "SHATTER",
  VOID: "VOID",
  EMERGE: "EMERGE",
};

// Extended timings for dramatic effect
const TIMINGS = {
  CRACK: 700,
  SHATTER: 1600,
  VOID: 2800,
  EMERGE: 3400,
  DONE: 4400,
};

// Ambient void particles (CSS-based, lightweight)
function VoidParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(255,${150 + Math.random() * 100},${50 + Math.random() * 50},0.8) 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.5],
            y: [0, -30 - Math.random() * 40],
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
}

const Gift2Transition = ({ screenshotCanvas, onComplete }) => {
  const [phase, setPhase] = useState(PHASES.FRAME);
  const [showFlash, setShowFlash] = useState(false);

  const stableOnComplete = useCallback(onComplete, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(PHASES.CRACK), TIMINGS.CRACK),
      setTimeout(() => {
        setPhase(PHASES.SHATTER);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 200);
      }, TIMINGS.SHATTER),
      setTimeout(() => setPhase(PHASES.VOID), TIMINGS.VOID),
      setTimeout(() => setPhase(PHASES.EMERGE), TIMINGS.EMERGE),
      setTimeout(() => stableOnComplete(), TIMINGS.DONE),
    ];

    return () => timers.forEach(clearTimeout);
  }, [stableOnComplete]);

  const backdropOpacity = {
    [PHASES.FRAME]: 0.3,
    [PHASES.CRACK]: 0.6,
    [PHASES.SHATTER]: 1,
    [PHASES.VOID]: 1,
    [PHASES.EMERGE]: 1,
  }[phase];

  const isVibrating = phase === PHASES.CRACK;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      animate={
        isVibrating
          ? {
              x: [0, -4, 5, -3, 4, -2, 3, -1, 2, 0],
              y: [0, 2, -3, 3, -2, 2, -1, 1, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={
        isVibrating
          ? { duration: 0.25, repeat: Infinity, repeatType: "mirror" }
          : { duration: 0.1 }
      }
    >
      {/* Dark backdrop — builds ominously */}
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: backdropOpacity }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Subtle vignette during crack phase */}
      {(phase === PHASES.CRACK || phase === PHASES.FRAME) && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      )}

      {/* Crack overlay — centered over the shrunken calendar */}
      {phase === PHASES.CRACK && (
        <div
          className="absolute flex items-center justify-center"
          style={{ width: "55vw", height: "55vh" }}
        >
          <CrackOverlay isActive />
        </div>
      )}

      {/* 3D shatter — real screenshot broken into fragments with sparks + bloom */}
      <ShatterScene
        screenshotCanvas={screenshotCanvas}
        isActive={phase === PHASES.SHATTER || phase === PHASES.VOID}
      />

      {/* White flash at shatter moment — more intense with warm color */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            className="absolute inset-0 z-[62]"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,220,150,0.8) 40%, rgba(255,180,100,0.4) 70%, transparent 100%)",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Secondary flash — quick screen-wide pulse */}
      {phase === PHASES.SHATTER && (
        <motion.div
          className="absolute inset-0 z-[61] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,200,100,0.3) 0%, transparent 60%)",
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}

      {/* VOID phase — floating ember particles + pulsing center light */}
      {phase === PHASES.VOID && (
        <>
          <VoidParticles />
          <motion.div
            className="absolute z-[63]"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,150,255,0.4) 50%, transparent 100%)",
              boxShadow: "0 0 40px 20px rgba(200,150,255,0.3)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 3, 2, 4],
              opacity: [0, 0.8, 0.6, 1],
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </>
      )}

      {/* EMERGE — portal opens, new world materializes */}
      {phase === PHASES.EMERGE && (
        <>
          {/* Light rays radiating outward */}
          <motion.div
            className="absolute inset-0 z-[63] pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(200,150,255,0.15) 10deg, transparent 20deg, transparent 30deg, rgba(200,150,255,0.1) 40deg, transparent 50deg, transparent 60deg, rgba(200,150,255,0.12) 70deg, transparent 80deg, transparent 90deg, rgba(200,150,255,0.08) 100deg, transparent 110deg, transparent 120deg, rgba(200,150,255,0.15) 130deg, transparent 140deg, transparent 150deg, rgba(200,150,255,0.1) 160deg, transparent 170deg, transparent 180deg, rgba(200,150,255,0.12) 190deg, transparent 200deg, transparent 210deg, rgba(200,150,255,0.08) 220deg, transparent 230deg, transparent 240deg, rgba(200,150,255,0.15) 250deg, transparent 260deg, transparent 270deg, rgba(200,150,255,0.1) 280deg, transparent 290deg, transparent 300deg, rgba(200,150,255,0.12) 310deg, transparent 320deg, transparent 330deg, rgba(200,150,255,0.08) 340deg, transparent 360deg)",
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 2, 3], rotate: 30 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Main emerge — new world zooms in from portal */}
          <motion.div
            className="absolute inset-0 z-[64] flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at center, #0a0015 0%, #050008 50%, #000000 100%)",
            }}
            initial={{
              clipPath: "circle(0% at 50% 50%)",
              opacity: 0,
            }}
            animate={{
              clipPath: "circle(75% at 50% 50%)",
              opacity: 1,
            }}
            transition={{
              clipPath: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3 },
            }}
          >
            {/* Inner glow ring */}
            <motion.div
              className="absolute"
              style={{
                width: "120vmax",
                height: "120vmax",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, transparent 48%, rgba(150,100,255,0.08) 50%, transparent 52%)",
              }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />

            {/* Text reveal */}
            <motion.p
              className="text-3xl font-serif text-white/60 tracking-widest"
              style={{ textShadow: "0 0 30px rgba(200,150,255,0.4)" }}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              ...
            </motion.p>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Gift2Transition;
