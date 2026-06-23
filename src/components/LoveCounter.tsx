/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, CalendarClock, Flame } from "lucide-react";

export default function LoveCounter() {
  // Setup romantic epoch: say, January 17th, 2026 at 00:00 (customizable base date)
  const romanticEpoch = new Date("2026-01-17T00:00:00").getTime();
  const [timeState, setTimeState] = useState({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diffMs = now - romanticEpoch;

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const daysTotal = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      const years = Math.floor(daysTotal / 365.25);
      const remainingDaysAfterYears = daysTotal % 365.25;
      
      const months = Math.floor(remainingDaysAfterYears / 30.4375);
      const remainingDaysAfterMonths = Math.floor(remainingDaysAfterYears % 30.4375);

      const weeks = Math.floor(remainingDaysAfterMonths / 7);
      const days = remainingDaysAfterMonths % 7;

      setTimeState({
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [romanticEpoch]);

  const timeBlocks = [
    { label: "Years", value: timeState.years, color: "from-amber-400 to-yellow-500" },
    { label: "Months", value: timeState.months, color: "from-rose-400 to-pink-500" },
    { label: "Weeks", value: timeState.weeks, color: "from-pink-500 to-fuchsia-500" },
    { label: "Days", value: timeState.days, color: "from-fuchsia-500 to-purple-600" },
    { label: "Hours", value: timeState.hours, color: "from-purple-600 to-indigo-500" },
    { label: "Minutes", value: timeState.minutes, color: "from-indigo-500 to-blue-500" },
    { label: "Seconds", value: timeState.seconds, color: "from-blue-500 to-teal-400" },
  ];

  return (
    <section
      id="infinite-love-counter-section"
      className="relative w-full py-24 bg-[#05000a] overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,117,140,0.06),transparent_60%)] pointer-events-none" />

      {/* Title block */}
      <div className="relative z-10 text-center max-w-2xl px-6 mb-16 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs mb-4"
        >
          <CalendarClock className="w-3.5 h-3.5 text-rose-400" />
          <span>Chapter 4: The Endless Ledger of Seconds</span>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-300 to-pink-500 tracking-tight">
          I Have Loved You For
        </h2>
        <p className="mt-4 text-zinc-400 font-light text-sm md:text-base leading-relaxed">
          Our hearts aligned on <span className="text-rose-300 font-medium">January 17, 2026</span>. Every breath since that divine day is a continuous record of absolute adoration, ticking forever.
        </p>
      </div>

      {/* Grid of counters */}
      <div className="relative z-10 w-full max-w-5xl px-6 grid grid-cols-2 md:grid-cols-7 gap-4">
        {timeBlocks.map((block, index) => (
          <motion.div
            key={block.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="bg-zinc-950/40 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md relative overflow-hidden group hover:border-rose-500/20 transition-all select-none"
          >
            {/* Hover card border glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest mb-2">
              {block.label}
            </span>

            {/* Glowing ticking value */}
            <motion.div
              key={block.value}
              initial={{ opacity: 0.4, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-4xl md:text-5xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-b ${block.color} drop-shadow-[0_0_15px_rgba(255,117,140,0.15)]`}
            >
              {block.value.toString().padStart(2, "0")}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Heart beat emblem underneath */}
      <div className="relative z-10 mt-16 flex flex-col items-center select-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1, 1.15, 1],
            filter: ["drop-shadow(0 0 5px rgba(244,63,94,0.4))", "drop-shadow(0 0 20px rgba(244,63,94,0.8))", "drop-shadow(0 0 5px rgba(244,63,94,0.4))"]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="p-4 rounded-full border border-rose-500/20 bg-rose-500/5"
        >
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500/30" />
        </motion.div>
        
        <span className="text-xs font-mono tracking-widest text-zinc-500 uppercase mt-4 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500" /> Ticking towards eternity
        </span>
      </div>
    </section>
  );
}
