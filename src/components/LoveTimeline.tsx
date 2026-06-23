/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TIMELINE_EVENTS, TimelineEvent } from "../types";
import { romanticSynth } from "../utils/audio";
import { Sparkles, Heart, MessageCircle, Smile, Star, BookOpen, CloudMoon, ShieldCheck, Milestone } from "lucide-react";

export default function LoveTimeline() {
  const [activeEvent, setActiveEvent] = useState<TimelineEvent | null>(null);

  const getIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "sparkles": return <Sparkles className={className} />;
      case "message-circle": return <MessageCircle className={className} />;
      case "smile": return <Smile className={className} />;
      case "heart": return <Heart className={className} />;
      case "star": return <Star className={className} />;
      case "book-open": return <BookOpen className={className} />;
      case "cloud-moon": return <CloudMoon className={className} />;
      case "shield-check": return <ShieldCheck className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const handleEventClick = (event: TimelineEvent) => {
    romanticSynth.playSparkle();
    setActiveEvent(event);
  };

  return (
    <section
      id="timeline-love-story"
      className="relative w-full py-24 bg-[#05010a] overflow-hidden flex flex-col items-center border-b border-zinc-900/60"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-16 select-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-4 font-sans"
        >
          <Milestone className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Chapter 3: The Chronicle of Us</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-serif font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] tracking-tight">
          Timeline Love Story
        </h2>
        <p className="mt-4 text-zinc-400 font-sans font-light text-sm md:text-base">
          A luxury collection of the moments that shaped our forever. Click each milestone card to unfold a beautiful memory.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative w-full max-w-4xl px-6 z-10 flex flex-col items-center">
        {/* Center Vertical Connecting Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-[#D4AF37]/40 via-[#B76E79]/40 to-transparent pointer-events-none" />

        <div className="w-full flex flex-col gap-12 relative">
          {TIMELINE_EVENTS.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                className={`flex w-full items-center justify-between relative ${
                  isLeft ? "flex-row" : "flex-row-reverse"
                }`}
              >
                {/* Content block */}
                <div className="w-[45%] flex flex-col items-stretch">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -4 }}
                    onClick={() => handleEventClick(event)}
                    className="cursor-pointer glass-card p-6 rounded-2xl relative shadow-2xl transition-all select-none border-l-2 border-l-[#D4AF37]"
                  >
                    {/* Top glow */}
                    <div className="absolute top-0 inset-x-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-[#D4AF37] to-[#B76E79]" />

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/15 to-[#B76E79]/15 text-white font-semibold flex items-center justify-center shadow-lg border border-[#D4AF37]/25">
                        {getIcon(event.icon, "w-4 h-4 text-[#D4AF37]")}
                      </div>
                      
                      <div>
                        <h3 className="font-serif font-light italic text-lg text-[#F9E29D]">
                          {event.title}
                        </h3>
                        <span className="text-[10px] font-mono tracking-widest text-[#B76E79] uppercase">
                          Milestone {index + 1}
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed font-sans font-light">
                      {event.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs text-[#B76E79] font-serif italic">
                        Open memory card ✦
                      </span>
                      <span className="text-xs text-zinc-500 font-sans font-semibold">
                        {event.urduTitle}
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Central Circle Pin */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                  <motion.div
                    whileInView={{ scale: [0.8, 1.2, 1] }}
                    className="w-6 h-6 rounded-full bg-[#05010a] border-2 border-[#D4AF37]/60 flex items-center justify-center shadow-lg shadow-[#D4AF37]/20"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#B76E79]" />
                  </motion.div>
                </div>

                {/* Empty block to balance layout on opposite side */}
                <div className="w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Luxury Milestone Memory Overlay Modal */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div
            key="timeline-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, filter: "blur(10px)" }}
              animate={{ scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ scale: 0.9, y: 30, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl rounded-3xl border border-[#D4AF37]/30 bg-[#05010a] p-8 md:p-10 text-center shadow-[0_0_60px_rgba(212,175,55,0.15)] overflow-hidden select-none border-l-4 border-l-[#D4AF37]"
            >
              {/* Dynamic light ray element behind */}
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 bg-[#B76E79]/20 pointer-events-none" />

              {/* Top design brand */}
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-gradient-to-br from-[#D4AF37]/10 to-[#B76E79]/10 text-white font-semibold flex items-center justify-center shadow-2xl border border-[#D4AF37]/30">
                  {getIcon(activeEvent.icon, "w-8 h-8 text-[#D4AF37]")}
                </div>
              </div>

              <span className="text-xs font-mono tracking-widest text-[#B76E79] uppercase">
                Divine Love Chronicles
              </span>
              
              <h3 className="text-3xl font-serif font-light italic text-[#F9E29D] mt-2 mb-1">
                {activeEvent.title}
              </h3>
              
              {/* Urdu Title display */}
              <h4 className="text-2xl font-normal text-rose-200 font-sans mt-2 mb-6">
                {activeEvent.urduTitle}
              </h4>

              {/* Dual Description Box */}
              <div className="flex flex-col gap-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative">
                {/* English */}
                <p className="text-sm md:text-base font-serif font-light text-zinc-300 leading-relaxed italic">
                  &ldquo;{activeEvent.description}&rdquo;
                </p>

                <div className="h-px bg-white/5 w-1/2 mx-auto" />

                {/* Urdu description in elegant text */}
                <p className="text-lg md:text-xl font-normal leading-relaxed text-[#F9E29D] font-sans">
                  {activeEvent.urduDescription}
                </p>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveEvent(null)}
                className="mt-8 px-6 py-2.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-serif font-light italic text-xs tracking-wider transition-all"
              >
                Return to Chronicle ✦
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
