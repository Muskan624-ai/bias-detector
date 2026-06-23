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
            <span className="font-mono text-[2rem] font-semibold text-indigo-200 leading-tight">
              {label || '—'}
            </span>
          </ResultCard>
        </motion.div>

        {/* Confidence */}
        <motion.div variants={rowVariants}>
          <ResultCard label="Confidence">
            <div className="flex items-center gap-4 mt-1">
              <span className="font-mono text-2xl font-semibold text-cyan-200 w-24 shrink-0">
                {confidence || '—'}
              </span>
              <ConfidenceBar value={confNum} />
            </div>
          </ResultCard>
        </motion.div>

        {/* Explanation */}
        <motion.div variants={rowVariants}>
          <ResultCard label="Explanation">
            <p className="text-[1.05rem] text-slate-300 leading-8 font-sans">
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
      className="rounded-3xl px-8 py-6"
      style={{
        background: 'rgba(20, 28, 60, 0.65)',
        border: '1px solid rgba(100, 120, 200, 0.14)',
        backdropFilter: 'blur(28px)',
        boxShadow: '0 0 60px rgba(120,100,255,0.12)',
      }}
    >
      <p className="text-xs tracking-[3px] uppercase text-slate-500 font-mono mb-3">
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
