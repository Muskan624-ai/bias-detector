import React from "react";
import { motion } from "framer-motion";
import ConfidenceBar from "./ConfidenceBar";

const pv = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.36, ease: [0.4, 0, 0.2, 1] },
  },
};
const row = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Shared card shell ────────────────────────────────────────────────────────
function Card({ children, style = {}, glowColor }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16, // Synced to Analysis Workspace radius
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 32,
          right: 32,
          height: 1,
          pointerEvents: "none",
          background: glowColor
            ? `linear-gradient(90deg, transparent, ${glowColor}44, transparent)`
            : "linear-gradient(90deg, transparent, rgba(178,102,255,0.2), transparent)",
        }}
      />
      {children}
    </div>
  );
}

// ── Label ────────────────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <p
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12, // Shrunk label text size
        letterSpacing: "4px",
        textTransform: "uppercase",
        color: "rgba(140,155,195,0.5)",
        marginBottom: 14, // Tighter element spacing inside cards
      }}
    >
      {children}
    </p>
  );
}

export default function ResultsPage({ result, onBack }) {
  const { is_biased, confidence, label, explanation } = result;
  const confNum = parseFloat(confidence) || 0;
  const accent = is_biased ? "#B266FF" : "#58E6FF";
  const accent2 = is_biased ? "#58E6FF" : "#3AB8FF";

  return (
    <motion.div
      className="page-scroll"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 5vw 40px", // Compressed top/bottom page padding
        overflowY: "auto",
      }}
      variants={pv}
      initial="hidden"
      animate="show"
      exit="exit"
    >
      {/* Page header */}
      <motion.div
        variants={row}
        style={{ textAlign: "center", marginBottom: 36 }} // Compact header spacing
      >
        <h1
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(18px, 2vw, 30px)", // Synced to Analysis page title scale
            fontWeight: 400,
            color: "rgba(200,210,235,0.55)",
            letterSpacing: "-0.5px",
            marginBottom: 6,
          }}
        >
          Bias&#8209;Detector
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11, // Synced to Analysis page subtitle scale
            color: "rgba(130,145,185,0.4)",
            letterSpacing: "2px",
          }}
        >
          Analysis Report
        </p>
      </motion.div>

      {/* ── Panel ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "min(900px, 82vw)", // Fixed edge-to-edge blowouts with updated width boundaries
          display: "flex",
          flexDirection: "column",
          gap: 12, // Reduced section layout spacing from 24px
        }}
      >
        {/* ── Status row ── */}
        <motion.div
          variants={row}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {/* Analysis complete */}
          <Card
            style={{
              background: "rgba(40,120,70,0.12)",
              border: "1px solid rgba(55,160,85,0.28)",
              padding: "20px 28px", // Clean status box sizing
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4fc87a",
                  boxShadow: "0 0 10px #4fc87a",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  letterSpacing: "1.5px",
                  color: "#6dcea0",
                }}
              >
                Analysis Complete
              </span>
            </div>
          </Card>
          {/* Biased / Neutral */}
          <Card
            style={{
              background: is_biased
                ? "rgba(160,45,45,0.14)"
                : "rgba(35,110,180,0.12)",
              border: is_biased
                ? "1px solid rgba(200,55,55,0.3)"
                : "1px solid rgba(55,140,210,0.28)",
              padding: "20px 28px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: is_biased ? "#e06060" : "#50aadd",
                  boxShadow: is_biased
                    ? "0 0 10px #e06060"
                    : "0 0 10px #50aadd",
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 14,
                  letterSpacing: "1.5px",
                  color: is_biased ? "#f08888" : "#7acbf0",
                }}
              >
                {is_biased ? "Bias Detected" : "Neutral Content"}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* ── BIAS TYPE — Hero card ── */}
        <motion.div variants={row}>
          <Card
            glowColor={accent}
            style={{
              padding: "28px 32px", // Reduced text box boundaries
              background: `linear-gradient(135deg, rgba(16,10,36,0.92) 0%, rgba(10,16,44,0.88) 100%)`,
              border: `1px solid ${accent}30`,
              boxShadow: `0 0 100px ${accent}0d, 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Corner glow */}
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -80,
                width: 260,
                height: 260,
                pointerEvents: "none",
                background: `radial-gradient(circle, ${accent}1a 0%, transparent 68%)`,
              }}
            />

            <Label>Bias Type</Label>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 4,
                  flexShrink: 0,
                  height: 36, // Scaled down structural line
                  borderRadius: 999,
                  background: `linear-gradient(to bottom, ${accent}, ${accent2})`,
                  boxShadow: `0 0 20px ${accent}66`,
                }}
              />
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "clamp(20px, 2.2vw, 30px)", // Scaled down primary label text
                  fontWeight: 400,
                  lineHeight: 1.1,
                  color: is_biased ? "#d4aaff" : "#86f0ff",
                  letterSpacing: "-0.5px",
                  textShadow: `0 0 60px ${accent}55`,
                }}
              >
                {label || "—"}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* ── EXPLANATION — Large body card ── */}
        <motion.div variants={row}>
          <Card
            style={{
              padding: "24px 30px", // Shrunk vertical card breathing room
              background: "rgba(13,17,44,0.78)",
              border: "1px solid rgba(110,128,205,0.15)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.04), 0 30px 70px rgba(0,0,0,0.4)",
            }}
          >
            <Label>Explanation</Label>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(13px, 1.1vw, 15px)", // Balanced paragraph text
                fontWeight: 300,
                lineHeight: 1.5, // Tighter line layout
                color: "rgba(198,208,238,0.88)",
              }}
            >
              {explanation || "No explanation available."}
            </p>
          </Card>
        </motion.div>

        {/* ── CONFIDENCE — Secondary card ── */}
        <motion.div variants={row}>
          <Card
            style={{
              padding: "22px 30px", // Scaled down panel padding
              background: "rgba(11,15,40,0.72)",
              border: "1px solid rgba(100,118,198,0.12)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.035), 0 24px 60px rgba(0,0,0,0.38)",
            }}
          >
            <Label>Confidence Score</Label>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "clamp(16px, 1.6vw, 22px)", // Tightened score readout
                  fontWeight: 400,
                  letterSpacing: "-0.5px",
                  color: "rgba(218,226,248,0.9)",
                  minWidth: 70,
                  flexShrink: 0,
                }}
              >
                {confidence || "—"}
              </span>
              <div style={{ flex: 1 }}>
                <ConfidenceBar value={confNum} accent={accent} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                  }}
                >
                  {["0%", "50%", "100%"].map((percent) => (
                    <span
                      key={percent}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 9,
                        color: "rgba(110,125,170,0.4)",
                        letterSpacing: "1px",
                      }}
                    >
                      {percent}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ── Back button ── */}
        <motion.div
          variants={row}
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 24, // Balanced spacing below dashboard card stacks
            paddingBottom: 16,
          }}
        >
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 14, // Aligned directly to production dashboard inputs
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#d4aaff",
              padding: "12px 38px", // Balanced CTA boundary widths
              borderRadius: 999,
              border: "1px solid rgba(178,102,255,0.45)",
              background:
                "linear-gradient(135deg, rgba(178,102,255,0.12), rgba(88,230,255,0.08))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 0 60px rgba(178,102,255,0.35)",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(178,102,255,0.8)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(178,102,255,0.45)";
              e.currentTarget.style.color = "#d4aaff";
            }}
          >
            ← New Analysis
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
