/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { romanticSynth } from "../utils/audio";
import { Heart, Star, Compass, Sparkles } from "lucide-react";

interface HeartFragment {
  id: string;
  title: string;
  description: string;
  color: string;
  revealed: boolean;
}

const FEELINGS_CHANNELS = [
  "Main tumhare baare mein sirf mehsoos nahi karta...",
  "Main tumhein apni zindagi ke har hissa mein mehsoos karta hoon.",
  "Tum meri subah ki pehli soch ho.",
  "Tum meri raat ka aakhri khayal ho.",
  "Tum woh sukoon ho jo har thakan mita deta hai.",
  "Tum woh muskurahat ho jo bina wajah bhi aa jati hai.",
  "Tum woh dua ho jo qabool ho gayi.",
  "Tum woh mohabbat ho jiske liye shukr ada karna bhi kam lagta hai.",
  "Tum mere dil ka sabse mehfooz hissa ho.",
  "Tum meri aadat ho.",
  "Tum meri zaroorat ho.",
  "Tum meri khushi ho.",
  "Tum mera ghar ho.",
  "Tum mera sakoon ho.",
  "Tum meri duniya nahi...",
  "Tum meri poori kainaat ho. 💖"
];

const LAYERS = [
  {
    title: "Layer 1 — What I Feel When I See You",
    text: "When I see you... The world doesn't stop. But somehow it becomes quieter. Everything feels lighter. Every problem feels smaller. And every moment feels more beautiful."
  },
  {
    title: "Layer 2 — What Your Presence Means",
    text: "Your presence feels like coming home after a long journey. Like finding shade on the hottest day. Like hearing your favorite song unexpectedly. Like every good thing arriving at once."
  },
  {
    title: "Layer 3 — What You Mean To My Heart",
    text: "You are not a chapter in my life. You are the story. You are not part of my happiness. You are the reason happiness feels complete."
  },
  {
    title: "Layer 4 — What I Fear",
    text: "The thing I fear most is never losing you. It is never being able to fully explain how much you mean to me. Because every word feels smaller than what my heart carries for you."
  },
  {
    title: "Layer 5 — What I Want Forever",
    text: "If life gives me a thousand choices. If time starts over a thousand times. If I am asked a thousand questions. My answer will always be the same. You."
  }
];

export default function FeelingsSection() {
  const [questionStarted, setQuestionStarted] = useState(false);
  const [feelingIndex, setFeelingIndex] = useState(-1);
  const [activeLayer, setActiveLayer] = useState(0);
  const [fragments, setFragments] = useState<HeartFragment[]>([
    { id: "f-1", title: "Meri Malkan 👑", description: "The supreme queen who commands my devotion, my heart, and my absolute respect.", color: "from-rose-400 to-pink-600", revealed: false },
    { id: "f-2", title: "Meri Begam ❤️", description: "My loving wife. The solid anchor of my home, my peace, and my beautiful reality.", color: "from-red-500 to-rose-600", revealed: false },
    { id: "f-3", title: "Meri Jaan 🌹", description: "My breathing life. Every single heartbeat of mine echoes with your beautiful name.", color: "from-pink-500 to-amber-500", revealed: false },
    { id: "f-4", title: "Mera Sakoon 🌙", description: "My ultimate sanctuary. In your presence, all worries and exhausting trials fade away.", color: "from-indigo-400 to-purple-600", revealed: false },
    { id: "f-5", title: "Mera Bacha 🥺", description: "My most precious baby. Your sweet smiles, cute details, and child-like wonder are my ultimate treasures.", color: "from-fuchsia-400 to-pink-500", revealed: false },
    { id: "f-6", title: "Meri Lakht-e-Jigar 💖", description: "A core piece of my actual liver and heart. You are crafted into the fiber of my existence.", color: "from-amber-400 to-rose-500", revealed: false },
    { id: "f-7", title: "Meri Antal Hayat ✨", description: "My eternal lifetime companion. Navigating this world and the hereafter with you is my finest dream.", color: "from-teal-400 to-blue-600", revealed: false }
  ]);

  const [confessionSpotlight, setConfessionSpotlight] = useState(false);
  const heartCanvasRef = useRef<HTMLCanvasElement>(null);

  // 3D Heart particle renderer
  useEffect(() => {
    const canvas = heartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 400);
    let height = (canvas.height = 400);

    interface HeartPoint {
      x3d: number;
      y3d: number;
      z3d: number;
      color: string;
      size: number;
    }

    const points: HeartPoint[] = [];
    const colors = ["#ff758c", "#ff7eb3", "#ff9a9e", "#ffd269"];

    // Generate 3D Heart coordinates mathematically
    for (let i = 0; i < 750; i++) {
      // Parametric equations for 3D heart shape
      const t = Math.PI * 2 * Math.random();
      const u = Math.PI * (Math.random() - 0.5);

      // Heart equations
      const x = 16 * Math.pow(Math.sin(t), 3) * Math.cos(u);
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * Math.cos(u);
      const z = 15 * Math.sin(u);

      points.push({
        x3d: x * 6,
        y3d: -y * 6, // invert Y coordinate for canvas math
        z3d: z * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 2 + 1,
      });
    }

    let rotY = 0;
    let rotX = 0;

    const render = () => {
      ctx.fillStyle = "rgba(10, 2, 20, 0.15)"; // slight fade
      ctx.fillRect(0, 0, width, height);

      rotY += 0.015;
      rotX = Math.sin(rotY * 0.5) * 0.3;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Sort points by Z (depth) for proper 3D rendering occlusion
      const rotatedPoints = points.map((p) => {
        // Rotate in Y
        let x1 = p.x3d * cosY - p.z3d * sinY;
        let z1 = p.z3d * cosY + p.x3d * sinY;

        // Rotate in X
        let y1 = p.y3d * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y3d * sinX;

        // Perspective projection
        const fov = 300;
        const scale = fov / (fov + z2);
        const px = x1 * scale + width / 2;
        const py = y1 * scale + height / 2;

        return { px, py, scale, color: p.color, size: p.size, z: z2 };
      });

      rotatedPoints.sort((a, b) => b.z - a.z);

      rotatedPoints.forEach((p) => {
        if (p.px >= 0 && p.px <= width && p.py >= 0 && p.py <= height) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0.2, Math.min(1, p.scale));
          ctx.beginPath();
          ctx.arc(p.px, p.py, p.size * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const startJourney = () => {
    romanticSynth.playSparkle();
    setQuestionStarted(true);
    setFeelingIndex(0);
  };

  const nextFeeling = () => {
    if (feelingIndex < FEELINGS_CHANNELS.length - 1) {
      romanticSynth.playSparkle();
      setFeelingIndex((p) => p + 1);
    }
  };

  const revealFragment = (id: string) => {
    romanticSynth.playSparkle();
    setFragments((prev) =>
      prev.map((f) => (f.id === id ? { ...f, revealed: !f.revealed } : f))
    );
  };

  const triggerSpotlightConfession = () => {
    romanticSynth.playWhoosh();
    setConfessionSpotlight(true);
  };

  return (
    <section
      id="feelings-journey-chapter"
      className="relative w-full min-h-screen py-24 bg-[#05010a] overflow-hidden flex flex-col items-center border-b border-zinc-900/60"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(183,110,121,0.1),transparent_75%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl px-6 mb-16 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <Heart className="w-3.5 h-3.5 fill-[#D4AF37]/20 text-[#D4AF37]" />
          <span>Chapter 2: The Emotional Symphony</span>
        </motion.div>

        <h2 className="text-4xl md:text-6xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight">
          How Do You Feel About Me?
        </h2>
        <p className="mt-4 text-zinc-400 font-sans font-light text-sm md:text-base">
          An interactive, multi-layered digital dialogue tracing the raw, deepest sentiments of my love.
        </p>
      </div>

      {!questionStarted ? (
        // Start Action Button
        <motion.div
          id="feelings-initial-trigger"
          className="z-10 text-center flex flex-col items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-zinc-500 italic text-sm mb-6 max-w-sm font-serif">
            &ldquo;You asked me once how much you truly mean... click below for the response line by line.&rdquo;
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(212,175,55,0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startJourney}
            className="px-8 py-4 rounded-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-serif font-light italic text-sm shadow-xl flex items-center gap-3 transition-all"
          >
            <Compass className="w-5 h-5 animate-spin-slow text-black" />
            <span>Begin the Feelings Journey</span>
          </motion.button>
        </motion.div>
      ) : (
        // Active Question / Reveal Stage
        <div className="relative w-full max-w-4xl z-10 px-6 flex flex-col items-center">
          
          {/* Poetic typewriter reveal */}
          <div className="w-full max-w-2xl glass-card rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 text-[#D4AF37]/10 text-6xl pointer-events-none select-none font-serif font-bold italic">
              02
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={feelingIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6 }}
                className="min-h-[160px] flex flex-col justify-center items-center text-center"
              >
                <span className="text-[#D4AF37]/40 text-3xl mb-4 font-mono">✦ ✦ ✦</span>
                <p className="text-xl md:text-2xl font-serif font-light text-[#F9E29D] leading-relaxed max-w-xl">
                  {FEELINGS_CHANNELS[feelingIndex]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Next buttons / progress */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5 pt-6">
              <div className="text-xs font-mono text-zinc-500">
                Message {feelingIndex + 1} of {FEELINGS_CHANNELS.length}
              </div>
              
              <div className="flex items-center gap-4">
                {feelingIndex < FEELINGS_CHANNELS.length - 1 ? (
                  <button
                    onClick={nextFeeling}
                    className="px-5 py-2.5 rounded-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] font-sans text-xs tracking-wider transition-all"
                  >
                    Reveal Next Sentence ✦
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-[#B76E79] animate-pulse flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-4.5 h-4.5" /> Full Confession Unlocked
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Extreme Detailed Feelings Journey Layer Tabs */}
          <div className="w-full grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
            {LAYERS.map((layer, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  romanticSynth.playSparkle();
                  setActiveLayer(idx);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  activeLayer === idx
                    ? "bg-[#D4AF37]/5 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5 text-[#D4AF37]"
                    : "bg-black/30 border-white/5 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <div className="text-[10px] font-mono tracking-wider mb-1">
                  LAYER {idx + 1}
                </div>
                <div className="font-serif font-light text-xs truncate italic">
                  {layer.title.split(" — ")[1] || layer.title}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl glass-card rounded-3xl p-8 text-center mb-24 shadow-xl border-l-2 border-l-[#D4AF37]"
            >
              <h4 className="text-base font-serif font-light text-[#D4AF37] mb-4 flex items-center justify-center gap-2 italic">
                <Star className="w-4 h-4 text-[#D4AF37]" />
                {LAYERS[activeLayer].title}
              </h4>
              <p className="text-[#F9E29D]/90 font-serif font-light text-base md:text-lg leading-relaxed">
                {LAYERS[activeLayer].text}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Heart Reveal Section */}
          <div className="w-full text-center mb-10 select-none">
            <span className="text-[#B76E79] text-2xl">🌹 ✦ 👑</span>
            <h3 className="text-3xl font-serif font-light italic text-[#D4AF37] tracking-tight mt-2">
              The Interactive Heart Reveal
            </h3>
            <p className="text-zinc-500 text-sm max-w-md mx-auto mt-2 font-sans">
              Touch the fragments below to unlock the sacred titles that compose the beautiful anatomy of my heart.
            </p>
          </div>

          <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 mb-28">
            {/* 3D Heart Canvas Visual */}
            <div className="relative flex items-center justify-center">
              <canvas
                ref={heartCanvasRef}
                className="relative rounded-full border border-[#D4AF37]/20 bg-black/40 shadow-2xl"
              />
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,#05010a_100%)] rounded-full" />
              
              {/* Overlay pulse floating text */}
              <div className="absolute inset-x-0 bottom-6 text-center pointer-events-none">
                <span className="text-[10px] font-mono text-[#D4AF37]/50 uppercase tracking-widest animate-pulse">
                  Rotating 3D Celestial Core
                </span>
              </div>
            </div>

            {/* Fragments grids */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
              {fragments.map((frag) => (
                <motion.div
                  key={frag.id}
                  onClick={() => revealFragment(frag.id)}
                  whileHover={{ scale: 1.03 }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all relative overflow-hidden backdrop-blur-md select-none ${
                    frag.revealed
                      ? `bg-white/[0.02] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/5`
                      : "bg-black/50 border-white/5 hover:border-[#D4AF37]/20 hover:bg-[#05010a]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-serif font-light italic text-[#F9E29D]">
                      {frag.title}
                    </span>
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        frag.revealed ? "text-[#B76E79] fill-[#B76E79]" : "text-zinc-600"
                      }`}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {frag.revealed ? (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 0.9, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-serif font-light text-zinc-300 leading-relaxed mt-2"
                      >
                        {frag.description}
                      </motion.p>
                    ) : (
                      <p className="text-xs font-sans font-light text-zinc-600 mt-2">
                        Touch to unlock crystal fragment...
                      </p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final Emotional Spotlight Confession Trigger */}
          {!confessionSpotlight ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerSpotlightConfession}
              className="px-8 py-3.5 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-serif font-light italic text-sm tracking-wider uppercase transition-all mb-12 shadow-xl shadow-[#D4AF37]/5"
            >
              Reveal Final Emotional Confession ✦
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-full max-w-2xl text-center bg-black border border-[#D4AF37]/30 p-8 md:p-12 rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.1)] relative overflow-hidden mb-12"
            >
              {/* Virtual Spotlight */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-[#D4AF37]/15 to-transparent blur-2xl rounded-full pointer-events-none" />

              <span className="text-[#D4AF37] text-xs uppercase tracking-widest font-mono">✦ THE SPOTLIGHT CONFESSION ✦</span>
              <h4 className="text-2xl md:text-3xl font-serif font-light italic text-[#F9E29D] mt-4 mb-6">
                So, how do I feel about you?
              </h4>

              <div className="flex flex-col gap-4 text-zinc-300 font-serif font-light text-sm md:text-base text-left bg-zinc-950/60 p-6 rounded-2xl border border-white/5">
                <p className="italic text-[#F9E29D]">
                  &ldquo;I love you more than words can explain.&rdquo;
                </p>
                <p className="italic text-[#F9E29D]">
                  &ldquo;More than poems can describe.&rdquo;
                </p>
                <p className="italic text-[#F9E29D]">
                  &ldquo;More than songs can sing.&rdquo;
                </p>
                <p className="italic text-[#F9E29D]">
                  &ldquo;More than time can measure.&rdquo;
                </p>
                <p className="mt-4 text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B76E79] font-bold">
                  And if one day every language disappears...
                  <br />
                  My heart would still know your name. ❤️
                </p>
              </div>

              {/* Display Her Names proudly */}
              <div className="flex flex-wrap gap-2 justify-center mt-8">
                {["Meri Malkan", "Meri Begam", "Meri Jaan", "Mera Sakoon", "My Favorite Human", "My Greatest Blessing", "My Forever"].map((name, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 text-xs font-serif italic text-[#D4AF37] tracking-wide font-medium">
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      )}
    </section>
  );
}
