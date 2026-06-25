"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import PitchShuffler from "@/components/PitchShuffler";
import ServicesGrid from "@/components/ServicesGrid";
import WorkAccordion from "@/components/WorkAccordion";
import AboutMe from "@/components/AboutMe";
import PhilosophyCards from "@/components/PhilosophyCards";
import DragZone from "@/components/DragZone";
import RoastBanner from "@/components/RoastBanner";
import Contact from "@/components/Contact";

const ACCENT_COLORS = [
  "#ff2d1a",
  "#f5a623",
  "#00c851",
  "#9b59b6",
  "#00bfff",
  "#ff69b4",
];

export default function Portfolio() {
  const [accent, setAccent] = useState(ACCENT_COLORS[0]);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-accent");
    if (saved && ACCENT_COLORS.includes(saved)) {
      setAccent(saved);
    }
  }, []);

  const handleChaos = () => {
    const others = ACCENT_COLORS.filter((c) => c !== accent);
    const next = others[Math.floor(Math.random() * others.length)];
    setAccent(next);
    localStorage.setItem("portfolio-accent", next);
  };

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <a href="#contact" className="skip-link">Skip to contact</a>
      <Header onChaos={handleChaos} />

      <main id="top" className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <Hero />
      </main>

      <Marquee
        direction="left"
        bg="bg-black"
        textColor="text-white"
        content="SARELLA VENKAT ✺ FULL-STACK DEV ✺ AI BUILDER ✺ REACT · TYPESCRIPT · SUPABASE ✺ OPEN FOR FREELANCE ✺"
      />

      <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <PitchShuffler />
        <ServicesGrid />
      </main>

      <Marquee
        direction="right"
        bg=""
        textColor="text-black"
        style={{ background: "var(--accent)" }}
        content="Ship fast, break nothing. ✺ AI is a tool, not a trick. ✺ Clean code is a feature. ✺ Details > vibes. ✺ Build things that matter. ✺"
      />

      <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
        <WorkAccordion />
        <AboutMe />
        <PhilosophyCards />
        <DragZone />
        <RoastBanner />
      </main>

      <Contact />
    </div>
  );
}
