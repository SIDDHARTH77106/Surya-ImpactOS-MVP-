"use client";

import React from "react";
import { motion } from "framer-motion";

type EnergyParticle = {
  id: string;
  cx: number;
  cy: number;
  delay: number;
  duration: number;
  radius: number;
};

type SolarBackgroundProps = {
  className?: string;
};

const particles: EnergyParticle[] = [
  { id: "p1", cx: 8, cy: 18, delay: 0, duration: 10, radius: 2.4 },
  { id: "p2", cx: 22, cy: 42, delay: 1.4, duration: 12, radius: 1.8 },
  { id: "p3", cx: 40, cy: 22, delay: 0.8, duration: 11, radius: 2.1 },
  { id: "p4", cx: 62, cy: 54, delay: 2.1, duration: 13, radius: 2.6 },
  { id: "p5", cx: 76, cy: 30, delay: 1.1, duration: 9, radius: 1.7 },
  { id: "p6", cx: 90, cy: 68, delay: 2.8, duration: 12, radius: 2.2 },
  { id: "p7", cx: 16, cy: 78, delay: 3.2, duration: 14, radius: 1.9 },
  { id: "p8", cx: 50, cy: 84, delay: 1.9, duration: 10, radius: 2.3 },
];

export default function SolarBackground({ className = "" }: SolarBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 overflow-hidden ${className}`}
      style={{ opacity: 0.05, position: "fixed", zIndex: 0, pointerEvents: "none" }}
    >
      <motion.svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" initial={false}>
        <defs>
          <linearGradient id="solar-wave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="45%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <radialGradient id="solar-particle-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#10b981" />
          </radialGradient>
        </defs>

        <motion.path
          d="M -5 18 C 18 6 30 32 50 18 S 78 4 105 20"
          fill="none"
          stroke="url(#solar-wave-gradient)"
          strokeWidth="0.45"
          strokeLinecap="round"
          animate={{ pathLength: [0.45, 1, 0.45], opacity: [0.45, 1, 0.45], y: [0, 2.5, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M -6 48 C 14 34 30 61 52 47 S 81 35 106 50"
          fill="none"
          stroke="url(#solar-wave-gradient)"
          strokeWidth="0.55"
          strokeLinecap="round"
          animate={{ pathLength: [0.35, 1, 0.35], opacity: [0.35, 0.9, 0.35], y: [0, -3, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        />
        <motion.path
          d="M -5 76 C 16 62 32 88 54 74 S 82 61 105 78"
          fill="none"
          stroke="url(#solar-wave-gradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          animate={{ pathLength: [0.5, 1, 0.5], opacity: [0.3, 0.85, 0.3], y: [0, 2, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />

        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.cx}
            cy={particle.cy}
            r={particle.radius}
            fill="url(#solar-particle-gradient)"
            animate={{
              cx: [particle.cx, particle.cx + 8, particle.cx + 18],
              cy: [particle.cy, particle.cy - 5, particle.cy + 3],
              opacity: [0, 1, 0],
              scale: [0.65, 1.15, 0.75],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>
    </div>
  );
}
