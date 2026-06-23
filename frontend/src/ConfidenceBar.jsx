import React from 'react'
import { motion } from 'framer-motion'

export default function ConfidenceBar({ value, accent = '#58E6FF' }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div style={{
      width: '100%', height: 6, borderRadius: 999,
      background: 'rgba(255,255,255,0.06)',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.4)',
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.4, ease: [0.4,0,0.2,1], delay: 0.2 }}
        style={{
          height: '100%',
          borderRadius: 999,
          background: `linear-gradient(90deg, #7c4dff, ${accent})`,
          boxShadow: `0 0 14px ${accent}66`,
        }}
      />
    </div>
  )
}
