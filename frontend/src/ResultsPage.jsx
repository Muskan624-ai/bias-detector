import React from 'react'
import { motion } from 'framer-motion'
import ConfidenceBar from './ConfidenceBar'

const pageVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.11, delayChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
  },
}

const row = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
}

export default function ResultsPage({ result, onBack }) {
  const { is_biased, confidence, label, explanation } = result
  const confNum = parseFloat(confidence) || 0

  const accentPurple = '#B266FF'
  const accentCyan   = '#58E6FF'
  const accent       = is_biased ? accentPurple : accentCyan

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-start results-scroll"
      style={{ overflowY: 'auto', padding: '28px 24px 40px' }}
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Page title */}
      <motion.h1
        variants={row}
        className="font-mono text-center tracking-tight mb-7 shrink-0 select-none"
        style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', color: 'rgba(200,210,230,0.5)' }}
      >
        Bias&#8209;Detector
      </motion.h1>

      {/* ── Main panel ── */}
      <div className="w-full flex flex-col gap-4 shrink-0" style={{ maxWidth: 'min(900px, 93vw)' }}>

        {/* ── Row 1: status strip (two pills side-by-side) ── */}
        <motion.div variants={row} className="grid grid-cols-2 gap-3">
          {/* Analysis Complete */}
          <div
            className="flex items-center justify-center gap-2.5 rounded-2xl font-mono tracking-widest"
            style={{
              padding: '16px 20px',
              fontSize: '0.8rem',
              background: 'rgba(50,140,80,0.13)',
              border: '1px solid rgba(60,160,90,0.3)',
              color: '#6dcea0',
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: '#4caf77', boxShadow: '0 0 8px #4caf77' }}
            />
            Analysis Complete
          </div>

          {/* Bias / Neutral badge */}
          <div
            className="flex items-center justify-center gap-2.5 rounded-2xl font-mono tracking-widest"
            style={{
              padding: '16px 20px',
              fontSize: '0.8rem',
              background: is_biased ? 'rgba(170,50,50,0.15)' : 'rgba(40,120,190,0.13)',
              border: is_biased ? '1px solid rgba(200,60,60,0.32)' : '1px solid rgba(60,150,220,0.28)',
              color: is_biased ? '#f08888' : '#7acbf0',
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                background: is_biased ? '#e06060' : '#50aadd',
                boxShadow: is_biased ? '0 0 8px #e06060' : '0 0 8px #50aadd',
              }}
            />
            {is_biased ? 'Bias Detected' : 'Neutral Content'}
          </div>
        </motion.div>

        {/* ── Row 2: Bias Type — primary hero card ── */}
        <motion.div variants={row}>
          <div
            className="rounded-2xl"
            style={{
              padding: '32px 40px',
              background: `linear-gradient(135deg, rgba(20,12,42,0.88) 0%, rgba(14,20,50,0.82) 100%)`,
              border: `1px solid ${accent}28`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: `0 0 80px ${accent}0e, inset 0 1px 0 rgba(255,255,255,0.055)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient corner glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: -60, right: -60,
                width: 200, height: 200,
                background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
              }}
            />

            <p
              className="font-mono mb-4"
              style={{ fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(140,150,185,0.55)', textTransform: 'uppercase' }}
            >
              Bias Type
            </p>

            <div className="flex items-center gap-5">
              {/* Accent bar */}
              <div
                className="rounded-full shrink-0"
                style={{
                  width: 4,
                  height: 52,
                  background: is_biased
                    ? `linear-gradient(to bottom, ${accentPurple}, ${accentCyan})`
                    : `linear-gradient(to bottom, ${accentCyan}, #3AB8FF)`,
                  boxShadow: `0 0 16px ${accent}55`,
                }}
              />
              <span
                className="font-mono leading-tight"
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 3rem)',
                  color: is_biased ? '#d0a8ff' : '#80ecff',
                  letterSpacing: '-0.5px',
                  textShadow: `0 0 40px ${accent}44`,
                }}
              >
                {label || '—'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Row 3: Explanation — largest card, primary text ── */}
        <motion.div variants={row}>
          <div
            className="rounded-2xl"
            style={{
              padding: '28px 40px',
              background: 'rgba(16,20,48,0.70)',
              border: '1px solid rgba(110,125,200,0.13)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            <p
              className="font-mono mb-4"
              style={{ fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(140,150,185,0.5)', textTransform: 'uppercase' }}
            >
              Explanation
            </p>
            <p
              className="font-sans leading-[1.95]"
              style={{
                fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
                color: 'rgba(192,200,228,0.85)',
                fontWeight: 300,
              }}
            >
              {explanation || 'No explanation available.'}
            </p>
          </div>
        </motion.div>

        {/* ── Row 4: Confidence — secondary card ── */}
        <motion.div variants={row}>
          <div
            className="rounded-2xl"
            style={{
              padding: '24px 40px',
              background: 'rgba(14,18,44,0.65)',
              border: '1px solid rgba(100,115,190,0.12)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035)',
            }}
          >
            <p
              className="font-mono mb-4"
              style={{ fontSize: '10px', letterSpacing: '3.5px', color: 'rgba(140,150,185,0.45)', textTransform: 'uppercase' }}
            >
              Confidence
            </p>
            <div className="flex items-center gap-6">
              <span
                className="font-mono shrink-0"
                style={{
                  fontSize: 'clamp(1.5rem, 2.8vw, 2rem)',
                  color: 'rgba(215,222,242,0.88)',
                  letterSpacing: '-0.5px',
                  minWidth: '6rem',
                }}
              >
                {confidence || '—'}
              </span>
              <div className="flex-1">
                <ConfidenceBar value={confNum} accent={accent} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Back button ── */}
        <motion.div variants={row} className="flex justify-center pt-2 pb-2">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="font-mono uppercase rounded-full"
            style={{
              fontSize: '0.7rem',
              letterSpacing: '3px',
              padding: '14px 38px',
              color: 'rgba(155,165,200,0.55)',
              border: '1px solid rgba(130,140,185,0.16)',
              background: 'transparent',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(178,102,255,0.38)'
              e.currentTarget.style.color = 'rgba(178,102,255,0.8)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(130,140,185,0.16)'
              e.currentTarget.style.color = 'rgba(155,165,200,0.55)'
            }}
          >
            ← New Analysis
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
