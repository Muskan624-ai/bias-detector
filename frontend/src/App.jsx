import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import LobeCanvas from './components/LobeCanvas'
import LandingPage from './components/LandingPage'
import AnalysisPage from './components/AnalysisPage'
import ResultsPage from './components/ResultsPage'
import { analyzeText } from './api/biasApi'

export default function App() {
  const [page, setPage]         = useState('landing')
  const [closing, setClosing]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState(null)

  const withTransition = useCallback((cb) => {
    setClosing(true)
    setTimeout(() => { cb(); setTimeout(() => setClosing(false), 600) }, 700)
  }, [])

  const goToAnalysis = useCallback(() => {
    withTransition(() => setPage('analysis'))
  }, [withTransition])

  const handleAnalyze = useCallback(async (text) => {
    setError(null)
    withTransition(async () => {
      setPage('loading')
      try {
        const data = await analyzeText(text)
        setResult(data)
        setTimeout(() => {
          setClosing(true)
          setTimeout(() => { setPage('results'); setTimeout(() => setClosing(false), 600) }, 700)
        }, 400)
      } catch (err) {
        setError(err.message || 'Analysis failed. Please try again.')
        setClosing(true)
        setTimeout(() => { setPage('analysis'); setTimeout(() => setClosing(false), 600) }, 700)
      }
    })
  }, [withTransition])

  const goBack = useCallback(() => {
    withTransition(() => { setResult(null); setError(null); setPage('analysis') })
  }, [withTransition])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#05080f' }}>
      <LobeCanvas closing={closing} />
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        <AnimatePresence mode="wait">
          {page === 'landing'  && <LandingPage  key="landing"  onStart={goToAnalysis} />}
          {page === 'analysis' && <AnalysisPage key="analysis" onAnalyze={handleAnalyze} error={error} onClearError={() => setError(null)} />}
          {page === 'loading'  && <LoadingPage  key="loading" />}
          {page === 'results' && result && <ResultsPage key="results" result={result} onBack={goBack} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Premium Loading Page ─────────────────────────────────────────────────────
const MSGS = [
  'Analyzing text…',
  'Detecting bias patterns…',
  'Evaluating linguistic drivers…',
  'Generating report…',
]

function LoadingPage() {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setShow(false)
      setTimeout(() => { setIdx(i => (i + 1) % MSGS.length); setShow(true) }, 360)
    }, 2200)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Concentric spinning rings */}
      <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 44 }}>
        <div className="spin-cw"  style={{ position: 'absolute', inset: 0,  borderRadius: '50%', border: '1px solid rgba(178,102,255,0.22)' }} />
        <div className="spin-ccw" style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '1px solid rgba(88,230,255,0.28)' }} />
        <div className="spin-fast"style={{ position: 'absolute', inset: 28, borderRadius: '50%', border: '1.5px solid transparent', borderTopColor: '#B266FF', borderRightColor: 'rgba(178,102,255,0.3)' }} />
        {/* Core */}
        <div style={{
          position: 'absolute', inset: 40, borderRadius: '50%',
          background: '#B266FF',
          boxShadow: '0 0 20px 6px rgba(178,102,255,0.55)',
          animation: 'nodePulse 1.8s ease-in-out infinite',
        }} />
      </div>

      {/* Cycling message */}
      <motion.p
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : -7 }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(178,102,255,0.8)',
          minHeight: '1.4em',
          textAlign: 'center',
        }}
      >
        {MSGS[idx]}
      </motion.p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
        {[0,1,2,3].map(i => (
          <motion.div
            key={i}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(178,102,255,0.38)' }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.2, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
