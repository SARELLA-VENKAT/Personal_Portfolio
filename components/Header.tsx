"use client";

import { useState, useEffect } from "react";
import SoundEffects from "@/utils/audio";

interface HeaderProps {
  onChaos: () => void;
}

export default function Header({ onChaos }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const muted = SoundEffects.isMuted();
    setIsMuted(muted);
    if (!muted) {
      SoundEffects.startMusic();
    }

    const handleSync = () => {
      const currentMuted = SoundEffects.isMuted();
      setIsMuted(currentMuted);
      if (currentMuted) {
        SoundEffects.stopMusic();
      } else {
        SoundEffects.startMusic();
      }
    };
    window.addEventListener("portfolio-mute-change", handleSync);
    return () => {
      window.removeEventListener("portfolio-mute-change", handleSync);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = SoundEffects.toggleMute();
    setIsMuted(nextMuted);
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b-[3px] border-black bg-white px-5 py-3 sm:px-8">
        <a
          href="#top"
          onMouseEnter={() => SoundEffects.playTick()}
          onClick={() => SoundEffects.playTick()}
          className="text-sm font-black uppercase tracking-tight sm:text-base hover:opacity-70 transition-opacity"
        >
          SARELLA VENKAT
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 sm:flex sm:gap-3">
          {["WORK", "ABOUT", "CONTACT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onMouseEnter={() => SoundEffects.playTick()}
              onClick={() => SoundEffects.playTick()}
              className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase transition-colors hover:bg-black hover:text-white"
            >
              {item}
            </a>
          ))}
          <a
            href="https://github.com/SARELLA-VENKAT"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => SoundEffects.playTick()}
            onClick={() => SoundEffects.playTick()}
            className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase transition-colors hover:bg-black hover:text-white"
          >
            GITHUB
          </a>
          <button
            onClick={toggleMute}
            onMouseEnter={() => SoundEffects.playTick()}
            className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: isMuted ? "#e5e5e5" : "var(--accent)" }}
            title={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? "🔇 MUSIC OFF" : "🔊 MUSIC ON"}
          </button>
          <button
            onClick={() => {
              onChaos();
              SoundEffects.playChirp();
            }}
            onMouseEnter={() => SoundEffects.playTick()}
            className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: "var(--accent)" }}
            title="Change accent color"
          >
            CHAOS ⚡
          </button>
        </nav>

        {/* Mobile: Chaos + Hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleMute}
            className="border-[3px] border-black px-2 py-1 text-xs font-black"
            style={{ background: isMuted ? "#e5e5e5" : "var(--accent)" }}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
          <button
            onClick={() => {
              onChaos();
              SoundEffects.playChirp();
            }}
            className="border-[3px] border-black px-2 py-1 text-xs font-black uppercase"
            style={{ background: "var(--accent)" }}
          >
            ⚡
          </button>
          <button
            onClick={() => {
              setMobileOpen(true);
              SoundEffects.playTick();
            }}
            className="border-[3px] border-black px-2 py-1 text-xs font-black uppercase"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`}>
        <button
          onClick={() => {
            setMobileOpen(false);
            SoundEffects.playTick();
          }}
          className="absolute right-5 top-4 border-[3px] border-white px-3 py-1.5 text-xs font-black uppercase text-white hover:bg-white hover:text-black transition-colors"
        >
          CLOSE ✕
        </button>
        {["WORK", "ABOUT", "CONTACT"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => {
              setMobileOpen(false);
              SoundEffects.playTick();
            }}
            onMouseEnter={() => SoundEffects.playTick()}
            className="text-4xl font-black uppercase text-white transition-colors hover:text-[var(--accent)]"
          >
            {item}
          </a>
        ))}
        <a
          href="https://github.com/SARELLA-VENKAT"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setMobileOpen(false);
            SoundEffects.playTick();
          }}
          onMouseEnter={() => SoundEffects.playTick()}
          className="text-4xl font-black uppercase text-white transition-colors hover:text-[var(--accent)]"
        >
          GITHUB
        </a>
      </div>
    </>
  );
}
