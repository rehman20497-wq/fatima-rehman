/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CustomCursor from "./components/CustomCursor";
import HeroSection from "./components/HeroSection";
import LoveGalaxy from "./components/LoveGalaxy";
import FeelingsSection from "./components/FeelingsSection";
import LoveTimeline from "./components/LoveTimeline";
import LoveCounter from "./components/LoveCounter";
import HeartTunnel from "./components/HeartTunnel";
import LoveLetter from "./components/LoveLetter";
import GiftSection from "./components/GiftSection";
import ForeverWall from "./components/ForeverWall";
import MeriFatima from "./components/MeriFatima";
import AikKhuwaab from "./components/AikKhuwaab";
import RomanticTabManager from "./components/RomanticTabManager";
import FinalScene from "./components/FinalScene";
import SoundtrackController from "./components/SoundtrackController";
import { Sparkles, Heart } from "lucide-react";

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [loveSeconds, setLoveSeconds] = useState(12456782);

  // Dynamic live counter for "Time Spent Loving You"
  useEffect(() => {
    const interval = setInterval(() => {
      setLoveSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="love-app-root" className="relative w-full min-h-screen bg-[#05010a] text-white selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] overflow-x-hidden font-sans">
      
      {/* Interactive Title & Favicon Tab Manager */}
      <RomanticTabManager />

      {/* Luxury Interactive Custom Cursor Trail */}
      <CustomCursor />

      {/* Floating Interactive Soundtrack Hub */}
      <SoundtrackController />

      <AnimatePresence mode="wait">
        {!introFinished ? (
          <motion.div key="intro" className="fixed inset-0 z-50 bg-[#05010a]">
            <HeroSection onComplete={() => setIntroFinished(true)} />
          </motion.div>
        ) : (
          <motion.main
            key="main-story"
            id="romantic-story-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full flex flex-col items-center bg-[#05010a]"
          >
            {/* Ambient Background Grid & Glow Spots matching Immersive UI */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#3a0b4d] blur-[150px] opacity-25" />
              <div className="absolute bottom-[50%] right-[-5%] w-[40%] h-[40%] rounded-full bg-[#B76E79] blur-[150px] opacity-15" />
              <div className="absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#3a0b4d] blur-[150px] opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_20%,_#05010a_100%)]" />
              
              {/* Star fields */}
              <div className="absolute top-10 left-20 star w-1 h-1 bg-white rounded-full opacity-60" />
              <div className="absolute top-40 left-[400px] star w-[2px] h-[2px] bg-white rounded-full opacity-70" />
              <div className="absolute top-60 right-20 star w-1 h-1 bg-white rounded-full opacity-50" />
              <div className="absolute bottom-40 left-10 star w-[2px] h-[2px] bg-white rounded-full opacity-60" />
              <div className="absolute top-[20%] right-[30%] star w-[1px] h-[1px] bg-white rounded-full opacity-80" />
              <div className="absolute top-[75%] right-[15%] star w-1.5 h-1.5 bg-rose-400 rounded-full opacity-40 animate-pulse" />
              <div className="absolute bottom-[25%] left-[25%] star w-1 h-1 bg-amber-300 rounded-full opacity-50 animate-pulse" />
            </div>

            {/* Chapter I Custom Header / Editorial Nav */}
            <nav className="z-50 p-6 md:p-10 flex justify-between items-center w-full absolute top-0 select-none">
              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-white/50 font-sans">
                The Love Journey / Chapter I
              </div>
              <div className="flex items-center gap-4 md:gap-6">
                <div className="w-8 md:w-12 h-[1px] bg-white/20"></div>
                <div className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-[#D4AF37] font-sans">
                  Menu
                </div>
              </div>
            </nav>

            {/* SECTION 1: Welcome Message Editorial Banner */}
            <section
              id="royal-welcome-banner"
              className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-28 px-6 text-center select-none border-b border-zinc-900/60"
            >
              {/* Backglow ornament */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#B76E79]/10 rounded-full blur-3xl pointer-events-none" />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 text-[#D4AF37] text-xs mb-8"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-sans uppercase tracking-widest text-[9px]">Chapter 1: The Divine Declaration</span>
              </motion.div>

              {/* Majestic Urdu Poem / Welcome */}
              <div className="relative max-w-4xl flex flex-col items-center justify-center z-10 px-4">
                
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-6 text-[#B76E79] filter drop-shadow-[0_0_10px_rgba(183,110,121,0.4)]"
                >
                  <Heart className="w-10 h-10 fill-[#B76E79]/15" />
                </motion.div>

                <p className="text-[#B76E79] text-xs md:text-sm uppercase tracking-[0.8em] mb-4 font-sans font-medium">
                  Ek choti si duniya hai meri
                </p>

                <h1 className="text-6xl md:text-8xl font-light italic gold-text mb-6 font-serif tracking-tight leading-tight">
                  Meri Malkan
                </h1>

                {/* Main Welcome Poem lines */}
                <div className="flex flex-col gap-5 text-xl md:text-3xl font-serif font-light text-white/80 leading-relaxed max-w-2xl">
                  {["Aaj jo tum dekh rahi ho...", "Woh sirf ek website nahi.", "Woh meri mohabbat ka ek chota sa hissa hai.", "Har heartbeat mein sirf tum ho."].map((poemLine, poemIdx) => (
                    <motion.p
                      key={poemIdx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 0.95, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: poemIdx * 0.15 }}
                      className={poemIdx === 3 ? "font-normal italic text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F9E29D] to-[#B76E79] font-serif" : ""}
                    >
                      {poemLine}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* Decorative Floating Luxury Glass Cards */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* Sakoon */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [-12, -10, -12] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-[20%] left-[5%] md:left-[10%] glass-card p-4 md:p-6 rounded-full w-28 h-28 md:w-36 md:h-36 flex flex-col items-center justify-center shadow-xl"
                >
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#D4AF37] mb-1 font-sans">Mera</span>
                  <span className="text-sm md:text-lg font-serif font-light italic text-white/95">Sakoon</span>
                </motion.div>

                {/* Begam */}
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [8, 10, 8] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-[22%] right-[5%] md:right-[12%] glass-card p-5 md:p-6 rounded-full w-32 h-32 md:w-44 md:h-44 flex flex-col items-center justify-center shadow-xl"
                >
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#D4AF37] mb-1 font-sans">Meri</span>
                  <span className="text-base md:text-xl font-serif font-light italic text-white/95">Begam</span>
                </motion.div>

                {/* Jaan */}
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-5, -3, -5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute top-[40%] right-[3%] md:right-[6%] glass-card p-3 md:p-4 rounded-full w-24 h-24 md:w-28 md:h-28 flex flex-col items-center justify-center shadow-xl"
                >
                  <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 mb-1 font-sans">Meri</span>
                  <span className="text-xs md:text-sm font-serif font-light text-white/95">Jaan</span>
                </motion.div>
              </div>

              {/* Editorial bottom Left card description */}
              <div className="absolute bottom-12 left-6 md:left-12 z-20 max-w-xs md:max-w-sm hidden lg:block text-left">
                <div className="glass-card p-6 md:p-8 rounded-tr-[40px] border-l-2 border-l-[#D4AF37] backdrop-blur-md">
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-3 font-sans">How I Feel About You</h3>
                  <p className="text-xs md:text-sm leading-relaxed text-white/80 font-serif font-light italic">
                    "Tum meri subah ki pehli soch ho. Tum meri raat ka aakhri khayal ho. Tum woh sukoon ho jo har thakan mita deta hai..."
                  </p>
                </div>
              </div>

              {/* Dynamic luxury counter on the bottom right */}
              <div className="absolute bottom-12 right-6 md:right-12 z-20 text-right space-y-2 hidden lg:block select-none">
                <div className="flex items-center justify-end gap-4 mb-2">
                  <div className="flex flex-col text-right">
                    <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-white/40 font-sans">Time Spent Loving You</span>
                    <span className="text-xl md:text-2xl font-mono font-light tracking-tighter text-white/95">
                      {loveSeconds.toLocaleString()} <span className="text-[10px] md:text-[11px] uppercase text-[#B76E79] ml-1 font-sans font-medium">Seconds</span>
                    </span>
                  </div>
                </div>
                <div className="h-[1px] w-48 bg-white/10 ml-auto" />
                <div className="text-[8px] md:text-[9px] uppercase tracking-[0.5em] text-white/40 pt-1 font-sans">
                  Scroll into the Heart Tunnel
                </div>
              </div>

              {/* Scroll down indicator */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
                <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">
                  Scroll to Enter
                </span>
                <div className="w-px h-8 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse" />
              </div>
            </section>

            {/* SECTION 2: 3D Love Galaxy */}
            <LoveGalaxy />

            {/* SECTION 3: How Do You Feel About Me */}
            <FeelingsSection />

            {/* SECTION 4: Timeline Love Story */}
            <LoveTimeline />

            {/* SECTION 5: Infinite Love Counter */}
            <LoveCounter />

            {/* SECTION 6: Heart Tunnel Experience */}
            <HeartTunnel />

            {/* SECTION 7: Love Letter Section */}
            <LoveLetter />

            {/* SECTION 8: Surprise Gift Section */}
            <GiftSection />

            {/* SECTION 9: Forever Wall of Reasons */}
            <ForeverWall />

            {/* SECTION 9.5 / NEW FINAL CHAPTER: Meri Fatima */}
            <MeriFatima />

            {/* SECTION 9.8 / FINAL DREAM CHAPTER: Aik Khuwaab Tumhare Sath */}
            <AikKhuwaab />

            {/* SECTION 10: Eternal Final Scene */}
            <FinalScene />

          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

