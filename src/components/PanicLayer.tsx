import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef } from "react";

interface PanicLayerProps {
  onReset: () => void;
}

export default function PanicLayer({ onReset }: PanicLayerProps) {
  const [isPanic, setIsPanic] = useState(false);
  const mouseHistory = useRef<{ x: number; y: number; t: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mouseHistory.current.push({ x: e.clientX, y: e.clientY, t: now });
      mouseHistory.current = mouseHistory.current.filter(p => now - p.t < 500);
      
      if (mouseHistory.current.length > 20) {
        let totalDist = 0;
        for (let i = 1; i < mouseHistory.current.length; i++) {
          const dx = mouseHistory.current[i].x - mouseHistory.current[i-1].x;
          const dy = mouseHistory.current[i].y - mouseHistory.current[i-1].y;
          totalDist += Math.sqrt(dx*dx + dy*dy);
        }
        if (totalDist > 3000) {
          setIsPanic(true);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleReset = () => {
    setIsPanic(false);
    mouseHistory.current = [];
    onReset();
  };

  return (
    <AnimatePresence>
      {isPanic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center panic"
        >
          <div className="zero-rain opacity-20 text-white">
            {Array(20).fill(0).map((_, i) => (
              <div key={i} className="whitespace-nowrap">
                {Array(100).fill(0).map(() => Math.random() > 0.5 ? "0" : "1").join("")}
              </div>
            ))}
          </div>
          <motion.h1 
            className="text-white font-mono text-9xl font-bold z-10 glitch"
          >
            PANIC
          </motion.h1>
          <button
            onClick={handleReset}
            className="mt-12 bg-white text-red-700 font-mono text-2xl px-12 py-6 hover:bg-black hover:text-white transition-all z-10"
          >
            ABORT SEQUENCE
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
