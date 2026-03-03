import { motion, useSpring } from "motion/react";
import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [targetType, setTargetType] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  // Spring physics for the outer ring to create a "lagging" effect
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const move = (e: MouseEvent | TouchEvent) => {
      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      
      setPos({ x, y });
      springX.set(x);
      springY.set(y);
      
      const target = document.elementFromPoint(x, y) as HTMLElement;
      if (target) {
        const isInteractive = target.closest('button, input, a, [role="button"], .group');
        setIsHovering(!!isInteractive);
        
        if (isInteractive) {
          setTargetType(target.tagName.toLowerCase());
        } else {
          setTargetType(null);
        }
      }
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("touchstart", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);
    
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchstart", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
    };
  }, [springX, springY]);

  // We keep it visible on touch to match desktop "feel"

  return (
    <>
      {/* 1. The Lagging Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{ 
          x: springX, 
          y: springY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <motion.div
          className="border border-black/20 rounded-full flex items-center justify-center"
          animate={{
            width: isHovering ? 64 : 40,
            height: isHovering ? 64 : 40,
            borderColor: isHovering ? "rgba(57, 255, 20, 0.5)" : "rgba(0, 0, 0, 0.2)",
            borderStyle: isHovering ? "solid" : "dashed",
            scale: isClicking ? 0.9 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Subtle Crosshair in Ring */}
          <div className="relative w-full h-full flex items-center justify-center opacity-10">
            <div className="absolute w-full h-[1px] bg-black" />
            <div className="absolute h-full w-[1px] bg-black" />
          </div>
        </motion.div>
      </motion.div>

      {/* 2. The Precise Center Dot & Readout */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ 
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        {/* Center Dot */}
        <motion.div
          className="w-1.5 h-1.5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: isClicking ? 1.5 : 1,
            backgroundColor: isHovering ? "#39FF14" : "#000000",
          }}
        />

        {/* Minimal Readout */}
        <motion.div
          className="absolute top-4 left-4 font-mono text-[9px] leading-none text-black/40 whitespace-nowrap pointer-events-none"
          animate={{
            opacity: isHovering ? 0.8 : 0.4,
            x: isHovering ? 8 : 0,
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex gap-2">
              <span>{pos.x.toString().padStart(4, '0')}</span>
              <span className="opacity-30">/</span>
              <span>{pos.y.toString().padStart(4, '0')}</span>
            </div>
            {targetType && (
              <span className="text-neon-green font-bold uppercase tracking-widest text-[7px]">
                {targetType}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
