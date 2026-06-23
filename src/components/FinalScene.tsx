/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles } from "lucide-react";

const FINAL_LINES = [
  "Meri Malkan 👑",
  "Meri Begam ❤️",
  "Meri Jaan 🌹",
  "Mera Sakoon 🌙",
  "Meri Lakht-e-Jigar 💖",
  "Meri Antal Hayat ✨",
  "Mera Bacha 🥺",
  "Aaj...",
  "Kal...",
  "Aur Hamesha... 💍"
];

export default function FinalScene() {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIdx((prev) => (prev + 1) % FINAL_LINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="eternal-final-scene"
      className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Floating stardust background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,20,100,0.1),transparent_70%)] pointer-events-none" />

      {/* Scattered background stars */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        <div className="absolute top-[30%] left-[80%] w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse delay-500" />
        <div className="absolute top-[70%] left-[15%] w-1 h-1 bg-amber-200 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-[80%] left-[75%] w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-750" />
        <div className="absolute top-[40%] left-[45%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-300" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Giant Pulsing Heart Canvas/SVG */}
        <div className="relative flex items-center justify-center w-80 h-80 md:w-[450px] md:h-[450px] mb-12">
          {/* Animated Glow rings */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.45, 0.15]
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"
          />

          {/* Central Beating vector heart container */}
          <motion.div
            animate={{
              scale: [1, 1.12, 0.98, 1.15, 1],
              filter: [
                "drop-shadow(0 0 15px rgba(244,63,94,0.3))",
                "drop-shadow(0 0 35px rgba(244,63,94,0.7))",
                "drop-shadow(0 0 15px rgba(244,63,94,0.3))",
                "drop-shadow(0 0 40px rgba(244,63,94,0.8))",
                "drop-shadow(0 0 15px rgba(244,63,94,0.3))"
              ]
            }}
            transition={{
              duration: 2.0,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full h-full flex items-center justify-center text-rose-500/10"
          >
            <Heart className="w-full h-full text-rose-500 fill-rose-500/5 stroke-rose-500/40 stroke-[0.5]" />
          </motion.div>

          {/* Inside Heart Texts */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-8">
            <span className="text-amber-400 font-mono tracking-widest text-[10px] uppercase mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Forever Yours
            </span>

            <AnimatePresence mode="wait">
              <motion.h3
                key={lineIdx}
                initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(6px)" }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 leading-tight drop-shadow-lg text-center"
              >
                {FINAL_LINES[lineIdx]}
              </motion.h3>
            </AnimatePresence>

            <span className="text-rose-300/40 text-sm font-light mt-6">
              Hamesha Hamesha...
            </span>
          </div>
        </div>

        {/* Closing subtle watermark of eternal presence */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.45 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 1 }}
          className="text-xs font-mono tracking-[0.2em] text-zinc-600 uppercase"
        >
          An Eternal Digital Sanctuary Crafted with Love 💍
        </motion.div>

      </div>
    </section>
  );
}
