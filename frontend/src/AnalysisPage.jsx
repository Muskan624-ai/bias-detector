import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CTAButton } from './LandingPage'

const pv = {
  hidden: { opacity: 0, y: 30 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1], staggerChildren: 0.13 } },
  exit:  { opacity: 0, y: -18, transition: { duration: 0.35, ease: [0.4,0,0.2,1] } },
}
const ch = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22,1,0.36,1] } },
}

export default function AnalysisPage({ onAnalyze, error, onClearError }) {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => ref.current?.focus(), 300)
    return () => clearTimeout(t)
  }, [])

  const handleAnalyze = async () => {
    if (!text.trim() || loading) return
    onClearError?.()
    setLoading(true)
    try { await onAnalyze(text.trim()) }
    finally { setLoading(false) }
  }

  const handleKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAnalyze() }
  const canGo = text.trim().length > 0 && !loading

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ padding: '16px 5vw 32px' }} // Reduced top padding to move Title/Subtitle up
      variants={pv} initial="hidden" animate="show" exit="exit"
    >
      {/* Page header */}
      <motion.div variants={ch} style={{ textAlign: 'center', marginBottom: 16 }}> {/* Reduced gap under header */}
        <h1 style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 'clamp(18px, 2vw, 30px)',
          fontWeight: 400,
          color: 'rgba(210,218,240,0.65)',
          letterSpacing: '-0.5px',
          marginBottom: 8,
        }}>
          Bias&#8209;Detector
        </h1>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: 'rgba(140,152,190,0.5)',
          letterSpacing: '1px',
        }}>
          AI-powered language bias analysis workspace
        </p>
      </motion.div>

      {/* ── Main workspace card (Analysis Box) ── */}
      <motion.div 
        variants={ch} 
        style={{ 
          width: '100%', 
          maxWidth: 'min(1050px, 88vw)',
          marginTop: 32 // Added margin top to move the analysis box down
        }}
      >
        {/* Workspace panel */}
        <div
          className={focused ? 'textarea-focus-glow' : ''}
          style={{
            position: 'relative',
            borderRadius: 16,
            background: 'rgba(12,16,38,0.82)',
            border: error
              ? '1px solid rgba(220,70,70,0.5)'
              : focused
              ? '1px solid rgba(178,102,255,0.45)'
              : '1px solid rgba(178,102,255,0.2)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.055)',
            transition: 'border-color 0.3s',
          }}
        >
          {/* Top shimmer strip */}
          <div style={{
            position: 'absolute', top: 0, left: 40, right: 40, height: 1, pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent, rgba(178,102,255,0.35), rgba(88,230,255,0.25), transparent)',
          }} />

          {/* Workspace header bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '22px 36px 20px',
            borderBottom: '1px solid rgba(178,102,255,0.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Traffic-light dots */}
              {['rgba(255,95,87,0.55)', 'rgba(255,189,46,0.45)', 'rgba(40,200,100,0.5)'].map((c, i) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />
              ))}
            </div>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 16,
              letterSpacing: '3px',
              color: 'rgba(130,145,185,0.4)',
              textTransform: 'uppercase',
            }}>
              Input · Bias Analysis
            </span>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              color: 'rgba(100,115,160,0.4)',
              letterSpacing: '1px',
            }}>
              {text.length > 0 ? `${text.length.toLocaleString()} chars` : ''}
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={ref}
            value={text}
            onChange={e => { setText(e.target.value); onClearError?.() }}
            onKeyDown={handleKey}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            placeholder="Paste any article, job description, or statement to detect bias…"
            style={{
              width: '100%',
              height: 'clamp(240px, 32vh, 380px)',
              background: 'transparent',
              border: 'none',
              padding: '20px 24px',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(14px, 1.1vw, 16px)',
              fontWeight: 300,
              lineHeight: 1.85,
              color: 'rgba(210,220,245,0.9)',
              caretColor: '#B266FF',
            }}
          />

          {/* Footer bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 28px 14px',
            borderTop: '1px solid rgba(178,102,255,0.08)',
          }}>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14,
              letterSpacing: '2.5px',
              color: 'rgba(110,125,170,0.38)',
              textTransform: 'uppercase',
            }}>
              Ctrl + Enter to analyze
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: focused ? '#B266FF' : 'rgba(120,130,170,0.3)', boxShadow: focused ? '0 0 10px #B266FF' : 'none', transition: 'all 0.3s' }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, color: 'rgba(110,125,170,0.4)', letterSpacing: '1.5px' }}>
                {focused ? 'EDITING' : 'IDLE'}
              </span>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: 14, padding: '14px 24px', borderRadius: 14, textAlign: 'center',
              fontFamily: "'Inter', sans-serif", fontSize: 14,
              background: 'rgba(220,60,60,0.1)', border: '1px solid rgba(220,60,60,0.25)',
              color: 'rgba(255,140,140,0.9)',
            }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>

      {/* CTA (Analyze Button) */}
      <motion.div variants={ch} style={{ marginTop: 40 }}> {/* Increased layout gap to move button down */}
        <CTAButton onClick={handleAnalyze} disabled={!canGo} loading={loading}>
          {loading ? 'Analyzing…' : 'Analyze Bias'}
        </CTAButton>
      </motion.div>
    </motion.div>
  )
}
