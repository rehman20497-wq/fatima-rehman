/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Compass, ChevronRight, Moon, Star, Milestone, Baby } from "lucide-react";
import { romanticSynth } from "../utils/audio";

interface DreamParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
  angle?: number;
  spin?: number;
}

interface StarrySkyParticle {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  phase: number;
}

export default function AikKhuwaab() {
  // Cinematic Timeline State
  // 0: Intro Card "Aik Khuwaab Tumhare Sath"
  // 1: Scene 1 - Two Souls Finding Each Other (Walking)
  // 2: Scene 1 - The Warm Hug & Sparkle Burst
  // 3: Transition Card "2 Years Later..."
  // 4: Scene 2 - Our Future Family (Under the Sunset)
  // 5: Final Message Scroll
  const [timelineStep, setTimelineStep] = useState(0);
  const [walkingProgress, setWalkingProgress] = useState(0); // 0 to 100 for Step 1
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPlayingRef = useRef(false);

  // Auto walking logic for Step 1
  useEffect(() => {
    if (timelineStep !== 1) return;
    setWalkingProgress(0);
    
    let frameId: number;
    let currentProgress = 0;
    
    const tick = () => {
      currentProgress += 0.28; // Elegant slow motion walk
      if (currentProgress >= 100) {
        setWalkingProgress(100);
        // Automatically transition to the beautiful Hug after they reach each other
        setTimeout(() => {
          romanticSynth.playSparkle();
          setTimelineStep(2);
        }, 1200);
      } else {
        setWalkingProgress(currentProgress);
        frameId = requestAnimationFrame(tick);
      }
    };
    
    // Tiny delay before starting to walk
    const startTimeout = setTimeout(() => {
      frameId = requestAnimationFrame(tick);
    }, 1500);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(frameId);
    };
  }, [timelineStep]);

  // Main Canvas animation logic covering all cinematic scenes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 600;
    };
    window.addEventListener("resize", handleResize);

    // Particles system
    const goldParticles: DreamParticle[] = [];
    const heartsList: { x: number; y: number; size: number; speedY: number; speedX: number; alpha: number; scale: number; maxLife: number; life: number }[] = [];
    const backgroundStars: StarrySkyParticle[] = [];

    // Initialize stars
    for (let i = 0; i < 80; i++) {
      backgroundStars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7),
        size: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Spawn gold particles
    for (let i = 0; i < 50; i++) {
      goldParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.6 + 0.2),
        speedX: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? "#D4AF37" : "#F9E29D"
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.01;

      const horizonY = height * 0.65;
      const centerX = width / 2;

      // 1. STAR & AMBIENT NEBULA BACKDROP
      ctx.save();
      // Draw dark rich space backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (timelineStep === 0 || timelineStep === 1 || timelineStep === 2) {
        bgGrad.addColorStop(0, "#030107");
        bgGrad.addColorStop(0.5, "#0b0515");
        bgGrad.addColorStop(1, "#04010a");
      } else if (timelineStep === 4) {
        // Luxury Golden Sunset for family scene
        bgGrad.addColorStop(0, "#08020f");
        bgGrad.addColorStop(0.4, "#210927");
        bgGrad.addColorStop(0.7, "#42162a");
        bgGrad.addColorStop(1, "#12020e");
      } else {
        bgGrad.addColorStop(0, "#020004");
        bgGrad.addColorStop(0.6, "#070211");
        bgGrad.addColorStop(1, "#000000");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw background stars
      backgroundStars.forEach((star) => {
        const opacity = (Math.sin(time * 60 * star.twinkleSpeed + star.phase) + 1) / 2 * 0.7 + 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // Ambient radial warm glow
      ctx.save();
      const radialGlow = ctx.createRadialGradient(
        centerX,
        timelineStep === 4 ? horizonY : height * 0.5,
        20,
        centerX,
        timelineStep === 4 ? horizonY : height * 0.5,
        Math.max(100, width * 0.6)
      );
      if (timelineStep === 4) {
        radialGlow.addColorStop(0, "rgba(212, 175, 55, 0.22)"); // Golden sun core
        radialGlow.addColorStop(0.4, "rgba(183, 110, 121, 0.09)"); // Rose glow
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        radialGlow.addColorStop(0, "rgba(212, 175, 55, 0.12)"); // Elegant gold dust
        radialGlow.addColorStop(0.5, "rgba(11, 5, 21, 0.2)");
        radialGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 2. PATHWAY PERSPECTIVE (Steps 1, 2, 4)
      if (timelineStep === 1 || timelineStep === 2 || timelineStep === 4) {
        ctx.save();
        ctx.strokeStyle = "rgba(212, 175, 55, 0.15)";
        ctx.lineWidth = 1.2;

        // Path side limits
        ctx.beginPath();
        ctx.moveTo(centerX - 12, horizonY);
        ctx.lineTo(centerX - 190, height);
        ctx.moveTo(centerX + 12, horizonY);
        ctx.lineTo(centerX + 190, height);
        ctx.stroke();

        // Cross planks / tiles moving down
        ctx.strokeStyle = "rgba(212, 175, 55, 0.08)";
        for (let i = 0; i < 6; i++) {
          const progress = ((time * 0.3 + i / 6) % 1);
          const py = horizonY + progress * (height - horizonY);
          const pWidth = 12 + progress * 178;
          ctx.beginPath();
          ctx.moveTo(centerX - pWidth, py);
          ctx.lineTo(centerX + pWidth, py);
          ctx.stroke();
        }

        // Pathway lanterns
        for (let i = 0; i < 4; i++) {
          const progress = ((time * 0.25 + i / 4) % 1);
          const ly = horizonY + progress * (height - horizonY);
          const lw = 15 + progress * 175;
          const glowRad = (Math.sin(time * 5 + i) + 1) * 3 + 4;

          // Left lantern glow
          ctx.fillStyle = "rgba(254, 226, 157, 0.7)";
          ctx.beginPath();
          ctx.arc(centerX - lw, ly, 2, 0, Math.PI * 2);
          ctx.fill();

          const lglowL = ctx.createRadialGradient(centerX - lw, ly, 1, centerX - lw, ly, glowRad * 2.5);
          lglowL.addColorStop(0, "rgba(212, 175, 55, 0.35)");
          lglowL.addColorStop(1, "rgba(212, 175, 55, 0)");
          ctx.fillStyle = lglowL;
          ctx.beginPath();
          ctx.arc(centerX - lw, ly, glowRad * 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Right lantern glow
          ctx.fillStyle = "rgba(254, 226, 157, 0.7)";
          ctx.beginPath();
          ctx.arc(centerX + lw, ly, 2, 0, Math.PI * 2);
          ctx.fill();

          const lglowR = ctx.createRadialGradient(centerX + lw, ly, 1, centerX + lw, ly, glowRad * 2.5);
          lglowR.addColorStop(0, "rgba(212, 175, 55, 0.35)");
          lglowR.addColorStop(1, "rgba(212, 175, 55, 0)");
          ctx.fillStyle = lglowR;
          ctx.beginPath();
          ctx.arc(centerX + lw, ly, glowRad * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 3. SCENE 1: TWO SOULS WALKING & APPROACHING (timelineStep === 1)
      if (timelineStep === 1) {
        ctx.save();
        
        // Define starting boundaries
        const leftStart = 50;
        const rightStart = width - 50;
        const targetCenter = centerX;

        // Current walking positions
        const ratio = walkingProgress / 100;
        const fatimaX = leftStart + (targetCenter - 30 - leftStart) * ratio;
        const rehmanX = rightStart - (rightStart - (targetCenter + 30)) * ratio;
        
        const figureY = height * 0.95;
        const bobL = Math.sin(time * 16) * 3; // Bobbing from walking
        const bobR = Math.cos(time * 16) * 3;

        // --- Draw Fatima Figure (Left) ---
        ctx.fillStyle = "rgba(12, 3, 20, 0.98)";
        // Fatima head
        ctx.beginPath();
        ctx.arc(fatimaX, figureY - 75 + bobL, 6.8, 0, Math.PI * 2);
        ctx.fill();
        // Dress/Body
        ctx.beginPath();
        ctx.moveTo(fatimaX - 7, figureY - 68 + bobL);
        ctx.lineTo(fatimaX + 7, figureY - 68 + bobL);
        ctx.quadraticCurveTo(fatimaX + 13, figureY - 30, fatimaX + 18, figureY);
        ctx.lineTo(fatimaX - 18, figureY);
        ctx.quadraticCurveTo(fatimaX - 13, figureY - 30, fatimaX - 7, figureY - 68 + bobL);
        ctx.closePath();
        ctx.fill();
        // Golden aura
        ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
        ctx.stroke();

        // --- Draw Abdul Rehman Figure (Right) ---
        ctx.fillStyle = "rgba(8, 2, 16, 0.98)";
        // Rehman head
        ctx.beginPath();
        ctx.arc(rehmanX, figureY - 80 + bobR, 7.5, 0, Math.PI * 2);
        ctx.fill();
        // Suit/Body
        ctx.beginPath();
        ctx.moveTo(rehmanX - 8, figureY - 72 + bobR);
        ctx.lineTo(rehmanX + 8, figureY - 72 + bobR);
        ctx.quadraticCurveTo(rehmanX + 10, figureY - 30, rehmanX + 12, figureY);
        ctx.lineTo(rehmanX - 12, figureY);
        ctx.quadraticCurveTo(rehmanX - 10, figureY - 30, rehmanX - 8, figureY - 72 + bobR);
        ctx.closePath();
        ctx.fill();
        // Warm gold outline
        ctx.strokeStyle = "rgba(254, 226, 157, 0.25)";
        ctx.stroke();

        ctx.restore();
      }

      // 4. SCENE 1: THE WARM EMBRACE / HUG (timelineStep === 2)
      if (timelineStep === 2) {
        ctx.save();
        const figureY = height * 0.95;
        const coupleX = centerX;

        // Ground shading
        ctx.fillStyle = "rgba(4, 1, 8, 0.95)";
        ctx.beginPath();
        ctx.ellipse(coupleX, figureY + 15, 120, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw integrated beautiful Hug silhouette
        ctx.fillStyle = "rgba(10, 2, 18, 0.99)";
        
        // Rehman's taller silhouette leaning in
        // Head
        ctx.beginPath();
        ctx.arc(coupleX - 5, figureY - 80 + Math.sin(time * 2) * 0.5, 7.8, 0, Math.PI * 2);
        ctx.fill();
        // Body wrapping around
        ctx.beginPath();
        ctx.moveTo(coupleX - 15, figureY - 72);
        ctx.quadraticCurveTo(coupleX - 10, figureY - 40, coupleX - 18, figureY);
        ctx.lineTo(coupleX + 5, figureY);
        ctx.quadraticCurveTo(coupleX, figureY - 45, coupleX + 4, figureY - 72);
        ctx.closePath();
        ctx.fill();

        // Fatima's silhouette nested perfectly
        // Head
        ctx.beginPath();
        ctx.arc(coupleX + 4, figureY - 74 + Math.sin(time * 2) * 0.5, 7, 0, Math.PI * 2);
        ctx.fill();
        // Dress merging gracefully
        ctx.beginPath();
        ctx.moveTo(coupleX - 4, figureY - 67);
        ctx.lineTo(coupleX + 12, figureY - 67);
        ctx.quadraticCurveTo(coupleX + 18, figureY - 35, coupleX + 24, figureY);
        ctx.lineTo(coupleX - 12, figureY);
        ctx.quadraticCurveTo(coupleX - 6, figureY - 35, coupleX - 4, figureY - 67);
        ctx.closePath();
        ctx.fill();

        // Gentle golden outline
        ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Spawn beautiful hearts in distance
        if (Math.random() > 0.85) {
          heartsList.push({
            x: coupleX + (Math.random() * 260 - 130),
            y: figureY - 50 - Math.random() * 150,
            size: Math.random() * 4 + 2,
            speedY: -(Math.random() * 0.8 + 0.3),
            speedX: Math.random() * 0.6 - 0.3,
            alpha: 1.0,
            scale: Math.random() * 0.8 + 0.4,
            maxLife: 100,
            life: 0
          });
        }

        ctx.restore();
      }

      // 5. SCENE 2: OUR FUTURE FAMILY WITH BEAUTIFUL CHILD (timelineStep === 4)
      if (timelineStep === 4) {
        ctx.save();
        const figureY = height * 0.95;
        const familyX = centerX;

        // Ground meadow hill
        ctx.fillStyle = "rgba(6, 1, 12, 0.98)";
        ctx.beginPath();
        ctx.ellipse(familyX, figureY + 20, 160, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Swaying grasses
        ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 40; i++) {
          const gx = familyX - 150 + (i * 300 / 40);
          const gh = 25 + Math.sin(time * 3 + i) * 8;
          ctx.beginPath();
          ctx.moveTo(gx, figureY + 10);
          ctx.quadraticCurveTo(gx + Math.sin(time * 4 + i) * 6, figureY + 10 - gh / 2, gx + Math.sin(time * 4 + i) * 12, figureY + 10 - gh);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(10, 3, 18, 0.99)";

        // --- DRAW ABDUL REHMAN (Center-Right) ---
        const rX = familyX - 10;
        // Rehman head
        ctx.beginPath();
        ctx.arc(rX, figureY - 80, 7.8, 0, Math.PI * 2);
        ctx.fill();
        // Rehman body (suit/shoulders)
        ctx.beginPath();
        ctx.moveTo(rX - 12, figureY - 72);
        ctx.lineTo(rX + 12, figureY - 72);
        ctx.quadraticCurveTo(rX + 15, figureY - 35, rX + 18, figureY);
        ctx.lineTo(rX - 18, figureY);
        ctx.quadraticCurveTo(rX - 15, figureY - 35, rX - 12, figureY - 72);
        ctx.closePath();
        ctx.fill();

        // --- DRAW BEAUTIFUL CHILD (Sitting on Rehman's Shoulders) ---
        const cX = rX;
        const cY = figureY - 94; // sitting tall on shoulders
        // Child head
        ctx.beginPath();
        ctx.arc(cX, cY - 14, 4.8, 0, Math.PI * 2);
        ctx.fill();
        // Child body & waving arms
        ctx.beginPath();
        ctx.moveTo(cX - 6, cY - 9);
        ctx.lineTo(cX + 6, cY - 9);
        ctx.lineTo(cX + 8, cY + 4);
        ctx.lineTo(cX - 8, cY + 4);
        ctx.closePath();
        ctx.fill();

        // Tiny waving left arm
        ctx.strokeStyle = "rgba(10, 3, 18, 0.99)";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cX - 6, cY - 6);
        ctx.lineTo(cX - 14, cY - 18 + Math.sin(time * 6) * 3);
        ctx.stroke();

        // Tiny waving right arm
        ctx.beginPath();
        ctx.moveTo(cX + 6, cY - 6);
        ctx.lineTo(cX + 14, cY - 18 + Math.cos(time * 6) * 3);
        ctx.stroke();

        // --- DRAW FATIMA (Standing Beside Rehman, Smiling) ---
        const fX = familyX + 26;
        // Fatima head (slightly leaning towards Rehman)
        ctx.beginPath();
        ctx.arc(fX, figureY - 74, 7, 0, Math.PI * 2);
        ctx.fill();
        // Elegant long dress silhouette
        ctx.beginPath();
        ctx.moveTo(fX - 8, figureY - 67);
        ctx.lineTo(fX + 8, figureY - 67);
        ctx.quadraticCurveTo(fX + 13, figureY - 30, fX + 22, figureY);
        ctx.lineTo(fX - 14, figureY);
        ctx.quadraticCurveTo(fX - 9, figureY - 30, fX - 8, figureY - 67);
        ctx.closePath();
        ctx.fill();

        // Interlocking arms details (romantic embrace feeling)
        ctx.beginPath();
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 1;
        // Outline child
        ctx.arc(cX, cY - 14, 4.8, 0, Math.PI * 2);
        // Outline Fatima
        ctx.arc(fX, figureY - 74, 7, 0, Math.PI * 2);
        // Outline Rehman
        ctx.arc(rX, figureY - 80, 7.8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 6. ANIMATE FLOATING HEARTS (Steps 2, 4)
      heartsList.forEach((heart, index) => {
        heart.life++;
        heart.y += heart.speedY;
        heart.x += heart.speedX;
        heart.alpha = 1 - (heart.life / heart.maxLife);

        if (heart.life >= heart.maxLife) {
          heartsList.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = heart.alpha * 0.75;
        ctx.translate(heart.x, heart.y);
        ctx.scale(heart.scale, heart.scale);

        // Vector heart drawing
        ctx.fillStyle = "rgba(183, 110, 121, 0.85)"; // Rose-gold tint
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-5, -5, -10, 0, 0, 10);
        ctx.bezierCurveTo(10, 0, 5, -5, 0, 0);
        ctx.fill();
        
        ctx.restore();
      });

      // 7. GOLD DUST AND FLOATING COVENANT PARTICLES
      ctx.globalAlpha = 1.0;
      goldParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        // Draw gorgeous diamond sparkle sparkles
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, [timelineStep, walkingProgress]);

  const handleNextStep = () => {
    romanticSynth.playSparkle();
    
    if (timelineStep < 5) {
      setTimelineStep((prev) => prev + 1);
    } else {
      // Loop back or reset
      setTimelineStep(0);
    }
  };

  return (
    <section
      id="aik-khuwaab-dream-section"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-24 border-b border-zinc-900 select-none"
    >
      {/* Immersive cinematic canvas viewport */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Floating elegant content frame */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 0: TITLE CARD INTRO */}
          {timelineStep === 0 && (
            <motion.div
              key="intro-card"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] text-xs mb-8 uppercase tracking-[0.25em] shadow-lg backdrop-blur-md">
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[10px] font-semibold">Chapter 10: Aik Khuwaab</span>
              </div>

              <h2 className="text-5xl md:text-8xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight leading-none mb-6 italic">
                Aik Khuwaab<br/>Tumhare Sath ❤️
              </h2>

              <p className="max-w-xl text-sm md:text-lg text-zinc-300 font-light font-serif leading-relaxed italic mb-10">
                "Some dreams are worth waiting for... and some people are worth everything." Let us step into a dream of the future we are weaving together.
              </p>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  romanticSynth.playWhoosh();
                  setTimelineStep(1);
                }}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B76E79] text-black text-xs uppercase tracking-widest font-semibold shadow-lg"
              >
                Enter the Dream Sequence
              </motion.button>
            </motion.div>
          )}

          {/* STEP 1: WALKING TOWARDS EACH OTHER */}
          {timelineStep === 1 && (
            <motion.div
              key="walking-sequence"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="text-center flex flex-col items-center max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D4AF37]/20 bg-black/50 text-[#D4AF37] text-[10px] uppercase tracking-widest mb-6">
                <Star className="w-3.5 h-3.5" />
                <span>Scene 1: Finding One Another</span>
              </div>

              <p className="text-xl md:text-3xl font-serif font-light text-rose-100 italic leading-relaxed min-h-[80px]">
                "In a quiet world of stardust and dreams, two souls begin walking towards each other..."
              </p>

              {/* Interactive custom status line */}
              <div className="w-48 h-[1px] bg-zinc-800 relative mt-8 overflow-hidden rounded">
                <div 
                  className="h-full bg-[#D4AF37] transition-all duration-300 shadow-[0_0_8px_#D4AF37]" 
                  style={{ width: `${walkingProgress}%` }}
                />
              </div>
              <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-widest mt-2">
                Approaching: {Math.round(walkingProgress)}%
              </span>
            </motion.div>
          )}

          {/* STEP 2: THE HUG AND CLIMAX */}
          {timelineStep === 2 && (
            <motion.div
              key="hug-sequence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col items-center max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] text-[10px] mb-8 uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">
                <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                <span>An Eternal Embrace</span>
              </div>

              <div className="flex flex-col gap-5 max-w-2xl min-h-[140px] justify-center items-center">
                <p className="text-xl md:text-3xl font-serif font-light text-rose-50/95 leading-relaxed italic">
                  "Some dreams are worth waiting for..."
                </p>
                <p className="text-xl md:text-3xl font-serif font-light text-[#D4AF37] leading-relaxed italic">
                  "And some people are worth everything."
                </p>
              </div>

              <h3 className="text-3xl md:text-5xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] mt-8 tracking-wide">
                Fatima ❤️ Abdul Rehman
              </h3>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  romanticSynth.playWhoosh();
                  setTimelineStep(3);
                }}
                className="mt-10 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs uppercase tracking-widest transition-all"
              >
                <span>Step Forward into the Future</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 3: TRANSITION CARD */}
          {timelineStep === 3 && (
            <motion.div
              key="transition-years"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 1.0 }}
              className="text-center flex flex-col items-center"
            >
              <h2 className="text-4xl md:text-7xl font-serif font-extralight text-[#D4AF37] tracking-[0.2em] uppercase mb-4 animate-pulse">
                2 Years Later...
              </h2>
              <p className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.3em]">
                The beautiful dream becomes a reality
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  romanticSynth.playSparkle();
                  setTimelineStep(4);
                }}
                className="mt-10 px-6 py-2.5 rounded-full bg-white/10 border border-[#D4AF37]/20 hover:bg-white/15 text-xs text-[#D4AF37] font-semibold tracking-wider uppercase"
              >
                Reveal the Future
              </motion.button>
            </motion.div>
          )}

          {/* STEP 4: THE FUTURE FAMILY SCENE */}
          {timelineStep === 4 && (
            <motion.div
              key="family-sequence"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col items-center max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#B76E79]/30 bg-black/60 text-[#B76E79] text-[10px] mb-8 uppercase tracking-[0.2em]">
                <Baby className="w-4 h-4 text-[#B76E79]" />
                <span>Our Sacred Family</span>
              </div>

              <p className="text-xl md:text-3xl font-serif font-light text-rose-100 italic leading-relaxed min-h-[100px]">
                "Under the warm golden sun, a beautiful future smiles upon us. Holding hands, sharing laughter, and looking ahead as one perfect family."
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  romanticSynth.playWhoosh();
                  setTimelineStep(5);
                }}
                className="mt-10 flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B76E79] text-black text-xs uppercase tracking-widest font-semibold"
              >
                <span>Complete the Dream</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          )}

          {/* STEP 5: POETIC MESSAGE SCROLL */}
          {timelineStep === 5 && (
            <motion.div
              key="final-scroll"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
              className="text-center flex flex-col items-center max-w-2xl w-full"
            >
              {/* Scrolling Credits Poetic Overlay */}
              <div className="flex flex-col gap-6 font-serif italic text-rose-100/90 text-lg md:text-2xl mb-12">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="font-light">
                  "Aik Khuwaab..." <span className="text-[#D4AF37]">Tumhare Sath.</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="font-light">
                  "Aik zindagi..." <span className="text-[#D4AF37]">Tumhare Sath.</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="font-light">
                  "Aik safar..." <span className="text-[#D4AF37]">Tumhare Sath.</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="font-light">
                  "Aik ghar..." <span className="text-[#D4AF37]">Tumhare Sath.</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.3 }} className="font-light">
                  "Aik mustaqbil..." <span className="text-[#D4AF37]">Tumhare Sath.</span>
                </motion.p>
              </div>

              {/* Massive Emotional Title Finish */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.9, filter: "blur(5px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ delay: 2.8, duration: 1.2 }}
                className="text-4xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight leading-none mb-10"
              >
                Aik Khuwaab Tumhare Sath ❤️
              </motion.h1>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  romanticSynth.playSparkle();
                  setTimelineStep(0);
                }}
                className="px-6 py-2.5 rounded-full border border-zinc-800 hover:bg-zinc-900 text-zinc-400 text-xs uppercase tracking-widest transition-all"
              >
                Relive the Dream
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* Aesthetic border labels for luxury presentation */}
      <div className="absolute top-8 left-8 text-[9px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]/40 hidden md:block">
        ✦ Sacred Dream Sequence
      </div>
      <div className="absolute top-8 right-8 text-[9px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]/40 hidden md:block">
        Two Years Future ✦
      </div>
    </section>
  );
}
