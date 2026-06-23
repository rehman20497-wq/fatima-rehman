/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Heart, Sparkles } from "lucide-react";

export default function LoveLetter() {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);

  const lines = [
    "Meri Malkan, 👑",
    "",
    "Agar mujhe dobara zindagi milay,",
    "To har dafa main tumhein hi chununga.",
    "",
    "Tum meri mohabbat nahi,",
    "Meri aadat ho.",
    "",
    "Tum meri khushi nahi,",
    "Meri rooh ka sukoon ho.",
    "",
    "Tum meri duniya nahi,",
    "Meri poori kainaat ho. ❤️"
  ];

  useEffect(() => {
    if (!isRevealed) return;

    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let currentLines: string[] = Array(lines.length).fill("");

    const typeNextChar = () => {
      if (currentLineIdx >= lines.length) return;

      const currentLineText = lines[currentLineIdx];
      
      if (currentLineText === "") {
        // Skip empty lines immediately
        currentLineIdx++;
        currentCharIdx = 0;
        setTimeout(typeNextChar, 100);
        return;
      }

      currentLines[currentLineIdx] = currentLineText.slice(0, currentCharIdx + 1);
      setTypedLines([...currentLines]);

      if (currentCharIdx < currentLineText.length - 1) {
        currentCharIdx++;
        // Write slightly faster for smoother flow
        setTimeout(typeNextChar, 40);
      } else {
        currentLineIdx++;
        currentCharIdx = 0;
        setTimeout(typeNextChar, 500); // pause between lines
      }
    };

    typeNextChar();
  }, [isRevealed]);

  return (
    <section
      id="love-letter-section"
      className="relative w-full py-24 bg-[#05010a] overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900/60"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* Header text */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-16 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Chapter 6: The Parchment of Promises</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight">
          Handwritten Love Letter
        </h2>
        <p className="mt-4 text-zinc-400 font-serif font-light text-sm max-w-md mx-auto italic">
          An intimate, cinematic scroll detailing our absolute devotion. Click or scroll to break the wax seal.
        </p>
      </div>

      {/* Love Letter Ambient Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center">
        {/* Candle Glow Lamp effect on the side */}
        <div className="absolute -top-16 -left-12 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-16 -right-12 w-36 h-36 bg-[#B76E79]/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {!isRevealed ? (
          // Wax Seal Trigger
          <motion.div
            id="wax-seal-wrapper"
            onClick={() => setIsRevealed(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer glass-card border-[#D4AF37]/30 w-full rounded-2xl p-12 text-center shadow-2xl relative select-none border-l-4 border-l-[#D4AF37]"
          >
            {/* Pulsing seal */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-[#B76E79] border-2 border-[#B76E79]/50 flex items-center justify-center text-white text-xl shadow-lg shadow-[#B76E79]/40"
              >
                👑
              </motion.div>
            </div>

            <h3 className="text-xl font-serif font-light italic text-[#F9E29D]">
              The Sacred Envelope
            </h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto leading-relaxed font-sans font-light">
              Touch the seal to melt the wax and unfold the ink-typed love letter.
            </p>
          </motion.div>
        ) : (
          // Unfolded Letter parchment
          <motion.div
            id="unfolded-letter-paper"
            initial={{ opacity: 0, rotate: -2, y: 30 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-full bg-[#fbf9f3] text-zinc-900 rounded-2xl p-8 md:p-14 shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative overflow-hidden border border-[#D4AF37]/30 select-none"
          >
            {/* Subtle paper lines background texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#eeddbb_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

            {/* Candle glow light overlay */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Paper Header */}
            <div className="flex justify-between items-center border-b border-amber-900/10 pb-6 mb-8">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#B76E79]" /> Eternal Devotion
              </span>
              <Heart className="w-5 h-5 text-[#B76E79] fill-[#B76E79]/20" />
            </div>

            {/* Ink Writing Text Area */}
            <div className="flex flex-col gap-3 min-h-[350px] font-serif font-light italic text-amber-950 text-lg md:text-xl leading-relaxed text-left">
              {typedLines.map((line, idx) => (
                <div key={idx} className="min-h-[1.5rem]">
                  {line}
                </div>
              ))}
            </div>

            {/* Paper Footer */}
            <div className="border-t border-amber-900/10 pt-6 mt-8 flex justify-between items-center text-xs text-amber-800/60 font-serif italic">
              <span>Aariz-e-Tamana</span>
              <span>Always Yours</span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
