/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Sparkles, Check, X, ShieldAlert, HeartHandshake, Lock, Unlock, 
  User, Flame, Sparkle, Smile, SmilePlus, HelpCircle
} from "lucide-react";
import { romanticSynth } from "../utils/audio";

interface GuidelineItem {
  id: string;
  title: string;
  emoji: string;
  desc: string;
  playfulNote: string;
  type: "do" | "dont";
  iconColor: string;
  accentGlow: string;
}

export default function FatimaGuidelines() {
  const [activeTab, setActiveTab] = useState<"all" | "dos" | "donts">("all");
  const [selectedItem, setSelectedItem] = useState<GuidelineItem | null>(null);
  const [isPromised, setIsPromised] = useState(false);
  const [promiseLockHover, setPromiseLockHover] = useState(false);
  const [sparkleBurst, setSparkleBurst] = useState<{ x: number; y: number; id: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const dos: GuidelineItem[] = [
    {
      id: "lap-sitting",
      title: "Lap Sitting",
      emoji: "🧘‍♀️",
      desc: "Sitting comfortably close, nested in warmth.",
      playfulNote: "The royal seat reserved exclusively for the Queen of my universe.",
      type: "do",
      iconColor: "text-[#D4AF37]",
      accentGlow: "from-[#D4AF37]/20 to-transparent",
    },
    {
      id: "lap-sleeping",
      title: "Lap Sleeping",
      emoji: "😴",
      desc: "Drifting to sleep wrapped in pure serenity and peace.",
      playfulNote: "Where all my life's exhaustion instantly melts away in seconds.",
      type: "do",
      iconColor: "text-rose-400",
      accentGlow: "from-rose-500/20 to-transparent",
    },
    {
      id: "holding-hands",
      title: "Holding Hands",
      emoji: "🤝",
      desc: "Interlocking fingers to walk side by side forever.",
      playfulNote: "Two hands, one locked destiny that nothing on earth can break.",
      type: "do",
      iconColor: "text-emerald-400",
      accentGlow: "from-emerald-500/20 to-transparent",
    },
    {
      id: "shoulder-rest",
      title: "Shoulder Rest",
      emoji: "💑",
      desc: "Leaning your head on my shoulder for comfort and peace.",
      playfulNote: "A pillars-of-eternity support system, ready for you to lean on anytime.",
      type: "do",
      iconColor: "text-[#B76E79]",
      accentGlow: "from-[#B76E79]/20 to-transparent",
    },
    {
      id: "pulling-hairs",
      title: "Pulling Hairs",
      emoji: "💇‍♀️",
      desc: "Gentle, sweet hair-playing and soft tugging gestures.",
      playfulNote: "Your exclusive privilege to playful hair chaos whenever you feel silly!",
      type: "do",
      iconColor: "text-purple-400",
      accentGlow: "from-purple-500/20 to-transparent",
    },
    {
      id: "hugs",
      title: "Warm Hugs",
      emoji: "🫂",
      desc: "Wrapping around each other in a safe, warm embrace.",
      playfulNote: "My ultimate sanctuary where time stands absolutely still.",
      type: "do",
      iconColor: "text-cyan-400",
      accentGlow: "from-cyan-500/20 to-transparent",
    },
    {
      id: "kissing",
      title: "Forehead & Cheek Kissing",
      emoji: "😘",
      desc: "Pure and respectful placement of love on cheeks and forehead.",
      playfulNote: "The gentlest seal of respect, protection, and infinite adoration.",
      type: "do",
      iconColor: "text-amber-400",
      accentGlow: "from-amber-500/20 to-transparent",
    },
    {
      id: "cheeks-pulling",
      title: "Cheeks Pulling",
      emoji: "🤏",
      desc: "Squishing and pulling cheeks in cute adorable playfulness.",
      playfulNote: "Because you are my adorable baby, and squishy cheeks are irresistible!",
      type: "do",
      iconColor: "text-pink-400",
      accentGlow: "from-pink-500/20 to-transparent",
    },
    {
      id: "nail-biting",
      title: "Nail Biting",
      emoji: "💅",
      desc: "Chewing or playing with nails in cute, endearing ways.",
      playfulNote: "Since you love it, I will gently hold your hand and admire your beautiful nails while you do! 🥰",
      type: "do",
      iconColor: "text-[#B76E79]",
      accentGlow: "from-[#B76E79]/20 to-transparent",
    }
  ];

  const donts: GuidelineItem[] = [
    {
      id: "love-bites",
      title: "Love Bites",
      emoji: "💋",
      desc: "Over-passionate marks that might stress or irritate the skin.",
      playfulNote: "Restricted! No markings allowed on my premium soft Queen's canvas.",
      type: "dont",
      iconColor: "text-red-500",
      accentGlow: "from-red-600/25 to-transparent",
    },
    {
      id: "lip-kissing",
      title: "Lip Kissing",
      emoji: "👄",
      desc: "Strictly unhygienic direct lips interaction.",
      playfulNote: "Redirected to forehead/cheeks where love stays pure, hygienic, and safe!",
      type: "dont",
      iconColor: "text-rose-600",
      accentGlow: "from-rose-600/25 to-transparent",
    },
    {
      id: "pinching",
      title: "Pinching",
      emoji: "🤏",
      desc: "Uncomfortable or unhygienic squeezing or sharp pinching of the skin.",
      playfulNote: "Restricted! Only ultra-gentle, loving touch is allowed—no pinches on my fragile Queen! 🥰",
      type: "dont",
      iconColor: "text-amber-500",
      accentGlow: "from-amber-600/25 to-transparent",
    }
  ];

  const allItems = [...dos, ...donts];
  const filteredItems = allItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeTab === "dos") return item.type === "do";
    return item.type === "dont";
  });

  // Background Ambient Particles in 3D perspective
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 500;
    };
    window.addEventListener("resize", handleResize);

    const particles: { x: number; y: number; z: number; size: number; speed: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? "#D4AF37" : "#B76E79"
      });
    }

    let angle = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.005;

      // Draw subtle background glowing radial haze
      const gradient = ctx.createRadialGradient(width / 2, height / 2, 20, width / 2, height / 2, Math.max(100, width * 0.5));
      gradient.addColorStop(0, "rgba(21, 5, 35, 0.5)");
      gradient.addColorStop(1, "rgba(5, 1, 10, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render 3D depth floating particles
      particles.forEach((p) => {
        p.y -= p.speed * p.z;
        p.x += Math.sin(angle + p.y * 0.01) * 0.2;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.shadowBlur = 8 * p.z;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  const handleCardClick = (item: GuidelineItem, e: React.MouseEvent) => {
    romanticSynth.playSparkle();
    setSelectedItem(item);

    // Create a local ripple sparkle explosion
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newSparkle = { x, y, id: Date.now() };
    setSparkleBurst((prev) => [...prev, newSparkle]);

    setTimeout(() => {
      setSparkleBurst((prev) => prev.filter((s) => s.id !== newSparkle.id));
    }, 1000);
  };

  const sealTheCovenant = () => {
    romanticSynth.playSparkle();
    romanticSynth.playWhoosh();
    setIsPromised(!isPromised);
  };

  return (
    <section 
      id="fatima-love-guidelines"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-24 px-4 md:px-8 border-b border-zinc-900 select-none"
    >
      {/* Background Interactive Canvas */}
      <div className="absolute inset-0 z-0 opacity-80">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Outer Glow Borders simulating premium 3D luxury panel */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#B76E79]/20 to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Modern Interactive Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 bg-black/60 text-[#D4AF37] text-xs mb-6 uppercase tracking-[0.25em] shadow-[0_0_15px_rgba(212,175,55,0.1)] backdrop-blur-md">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[10px] font-bold">Chapter 9.7: Divine Rules of Love</span>
          </div>

          <h2 className="text-4xl md:text-7xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight leading-none mb-6 italic">
            Fatima's Do's & Don'ts ✨
          </h2>

          <p className="max-w-2xl text-sm md:text-base text-zinc-300 font-light font-serif leading-relaxed italic">
            Our private, beautiful handbook of romantic boundaries. Navigating the sweet sacred gestures we embrace, and the playful hygienic rules we honor.
          </p>

          {/* Luxury Tab Switcher */}
          <div className="flex p-1 mt-10 rounded-full border border-zinc-800 bg-zinc-950/80 backdrop-blur-md shadow-inner">
            <button
              onClick={() => { romanticSynth.playSparkle(); setActiveTab("all"); }}
              className={`px-6 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                activeTab === "all" 
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#B76E79] text-black shadow-md font-semibold" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All Guidelines
            </button>
            <button
              onClick={() => { romanticSynth.playSparkle(); setActiveTab("dos"); }}
              className={`px-6 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                activeTab === "dos" 
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md font-semibold" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Hygienic Do's 💚
            </button>
            <button
              onClick={() => { romanticSynth.playSparkle(); setActiveTab("donts"); }}
              className={`px-6 py-2 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                activeTab === "donts" 
                  ? "bg-gradient-to-r from-rose-500 to-[#B76E79] text-white shadow-md font-semibold" 
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Unhygienic Don'ts 🛑
            </button>
          </div>
        </motion.div>

        {/* 3D Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-20">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={(e) => handleCardClick(item, e)}
                className={`group relative p-6 rounded-2xl border bg-gradient-to-b from-zinc-950 to-black backdrop-blur-md cursor-pointer transition-all duration-300 shadow-lg select-none overflow-hidden ${
                  item.type === "do" 
                    ? "border-emerald-500/10 hover:border-emerald-500/40" 
                    : "border-rose-500/15 hover:border-rose-500/40"
                }`}
              >
                {/* Embedded Ripple Sparkles */}
                {sparkleBurst.map((s) => (
                  <span
                    key={s.id}
                    className="absolute pointer-events-none rounded-full bg-yellow-400/20 animate-ping"
                    style={{ left: s.x, top: s.y, width: 40, height: 40 }}
                  />
                ))}

                {/* Subtly Glowing Radial Inner Backdrop */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${item.accentGlow} opacity-30 transition-opacity group-hover:opacity-60 duration-300`} />

                {/* Category indicator badges */}
                <div className="absolute top-4 right-4 flex items-center">
                  {item.type === "do" ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-2.5 h-2.5" /> Do
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-[#B76E79] border border-rose-500/20">
                      <X className="w-2.5 h-2.5" /> Don't
                    </span>
                  )}
                </div>

                {/* Huge Beautiful 3D Style Emoji Display */}
                <div className="text-5xl my-4 transform transition-transform group-hover:scale-125 group-hover:rotate-6 duration-300 select-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  {item.emoji}
                </div>

                {/* Info block */}
                <h3 className="text-lg font-serif font-light text-zinc-100 group-hover:text-white mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-4">
                  {item.desc}
                </p>

                {/* Interactive Action Tip */}
                <div className="text-[10px] font-mono text-zinc-500 group-hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  <Sparkle className="w-3 h-3 text-[#D4AF37]/50 group-hover:animate-spin" />
                  <span>Click to reveal note</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Detailed Guidelines Popover (Dynamic Drawer style) */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedItem(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, filter: "blur(5px)" }}
                animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ scale: 0.9, y: 20, filter: "blur(5px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full max-w-lg rounded-3xl p-8 border bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-center shadow-2xl ${
                  selectedItem.type === "do" ? "border-emerald-500/30" : "border-rose-500/30"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Icon display */}
                <div className="text-7xl mb-6 select-none animate-bounce drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                  {selectedItem.emoji}
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase mb-4 tracking-wider bg-zinc-900">
                  {selectedItem.type === "do" ? (
                    <span className="text-emerald-400">Hygienic Pure Gesture</span>
                  ) : (
                    <span className="text-[#B76E79]">Unhygienic Restricted</span>
                  )}
                </div>

                <h3 className="text-3xl font-serif text-white tracking-wide mb-3">
                  {selectedItem.title}
                </h3>
                <p className="text-sm text-zinc-300 mb-6 leading-relaxed font-serif">
                  "{selectedItem.desc}"
                </p>

                {/* Rehman's Romantic Comment Box */}
                <div className="bg-zinc-950/90 border border-zinc-800/80 p-5 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#D4AF37] to-[#B76E79]" />
                  <p className="text-[11px] font-mono uppercase text-[#D4AF37] tracking-widest text-left mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Rehman's Devoted Response:</span>
                  </p>
                  <p className="text-xs md:text-sm text-rose-100/90 italic font-serif leading-relaxed text-left">
                    "{selectedItem.playfulNote}"
                  </p>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="mt-8 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 text-xs tracking-wider uppercase transition-all"
                >
                  Close parameters
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- THE HOLY PROMISE VAULT (Aesthetic Twist at the End) --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl rounded-3xl p-8 md:p-12 border border-[#D4AF37]/25 bg-gradient-to-b from-zinc-950/80 to-[#12020a]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center flex flex-col items-center"
        >
          {/* Decorative Corner Stars */}
          <div className="absolute top-6 left-6 text-[#D4AF37]/30 text-xl">✦</div>
          <div className="absolute bottom-6 right-6 text-[#D4AF37]/30 text-xl">✦</div>
          
          <div className="absolute -right-32 -top-32 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] uppercase tracking-widest mb-6">
            <Lock className="w-3 h-3" />
            <span>The Covenant of Trust</span>
          </div>

          <h3 className="text-2xl md:text-5xl font-serif text-white tracking-tight leading-tight mb-4">
            Mera Pakka Promise ❤️
          </h3>

          <p className="max-w-2xl text-xs md:text-sm text-zinc-400 font-serif leading-relaxed italic mb-8">
            Some boundaries are sacred. By locking this scroll, Rehman promises with absolute fidelity to cherish his beautiful Malkan with utmost respect, safety, and care.
          </p>

          {/* Interactive Locking Shield Button */}
          <motion.div
            className="relative z-10 cursor-pointer mb-10"
            onMouseEnter={() => setPromiseLockHover(true)}
            onMouseLeave={() => setPromiseLockHover(false)}
            onClick={sealTheCovenant}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border transition-all duration-500 shadow-2xl ${
              isPromised 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
                : "bg-black border-[#D4AF37]/40 text-[#D4AF37] hover:border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            }`}>
              {isPromised ? (
                <Unlock className="w-8 md:w-10 h-8 md:h-10 animate-pulse" />
              ) : (
                <Lock className={`w-8 md:w-10 h-8 md:h-10 ${promiseLockHover ? "animate-bounce" : ""}`} />
              )}
            </div>
            
            {/* Pulsing outline halos */}
            <div className={`absolute -inset-2 rounded-full border border-dashed animate-spin transition-colors duration-500 ${
              isPromised ? "border-emerald-500/30" : "border-[#D4AF37]/20"
            }`} style={{ animationDuration: "12s" }} />
          </motion.div>

          {/* Sealed Promise Card Reveal */}
          <AnimatePresence mode="wait">
            {isPromised ? (
              <motion.div
                key="promised"
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-2xl bg-black/80 border border-emerald-500/20 p-6 md:p-8 rounded-2xl relative"
              >
                {/* Golden Badge Emblem */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B76E79] text-black text-[9px] font-bold uppercase tracking-widest shadow-lg">
                  SEALED FOR ETERNITY 🔐
                </div>

                <p className="text-base md:text-xl font-serif text-rose-100/95 leading-relaxed italic mb-6">
                  "I solemnly promise to you, my beautiful Queen Fatima, that I will never repeat any unhygienic things ever again. I will keep our love pure, safe, and pristine. Instead, we'll invest all our energy into infinite cuddles, cozy lap-sleeping, cheek pulling, and endless forehead kisses! You hold the absolute key to my heart."
                </p>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
                    Signed with Adoration
                  </div>
                  <div className="text-xl md:text-2xl font-serif italic text-white font-light tracking-wider">
                    — Abdul Rehman ❤️
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="not-promised"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.25em]"
              >
                Click above to seal Abdul Rehman's Dynamic Promise 📜
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </section>
  );
}
