import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LobeCanvas from './components/LobeCanvas'
import LandingPage from './components/LandingPage'
import AnalysisPage from './components/AnalysisPage'
import ResultsPage from './components/ResultsPage'
import { analyzeText } from './api/biasApi'

export default function App() {
  const [page, setPage] = useState('landing')
  const [lobeClosing, setLobeClosing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const withLobeTransition = useCallback((cb) => {
    setLobeClosing(true)
    setTimeout(() => {
      cb()
      setTimeout(() => setLobeClosing(false), 600)
    }, 700)
  }, [])

  const goToAnalysis = useCallback(() => {
    withLobeTransition(() => setPage('analysis'))
  }, [withLobeTransition])

  const handleAnalyze = useCallback(async (text) => {
    setError(null)
    withLobeTransition(async () => {
      setPage('loading')
      try {
        const data = await analyzeText(text)
        setResult(data)
        setTimeout(() => {
          setLobeClosing(true)
          setTimeout(() => {
            setPage('results')
            setTimeout(() => setLobeClosing(false), 600)
          }, 700)
        }, 400)
      } catch (err) {
        setError(err.message || 'Analysis failed. Please try again.')
        setLobeClosing(true)
        setTimeout(() => {
          setPage('analysis')
          setTimeout(() => setLobeClosing(false), 600)
        }, 700)
      }
    })
  }, [withLobeTransition])

  const goBackToAnalysis = useCallback(() => {
    withLobeTransition(() => {
      setResult(null)
      setError(null)
      setPage('analysis')
    })
  }, [withLobeTransition])

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#060912' }}>
      <LobeCanvas closing={lobeClosing} />
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {page === 'landing' && <LandingPage key="landing" onStart={goToAnalysis} />}
          {page === 'analysis' && (
            <AnalysisPage
              key="analysis"
              onAnalyze={handleAnalyze}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
          {page === 'loading' && <LoadingPage key="loading" />}
          {page === 'results' && result && (
            <ResultsPage key="results" result={result} onBack={goBackToAnalysis} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Premium loading screen ────────────────────────────────────────────────────
const LOADING_MESSAGES = [
  'Analyzing text…',
  'Detecting bias patterns…',
  'Evaluating linguistic drivers…',
  'Generating results…',
]

function LoadingPage() {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length)
        setVisible(true)
      }, 350)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
      {/* Orb */}
      <div className="relative mb-10" style={{ width: 80, height: 80 }}>
        {/* Outer slow ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: '1px solid rgba(178,102,255,0.2)',
            animation: 'spin 3s linear infinite',
          }}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 10,
            border: '1px solid rgba(88,230,255,0.25)',
            animation: 'spin 2s linear infinite reverse',
          }}
        />
        {/* Inner fast ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 22,
            border: '1.5px solid rgba(178,102,255,0.5)',
            borderTopColor: '#B266FF',
            animation: 'spin 0.75s linear infinite',
          }}
        />
        {/* Core glow dot */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 32,
            background: '#B266FF',
            boxShadow: '0 0 16px 4px rgba(178,102,255,0.6)',
            animation: 'pulse 1.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* Cycling message */}
      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -6 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="font-mono text-center select-none"
        style={{
          fontSize: '0.8rem',
          letterSpacing: '2.5px',
          color: 'rgba(178,102,255,0.75)',
          textTransform: 'uppercase',
          minHeight: '1.4em',
        }}
      >
        {LOADING_MESSAGES[msgIndex]}
      </motion.p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-5">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="rounded-full"
            style={{ width: 5, height: 5, background: 'rgba(178,102,255,0.4)' }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
