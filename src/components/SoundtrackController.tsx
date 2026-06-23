/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Music, Volume2, VolumeX, Play, Pause, Upload, RotateCcw, Sliders } from "lucide-react";
import { romanticSynth } from "../utils/audio";

export default function SoundtrackController() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(40); // default 40%
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor playback state from synthesizer
  useEffect(() => {
    // If user clicked anywhere on screen to enter, the audio pad starts.
    // Let's check status periodically or sync on mount
    const syncStatus = () => {
      // Accessing synthesized pad state if running
      const isPadActive = (romanticSynth as any).isPlayingPad;
      setIsPlaying(isPadActive);
    };

    const interval = setInterval(syncStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTogglePlay = () => {
    romanticSynth.init();
    romanticSynth.resume();
    romanticSynth.playSparkle();

    if (isPlaying) {
      romanticSynth.stopAmbientPad();
      setIsPlaying(false);
    } else {
      romanticSynth.startAmbientPad();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value, 10);
    setVolume(vol);
    // Apply volume to synth mainGain
    if ((romanticSynth as any).mainGain && (romanticSynth as any).ctx) {
      const actualVolume = vol / 100;
      const ctx = (romanticSynth as any).ctx;
      (romanticSynth as any).mainGain.gain.setValueAtTime(actualVolume * 0.7, ctx.currentTime);
    }
    // Apply to custom HTML5 audio if active
    if ((romanticSynth as any).customAudio) {
      (romanticSynth as any).customAudio.volume = vol / 100;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      romanticSynth.playSparkle();
      
      // Create Object URL for the local file
      const blobUrl = URL.createObjectURL(file);
      
      // Load and replace in synthetic engine
      romanticSynth.setCustomAudioUrl(blobUrl);
      setIsPlaying(true);
      
      // Start pad to trigger the playback of custom file
      romanticSynth.startAmbientPad();
    }
  };

  const handleResetSoundtrack = () => {
    romanticSynth.playSparkle();
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Remove custom audio file URL to fallback to emotional synthesized melody
    (romanticSynth as any).customAudioUrl = null;
    if ((romanticSynth as any).customAudio) {
      (romanticSynth as any).customAudio.pause();
      (romanticSynth as any).customAudio.src = "";
    }
    // If playing, restart the synthesized progression
    if (isPlaying) {
      (romanticSynth as any).stopSynthesizedMusic();
      (romanticSynth as any).startSynthesizedMusic();
    }
  };

  return (
    <div id="soundtrack-controller-wrapper" className="fixed bottom-6 left-6 z-50 select-none">
      <div className="relative">
        
        {/* Main Floating Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => {
            romanticSynth.playSparkle();
            setIsOpen(!isOpen);
          }}
          className={`relative p-4 rounded-full glass-card border border-[#D4AF37]/30 text-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] flex items-center justify-center transition-all ${
            isOpen ? "bg-black/90 scale-105" : "bg-black/60 hover:bg-black/85"
          }`}
          aria-label="Soundtrack controls"
        >
          {/* Animated Waveform when playing */}
          {isPlaying ? (
            <div className="flex gap-0.5 items-center justify-center w-5 h-5">
              <span className="w-0.5 h-3 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
              <span className="w-0.5 h-4 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
              <span className="w-0.5 h-2 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
              <span className="w-0.5 h-3 bg-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
            </div>
          ) : (
            <Music className="w-5 h-5 text-[#D4AF37]" />
          )}

          {/* Active dot */}
          {fileName && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B76E79] shadow-md animate-ping" />
          )}
        </motion.button>

        {/* Expandable Glass Controller Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, x: -10, y: 15 }}
              animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: -10, y: 15 }}
              transition={{ duration: 0.3, type: "spring", damping: 20 }}
              className="absolute bottom-16 left-0 w-72 glass-card border border-[#D4AF37]/30 p-5 rounded-2xl shadow-2xl flex flex-col gap-4 select-none"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5 text-[#D4AF37]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-semibold">Soundscape Hub</span>
                </div>
                <div className="text-[8px] font-mono text-zinc-500 uppercase">
                  Luxury Grade
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-sans font-light">
                  {fileName ? "Custom Soundtrack" : "Emotional Cinematic Synth"}
                </span>
                
                {/* Play/Pause Button */}
                <button
                  onClick={handleTogglePlay}
                  className="p-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/25 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const nextVol = volume === 0 ? 40 : 0;
                    setVolume(nextVol);
                    const mockEvent = { target: { value: nextVol.toString() } } as any;
                    handleVolumeChange(mockEvent);
                  }}
                  className="text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <span className="text-[10px] font-mono text-zinc-400 w-6 text-right">
                  {volume}%
                </span>
              </div>

              {/* File Upload Selector */}
              <div className="border-t border-white/5 pt-3 mt-1 flex flex-col gap-2">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                  Replace with Custom Audio (MP3)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/95 text-xs transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="truncate max-w-[120px] font-sans">
                      {fileName ? fileName : "Upload MP3"}
                    </span>
                  </button>

                  {fileName && (
                    <button
                      onClick={handleResetSoundtrack}
                      className="p-2 rounded-lg bg-[#B76E79]/10 text-[#B76E79] border border-[#B76E79]/20 hover:bg-[#B76E79]/20 transition-colors"
                      title="Reset to Cinematic Synth"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Footer text */}
              <div className="text-[8px] text-center text-zinc-600 font-serif italic border-t border-white/5 pt-2">
                "Music should transition smoothly and feel emotional"
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
