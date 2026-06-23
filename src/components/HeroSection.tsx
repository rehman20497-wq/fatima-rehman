/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { romanticSynth } from "../utils/audio";
import { ROMANTIC_TITLES } from "../types";

enum HeroStage {
  TAP_TO_ENTER = "TAP_TO_ENTER",
  INTRO_LINE1 = "INTRO_LINE1",
  INTRO_LINE2 = "INTRO_LINE2",
  ZOOM_EXPLOSION = "ZOOM_EXPLOSION",
  TITLE_REVEAL = "TITLE_REVEAL",
  COMPLETE = "COMPLETE",
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  angle: number;
  speed: number;
  radialDist: number;
  rotSpeed: number;
}

export default function HeroSection({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState<HeroStage>(HeroStage.TAP_TO_ENTER);
  const [titleIndex, setTitleIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Handle stage progressions
  useEffect(() => {
    if (stage === HeroStage.INTRO_LINE1) {
      // Play initial slow heartbeat
      const heartbeatInterval = setInterval(() => {
        if (stageRef.current === HeroStage.INTRO_LINE1 || stageRef.current === HeroStage.INTRO_LINE2) {
          romanticSynth.playHeartbeat();
        }
      }, 1500);

      const t1 = setTimeout(() => {
        setStage(HeroStage.INTRO_LINE2);
      }, 4500);

      return () => {
        clearInterval(heartbeatInterval);
        clearTimeout(t1);
      };
    }

    if (stage === HeroStage.INTRO_LINE2) {
      // Slightly faster heartbeat for anticipation
      const heartbeatInterval = setInterval(() => {
        if (stageRef.current === HeroStage.INTRO_LINE2) {
          romanticSynth.playHeartbeat();
        }
      }, 1000);

      const t2 = setTimeout(() => {
        setStage(HeroStage.ZOOM_EXPLOSION);
      }, 4500);

      return () => {
        clearInterval(heartbeatInterval);
        clearTimeout(t2);
      };
    }

    if (stage === HeroStage.ZOOM_EXPLOSION) {
      // Play explosive sound
      romanticSynth.playWhoosh();
      // Initialize Canvas explosion
      initExplosion();

      const t3 = setTimeout(() => {
        setStage(HeroStage.TITLE_REVEAL);
      }, 3500);

      return () => clearTimeout(t3);
    }

    if (stage === HeroStage.TITLE_REVEAL) {
      // Start ambient music pad
      romanticSynth.startAmbientPad();

      const interval = setInterval(() => {
        setTitleIndex((prev) => {
          if (prev >= ROMANTIC_TITLES.length - 1) {
            clearInterval(interval);
            // After all titles are shown, complete the intro
            setTimeout(() => {
              setStage(HeroStage.COMPLETE);
              setTimeout(() => {
                onComplete();
              }, 1500);
            }, 3000);
            return prev;
          }
          // Play a delicate sparkle when title changes
          romanticSynth.playSparkle();
          return prev + 1;
        });
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [stage]);

  // Handle Enter Action
  const handleEnter = () => {
    // Play sound on user gesture
    romanticSynth.init();
    romanticSynth.resume();
    romanticSynth.playHeartbeat();
    setStage(HeroStage.INTRO_LINE1);
  };

  // Canvas Explosion Logic
  const initExplosion = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const count = 1200;
    const particles: Particle[] = [];

    const colors = ["#ff758c", "#ff7eb3", "#ffd269", "#e2b0ff", "#ff9a9e", "#a1c4fd"];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        size: Math.random() * 4 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: angle,
        speed: speed,
        radialDist: 0,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    particlesRef.current = particles;

    const render = () => {
      if (stageRef.current === HeroStage.COMPLETE) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.06)"; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pts = particlesRef.current;
      pts.forEach((p) => {
        if (stageRef.current === HeroStage.ZOOM_EXPLOSION) {
          // Outward explosion
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.alpha -= 0.003;
        } else {
          // Pull into a circular rotating galaxy in the background
          const dx = p.x - centerX;
          const dy = p.y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          p.angle += p.rotSpeed;
          // Slowly orbit and pull in or float
          p.x = centerX + Math.cos(p.angle) * (dist * 1.002);
          p.y = centerY + Math.sin(p.angle) * (dist * 1.002);
          p.alpha = Math.max(0.1, p.alpha);
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Resize canvas handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div
      id="hero-stage-container"
      className="fixed inset-0 bg-black z-40 flex items-center justify-center overflow-hidden cursor-pointer select-none"
    >
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        id="hero-particles"
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

      <AnimatePresence mode="wait">
        {/* Stage 1: Tap to Enter */}
        {stage === HeroStage.TAP_TO_ENTER && (
          <motion.div
            key="tap"
            id="hero-tap-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            onClick={handleEnter}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            {/* Pulsing Cinematic Heart */}
            <motion.div
              id="hero-glowing-heart"
              animate={{
                scale: [1, 1.25, 1, 1.25, 1],
                filter: [
                  "drop-shadow(0 0 10px rgba(255, 117, 140, 0.4))",
                  "drop-shadow(0 0 30px rgba(255, 117, 140, 0.9))",
                  "drop-shadow(0 0 10px rgba(255, 117, 140, 0.4))",
                  "drop-shadow(0 0 35px rgba(255, 117, 140, 0.9))",
                  "drop-shadow(0 0 10px rgba(255, 117, 140, 0.4))"
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-pink-500 text-7xl md:text-8xl mb-8"
            >
              ❤️
            </motion.div>

            <motion.p
              id="hero-tap-instruction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="text-amber-100 font-sans tracking-widest text-xs md:text-sm uppercase max-w-md leading-relaxed px-4"
            >
              Bismillah...
              <br />
              <span className="block mt-2 font-light text-rose-300">
                Touch anywhere to open your universe, Malkan 👑
              </span>
            </motion.p>
          </motion.div>
        )}

        {/* Stage 2: Intro Line 1 */}
        {stage === HeroStage.INTRO_LINE1 && (
          <motion.div
            key="line1"
            id="hero-line1-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-center max-w-2xl px-6 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-rose-500 text-3xl mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
            >
              ❤️
            </motion.div>
            <h1 className="text-2xl md:text-4xl text-rose-100 font-sans font-light tracking-wide leading-relaxed">
              &ldquo;Ek choti si duniya hai meri...&rdquo;
            </h1>
          </motion.div>
        )}

        {/* Stage 3: Intro Line 2 */}
        {stage === HeroStage.INTRO_LINE2 && (
          <motion.div
            key="line2"
            id="hero-line2-screen"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-center max-w-2xl px-6 flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.0, repeat: Infinity }}
              className="text-rose-500 text-4xl mb-6 drop-shadow-[0_0_25px_rgba(244,63,94,0.8)]"
            >
              ❤️
            </motion.div>
            <h1 className="text-3xl md:text-5xl text-rose-200 font-sans font-medium tracking-wide leading-relaxed">
              &ldquo;Aur us duniya ka naam tum ho ❤️&rdquo;
            </h1>
          </motion.div>
        )}

        {/* Stage 4: Zoom & Explosion (Handled fully by Canvas. Shows subtle fade overlay) */}
        {stage === HeroStage.ZOOM_EXPLOSION && (
          <motion.div
            key="explosion"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent flex items-center justify-center"
          >
            {/* Visual zoom cue */}
            <div className="w-1 bg-white opacity-10 rounded-full h-1 blur-sm animate-ping scale-[20]" />
          </motion.div>
        )}

        {/* Stage 5: Title Reveals */}
        {stage === HeroStage.TITLE_REVEAL && (
          <motion.div
            key="reveal"
            id="hero-titles-carousel"
            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={titleIndex}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="flex flex-col items-center justify-center"
              >
                {/* Floating particle crown or visual ornament */}
                <span className="text-amber-400 text-xl md:text-2xl mb-4 opacity-75">
                  ✨ ✦ 👑 ✦ ✨
                </span>
                
                <h2 className="text-5xl md:text-7xl font-sans font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  {ROMANTIC_TITLES[titleIndex].text}
                </h2>
                
                <p className="mt-4 text-rose-100 font-light tracking-widest text-sm md:text-base max-w-md italic opacity-90">
                  {ROMANTIC_TITLES[titleIndex].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Bottom progression bar */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {ROMANTIC_TITLES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === titleIndex ? "w-8 bg-rose-500" : "w-1.5 bg-zinc-800"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Stage 6: Fade Out / Complete */}
        {stage === HeroStage.COMPLETE && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center"
          >
            <motion.h2
              animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-amber-100 font-sans tracking-widest uppercase text-xs md:text-sm"
            >
              Designing your love story...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
