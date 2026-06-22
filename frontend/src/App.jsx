import React, { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import LobeCanvas from "./LobeCanvas";
import LandingPage from "./LandingPage";
import AnalysisPage from "./AnalysisPage";
import ResultsPage from "./ResultsPage";
import { analyzeText } from "./biasApi";

// Pages: 'landing' | 'analysis' | 'results'
export default function App() {
  const [page, setPage] = useState("landing");
  const [lobeClosing, setLobeClosing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Trigger lobe close animation, then run callback after 700ms
  const withLobeTransition = useCallback((cb) => {
    setLobeClosing(true);
    setTimeout(() => {
      cb();
      setTimeout(() => setLobeClosing(false), 600);
    }, 700);
  }, []);

  const goToAnalysis = useCallback(() => {
    withLobeTransition(() => setPage("analysis"));
  }, [withLobeTransition]);

  const handleAnalyze = useCallback(
    async (text) => {
      setError(null);
      withLobeTransition(async () => {
        setPage("loading");
        try {
          const data = await analyzeText(text);
          setResult(data);
          setTimeout(() => {
            setLobeClosing(true);
            setTimeout(() => {
              setPage("results");
              setTimeout(() => setLobeClosing(false), 600);
            }, 700);
          }, 400);
        } catch (err) {
          setError(err.message || "Analysis failed. Please try again.");
          setLobeClosing(true);
          setTimeout(() => {
            setPage("analysis");
            setTimeout(() => setLobeClosing(false), 600);
          }, 700);
        }
      });
    },
    [withLobeTransition],
  );

  const goBackToAnalysis = useCallback(() => {
    withLobeTransition(() => {
      setResult(null);
      setError(null);
      setPage("analysis");
    });
  }, [withLobeTransition]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-navy-900">
      <LobeCanvas closing={lobeClosing} />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,77,255,0.15) 0%, rgba(124,77,255,0.05) 25%, transparent 60%)",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {page === "landing" && (
            <LandingPage key="landing" onStart={goToAnalysis} />
          )}
          {page === "analysis" && (
            <AnalysisPage
              key="analysis"
              onAnalyze={handleAnalyze}
              error={error}
              onClearError={() => setError(null)}
            />
          )}
          {page === "loading" && <LoadingPage key="loading" />}
          {page === "results" && result && (
            <ResultsPage
              key="results"
              result={result}
              onBack={goBackToAnalysis}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Inline loading page to keep App.jsx self-contained for this state
function LoadingPage() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative w-12 h-12 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-purple-glow/20 border-t-purple-glow animate-spin" />
        <div
          className="absolute inset-2 rounded-full border border-cyan-glow/30 border-b-cyan-glow animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.6s" }}
        />
      </div>
      <p className="font-mono text-sm tracking-[3px] text-slate-500 uppercase">
        Analyzing patterns
      </p>
      <div className="flex gap-1 mt-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1 h-1 rounded-full bg-purple-glow/60"
            style={{ animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
