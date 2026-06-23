/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { INFINITE_REASONS } from "../types";
import { Star, Heart } from "lucide-react";

export default function ForeverWall() {
  // Let's divide reasons into 3 separate rows for dynamic parallax speed
  const firstRow = INFINITE_REASONS.slice(0, 7);
  const secondRow = INFINITE_REASONS.slice(7, 14);
  const thirdRow = INFINITE_REASONS.slice(14);

  return (
    <section
      id="forever-wall-reasons"
      className="relative w-full py-24 bg-gradient-to-b from-black via-[#06000b] to-black overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900 select-none"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-xs mb-4"
        >
          <Star className="w-3.5 h-3.5 text-purple-400" />
          <span>Chapter 8: The Endless Register of Devotion</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 tracking-tight">
          Forever Wall of Reasons
        </h2>
        <p className="mt-4 text-zinc-500 font-light text-sm max-w-md mx-auto">
          An endless sliding canvas detailing the infinite micro-reasons why my heart belongs completely to you.
        </p>
      </div>

      {/* Endless Horizontal Sliding Tracks */}
      <div className="relative z-10 w-full flex flex-col gap-6 overflow-hidden py-4">
        
        {/* Row 1 - Sliding Left */}
        <div className="w-full flex overflow-hidden">
          <div className="flex gap-4 animate-marquee-left whitespace-nowrap">
            {[...firstRow, ...firstRow].map((reason, idx) => (
              <div
                key={`${reason.id}-r1-${idx}`}
                className="inline-flex items-center gap-3 bg-zinc-950/40 border border-white/5 hover:border-rose-500/20 px-6 py-4 rounded-2xl backdrop-blur-md transition-all shadow-xl"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-sans font-medium text-rose-100">
                    {reason.text}
                  </span>
                  {reason.urduText && (
                    <span className="text-xs text-zinc-500 font-sans mt-1">
                      {reason.urduText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Sliding Right */}
        <div className="w-full flex overflow-hidden">
          <div className="flex gap-4 animate-marquee-right whitespace-nowrap">
            {[...secondRow, ...secondRow].map((reason, idx) => (
              <div
                key={`${reason.id}-r2-${idx}`}
                className="inline-flex items-center gap-3 bg-zinc-950/40 border border-white/5 hover:border-rose-500/20 px-6 py-4 rounded-2xl backdrop-blur-md transition-all shadow-xl"
              >
                <Heart className="w-4 h-4 text-amber-400 fill-amber-400/10 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-sans font-medium text-rose-100">
                    {reason.text}
                  </span>
                  {reason.urduText && (
                    <span className="text-xs text-zinc-500 font-sans mt-1">
                      {reason.urduText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Sliding Left */}
        <div className="w-full flex overflow-hidden">
          <div className="flex gap-4 animate-marquee-left whitespace-nowrap">
            {[...thirdRow, ...thirdRow].map((reason, idx) => (
              <div
                key={`${reason.id}-r3-${idx}`}
                className="inline-flex items-center gap-3 bg-zinc-950/40 border border-white/5 hover:border-rose-500/20 px-6 py-4 rounded-2xl backdrop-blur-md transition-all shadow-xl"
              >
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500/20 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-sans font-medium text-rose-100">
                    {reason.text}
                  </span>
                  {reason.urduText && (
                    <span className="text-xs text-zinc-500 font-sans mt-1">
                      {reason.urduText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Decorative gradient overlay screens on horizontal edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none z-20" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none z-20" />
    </section>
  );
}
