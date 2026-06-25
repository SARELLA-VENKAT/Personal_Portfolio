class SoundEffects {
  private static audio: HTMLAudioElement | null = null;
  private static hasInitAutoResume = false;

  private static getAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audio) {
      this.audio = new Audio('/bg_music.m4a');
      this.audio.volume = 0.1; // background volume level
      if (typeof window !== "undefined") {
        (window as any)._audio = this.audio;
      }
      
      // Start from 3 seconds
      this.audio.currentTime = 3;

      // Loop back to 3 seconds when song ends
      this.audio.addEventListener("ended", () => {
        if (this.audio) {
          this.audio.currentTime = 3;
          this.audio.play().catch(() => {});
        }
      });
      
      this.initAutoResume();
    }
    return this.audio;
  }

  private static initAutoResume() {
    if (typeof window === "undefined" || this.hasInitAutoResume) return;
    this.hasInitAutoResume = true;

    const resume = () => {
      if (!this.isMuted()) {
        this.startMusic();
      }
      
      // Remove listeners once gesture detected
      window.removeEventListener("click", resume);
      window.removeEventListener("keydown", resume);
      window.removeEventListener("touchstart", resume);
    };

    window.addEventListener("click", resume);
    window.addEventListener("keydown", resume);
    window.addEventListener("touchstart", resume);
  }

  public static isMuted(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("portfolio-muted") !== "false";
  }

  public static toggleMute(): boolean {
    if (typeof window === "undefined") return true;
    const nextMuted = !this.isMuted();
    localStorage.setItem("portfolio-muted", String(nextMuted));
    
    if (nextMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }

    // Dispatch custom event to sync headers immediately
    window.dispatchEvent(new Event("portfolio-mute-change"));
    
    return nextMuted;
  }

  public static startMusic() {
    if (this.isMuted()) return;
    const audio = this.getAudio();
    if (!audio) return;

    // Trigger play (browsers might block this until user gesture)
    audio.play().catch(() => {
      this.initAutoResume();
    });
  }

  public static stopMusic() {
    const audio = this.getAudio();
    if (audio) {
      audio.pause();
    }
  }

  // Interactive sounds are disabled in favor of the background music
  public static playTick() {
    // Silent
  }

  public static playChirp() {
    // Silent
  }

  public static playSuccess() {
    if (this.isMuted()) return;
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;
      
      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.02, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Ascending retro arpeggio (C5 -> E5 -> G5 -> C6)
      playNote(523.25, now, 0.1);         // C5
      playNote(659.25, now + 0.08, 0.1);    // E5
      playNote(783.99, now + 0.16, 0.1);    // G5
      playNote(1046.50, now + 0.24, 0.25);  // C6
    } catch {
      // Ignore audio scheduling conflicts
    }
  }

  public static playFail() {
    if (this.isMuted()) return;
    if (typeof window === "undefined") return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      const playNote = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + duration);
      };

      // Descending failure tones (C4 -> G3)
      playNote(261.63, now, 0.15);
      playNote(196.00, now + 0.12, 0.3);
    } catch {
      // Ignore audio scheduling conflicts
    }
  }
}

export default SoundEffects;
