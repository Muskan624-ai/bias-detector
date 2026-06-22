import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ConfidenceBar from './ConfidenceBar'
import BiasBadge from './BiasBadge'

const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
}

export default function ResultsPage({ result, onBack }) {
  const { is_biased, confidence, label, explanation } = result

  // Parse numeric confidence value (e.g. "96.45%" → 96.45)
  const confNum = parseFloat(confidence) || 0

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Title */}
      <motion.h1
        variants={rowVariants}
        className="font-mono text-[clamp(1.4rem,3vw,2rem)] text-slate-400 tracking-tight text-center mb-6"
      >
        Bias&#8209;Detector
      </motion.h1>

      {/* Results panel */}
      <div className="w-full max-w-[900px] flex flex-col gap-5 results-scroll">

        {/* Analysis Complete badge */}
        <motion.div variants={rowVariants}>
          <StatusBadge variant="complete" label="Analysis Complete" />
        </motion.div>

        {/* Bias detected / Neutral */}
        <motion.div variants={rowVariants}>
          <BiasBadge isBiased={is_biased} />
        </motion.div>

        {/* Bias Type */}
        <motion.div variants={rowVariants}>
          <ResultCard label="Bias Type">
            <span className="font-mono text-[1.3rem] text-indigo-300 leading-tight">
              {label || '—'}
            </span>
          </ResultCard>
        </motion.div>

        {/* Confidence */}
        <motion.div variants={rowVariants}>
          <ResultCard label="Confidence">
            <div className="flex items-center gap-4 mt-1">
              <span className="font-mono text-lg text-slate-300 w-16 shrink-0">
                {confidence || '—'}
              </span>
              <ConfidenceBar value={confNum} />
            </div>
          </ResultCard>
        </motion.div>

        {/* Explanation */}
        <motion.div variants={rowVariants}>
          <ResultCard label="Explanation">
            <p className="text-[0.9rem] text-slate-400 leading-relaxed font-sans font-light">
              {explanation || 'No explanation available.'}
            </p>
          </ResultCard>
        </motion.div>
      </div>

      {/* Back button */}
      <motion.div variants={rowVariants} className="mt-5">
        <button
          onClick={onBack}
          className="font-mono text-xs tracking-widest text-slate-500 px-7 py-3 rounded-full border border-slate-700/50 bg-transparent hover:border-slate-600 hover:text-slate-400 transition-all duration-300 active:scale-95"
        >
          ← New Analysis
        </button>
      </motion.div>
    </motion.div>
  )
}

// Generic result card container
function ResultCard({ label, children }) {
  return (
    <div
      className="rounded-2xl px-6 py-4"
      style={{
        background: 'rgba(20, 28, 60, 0.50)',
        border: '1px solid rgba(100, 120, 200, 0.14)',
        backdropFilter: 'blur(22px)',
        boxShadow: '0 0 40px rgba(100,120,255,0.08)',
      }}
    >
      <p className="text-[10px] tracking-[2.5px] uppercase text-slate-600 font-mono mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}

// Status badge pill
function StatusBadge({ label }) {
  return (
    <div
      className="w-full py-3 px-5 rounded-full text-center font-mono text-sm tracking-widest"
      style={{
        background: 'rgba(70, 160, 100, 0.18)',
        border: '1px solid rgba(70, 160, 100, 0.35)',
        color: '#7dd4a0',
      }}
    >
      {label}
    </div>
  )
}
