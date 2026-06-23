/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { romanticSynth } from "../utils/audio";
import { Sparkles, Gift, Heart } from "lucide-react";

interface ExplodingHeart {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRotation: number;
}

export default function GiftSection() {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<ExplodingHeart[]>([]);
  const requestRef = useRef<number | null>(null);

  const colors = [
    "#D4AF37", // Metallic Gold
    "#F9E29D", // Light Golden Sand
    "#B76E79", // Elegant Rose Gold
    "#ff758c", // Soft Rose Pink
    "#ffffff", // Crystal White
  ];

  const handleOpenGift = () => {
    if (isOpen) return;
    
    // Play sound swells
    romanticSynth.playWhoosh();
    romanticSynth.playSparkle();
    setIsOpen(true);
    
    // Trigger canvas explosion
    triggerExplosion();
  };

  const triggerExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const count = 180;
    const hearts: ExplodingHeart[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 10 + 4;
      hearts.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slight upward float
        size: Math.random() * 12 + 6,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRotation: (Math.random() - 0.5) * 0.1,
      });
    }

    heartsRef.current = hearts;

    const drawHeart = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      context.beginPath();
      context.moveTo(x, y + size / 4);
      context.quadraticCurveTo(x, y - size / 2, x + size / 2, y - size / 2);
      context.quadraticCurveTo(x + size, y - size / 2, x + size, y + size / 4);
      context.quadraticCurveTo(x + size, y + size * 0.7, x, y + size * 1.25);
      context.quadraticCurveTo(x - size, y + size * 0.7, x - size, y + size / 4);
      context.quadraticCurveTo(x - size, y - size / 2, x - size / 2, y - size / 2);
      context.quadraticCurveTo(x, y - size / 2, x, y + size / 4);
      context.closePath();
      context.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeHearts = heartsRef.current;
      activeHearts = activeHearts.filter((h) => h.alpha > 0.01);
      
      activeHearts.forEach((h) => {
        h.x += h.vx;
        h.y += h.vy;
        h.vy += 0.05; // gravity pulls them down slowly
        h.rotation += h.vRotation;
        h.alpha -= 0.008; // slow fade

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.fillStyle = h.color;
        ctx.globalAlpha = Math.max(0, h.alpha);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = h.color;

        drawHeart(ctx, 0, 0, h.size);
        ctx.restore();
      });

      heartsRef.current = activeHearts;

      if (activeHearts.length > 0) {
        requestRef.current = requestAnimationFrame(render);
      }
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <section
      id="surprise-gift-section"
      className="relative w-full py-24 bg-[#05010a] overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900/60"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* Confetti Explosion Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-30 mix-blend-screen"
      />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-16 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <Gift className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Chapter 7: The Royal Presentation</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight">
          Surprise Gift Box
        </h2>
        <p className="mt-4 text-zinc-400 font-serif font-light text-sm max-w-md mx-auto italic">
          A bespoke golden chest crafted solely for Madam G. Open it to reveal the ultimate message of my devotion.
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            // Golden Box Wrapper
            <motion.div
              key="closed-gift"
              id="gift-trigger"
              onClick={handleOpenGift}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex flex-col items-center"
            >
              {/* Box container */}
              <div className="relative w-44 h-44 mb-8">
                {/* Golden box body with ribbon */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, -3, 3, -3, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-full h-full bg-gradient-to-tr from-[#D4AF37] via-[#F9E29D] to-[#B76E79] rounded-2xl relative shadow-2xl flex items-center justify-center border border-[#D4AF37]/30"
                >
                  {/* Ribbons */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-[#B76E79] border-x border-[#B76E79]/50" />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-[#B76E79] border-y border-[#B76E79]/50" />

                  {/* Ribbon bow on top */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#B76E79] rounded-full flex items-center justify-center text-xs font-bold text-white border border-[#B76E79]/40 shadow-md">
                    👑
                  </div>

                  {/* Center Heart Emblem */}
                  <div className="absolute w-12 h-12 rounded-full bg-black/80 border border-[#D4AF37]/30 flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-[#B76E79] fill-[#B76E79]/20" />
                  </div>
                </motion.div>
              </div>

              <span className="text-sm font-serif font-light italic text-[#D4AF37] tracking-wider hover:text-white transition-colors bg-[#D4AF37]/5 border border-[#D4AF37]/20 px-6 py-2.5 rounded-full backdrop-blur-md">
                Madam G, yahan click karo ❤️
              </span>
            </motion.div>
          ) : (
            // Revealed Confession Overlay Card
            <motion.div
              key="opened-gift"
              initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full max-w-lg glass-card p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center relative overflow-hidden mx-6 border-l-4 border-l-[#D4AF37]"
            >
              {/* Radial glow background */}
              <div className="absolute -inset-10 bg-gradient-to-b from-[#D4AF37]/10 to-transparent blur-3xl pointer-events-none" />

              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 animate-pulse">
                  <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>

              <span className="text-xs font-mono tracking-widest text-[#B76E79] uppercase mb-2 block">
                The Sacred Unlocked Decree
              </span>

              <h3 className="text-3xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight leading-tight">
                Main tumse beinteha mohabbat karta hoon.
              </h3>

              <div className="mt-6 flex justify-center text-[#B76E79]/40 text-xl">
                ✦ ❦ ✦
              </div>

              <p className="mt-6 text-[#F9E29D]/90 font-serif font-light text-sm md:text-base leading-relaxed">
                You are my queen, my wife, my sanity, and my absolute everything. No matter what comes, my heart is anchored in you, for now and for eternity.
              </p>

              {/* Glowing Heart floating inside */}
              <div className="mt-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex p-3 rounded-full bg-[#B76E79]/10 border border-[#B76E79]/30 text-[#B76E79]"
                >
                  <Heart className="w-6 h-6 fill-[#B76E79]/40" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
