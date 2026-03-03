/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CustomCursor from "@/src/components/CustomCursor";
import PanicLayer from "@/src/components/PanicLayer";
import { Volume2 } from "lucide-react";
import { generateSpeech, playAudioFromBase64 } from "@/src/services/geminiService";

// --- Components for Sections ---

const Section1Arrival: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [coords, setCoords] = useState("000");
  const [speed, setSpeed] = useState(100);
  const [isFrozen, setIsFrozen] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isFrozen) return;
    const interval = setInterval(() => {
      setCoords(Math.floor(Math.random() * 1000).toString().padStart(3, "0"));
    }, speed);
    return () => clearInterval(interval);
  }, [speed, isFrozen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - lastPos.current.x);
    const dy = Math.abs(e.clientY - lastPos.current.y);
    const dist = Math.sqrt(dx * dx + dy * dy);
    setSpeed(Math.max(20, 200 - dist * 2));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = () => {
    setIsFrozen(true);
    setTimeout(onComplete, 1000);
  };

  return (
    <div className="section bg-white" onMouseMove={handleMouseMove} onClick={handleClick}>
      <AnimatePresence mode="wait">
        {!isFrozen ? (
          <motion.div
            key="coords"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            className="massive-number text-black"
          >
            {coords}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            className="flex gap-4"
          >
            {coords.split("").map((char, i) => (
              <motion.span
                key={i}
                initial={{ y: 0 }}
                animate={{ y: 1000, rotate: Math.random() * 360, opacity: 0 }}
                transition={{ duration: 1, ease: "easeIn" }}
                className="massive-number text-black"
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-8 serif-tiny text-black uppercase italic">
        Where do you want to exist?
      </div>
    </div>
  );
};

const Section2Calibration: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const options = [
    "Negligible", "Infinite", "Variable", "0.00001kg", "Heavy", "Void", "Compressed"
  ];

  const handleSelect = () => {
    setIsGlitching(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className="section bg-white">
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-neon-green z-50"
          />
        )}
      </AnimatePresence>

      {!isGlitching ? (
        <>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-12 text-black"
          >
            What is the weight of your current reality?
          </motion.h2>
          <div className="relative w-full h-64 md:h-64 flex flex-wrap justify-center items-center gap-4 md:block">
            {options.map((opt, i) => (
              <motion.button
                key={opt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1, color: "#39FF14" }}
                onClick={handleSelect}
                className="md:absolute serif-tiny uppercase text-black italic p-2"
                style={{
                  top: typeof window !== 'undefined' && window.innerWidth > 768 ? `${Math.random() * 80}%` : undefined,
                  left: typeof window !== 'undefined' && window.innerWidth > 768 ? `${Math.random() * 80}%` : undefined,
                }}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-2xl text-black"
        >
          CALCULATING DESTINATION...
        </motion.div>
      )}
    </div>
  );
};

const Section3Catalog: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const destinations = [
    { id: 0, title: "Timeline 0.00", physics: "Gravity: 0.2g | Emotion: Melancholy", img: "https://picsum.photos/seed/dest1/800/1000" },
    { id: 1, title: "Timeline 4.12", physics: "Gravity: 1.5g | Emotion: Euphoria", img: "https://picsum.photos/seed/dest2/800/1000" },
    { id: 2, title: "Timeline 9.99", physics: "Gravity: Null | Emotion: Static", img: "https://picsum.photos/seed/dest3/800/1000" },
  ];

  return (
    <div className="section bg-white p-4 md:p-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-6xl relative overflow-y-auto md:overflow-visible py-10 md:py-0">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            className="relative aspect-[3/4] overflow-hidden group cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setHovered(hovered === i ? null : i)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <motion.img
              src={dest.img}
              alt={dest.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-500"
              style={{
                filter: hovered === i ? "grayscale(1) contrast(200%)" : "grayscale(0.5)",
              }}
            />
            <div className="absolute top-4 left-4 font-mono text-lg md:text-xl bg-white text-black px-2 z-10">
              {dest.title}
            </div>
            
            <AnimatePresence>
              {hovered === i && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  className="absolute inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-1/2 bg-black/90 md:bg-black text-white p-6 flex flex-col justify-center z-20"
                >
                  <div className="serif-tiny mb-4 uppercase italic text-white/60">Physics Report</div>
                  <div className="font-mono text-sm leading-relaxed mb-8">
                    {dest.physics}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onComplete();
                    }}
                    className="w-full border border-white/30 p-4 md:p-2 serif-tiny uppercase hover:bg-white hover:text-black transition-colors italic bg-white/10 md:bg-transparent"
                  >
                    Select Coordinate
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setHovered(null);
                    }}
                    className="mt-4 md:hidden text-[10px] uppercase opacity-50 underline"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Section4BoardingPass: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isFlickering, setIsFlickering] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInput = () => {
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className={`section transition-colors duration-75 justify-start md:justify-center pt-20 md:pt-0 p-6 ${isFlickering ? 'bg-black' : 'bg-white'}`}>
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-8 md:space-y-12"
          >
            <div className="space-y-2">
              <label className="serif-tiny uppercase block text-black italic">Designated Avatar Name</label>
              <input
                type="text"
                required
                onInput={handleInput}
                className="w-full bg-transparent border-b-2 md:border-b-4 border-black font-mono text-2xl md:text-4xl outline-none py-2 text-black"
              />
            </div>
            <div className="space-y-4">
              <label className="serif-tiny uppercase block text-black italic">Probability of returning</label>
              <input
                type="range"
                min="0.001"
                max="0.499"
                step="0.001"
                className="w-full accent-black"
              />
              <div className="flex justify-between font-mono text-[10px] text-black">
                <span>0.001%</span>
                <span>0.499%</span>
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ 
                backgroundColor: ["#000000", "#39FF14", "#000000"],
                color: ["#39FF14", "#000000", "#39FF14"],
                transition: { repeat: Infinity, duration: 0.3 }
              }}
              className="w-full bg-black text-neon-green font-mono text-xl md:text-2xl py-4 md:py-6 border-2 border-neon-green"
            >
              INITIATE TRANSFER
            </motion.button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-4 pt-20 md:pt-0"
          >
            <div className="font-mono text-2xl md:text-4xl text-black">Departure locked.</div>
            <div className="serif-tiny uppercase text-black italic">Pack lightly.</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Section5Risk: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const legalText = Array(100).fill("BY INITIATING THIS TRANSFER YOU ACKNOWLEDGE THE TOTAL DISSOLUTION OF YOUR CURRENT BIOLOGICAL IDENTITY. THE AGENCY IS NOT RESPONSIBLE FOR TEMPORAL LOOPS, SPONTANEOUS COMBUSTION, OR THE LOSS OF MEMORY REGARDING THE CONCEPT OF 'HOME'. ").join(" ");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringAccept, setIsHoveringAccept] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  return (
    <div 
      className="section bg-white overflow-hidden p-6 md:p-10"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      onTouchMove={(e) => setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY })}
    >
      <div className="relative w-full h-full">
        {/* Background: Tiny unreadable text */}
        <div className="absolute inset-0 text-[4px] leading-[4px] text-black/10 break-all select-none blur-[1px]">
          {legalText}
        </div>
        
        {/* Foreground: Readable text revealed by cursor/touch */}
        <div 
          className="absolute inset-0 text-sm md:text-lg font-mono text-black break-words select-none pointer-events-none"
          style={{
            clipPath: `circle(${isHoveringAccept ? 64 : 40}px at ${mousePos.x}px ${mousePos.y}px)`,
          }}
        >
          {legalText}
        </div>

        {/* The "ACCEPT" button is hidden in the text */}
        <button
          onClick={onComplete}
          onMouseEnter={() => setIsHoveringAccept(true)}
          onMouseLeave={() => setIsHoveringAccept(false)}
          className="absolute top-[60%] left-[30%] md:left-[40%] text-red-600 font-bold text-xs hover:scale-150 transition-transform z-10 p-4"
          style={{ textShadow: "0 0 10px rgba(255,0,0,0.5)" }}
        >
          ACCEPT
        </button>
      </div>
      
      <div className="absolute bottom-10 left-6 md:left-10 serif-tiny uppercase text-black italic">
        {isTouch ? "Touch to reveal release" : "Scan for liability release"}
      </div>
    </div>
  );
};

const Section6Echoes: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const [active, setActive] = useState<number | null>(null);
  const [isFlatline, setIsFlatline] = useState<boolean[]>([false, false, false]);
  const [isLoadingAudio, setIsLoadingAudio] = useState<number | null>(null);

  const testimonials = [
    "I forgot the color of my mother's eyes, but the sky here is a perfect violet.",
    "Time is no longer a line. It is a room I can walk through.",
    "The silence is the loudest thing I have ever heard."
  ];

  const voices: ('Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr')[] = ['Kore', 'Zephyr', 'Charon'];

  const handleWaveClick = async (i: number) => {
    if (isFlatline[i] || isLoadingAudio !== null) return;
    
    setIsLoadingAudio(i);
    const audioBase64 = await generateSpeech(testimonials[i], voices[i]);
    
    if (audioBase64) {
      playAudioFromBase64(audioBase64);
    }

    const newFlatlines = [...isFlatline];
    newFlatlines[i] = true;
    setIsFlatline(newFlatlines);
    setIsLoadingAudio(null);
  };

  return (
    <div className="section bg-white p-20">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="serif-tiny uppercase text-black/40 italic">
          Click to extract residual echoes
        </div>
        <motion.div 
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Volume2 size={12} className="text-black/40" />
        </motion.div>
      </div>

      <div className="flex justify-around w-full items-center h-64">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col items-center gap-8 w-1/4">
            <motion.div
              className="w-full h-32 flex items-center justify-center relative"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => handleWaveClick(i)}
            >
              <AnimatePresence>
                {isLoadingAudio === i && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`flex items-center gap-1 h-full transition-opacity ${isLoadingAudio === i ? 'opacity-20' : 'opacity-100'}`}>
                {Array(20).fill(0).map((_, j) => (
                  <motion.div
                    key={j}
                    animate={{
                      height: isFlatline[i] ? 2 : (active === i ? Math.random() * 100 + 20 : Math.random() * 20 + 5),
                      backgroundColor: isFlatline[i] ? "#ff0000" : "#000000"
                    }}
                    className="w-1"
                  />
                ))}
              </div>
            </motion.div>
            <AnimatePresence>
              {(active === i || isFlatline[i]) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="serif-tiny text-center text-black italic max-w-[200px]"
                >
                  {testimonials[i]}
                  {isFlatline[i] && <div className="text-[8px] mt-2 text-red-600 uppercase not-italic font-mono">Signal Lost</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onReset}
        className="mt-20 border-b-2 border-black font-mono text-sm hover:text-neon-green hover:border-neon-green transition-all text-black"
      >
        RETURN TO ORIGIN
      </button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [section, setSection] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 50) {
        setSection(s => Math.min(s + 1, 5));
      } else if (e.deltaY < -50) {
        setSection(s => Math.max(s - 1, 0));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return;
      
      // Don't swipe if we're inside a scrollable element that can still scroll
      const target = e.target as HTMLElement;
      const scrollable = target.closest('.overflow-y-auto');
      if (scrollable) {
        const isAtTop = scrollable.scrollTop <= 0;
        const isAtBottom = scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 1;
        const touchEnd = e.changedTouches[0].clientY;
        const diff = touchStart.current - touchEnd;
        
        // If scrolling up at top or down at bottom, allow section change
        if (diff > 0 && !isAtBottom) return; 
        if (diff < 0 && !isAtTop) return;
      }

      const touchEnd = e.changedTouches[0].clientY;
      const diff = touchStart.current - touchEnd;

      if (Math.abs(diff) > 70) {
        if (diff > 0) {
          setSection(s => Math.min(s + 1, 5));
        } else {
          setSection(s => Math.max(s - 1, 0));
        }
      }
      touchStart.current = null;
    };

    window.addEventListener("wheel", handleWheel);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const reset = () => {
    setSection(0);
    // Incrementing the key forces all sections to remount and reset their internal state
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="section-container">
      <CustomCursor />
      <PanicLayer onReset={reset} />

      {/* Sections */}
      <motion.div
        animate={{ y: `-${section * 100}vh` }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="h-full w-full"
      >
        <Section1Arrival key={`s1-${resetKey}`} onComplete={() => setSection(1)} />
        <Section2Calibration key={`s2-${resetKey}`} onComplete={() => setSection(2)} />
        <Section3Catalog key={`s3-${resetKey}`} onComplete={() => setSection(3)} />
        <Section4BoardingPass key={`s4-${resetKey}`} onComplete={() => setSection(4)} />
        <Section5Risk key={`s5-${resetKey}`} onComplete={() => setSection(5)} />
        <Section6Echoes key={`s6-${resetKey}`} onReset={reset} />
      </motion.div>
    </div>
  );
}
