"use client";

import { useState } from "react";
import ScrambleText from "./ScrambleText";
import SoundEffects from "@/utils/audio";

const ADJECTIVES = [
  "LIGHTNING-FAST",
  "AI-POWERED",
  "BULLETPROOF",
  "EFFORTLESS",
  "SCALABLE",
  "FULL-STACK",
  "REAL-TIME",
  "INTELLIGENT",
  "AUTOMATED",
  "HIGH-PERFORMANCE",
];

const NOUNS = [
  "WEB APPS",
  "AI TOOLS",
  "PLATFORMS",
  "PRODUCTS",
  "SYSTEMS",
  "EXPERIENCES",
  "DASHBOARDS",
  "PORTALS",
  "AUTOMATIONS",
];

const TARGETS = [
  "founders who ship fast",
  "startups who want real results",
  "clients who hate boring",
  "teams who think big",
  "builders who refuse to look generic",
  "companies needing AI integrations",
  "non-profits serving communities",
  "anyone tired of slow templates",
];

export default function PitchShuffler() {
  const [adj, setAdj] = useState(ADJECTIVES[0]);
  const [noun, setNoun] = useState(NOUNS[0]);
  const [target, setTarget] = useState(TARGETS[0]);
  const [triggerCount, setTriggerCount] = useState(0);

  const shuffle = () => {
    setAdj(ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]);
    setNoun(NOUNS[Math.floor(Math.random() * NOUNS.length)]);
    setTarget(TARGETS[Math.floor(Math.random() * TARGETS.length)]);
    setTriggerCount(prev => prev + 1);
    SoundEffects.playChirp();
  };

  return (
    <section className="py-14 sm:py-20">
      <div
        className="border-[3px] border-black bg-white p-6 sm:p-10"
        style={{ boxShadow: "8px 8px 0 #000" }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-black/50">
          // the elevator pitch, randomised
        </div>
        <p className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-5xl">
          I build{" "}
          <button
            onClick={shuffle}
            onMouseEnter={() => SoundEffects.playTick()}
            className="inline-block border-[3px] border-black px-2 align-middle text-black transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--accent)" }}
          >
            <ScrambleText text={adj} duration={300} trigger={triggerCount} />
          </button>{" "}
          <button
            onClick={shuffle}
            onMouseEnter={() => SoundEffects.playTick()}
            className="inline-block border-[3px] border-black px-2 align-middle text-black transition-transform hover:-translate-y-0.5"
            style={{ background: "var(--accent)" }}
          >
            <ScrambleText text={noun} duration={300} trigger={triggerCount} />
          </button>{" "}
          for <ScrambleText text={target} duration={400} trigger={triggerCount} />.
        </p>
        <button
          onClick={shuffle}
          onMouseEnter={() => SoundEffects.playTick()}
          className="mt-6 border-[3px] border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-1 active:translate-y-0"
        >
          ⟳ shuffle the pitch
        </button>
      </div>
    </section>
  );
}
