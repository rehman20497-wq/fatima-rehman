/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { romanticSynth } from "../utils/audio";
import { Compass, Sparkles } from "lucide-react";

interface TunnelMessage {
  id: string;
  text: string;
  urduText: string;
}

const TUNNEL_MESSAGES: TunnelMessage[] = [
  { id: "tm-1", text: "Tum meri dua ho.", urduText: "تم میری دعا ہو۔" },
  { id: "tm-2", text: "Tum meri khushi ho.", urduText: "تم میری خوشی ہو۔" },
  { id: "tm-3", text: "Tum meri duniya ho.", urduText: "تم میری دنیا ہو۔" },
  { id: "tm-4", text: "Tum mera ghar ho.", urduText: "تم میرا گھر ہو۔" },
  { id: "tm-5", text: "Tum meri mohabbat ki inteha ho.", urduText: "تم میری محبت کی انتہا ہو۔" },
  { id: "tm-6", text: "Tum meri rooh ka sukoon ho.", urduText: "تم میری روح کا سکون ہو۔" },
  { id: "tm-7", text: "Tum meri har jeet ka sabab ho.", urduText: "تم میری ہر جیت کا سبب ہو۔" }
];

interface TunnelPoint {
  x3d: number;
  y3d: number;
  z3d: number;
  color: string;
  size: number;
}

export default function HeartTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMessageIdx, setActiveMessageIdx] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const colors = [
      "rgba(212,175,55,0.85)",  // Gold
      "rgba(183,110,121,0.85)", // Rose Gold
      "rgba(249,226,157,0.85)", // Golden Sand
      "rgba(255,255,255,0.85)"   // Pure White
    ];
    
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 600;
    };
    resize();
    window.addEventListener("resize", resize);

    const points: TunnelPoint[] = [];
    const ringCount = 25;
    const pointsPerRing = 60;
    const tunnelLength = 500;

    // Build the mathematical 3D heart tunnel
    for (let r = 0; r < ringCount; r++) {
      // Z depth spacing
      const zVal = (r / ringCount) * tunnelLength;
      
      for (let p = 0; p < pointsPerRing; p++) {
        // Parametric angle for 2D heart shape
        const theta = (p / pointsPerRing) * Math.PI * 2;
        
        // 2D heart shape formula
        const x2d = 16 * Math.pow(Math.sin(theta), 3);
        const y2d = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
        
        // Scale coordinate outwards
        const scaleRadius = 12;

        points.push({
          x3d: x2d * scaleRadius,
          y3d: -y2d * scaleRadius, // Invert Y
          z3d: zVal,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2 + 1,
        });
      }
    }

    // Scroll speed modifier tracker
    let scrollSpeedOffset = 0;
    const handleScroll = () => {
      // Give a tiny push forward when scrolling occurs
      scrollSpeedOffset += 3.5;
    };
    window.addEventListener("scroll", handleScroll);

    let scrollProgress = 0;

    const render = () => {
      ctx.fillStyle = "rgba(5, 1, 10, 0.25)"; // Dark void trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const center_x = canvas.width / 2;
      const center_y = canvas.height / 2;
      const time = Date.now();

      // Slow constant moving forward + extra boost on scroll
      const forwardMovement = 1.2 + scrollSpeedOffset;
      scrollSpeedOffset *= 0.95; // damp scroll impulse

      // Track scrollProgress to update text messages
      scrollProgress += forwardMovement;
      if (scrollProgress > 220) {
        scrollProgress = 0;
        setActiveMessageIdx((prev) => (prev + 1) % TUNNEL_MESSAGES.length);
        romanticSynth.playSparkle();
      }

      points.forEach((p) => {
        // Move point forward towards user (decrement Z)
        p.z3d -= forwardMovement;

        // If point passes user, wrap back to the tunnel start
        if (p.z3d <= 1) {
          p.z3d = tunnelLength;
        }

        // Add subtle radial waviness / twisting
        const twistAngle = p.z3d * 0.003 + time * 0.0004;
        const cosTwist = Math.cos(twistAngle);
        const sinTwist = Math.sin(twistAngle);

        const rotatedX = p.x3d * cosTwist - p.y3d * sinTwist;
        const rotatedY = p.y3d * cosTwist + p.x3d * sinTwist;

        // Project 3D point onto 2D canvas coordinates
        const fov = 200;
        const scale = fov / (fov + p.z3d);
        const px = rotatedX * scale + center_x;
        const py = rotatedY * scale + center_y;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          // Draw particle with depth-based size and glow alpha
          const size = p.size * scale * 1.8;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.05, Math.min(1.0, 1.0 - p.z3d / tunnelLength));
          
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      id="heart-tunnel-block"
      className="relative w-full py-24 bg-[#05010a] overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900/60"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/25 to-transparent" />

      {/* Header text */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-12 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <Compass className="w-3.5 h-3.5 animate-spin-slow text-[#D4AF37]" />
          <span>Chapter 5: The Infinite Dive</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight">
          Heart Tunnel Experience
        </h2>
        <p className="mt-4 text-zinc-400 font-serif font-light text-sm italic">
          Plunge through thousands of stardust hearts. As you scroll, the tunnel accelerates and whispers key truths of our devotion.
        </p>
      </div>

      {/* 3D Tunnel Stage */}
      <div className="relative w-full max-w-4xl h-[450px] md:h-[500px] z-10 rounded-3xl border border-[#D4AF37]/20 bg-black overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.1)]">
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Cinematic Foreground Text Card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMessageIdx}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.2, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center glass-card border-[#D4AF37]/30 p-6 md:p-8 rounded-2xl max-w-md shadow-2xl flex flex-col items-center justify-center select-none"
            >
              <span className="text-[#D4AF37] text-xs font-mono tracking-widest mb-3 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Echo of My Soul
              </span>
              
              <h3 className="text-2xl md:text-3xl font-serif font-light italic text-[#F9E29D] mb-2 leading-tight">
                {TUNNEL_MESSAGES[activeMessageIdx].text}
              </h3>
              
              <p className="text-xl md:text-2xl font-normal text-rose-200 leading-normal font-sans drop-shadow-sm mt-2">
                {TUNNEL_MESSAGES[activeMessageIdx].urduText}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll cues */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center pointer-events-none">
          <span className="text-[10px] font-mono text-[#D4AF37]/60 tracking-widest uppercase animate-pulse">
            Scroll down to accelerate dive speed ✦
          </span>
        </div>
      </div>
    </section>
  );
}
