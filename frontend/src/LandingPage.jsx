import React from 'react'
import { motion } from 'framer-motion'

const PILLS = [
  { label: 'Political Bias',  col: '#a78bfa', bg: 'rgba(139,92,246,0.13)',  border: 'rgba(139,92,246,0.3)',  delay: 0.7,  floatDur: 3.8 },
  { label: 'Gender Bias',     col: '#67e8f9', bg: 'rgba(34,211,238,0.11)',  border: 'rgba(34,211,238,0.28)', delay: 0.85, floatDur: 4.4 },
  { label: 'Racial Bias',     col: '#c4b5fd', bg: 'rgba(167,139,250,0.11)', border: 'rgba(167,139,250,0.26)',delay: 1.0,  floatDur: 3.2 },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.05 } },
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.4, ease: [0.4,0,0.2,1] } },
}
const up = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.22,1,0.36,1] } },
}

export default function LandingPage({ onStart }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ padding: '0 5vw' }}
      variants={container}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Eyebrow */}
     <motion.div variants={up} className="flex items-center gap-4 mb-24">
        <span style={{ width: 56, height: 1, background: 'linear-gradient(to right, transparent, rgba(178,102,255,0.6))' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, letterSpacing: '5px', color: 'rgba(178,102,255,0.6)', textTransform: 'uppercase' }}>
          AI · Language Analysis
        </span>
        <span style={{ width: 56, height: 1, background: 'linear-gradient(to left, transparent, rgba(88,230,255,0.6))' }} />
      </motion.div>

      {/* HERO TITLE */}
      <motion.div variants={up} style={{ position: 'relative', textAlign: 'center', marginBottom: 36 }}>
        {/* Deep glow behind title */}
        <div style={{
          position: 'absolute', inset: '-40% -20%',
          background: 'radial-gradient(ellipse at 50% 55%, rgba(178,102,255,0.22) 0%, rgba(88,230,255,0.08) 40%, transparent 70%)',
          filter: 'blur(4px)',
          pointerEvents: 'none',
        }} />
        <h1
          className="title-pulse"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 400,
            fontSize: 'clamp(56px, 8vw, 100px)',
            lineHeight: 1,
            letterSpacing: '-3px',
            color: '#e2e6f5',
            position: 'relative',
            textShadow:'0 0 30px rgba(178,102,255,0.35), 0 0 80px rgba(88,230,255,0.18)',
          }}
        >
          Bias&#8209;Detector
        </h1>
      </motion.div>

      {/* Thin vertical line */}
      <motion.div
        variants={up}
        style={{ width: 1, height: 52, marginBottom: 32, background: 'linear-gradient(to bottom, rgba(178,102,255,0.6), rgba(88,230,255,0.2), transparent)' }}
      />

      {/* Subtitle */}
      <motion.p
        variants={up}
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          fontSize: 'clamp(16px, 1.5vw, 22px)',
          lineHeight: 1.85,
          color: 'rgba(175,185,220,0.72)',
          textAlign: 'center',
          maxWidth: 700,
          marginBottom: 36,
          letterSpacing: '0.01em',
        }}
      >
        Detect political, gender, and racial bias in articles,
        statements, and job descriptions — powered by machine learning.
      </motion.p>

      {/* Floating bias pills */}
      <motion.div variants={up} style={{ display: 'flex', gap: 14, marginBottom: 38, flexWrap: 'wrap', justifyContent: 'center' }}>
        {PILLS.map((p) => (
          <motion.span
            key={p.label}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: p.delay, ease: [0.22,1,0.36,1] }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '20px',
              letterSpacing: '3px',
              padding: '14px 28px',
              borderRadius: '999px',
              background: p.bg,
              border: "1px solid rgba(139,92,246,0.3)",
              color: p.col,
              userSelect: 'none',
              animation: `pillFloat ${p.floatDur}s ease-in-out infinite`,
              animationDelay: `${p.delay * 0.5}s`,
              boxShadow: `0 0 20px ${p.col}22`,
            }}
          >
            {p.label}
          </motion.span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        variants={up}
        style={{ marginTop: 15 }}
      >
        <CTAButton onClick={onStart}>Start Analysis</CTAButton>
      </motion.div>

      {/* Chevron */}
      <motion.button
        onClick={onStart}
        aria-label="Begin"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3, y: [0, 8, 0] }}
        transition={{ opacity: { duration: 0.6, delay: 1.4 }, y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ marginTop: 90, background: 'none', border: 'none', cursor: 'pointer', color: '#6070a0', padding: 0 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.65')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '0.3')}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M6 9l6 6 6-6" />
        </svg>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ marginTop: -13, display: 'block' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.button>
    </motion.div>
  )
}

// ── Shared premium CTA button ────────────────────────────────────────────────
export function CTAButton({ onClick, children, disabled = false, loading = false }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.04 } : {}}
      whileTap={!disabled ? { scale: 0.96 } : {}}
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 20,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: disabled ? 'rgba(140,150,180,0.4)' : '#fff',
        padding: '20px 70px',
        borderRadius: 999,
        background: disabled
          ? 'rgba(60,65,90,0.1)'
          : 'linear-gradient(135deg, rgba(178,102,255,0.2) 0%, rgba(88,230,255,0.1) 100%)',
        border: disabled ? '1px solid rgba(100,110,140,0.18)' : '1px solid rgba(178,102,255,0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: disabled ? 'none' : '0 0 50px rgba(178,102,255,0.2), inset 0 1px 0 rgba(255,255,255,0.07)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.38 : 1,
        transition: 'border-color 0.28s, box-shadow 0.28s',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
      onMouseEnter={e => {
        if (disabled) return
        e.currentTarget.style.borderColor = 'rgba(178,102,255,0.8)'
        e.currentTarget.style.boxShadow = '0 0 80px rgba(178,102,255,0.38), 0 0 130px rgba(88,230,255,0.12), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
      onMouseLeave={e => {
        if (disabled) return
        e.currentTarget.style.borderColor = 'rgba(178,102,255,0.5)'
        e.currentTarget.style.boxShadow = '0 0 50px rgba(178,102,255,0.2), inset 0 1px 0 rgba(255,255,255,0.07)'
      }}
    >
      {loading && <SmallSpinner />}
      {children}
    </motion.button>
  )
}

function SmallSpinner() {
  return (
    <svg className="spin-fast" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
