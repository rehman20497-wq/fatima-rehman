/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class RomanticSynthesizer {
  private ctx: AudioContext | null = null;
  private mainGain: GainNode | null = null;
  private isPlayingPad = false;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private loopInterval: number | null = null;
  private melodyInterval: number | null = null;
  
  // HTML5 custom audio support
  private customAudio: HTMLAudioElement | null = null;
  private customAudioUrl: string | null = null;
  private isPlayingCustom = false;

  constructor() {
    if (typeof window !== "undefined" && typeof Audio !== "undefined") {
      try {
        this.customAudio = new Audio();
        this.customAudio.loop = true;
        // Default placeholder or custom soundtrack path if provided later
        this.customAudio.src = "";
      } catch (e) {
        console.warn("HTML5 Audio element is not supported", e);
      }
    }
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = typeof window !== "undefined" ? (window.AudioContext || (window as any).webkitAudioContext) : null;
      if (!AudioCtxClass) {
        console.warn("Web Audio API not supported/available");
        return;
      }
      this.ctx = new AudioCtxClass();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // moderate volume
      this.mainGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playHeartbeat() {
    this.init();
    this.resume();
    if (!this.ctx || !this.mainGain) return;

    const now = this.ctx.currentTime;
    
    // Low frequency beat 1
    this.triggerBeat(now, 55, 0.15, 0.25);
    // Low frequency beat 2 (double beat of heart)
    this.triggerBeat(now + 0.25, 52, 0.12, 0.22);
  }

  private triggerBeat(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);
    // Sweeping frequency down to make it a deep thud
    osc.frequency.exponentialRampToValueAtTime(10, time + duration);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.mainGain);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  }

  // Set local or custom MP3 URL
  setCustomAudioUrl(url: string) {
    this.customAudioUrl = url;
    if (this.customAudio) {
      this.customAudio.src = url;
      this.customAudio.load();
      if (this.isPlayingPad) {
        this.stopSynthesizedMusic();
        this.playCustomAudio();
      }
    }
  }

  private playCustomAudio() {
    if (!this.customAudio) return;
    this.isPlayingCustom = true;
    this.customAudio.volume = 0.4;
    this.customAudio.play().catch((err) => {
      console.warn("Autoplay block or audio error, falling back to synth", err);
      this.isPlayingCustom = false;
      this.startSynthesizedMusic();
    });
  }

  private stopCustomAudio() {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.isPlayingCustom = false;
  }

  startAmbientPad() {
    this.init();
    this.resume();
    if (this.isPlayingPad) return;
    this.isPlayingPad = true;

    // If we have a custom audio URL, prefer playing that
    if (this.customAudioUrl && this.customAudio) {
      this.playCustomAudio();
    } else {
      this.startSynthesizedMusic();
    }
  }

  private startSynthesizedMusic() {
    if (!this.ctx || !this.mainGain || !this.isPlayingPad) return;

    // Slow chord progression: Cmaj9 -> Am9 -> Fmaj9 -> G6/9 (cinematic base chords)
    const chords = [
      [130.81, 164.81, 196.00, 246.94, 293.66], // Cmaj9 (C3, E3, G3, B3, D4)
      [110.00, 146.83, 174.61, 220.00, 261.63], // Am9 (A2, D3, F3, A3, C4)
      [87.31, 130.81, 174.61, 220.00, 261.63],  // Fmaj9 (F2, C3, F3, A3, C4)
      [98.00, 146.83, 196.00, 246.94, 293.66]   // G6/9 (G2, D3, G3, B3, D4)
    ];

    // High piano notes that match the current chord
    const melodyNotes = [
      [523.25, 587.33, 659.25, 783.99, 987.77], // C5, D5, E5, G5, B5 (Chord 0)
      [440.00, 523.25, 587.33, 659.25, 783.99], // A4, C5, D5, E5, G5 (Chord 1)
      [349.23, 440.00, 523.25, 659.25, 783.99], // F4, A4, C5, E5, G5 (Chord 2)
      [392.00, 493.88, 587.33, 783.99, 880.00]  // G4, B4, D5, G5, A5 (Chord 3)
    ];

    let chordIndex = 0;
    
    const playNextChord = () => {
      if (!this.isPlayingPad || this.isPlayingCustom) return;
      const now = this.ctx!.currentTime;
      const chord = chords[chordIndex];
      
      // Fade out and stop old notes slowly
      const oldOscs = [...this.activeOscillators];
      this.activeOscillators = [];
      
      oldOscs.forEach(({ osc, gain }) => {
        try {
          gain.gain.cancelScheduledValues(now);
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
          osc.stop(now + 3.1);
        } catch (_) {}
      });

      // Start new notes with rich, warm detuning and lowpass strings effect
      chord.forEach((freq) => {
        if (!this.ctx || !this.mainGain) return;
        
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "triangle"; // Warm strings pad tone
        osc.frequency.setValueAtTime(freq, now);
        
        subOsc.type = "sine"; // Warm sub-depth
        subOsc.frequency.setValueAtTime(freq * 0.995, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(750, now + 4.0);
        filter.frequency.exponentialRampToValueAtTime(240, now + 8.0);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 3.0); // Very soft background pad
        gain.gain.setValueAtTime(0.04, now + 6.0);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 9.5);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.mainGain);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 9.8);
        subOsc.stop(now + 9.8);

        this.activeOscillators.push({ osc, gain });
      });

      // Start romantic piano-like melody triggers inside this chord
      let melodyStep = 0;
      const triggerMelodyStep = () => {
        if (!this.isPlayingPad || this.isPlayingCustom || !this.ctx) return;
        const currentNow = this.ctx.currentTime;
        const noteSet = melodyNotes[chordIndex];
        
        // Pick a note from our romantic pentatonic scale (occasionally rest for realism)
        if (Math.random() > 0.15) {
          const freq = noteSet[Math.floor(Math.random() * noteSet.length)];
          this.playPianoMelodyNote(freq, currentNow);
        }
        
        melodyStep++;
        if (melodyStep < 4 && this.isPlayingPad && !this.isPlayingCustom) {
          // schedule next note in 2 seconds
          setTimeout(triggerMelodyStep, 2000);
        }
      };
      
      triggerMelodyStep();

      chordIndex = (chordIndex + 1) % chords.length;
    };

    playNextChord();
    this.loopInterval = window.setInterval(playNextChord, 8000);
  }

  private playPianoMelodyNote(freq: number, time: number) {
    if (!this.ctx || !this.mainGain) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const delay = this.ctx.createDelay();
    const delayGain = this.ctx.createGain();

    // Sine mixed with a tiny bit of triangle gives a gorgeous, soft emotional glass-piano feel
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    // Instant attack like a piano pluck
    gain.gain.linearRampToValueAtTime(0.07, time + 0.08);
    // Warm, emotional resonance decay
    gain.gain.exponentialRampToValueAtTime(0.001, time + 3.5);

    // Dynamic delay (echo) for premium wedding soundtrack depth
    delay.delayTime.setValueAtTime(0.35, time);
    delayGain.gain.setValueAtTime(0.03, time);

    osc.connect(gain);
    gain.connect(this.mainGain);

    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.mainGain);

    osc.start(time);
    osc.stop(time + 3.8);
  }

  private stopSynthesizedMusic() {
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
    const now = this.ctx?.currentTime || 0;
    this.activeOscillators.forEach(({ osc, gain }) => {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        osc.stop(now + 1.1);
      } catch (_) {}
    });
    this.activeOscillators = [];
  }

  stopAmbientPad() {
    this.isPlayingPad = false;
    this.stopCustomAudio();
    this.stopSynthesizedMusic();
  }

  playSparkle() {
    this.init();
    this.resume();
    if (!this.ctx || !this.mainGain) return;

    const now = this.ctx.currentTime;
    
    // Sparkle frequencies (pentatonic scale of high crystal bells)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C5, E5, G5, B5, C6
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const delay = this.ctx.createDelay();
    const delayGain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(randomNote, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    // Simple echo delay
    delay.delayTime.setValueAtTime(0.3, now);
    delayGain.gain.setValueAtTime(0.05, now);

    osc.connect(gain);
    gain.connect(this.mainGain);
    
    gain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.mainGain);

    osc.start(now);
    osc.stop(now + 2.0);
  }

  playWhoosh() {
    this.init();
    this.resume();
    if (!this.ctx || !this.mainGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.mainGain);

    osc.start(now);
    osc.stop(now + 0.9);
  }
}

export const romanticSynth = new RomanticSynthesizer();
