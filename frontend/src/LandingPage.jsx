import React from 'react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
}

export default function LandingPage({ onStart }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Eyebrow */}
      <motion.p
        variants={item}
        className="mb-4 text-[11px] tracking-[4px] uppercase text-purple-soft/50 font-mono"
      >
        AI · Language Analysis
      </motion.p>

      {/* Title */}
      <motion.h1
        variants={item}
        className="font-mono text-[clamp(4rem,8vw,7rem)] font-normal text-slate-300 tracking-tight text-center leading-tight mb-6"
        style={{ textShadow: '0 0 80px rgba(124,77,255,0.25)' }}
      >
        Bias&#8209;Detector
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={item}
        className="font-sans text-[clamp(0.9rem,1.8vw,1.1rem)] text-slate-500 text-center max-w-xl leading-relaxed font-light mb-14"
      >
        Detect political, gender, and racial bias in articles,
        statements, or job descriptions.
      </motion.p>

      {/* CTA */}
      <motion.div variants={item}>
        <button
          onClick={onStart}
          className="group relative font-mono text-sm tracking-widest text-white px-10 py-4 rounded-full border border-purple-glow/40 bg-purple-glow/10 backdrop-blur-sm transition-all duration-300 hover:border-purple-glow/70 hover:bg-purple-glow/20 hover:shadow-[0_0_40px_rgba(124,77,255,0.3)] active:scale-95"
        >
          <span className="relative z-10">Start Analysis</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-glow/0 via-purple-glow/10 to-cyan-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
      </motion.div>

      {/* Chevron scroll hint */}
      <motion.div
        variants={item}
        className="mt-12 cursor-pointer text-slate-700 animate-bob"
        onClick={onStart}
        aria-label="Start analysis"
      >
        <ChevronDouble />
      </motion.div>
    </motion.div>
  )
}

function ChevronDouble() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M6 9l6 6 6-6" />
      <path d="M6 4l6 6 6-6" opacity="0.35" />
    </svg>
  )
}
