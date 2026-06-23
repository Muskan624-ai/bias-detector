import React from 'react'
import { motion } from 'framer-motion'

/**
 * ConfidenceBar
 * @param {number} value   - 0 to 100
 * @param {string} accent  - optional hex color for the gradient end
 */
export default function ConfidenceBar({ value, accent = '#00e5ff' }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{
        height: 5,
        background: 'rgba(255,255,255,0.05)',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.3)',
      }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, #7c4dff, ${accent})`,
          boxShadow: `0 0 10px ${accent}55`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.25 }}
      />
    </div>
  )
}
