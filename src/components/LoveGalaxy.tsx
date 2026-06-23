/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STAR_MESSAGES, StarMessage } from "../types";
import { romanticSynth } from "../utils/audio";
import { Star, Sparkles, X, Heart } from "lucide-react";

interface CanvasStar {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export default function LoveGalaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedStar, setSelectedStar] = useState<StarMessage | null>(null);
  const [hoveredStar, setHoveredStar] = useState<StarMessage | null>(null);
  const hoveredStarRef = useRef<StarMessage | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false });
  const rotationRef = useRef({ x: 0.001, y: 0.002 });
  const dragRef = useRef({ isDragging: false, startX: 0, startY: 0 });

  // Galaxy rendering configuration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let backgroundStars: CanvasStar[] = [];
    const starCount = 350;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 650; // generous block height
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize starry space background
    for (let i = 0; i < starCount; i++) {
      backgroundStars.push({
        // Uniform distribution in sphere coordinates
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        size: Math.random() * 1.5 + 0.5,
        color: i % 4 === 0 ? "#ffd269" : i % 3 === 0 ? "#ff7eb3" : "#ffffff",
        alpha: Math.random(),
        pulseSpeed: 0.01 + Math.random() * 0.02,
        pulseOffset: Math.random() * Math.PI,
      });
    }

    // Interactive Star Messages positions mapping to canvas viewport coordinates
    let activeStars = [...STAR_MESSAGES];

    const project = (x: number, y: number, z: number, width: number, height: number) => {
      const fov = 350; // field of view / perspective depth
      // Translate based on camera distance (e.g. z = 300)
      const scale = fov / (fov + z);
      const projX = x * scale + width / 2;
      const projY = y * scale + height / 2;
      return { x: projX, y: projY, scale };
    };

    const drawCrystal = (context: CanvasRenderingContext2D, px: number, py: number, size: number, color: string, time: number) => {
      // Draw a rotating 3D crystal shape (octahedron)
      context.save();
      context.translate(px, py);
      context.rotate(time * 0.01);

      context.shadowBlur = 20;
      context.shadowColor = color;

      context.beginPath();
      context.fillStyle = color;
      context.globalAlpha = 0.25;

      // Octahedron top face
      context.beginPath();
      context.moveTo(0, -size);
      context.lineTo(size * 0.7, 0);
      context.lineTo(0, size * 0.7);
      context.lineTo(-size * 0.7, 0);
      context.closePath();
      context.fill();

      // Golden inner core
      context.beginPath();
      context.fillStyle = "#ffffff";
      context.globalAlpha = 0.7;
      context.arc(0, 0, size * 0.2, 0, Math.PI * 2);
      context.fill();

      // Outer wireframe highlights
      context.strokeStyle = "#ffffff";
      context.globalAlpha = 0.5;
      context.lineWidth = 1;
      context.stroke();

      context.restore();
    };

    const render = () => {
      ctx.fillStyle = "#030008"; // Midnight galactic space back
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw warm nebula cloud behind
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, Math.max(100, canvas.width * 0.6)
      );
      grad.addColorStop(0, "rgba(22, 5, 45, 0.45)"); // Dark purple core
      grad.addColorStop(0.5, "rgba(10, 1, 20, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0.95)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now();
      const mouse = mouseRef.current;

      // Apply drag / inertial rotation or soft self orbit
      if (!dragRef.current.isDragging) {
        rotationRef.current.y += 0.0012; // slow continuous rotation
        // Add subtle mouse lag parallax
        rotationRef.current.y += (mouse.targetX - mouse.x) * 0.00002;
        rotationRef.current.x += (mouse.targetY - mouse.y) * 0.00002;
      }
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);

      // Render background stars
      backgroundStars.forEach((star) => {
        // Rotate in Y
        let x1 = star.x * cosY - star.z * sinY;
        let z1 = star.z * cosY + star.x * sinY;

        // Rotate in X
        let y1 = star.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + star.y * sinX;

        const proj = project(x1, y1, z2, canvas.width, canvas.height);

        if (proj.x >= 0 && proj.x <= canvas.width && proj.y >= 0 && proj.y <= canvas.height) {
          const size = star.size * proj.scale;
          const alpha = star.alpha * (Math.sin(time * star.pulseSpeed + star.pulseOffset) * 0.4 + 0.6);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Track star locations in 2D viewport to handle hover/clicking
      const projectedStars = activeStars.map((star) => {
        // Rotate in Y
        let x1 = star.x * cosY - star.z * sinY;
        let z1 = star.z * cosY + star.x * sinY;

        // Rotate in X
        let y1 = star.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + star.y * sinX;

        const proj = project(x1, y1, z2, canvas.width, canvas.height);
        return {
          star,
          px: proj.x,
          py: proj.y,
          scale: proj.scale,
          depth: z2,
        };
      });

      // Sort by depth so back stars render behind front stars
      projectedStars.sort((a, b) => b.depth - a.depth);

      let currentHovered: StarMessage | null = null;

      projectedStars.forEach(({ star, px, py, scale }) => {
        const size = star.size * scale * 1.2;
        const distToMouse = Math.hypot(px - mouse.targetX, py - mouse.targetY);
        const isHover = distToMouse < size + 15;

        if (isHover) {
          currentHovered = star;
        }

        // Draw interactive star crystal
        drawCrystal(ctx, px, py, size, isHover ? "#ffffff" : star.color, time);

        // Render elegant label right above it
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.font = "normal 500 12px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.globalAlpha = isHover ? 1.0 : 0.65;
        
        ctx.fillText(star.title, px, py - size - 8);
        ctx.shadowBlur = 0; // reset
      });

      // Safe update hovered state using ref comparison to avoid tearing down canvas on every hover change
      if (currentHovered?.id !== hoveredStarRef.current?.id) {
        hoveredStarRef.current = currentHovered;
        setHoveredStar(currentHovered);
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.targetX = x;
    mouseRef.current.targetY = y;

    if (dragRef.current.isDragging) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x += dy * 0.005;
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragRef.current.isDragging = true;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
  };

  const handleMouseUp = () => {
    dragRef.current.isDragging = false;
    
    // If a star was hovered during mouseUp, trigger click message
    if (hoveredStar) {
      romanticSynth.playSparkle();
      setSelectedStar(hoveredStar);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.targetX = touch.clientX - rect.left;
      mouseRef.current.targetY = touch.clientY - rect.top;

      dragRef.current.isDragging = true;
      dragRef.current.startX = touch.clientX;
      dragRef.current.startY = touch.clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1 && dragRef.current.isDragging) {
      const touch = e.touches[0];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.targetX = touch.clientX - rect.left;
      mouseRef.current.targetY = touch.clientY - rect.top;

      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      rotationRef.current.y += dx * 0.007;
      rotationRef.current.x += dy * 0.007;
      dragRef.current.startX = touch.clientX;
      dragRef.current.startY = touch.clientY;
    }
  };

  const handleTouchEnd = () => {
    dragRef.current.isDragging = false;
    if (hoveredStar) {
      romanticSynth.playSparkle();
      setSelectedStar(hoveredStar);
    }
  };

  return (
    <section
      id="love-galaxy-section"
      className="relative w-full py-20 bg-[#05010a] overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900/60"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      
      {/* Editorial Content header */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-8 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Celestial Universe of My Heart</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight"
        >
          3D Love Galaxy
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.8 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-4 text-[#F9E29D] font-serif font-light text-sm md:text-base leading-relaxed italic"
        >
          Drag to orbit the stars. Every celestial glowing object represents a majestic blessing or a pure feeling in my soul. Click any glowing memory crystal to decode it.
        </motion.p>
      </div>

      {/* 3D Canvas Container */}
      <div
        id="interactive-galaxy-container"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-5xl h-[550px] md:h-[600px] cursor-grab active:cursor-grabbing z-10"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Hover Hint display in canvas */}
        {hoveredStar && !selectedStar && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-black/80 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full px-4 py-1.5 backdrop-blur-md text-xs tracking-wider font-serif italic flex items-center gap-2 shadow-xl">
            <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79]/30 animate-pulse" />
            <span>Click to expand <b>{hoveredStar.title}</b></span>
          </div>
        )}
      </div>

      {/* Magical Crystal Overlay Modal */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            key="star-modal"
            id="crystal-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedStar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, filter: "blur(10px)" }}
              animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 0.9, y: 20, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl border border-[#D4AF37]/30 bg-[#05010a] p-8 text-center shadow-[0_0_50px_rgba(212,175,55,0.15)] overflow-hidden border-l-4 border-l-[#D4AF37]"
            >
              {/* Decorative radial glows */}
              <div
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: selectedStar.color }}
              />
              <div
                className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ backgroundColor: selectedStar.color }}
              />

              {/* Heart floating asset in background */}
              <div className="absolute top-4 right-4 text-white/5 font-serif font-bold text-8xl pointer-events-none select-none italic">
                M
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedStar(null)}
                className="absolute top-4 right-4 p-2 rounded-full border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37] bg-white/5 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon / Diamond crown */}
              <div className="flex justify-center mb-6">
                <div
                  className="p-4 rounded-full border flex items-center justify-center animate-bounce shadow-lg"
                  style={{ borderColor: `${selectedStar.color}40`, backgroundColor: `${selectedStar.color}15` }}
                >
                  <Star className="w-8 h-8" style={{ color: selectedStar.color, fill: `${selectedStar.color}30` }} />
                </div>
              </div>

              {/* Star Title */}
              <h3 className="text-3xl md:text-4xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F9E29D] tracking-wide mb-2">
                {selectedStar.title}
              </h3>
              <p className="text-[#B76E79] font-sans tracking-widest text-xs uppercase mb-6">
                Celestial Coordinate of Love
              </p>

              {/* Urdu Poetic message */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative backdrop-blur-sm">
                <p className="text-xl md:text-2xl font-normal leading-relaxed text-[#F9E29D] font-serif italic drop-shadow-sm">
                  {selectedStar.message}
                </p>
                
                {/* Visual flower accent */}
                <div className="flex justify-center mt-4 text-[#B76E79]/30 text-lg">
                  ❦ ✦ ❦
                </div>
              </div>

              {/* Interactive Affirmation button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedStar(null)}
                className="mt-8 px-6 py-3 rounded-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-serif font-light italic text-sm shadow-xl transition-all flex items-center gap-2 mx-auto"
              >
                <span>Hamesha Tumhare Saath ❤️</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
