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
    scale: 0.97,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
}

const up = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
}

const PILLS = [
  { label: 'Political Bias',  color: '#a78bfa', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.28)',  delay: 0.6 },
  { label: 'Gender Bias',     color: '#67e8f9', bg: 'rgba(34,211,238,0.10)',  border: 'rgba(34,211,238,0.26)',  delay: 0.75 },
  { label: 'Racial Bias',     color: '#c4b5fd', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.24)', delay: 0.9 },
]

export default function LandingPage({ onStart }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-8"
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Eyebrow */}
      <motion.div variants={up} className="flex items-center gap-3 mb-8">
        <span className="block h-px w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(178,102,255,0.5))' }} />
        <span className="font-mono text-[10px] tracking-[5px] uppercase select-none"
          style={{ color: 'rgba(178,102,255,0.55)' }}>
          AI · Language Analysis
        </span>
        <span className="block h-px w-10" style={{ background: 'linear-gradient(to left, transparent, rgba(88,230,255,0.5))' }} />
      </motion.div>

      {/* ── Hero title with ambient glow behind it ── */}
      <motion.div variants={up} className="relative flex items-center justify-center mb-6 select-none">
        {/* Radial glow blob sitting behind the title */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '140%',
            height: '260%',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse at center, rgba(178,102,255,0.18) 0%, rgba(88,230,255,0.06) 45%, transparent 70%)',
            filter: 'blur(2px)',
          }}
        />
        <h1
          className="relative font-mono font-normal text-center leading-none title-glow"
          style={{
            fontSize: 'clamp(4.5rem, 11vw, 10rem)',
            color: '#dde1f0',
            letterSpacing: '-3px',
          }}
        >
          Bias&#8209;Detector
        </h1>
      </motion.div>

      {/* Thin divider */}
      <motion.div
        variants={up}
        className="mb-8"
        style={{
          width: 1,
          height: 48,
          background: 'linear-gradient(to bottom, rgba(178,102,255,0.55), rgba(88,230,255,0.18), transparent)',
        }}
      />

      {/* Subtitle */}
      <motion.p
        variants={up}
        className="font-sans text-center mb-10 font-light"
        style={{
          maxWidth: 520,
          fontSize: 'clamp(1rem, 1.8vw, 1.18rem)',
          color: 'rgba(170,178,210,0.72)',
          letterSpacing: '0.015em',
          lineHeight: 1.9,
        }}
      >
        Detect political, gender, and racial bias in articles,
        statements, or job descriptions — powered by machine learning.
      </motion.p>

      {/* Bias category pills */}
      <motion.div
        variants={up}
        className="flex items-center gap-3 mb-12 flex-wrap justify-center"
      >
        {PILLS.map((pill) => (
          <motion.span
            key={pill.label}
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: pill.delay, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono select-none"
            style={{
              fontSize: '0.72rem',
              letterSpacing: '2px',
              padding: '8px 18px',
              borderRadius: 999,
              background: pill.bg,
              border: `1px solid ${pill.border}`,
              color: pill.color,
            }}
          >
            {pill.label}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div variants={up}>
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative font-mono uppercase text-white rounded-full"
          style={{
            fontSize: '0.82rem',
            letterSpacing: '3px',
            padding: '20px 64px',
            background: 'linear-gradient(135deg, rgba(178,102,255,0.22) 0%, rgba(88,230,255,0.12) 100%)',
            border: '1px solid rgba(178,102,255,0.48)',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 0 48px rgba(178,102,255,0.18), 0 0 80px rgba(88,230,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)',
            transition: 'border-color 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(178,102,255,0.75)'
            e.currentTarget.style.boxShadow = '0 0 72px rgba(178,102,255,0.35), 0 0 120px rgba(88,230,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(178,102,255,0.48)'
            e.currentTarget.style.boxShadow = '0 0 48px rgba(178,102,255,0.18), 0 0 80px rgba(88,230,255,0.06), inset 0 1px 0 rgba(255,255,255,0.07)'
          }}
        >
          Start Analysis
        </motion.button>
      </motion.div>

      {/* Bobbing chevron */}
      <motion.button
        variants={up}
        onClick={onStart}
        aria-label="Begin"
        className="flex flex-col items-center gap-0 mt-14"
        style={{ opacity: 0.28, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.55')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.28')}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ marginTop: -12 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.button>
    </motion.div>
  )
}
