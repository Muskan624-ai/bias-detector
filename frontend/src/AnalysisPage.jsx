import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const pageVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.12 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
}

export default function AnalysisPage({ onAnalyze, error, onClearError }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    // Focus textarea when page mounts
    setTimeout(() => textareaRef.current?.focus(), 300)
  }, [])

  const handleAnalyze = async () => {
    if (!text.trim()) return
    onClearError?.()
    setLoading(true)
    try {
      await onAnalyze(text.trim())
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAnalyze()
    }
  }

  const charCount = text.length

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Title */}
      <motion.h1
        variants={childVariants}
        className="font-mono text-[clamp(1.6rem,3.5vw,2.6rem)] text-slate-400 tracking-tight text-center mb-8"
      >
        Bias&#8209;Detector
      </motion.h1>

      {/* Textarea card */}
      <motion.div
        variants={childVariants}
        className="w-full max-w-[1100px]"
      >
        <div
          className="relative rounded-[20px] overflow-hidden"
          style={{
            background: 'rgba(20, 25, 55, 0.65)',
            border: error
              ? '1px solid rgba(220,80,80,0.4)'
              : '1px solid rgba(155, 110, 220, 0.20)',
            backdropFilter: 'blur(28px)',
            transition: 'border-color 0.3s',
          }}
        >
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => { setText(e.target.value); onClearError?.() }}
            onKeyDown={handleKeyDown}
            placeholder="Paste any article, job description, or statement to detect bias."
            className="w-full h-[450px] bg-transparent px-8 py-7 text-[1.05rem] text-slate-200 leading-relaxed font-sans focus:outline-none"
            style={{ caretColor: '#a07aff' }}
            disabled={loading}
          />

          {/* Char count */}
          {charCount > 0 && (
            <div className="absolute bottom-3 right-4 text-[11px] text-slate-600 font-mono select-none">
              {charCount.toLocaleString()} chars
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-400/80 font-sans text-center"
          >
            {error}
          </motion.p>
        )}

        {/* Hint */}
        <p className="mt-2 text-center text-[11px] text-slate-700 font-mono">
          Ctrl+Enter to analyze
        </p>
      </motion.div>

      {/* Analyze button */}
      <motion.div variants={childVariants} className="mt-6">
        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="group relative font-mono text-sm tracking-widest text-white px-10 py-4 rounded-full border border-purple-glow/40 bg-purple-glow/10 backdrop-blur-sm transition-all duration-300 hover:border-purple-glow/70 hover:bg-purple-glow/20 hover:shadow-[0_0_40px_rgba(124,77,255,0.35)] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-purple-glow/40 disabled:hover:bg-purple-glow/10 disabled:hover:shadow-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <SpinnerIcon />
              Analyzing…
            </span>
          ) : (
            'Analyze Bias'
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-glow/0 via-purple-glow/10 to-cyan-glow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </button>
      </motion.div>
    </motion.div>
  )
}

function SpinnerIcon() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
    </svg>
  )
}
