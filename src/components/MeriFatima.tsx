/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Compass, ChevronRight, Moon, Star } from "lucide-react";
import { romanticSynth } from "../utils/audio";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  alpha: number;
  color: string;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  spin: number;
  alpha: number;
}

export default function MeriFatima() {
  const [activeSlide, setActiveSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Slides configuration
  const slides = [
    {
      id: "intro-fatima",
      title: "Meri Fatima ❤️",
      lines: [
        "Agar mohabbat ko kisi shakl mein dekhta...",
        "To shayad woh tum hoti.",
        "Agar sukoon ko kisi naam se pukarta...",
        "To shayad woh Fatima hota."
      ],
      meta: "Chapter 9.5: The Ultimate Truth",
      icon: <Heart className="w-6 h-6 text-[#D4AF37]" />,
      background: "from-black via-[#0b0414] to-[#05010a]"
    },
    {
      id: "devotion-fatima",
      title: "My Absolute Devotion",
      lines: [
        "Tum meri kahani ka sabse khoobsurat hissa ho.",
        "Tum meri duaon ka sabse pyara jawab ho.",
        "Tum meri zindagi ki sabse haseen haqeeqat ho."
      ],
      meta: "The Covenant of Hearts",
      icon: <Sparkles className="w-6 h-6 text-[#B76E79]" />,
      background: "from-[#05010a] via-[#10061e] to-[#0c0316]"
    },
    {
      id: "future-fatima",
      title: "Our Dream-like Future",
      lines: [
        "Hathon mein hath liye, thandi hawaon ke beech...",
        "Zindagi ke har haseen sunset ko sath dekhenge.",
        "Ek sukoon bhari duniya, jahan sirf hum honge.",
        "Har khamoshi mein ek gehra rishta hoga."
      ],
      meta: "A Promise of Tomorrow",
      icon: <Compass className="w-6 h-6 text-[#F9E29D]" />,
      background: "from-[#0c0316] via-[#15041a] to-[#07010f]"
    },
    {
      id: "covenant-climax",
      title: "Fatima ❤️ Rehman",
      lines: [
        "Har khoobsurat kahani ka ek khoobsurat naam hota hai...",
        "Meri kahani ka naam...",
        "Fatima ❤️"
      ],
      meta: "The Eternal Melody",
      icon: <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]/20" />,
      background: "from-[#07010f] via-[#090212] to-black"
    }
  ];

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || 650;
    };
    window.addEventListener("resize", resize);

    // Initialize particles (golden dust)
    const particles: Particle[] = [];
    const maxParticles = 60;
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: -(Math.random() * 0.8 + 0.2),
        speedX: Math.random() * 0.4 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.4 ? "#D4AF37" : "#F9E29D"
      });
    }

    // Initialize flower petals (drifting cherry/rose petals)
    const petals: Petal[] = [];
    const maxPetals = 20;
    for (let i = 0; i < maxPetals; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * (height - 100),
        size: Math.random() * 6 + 5,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
        spin: Math.random() * 0.02 - 0.01,
        alpha: Math.random() * 0.7 + 0.3
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.005;

      // Draw warm sunset background glow centered near bottom
      const glowGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.75,
        50,
        width / 2,
        height * 0.75,
        Math.max(100, width * 0.6)
      );
      glowGrad.addColorStop(0, "rgba(212, 175, 55, 0.15)"); // warm golden sun core
      glowGrad.addColorStop(0.3, "rgba(183, 110, 121, 0.06)"); // rose gold aura
      glowGrad.addColorStop(1, "rgba(5, 1, 10, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // --- Draw Pathway (Phase 1, 2, 4) ---
      // A perspective golden path tapering to the horizon
      const horizonY = height * 0.68;
      const centerX = width / 2;

      ctx.save();
      ctx.strokeStyle = "rgba(212, 175, 55, 0.12)";
      ctx.lineWidth = 1.5;

      // Central Path borders
      ctx.beginPath();
      ctx.moveTo(centerX - 10, horizonY);
      ctx.lineTo(centerX - 180, height);
      ctx.moveTo(centerX + 10, horizonY);
      ctx.lineTo(centerX + 180, height);
      ctx.stroke();

      // Pathway perspective lines (stepping slabs)
      ctx.strokeStyle = "rgba(212, 175, 55, 0.07)";
      for (let i = 0; i < 7; i++) {
        const offset = (time + i / 7) % 1;
        const lineY = horizonY + offset * (height - horizonY);
        const halfWidth = 10 + offset * 170;
        ctx.beginPath();
        ctx.moveTo(centerX - halfWidth, lineY);
        ctx.lineTo(centerX + halfWidth, lineY);
        ctx.stroke();
      }

      // Draw pulsing pathway lanterns lining the left and right borders
      for (let i = 0; i < 5; i++) {
        const offset = (time * 0.4 + i / 5) % 1;
        const lanternY = horizonY + offset * (height - horizonY);
        const halfWidth = 12 + offset * 175;
        const pulseSize = (Math.sin(time * 8 + i) + 1) * 3 + 2;

        // Left lantern glow
        ctx.fillStyle = "rgba(254, 226, 157, 0.55)";
        ctx.beginPath();
        ctx.arc(centerX - halfWidth, lanternY, pulseSize / 2, 0, Math.PI * 2);
        ctx.fill();

        const lightGlowL = ctx.createRadialGradient(
          centerX - halfWidth,
          lanternY,
          1,
          centerX - halfWidth,
          lanternY,
          pulseSize * 3
        );
        lightGlowL.addColorStop(0, "rgba(212, 175, 55, 0.4)");
        lightGlowL.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = lightGlowL;
        ctx.beginPath();
        ctx.arc(centerX - halfWidth, lanternY, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Right lantern glow
        ctx.fillStyle = "rgba(254, 226, 157, 0.55)";
        ctx.beginPath();
        ctx.arc(centerX + halfWidth, lanternY, pulseSize / 2, 0, Math.PI * 2);
        ctx.fill();

        const lightGlowR = ctx.createRadialGradient(
          centerX + halfWidth,
          lanternY,
          1,
          centerX + halfWidth,
          lanternY,
          pulseSize * 3
        );
        lightGlowR.addColorStop(0, "rgba(212, 175, 55, 0.4)");
        lightGlowR.addColorStop(1, "rgba(212, 175, 55, 0)");
        ctx.fillStyle = lightGlowR;
        ctx.beginPath();
        ctx.arc(centerX + halfWidth, lanternY, pulseSize * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // --- Draw Sunset Ocean & couple silhouette for slide 2 ("Our Dream-like Future") ---
      if (activeSlide === 2) {
        ctx.save();
        // Ocean horizon reflection
        ctx.fillStyle = "rgba(183, 110, 121, 0.05)";
        ctx.fillRect(0, horizonY, width, height - horizonY);

        // Shimmering water details
        ctx.strokeStyle = "rgba(214, 175, 55, 0.15)";
        ctx.lineWidth = 1;
        for (let i = 0; i < 15; i++) {
          const sy = horizonY + (i / 15) * (height - horizonY);
          const sLength = Math.random() * 80 + 30;
          ctx.beginPath();
          ctx.moveTo(centerX - sLength / 2 + Math.sin(time * 3 + i) * 10, sy);
          ctx.lineTo(centerX + sLength / 2 + Math.sin(time * 3 + i) * 10, sy);
          ctx.stroke();
        }

        // Silhouette of couple standing together, looking at the sunset
        // Couple center position is shifted slightly to the side or perfectly center-bottom
        const coupleX = centerX;
        const coupleY = height * 0.95;

        // Ground hill they stand on
        ctx.fillStyle = "rgba(5, 1, 10, 0.95)";
        ctx.beginPath();
        ctx.ellipse(coupleX, coupleY + 20, 140, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw couple silhouette
        // Rehman (Left): slightly taller
        ctx.fillStyle = "rgba(10, 3, 16, 0.98)";
        
        // Rehman Head
        ctx.beginPath();
        ctx.arc(coupleX - 14, coupleY - 80, 8, 0, Math.PI * 2);
        ctx.fill();
        // Rehman Body
        ctx.beginPath();
        ctx.moveTo(coupleX - 22, coupleY - 72);
        ctx.quadraticCurveTo(coupleX - 24, coupleY - 30, coupleX - 20, coupleY);
        ctx.lineTo(coupleX - 8, coupleY);
        ctx.quadraticCurveTo(coupleX - 6, coupleY - 45, coupleX - 6, coupleY - 72);
        ctx.closePath();
        ctx.fill();

        // Fatima (Right): elegant posture, slightly leaning, head near Rehman
        // Fatima Head
        ctx.beginPath();
        ctx.arc(coupleX + 10, coupleY - 74, 7.2, 0, Math.PI * 2);
        ctx.fill();
        // Fatima Dress/Body
        ctx.beginPath();
        ctx.moveTo(coupleX + 3, coupleY - 67);
        ctx.lineTo(coupleX + 17, coupleY - 67);
        ctx.quadraticCurveTo(coupleX + 22, coupleY - 35, coupleX + 28, coupleY);
        ctx.lineTo(coupleX - 2, coupleY);
        ctx.quadraticCurveTo(coupleX + 1, coupleY - 35, coupleX + 3, coupleY - 67);
        ctx.closePath();
        ctx.fill();

        // Soft gold outline glow for silhouette
        ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(coupleX - 14, coupleY - 80, 8, 0, Math.PI * 2);
        ctx.arc(coupleX + 10, coupleY - 74, 7.2, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // --- Draw Swirling Sparkle Heart for Climax Slide 3 ---
      if (activeSlide === 3) {
        ctx.save();
        const heartCenterX = centerX;
        const heartCenterY = height * 0.35;
        const scale = 8 + Math.sin(time * 5) * 0.3;

        ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
          // parametric heart equation
          const hx = 16 * Math.sin(angle) ** 3;
          const hy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
          
          const px = heartCenterX + hx * scale;
          const py = heartCenterY + hy * scale;

          if (angle === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }

          // sparkle points
          if (Math.random() > 0.94) {
            ctx.fillStyle = "rgba(254, 226, 157, 0.85)";
            ctx.fillRect(px + Math.random() * 8 - 4, py + Math.random() * 8 - 4, 2, 2);
          }
        }
        ctx.closePath();
        ctx.stroke();

        // Heart central glow
        const hGlow = ctx.createRadialGradient(heartCenterX, heartCenterY, 5, heartCenterX, heartCenterY, 150);
        hGlow.addColorStop(0, "rgba(212, 175, 55, 0.08)");
        hGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = hGlow;
        ctx.beginPath();
        ctx.arc(heartCenterX, heartCenterY, 150, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Draw and update golden dust particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update flower rose petals
      ctx.globalAlpha = 1.0;
      petals.forEach((petal) => {
        petal.y += petal.speedY;
        petal.x += petal.speedX;
        petal.angle += petal.spin;

        if (petal.y > height + 20 || petal.x > width + 20) {
          petal.y = -20;
          petal.x = Math.random() * (width / 2);
          petal.angle = Math.random() * Math.PI * 2;
        }

        ctx.save();
        ctx.translate(petal.x, petal.y);
        ctx.rotate(petal.angle);

        // draw a beautiful luxury rose petal
        ctx.fillStyle = "rgba(183, 110, 121, 0.75)"; // Elegant rose gold petal
        ctx.beginPath();
        ctx.ellipse(0, 0, petal.size, petal.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // highlight vein
        ctx.strokeStyle = "rgba(254, 226, 157, 0.25)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(-petal.size, 0);
        ctx.lineTo(petal.size, 0);
        ctx.stroke();

        ctx.restore();
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeSlide]);

  const handleNextSlide = () => {
    romanticSynth.playSparkle();
    if (activeSlide < slides.length - 1) {
      setActiveSlide((prev) => prev + 1);
    } else {
      // Reached the end: loop back or stay
      setActiveSlide(0);
    }
  };

  return (
    <section
      id="meri-fatima-epic-section"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-20 border-b border-zinc-900/60 select-none"
    >
      {/* Background canvas of pathway, silhouettes, rose petals */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Floating elegant layout */}
      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
        
        {/* Animated Slide Switcher */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full flex flex-col items-center text-center"
          >
            {/* Metadata Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] text-xs mb-8 font-sans uppercase tracking-[0.2em] shadow-lg backdrop-blur-md">
              {slides[activeSlide].icon}
              <span className="text-[10px]">{slides[activeSlide].meta}</span>
            </div>

            {/* Display / Title heading */}
            <h2 className="text-5xl md:text-7xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight leading-tight mb-8">
              {slides[activeSlide].title}
            </h2>

            {/* Cinematic Poetic Lines */}
            <div className="flex flex-col gap-5 max-w-2xl min-h-[160px] md:min-h-[200px] justify-center items-center">
              {slides[activeSlide].lines.map((line, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.95, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.25 }}
                  className="text-lg md:text-2xl font-serif font-light text-rose-100/90 leading-relaxed italic"
                >
                  {line}
                </motion.p>
              ))}
            </div>

            {/* Respectful luxury moment descriptive overlay (strictly romantic) */}
            {activeSlide === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.2 }}
                className="mt-6 text-zinc-500 font-sans font-light text-xs max-w-md tracking-wider uppercase leading-loose bg-black/40 border border-[#D4AF37]/10 px-5 py-2.5 rounded-full backdrop-blur-md"
              >
                ✦ A beautiful cinematic union. Rehman pledges his eternal breath to Fatima. ✦
              </motion.div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation Indicator / Interactive Dots */}
        <div className="mt-12 flex flex-col items-center gap-5">
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  romanticSynth.playSparkle();
                  setActiveSlide(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  activeSlide === index
                    ? "bg-[#D4AF37] w-8 shadow-[0_0_10px_rgba(212,175,55,0.7)]"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(212,175,55,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextSlide}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] text-black font-sans font-medium text-xs uppercase tracking-widest shadow-lg transition-all"
          >
            <span>{activeSlide === slides.length - 1 ? "Read Again ❤️" : "Travel Deeper"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

      </div>

      {/* Luxury frame ornaments */}
      <div className="absolute top-8 left-8 text-[9px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/50 hidden md:block">
        Elegance ✦ Devotion
      </div>
      <div className="absolute top-8 right-8 text-[9px] font-mono uppercase tracking-[0.3em] text-[#D4AF37]/50 hidden md:block">
        Sacred Promise
      </div>
      <div className="absolute bottom-8 left-8 text-[9px] font-serif italic text-zinc-600 hidden md:block">
        Agar sukoon ko kisi naam se pukarta...
      </div>
      <div className="absolute bottom-8 right-8 text-[9px] font-serif italic text-zinc-600 hidden md:block">
        To shayad woh Fatima hota.
      </div>
    </section>
  );
}
