import React from 'react'
import { motion } from 'framer-motion'

export default function BiasBadge({ isBiased }) {
  const config = isBiased
    ? {
        label: '⚠  Bias Detected',
        bg: 'rgba(180, 60, 60, 0.18)',
        border: 'rgba(200, 70, 70, 0.38)',
        color: '#f08080',
      }
    : {
        label: '✓  Neutral Content',
        bg: 'rgba(60, 130, 200, 0.18)',
        border: 'rgba(80, 150, 210, 0.38)',
        color: '#7ab8f0',
      }

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full py-3 px-5 rounded-full text-center font-mono text-sm tracking-widest"
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
      }}
    >
      {config.label}
    </motion.div>
  )
}
