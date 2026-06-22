import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * ConfidenceBar
 * @param {number} value - 0 to 100
 */
export default function ConfidenceBar({ value }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/5">
      <motion.div
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg, #7c4dff, #00e5ff)',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
      />
    </div>
  )
}
