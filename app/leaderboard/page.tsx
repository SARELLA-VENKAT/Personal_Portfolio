"use client";

import { motion, useScroll, useTransform, useVelocity, useSpring } from "motion/react";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import SoundEffects from "@/utils/audio";
import { supabase } from "@/utils/supabaseClient";
import ScrambleText from "@/components/ScrambleText";

export interface LeaderboardItem {
  rank: string;
  domain: string;
  score: number;
  label: string;
  tagline: string;
  crime: string;
  color: string;
}

interface PlaneProps {
  item: LeaderboardItem;
  index: number;
  smoothVelocity: any;
}

function Plane({ item, index, smoothVelocity }: PlaneProps) {
  const [hovered, setHovered] = useState(false);

  // Map scroll velocity to 3D rotation, skew, and translation depth
  const rotateY = useTransform(smoothVelocity, [-3000, 3000], [-30, 30]);
  const skewX = useTransform(smoothVelocity, [-3000, 3000], [-10, 10]);
  const z = useTransform(smoothVelocity, [-3000, 3000], [-100, 0]);

  const yOffset = index % 2 === 0 ? 30 : -30;

  return (
    <motion.div
      className="plane relative flex flex-col justify-between p-6 bg-[#0c0c0c] border-[3px] border-black transition-colors"
      style={{
        width: 320,
        height: 420,
        y: yOffset,
        rotateY,
        skewX,
        z,
        transformStyle: "preserve-3d",
        boxShadow: hovered ? `8px 8px 0 ${item.color}` : "8px 8px 0 #000",
        borderColor: hovered ? item.color : "#222",
      }}
      whileHover={{
        scale: 1.08,
        z: 80,
        rotateY: 0,
        rotateX: 0,
        transition: { duration: 0.25, ease: "easeOut" }
      }}
      onMouseEnter={() => {
        setHovered(true);
        SoundEffects.playTick();
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {/* Neo-brutalist header */}
      <div className="flex justify-between items-start">
        <span className="text-sm font-black opacity-60 text-white/50">{item.rank}</span>
        <span
          className="border-[2px] border-black px-2 py-0.5 text-[9px] font-black uppercase text-black"
          style={{ background: item.color }}
        >
          {item.label}
        </span>
      </div>

      {/* Main Preview Container */}
      <div 
        className="flex-1 my-5 border-[3px] border-black bg-black p-4 flex flex-col justify-between overflow-hidden relative"
        style={{ boxShadow: "inset 0 0 15px rgba(0,0,0,0.8)" }}
      >
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px]" />
        
        <div className="z-10 flex flex-col items-center justify-center flex-1">
          <div className="text-6xl font-black tracking-tighter text-white" style={{ textShadow: `0 0 10px ${item.color}55` }}>
            {item.score}
          </div>
          <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-white/40">ROAST SCORE</div>
        </div>

        <div className="z-10 text-[10px] font-bold text-white/60 border-t border-white/20 pt-2 break-all font-mono leading-normal">
          {hovered ? (
            <ScrambleText text={item.domain} duration={500} trigger={hovered} />
          ) : (
            item.domain
          )}
        </div>
      </div>

      {/* Info footer */}
      <div className="space-y-2 select-none font-sans">
        <p className="text-xs font-black uppercase text-white/95 leading-tight font-mono">
          {item.tagline}
        </p>
        <p className="text-[10px] font-bold text-white/40 leading-snug">
          {item.crime}
        </p>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 450 });

  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Fetch leaderboard data from Supabase
  useEffect(() => {
    async function getLeaderboard() {
      try {
        const { data, error: dbErr } = await supabase
          .from("roast_leaderboard")
          .select("*")
          .order("score", { ascending: true }); // Worst score first (lower score = harder roast)

        if (dbErr) throw dbErr;

        let records = data || [];

        // Fallback default mock entries if database table is empty
        if (records.length === 0) {
          records = [
            {
              domain: "bloated-enterprise.com",
              score: 12,
              label: "ENTERPRISE SLUDGE",
              tagline: "A monument to corporate committee design.",
              crime: "50MB JavaScript payload, 3 nested cookie modals, and a hidden navigation.",
              color: "#ff2d1a",
            },
            {
              domain: "ai-wrapper-v9.io",
              score: 14,
              label: "WRAPPER APOCALYPSE",
              tagline: "Just an OpenAI API key dressed up in black-and-white neon.",
              crime: "Auto-reoccurring subscription modal triggers before the landing page can load.",
              color: "#00f0ff",
            },
            {
              domain: "crypto-clicker.gg",
              score: 19,
              label: "WEB3 BLUNDER",
              tagline: "Connecting your wallet is the only functional button.",
              crime: "34 metamask popup requests on mount and a background spinning at 120 HZ.",
              color: "#ff00ea",
            },
            {
              domain: "no-mobile-ux.net",
              score: 23,
              label: "DESKTOP DINOSAUR",
              tagline: "Looks incredible as long as your viewport is exactly 1920x1080.",
              crime: "Uses layout tables, horizontal scrolls on mobile views, and image texts.",
              color: "#ffb700",
            },
          ];
        }

        const formatted = records.map((dbItem: any, idx: number) => ({
          rank: String(idx + 1).padStart(2, "0"),
          domain: dbItem.domain,
          score: dbItem.score,
          label: dbItem.label,
          tagline: dbItem.tagline,
          crime: dbItem.crime,
          color: dbItem.color,
        }));

        setItems(formatted);
      } catch (err: any) {
        console.error("Supabase load failed, rendering fallback data:", err);
        // Fallback silently to display placeholder neo-brutalist data rather than crashing
        const fallback = [
          {
            rank: "01",
            domain: "bloated-enterprise.com",
            score: 12,
            label: "ENTERPRISE SLUDGE",
            tagline: "A monument to corporate committee design.",
            crime: "50MB JavaScript payload, 3 nested cookie modals, and a hidden navigation.",
            color: "#ff2d1a",
          },
          {
            rank: "02",
            domain: "ai-wrapper-v9.io",
            score: 14,
            label: "WRAPPER APOCALYPSE",
            tagline: "Just an OpenAI API key dressed up in black-and-white neon.",
            crime: "Auto-reoccurring subscription modal triggers before the landing page can load.",
            color: "#00f0ff",
          },
        ];
        setItems(fallback);
      } finally {
        setLoading(false);
      }
    }

    getLeaderboard();
  }, []);

  // Map scroll progress to horizontal translation dynamically based on items count
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${Math.max(0, (items.length - 2) * 12)}%`]);

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
    <div
      ref={containerRef}
      className="relative min-h-[400vh] bg-black font-mono text-white"
    >
      {/* Sticky view viewport */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden flex flex-col justify-between">
        
        {/* Header Nav */}
        <header className="z-20 flex items-center justify-between border-b-[3px] border-[#222] bg-black px-5 py-3 sm:px-8">
          <span className="text-xs font-black uppercase tracking-tight text-white/90">
            SARELLA VENKAT // BRUTAL LEADERBOARD V1.0
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="border-[3px] border-[#222] bg-[#111] hover:bg-[#222] px-3 py-1.5 text-xs font-black uppercase text-white transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: isMuted ? "#111" : "#ff2d1a", borderColor: isMuted ? "#222" : "black" }}
              title={isMuted ? "Unmute music" : "Mute music"}
            >
              {isMuted ? "🔇 MUSIC OFF" : "🔊 MUSIC ON"}
            </button>
            <Link
              href="/roast"
              className="border-[3px] border-[#222] bg-[#111] hover:bg-white hover:text-black hover:border-black px-3 py-1.5 text-xs font-black uppercase transition-colors"
            >
              ROAST MY SITE →
            </Link>
            <Link
              href="/"
              className="border-[3px] border-[#222] bg-[#111] hover:bg-white hover:text-black hover:border-black px-3 py-1.5 text-xs font-black uppercase transition-colors"
            >
              ← PORTFOLIO
            </Link>
          </div>
        </header>

        {/* Viewport for 3D elements */}
        <div 
          className="relative flex-1 w-full flex items-center justify-start overflow-hidden"
          style={{ perspective: 1200 }}
        >
          {/* Huge background headline */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
            <h1 className="text-[12vw] font-black uppercase text-[#111] leading-none tracking-tighter transform -translate-y-12">
              ROAST HALL OF FAME
            </h1>
          </div>

          {loading ? (
            <div className="w-full flex flex-col items-center justify-center gap-3">
              <div className="h-4 w-4 border-[3px] border-[#ff2d1a] border-t-transparent rounded-full animate-spin" />
              <div className="text-[10px] font-black tracking-widest text-[#ff2d1a] uppercase animate-pulse">
                fetching record books ...
              </div>
            </div>
          ) : (
            /* Scrolling Planes Container */
            <motion.div
              className="flex gap-10 px-[15vw] items-center"
              style={{
                x,
                transformStyle: "preserve-3d",
              }}
            >
              {items.map((item, i) => (
                <Plane
                  key={item.domain + i}
                  item={item}
                  index={i}
                  smoothVelocity={smoothVelocity}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Bottom instructions */}
        <footer className="z-10 border-t border-[#222] bg-black p-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          SCROLL DOWN TO NAVIGATE THE HALL OF SHAME • HOVER ON CARDS TO LIFT & INSPECT
        </footer>

      </div>
    </div>
  );
}
