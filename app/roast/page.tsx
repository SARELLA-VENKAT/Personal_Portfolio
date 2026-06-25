"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import SoundEffects from "@/utils/audio";

type State = "idle" | "loading" | "done" | "error";

interface Metric {
  name: string;
  score: number;
  line: string;
}

interface RoastData {
  url: string;
  overall: number;
  label: string;
  tagline: string;
  cards: {
    load: Metric;
    visual: Metric;
    copy: Metric;
    originality: Metric;
    mobile: Metric;
    trust: Metric;
  };
  verdict: string;
}

export default function RoastPage() {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<State>("idle");
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [scannedDomain, setScannedDomain] = useState("");
  const [loadingLines, setLoadingLines] = useState<string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const [accent, setAccent] = useState("#ff2d1a");
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-accent");
    if (saved) {
      setAccent(saved);
    }
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

  const handleRoast = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    SoundEffects.playChirp();

    setState("loading");
    setRoastData(null);
    setErrorMsg("");
    setLoadingLines([]);

    // Extract domain for display
    let domain = trimmed;
    try {
      let cleanUrl = trimmed;
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = "https://" + cleanUrl;
      }
      const parsed = new URL(cleanUrl);
      domain = parsed.hostname;
    } catch {
      domain = trimmed;
    }
    setScannedDomain(domain);

    const steps = [
      `resolving dns for ${domain} ... found it, unfortunately`,
      "measuring load time ... still measuring ...",
      "counting fonts ... too many",
      "scanning for original ideas ... 0 results",
      "checking mobile layout ... oh no",
      "tallying popups ... please stop",
      "reading the copy ... out loud, in disbelief",
      "compiling roast ..."
    ];

    const fullUrl = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

    // Start API call
    let apiResponse: RoastData | null = null;
    let apiError: string | null = null;
    let apiFinished = false;

    fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: fullUrl }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || "Something went wrong");
        }
        apiResponse = data.roast;
      })
      .catch((err) => {
        apiError = err instanceof Error ? err.message : "Unknown error";
      })
      .finally(() => {
        apiFinished = true;
      });

    // Animate terminal scanner lines
    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingLines((prev) => [...prev, steps[currentStep]]);
        currentStep++;
        SoundEffects.playTick();
      } else {
        clearInterval(timer);

        // Wait for API to finish if it hasn't
        const checkCompletion = setInterval(() => {
          if (apiFinished) {
            clearInterval(checkCompletion);
            if (apiError) {
              setErrorMsg(apiError);
              setState("error");
              SoundEffects.playFail();
            } else if (apiResponse) {
              setRoastData(apiResponse);
              setState("done");
              SoundEffects.playSuccess();
            }
          }
        }, 100);
      }
    }, 850);
  };

  // Scroll to output when done
  useEffect(() => {
    if (state === "done" && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state]);

  return (
    <div
      className="min-h-screen bg-white font-mono text-black"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* ── Header Nav ── */}
      <header className="flex items-center justify-between border-b-[3px] border-black px-5 py-3 sm:px-8">
        <span className="text-xs font-black uppercase tracking-tight">
          SARELLA VENKAT // SITE-ROAST V1.0
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            onMouseEnter={() => SoundEffects.playTick()}
            className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase text-black transition-transform hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: isMuted ? "#e5e5e5" : "var(--accent)" }}
            title={isMuted ? "Unmute music" : "Mute music"}
          >
            {isMuted ? "🔇 MUSIC OFF" : "🔊 MUSIC ON"}
          </button>
          <Link
            href="/"
            onMouseEnter={() => SoundEffects.playTick()}
            onClick={() => SoundEffects.playTick()}
            className="border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase transition-colors hover:bg-black hover:text-white"
          >
            ← PORTFOLIO
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
        {/* ── Hero ── */}
        <div className="relative">
          {/* Rotated Badge */}
          <span 
            className="absolute -right-1 top-0 rotate-6 border-[3px] border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white sm:text-xs" 
            style={{ background: "var(--accent)", boxShadow: "5px 5px 0 #000" }}
          >
            brutal honesty
          </span>
          <h1 className="text-[18vw] font-black uppercase leading-[0.82] tracking-tighter sm:text-[9rem]">
            <span className="text-outline">ROAST</span>
            <br />
            <span>MY SITE</span>
          </h1>
        </div>

        <p className="mt-8 max-w-xl border-l-[6px] border-black pl-4 text-base leading-relaxed sm:text-lg">
          Paste a URL. Get it taken apart, line by line. Then — if you can take
          a hint — get it rebuilt by someone who won&apos;t let it happen again.
        </p>

        {/* ── Input Box ── */}
        {state !== "done" && state !== "loading" && (
          <div className="mt-10">
            <div className="mb-3 text-xs font-black uppercase tracking-[0.3em]">
              DROP THE URL ↓
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRoast()}
                placeholder="competitor-i-dont-like.com"
                autoComplete="off"
                spellCheck="false"
                className="w-full border-[3px] border-black bg-white px-4 py-4 text-base font-bold lowercase placeholder:text-black/30 focus:outline-none focus:ring-0"
                style={{ boxShadow: "6px 6px 0 #000" }}
              />
              <button
                type="submit"
                onClick={handleRoast}
                disabled={!url.trim()}
                onMouseEnter={() => SoundEffects.playTick()}
                className="shrink-0 border-[3px] border-black bg-black px-7 py-4 text-base font-black uppercase tracking-wider text-white transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-40"
                style={{ boxShadow: "6px 6px 0 var(--accent)" }}
              >
                Roast it →
              </button>
            </div>
            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-black/40">
              SATIRE. IT DOESN&apos;T CRAWL YOUR REAL SITE — THE FIXES, HOWEVER, ARE REAL.
            </div>
          </div>
        )}

        {/* ── Simulated Terminal Loading Scanner ── */}
        {state === "loading" && (
          <div
            className="mt-10 border-[3px] border-black p-6 sm:p-8 bg-black text-white font-mono text-sm"
            style={{ boxShadow: "8px 8px 0 var(--accent)" }}
          >
            <div className="flex gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 border-[2px] border-white bg-black" />
              <div className="w-2.5 h-2.5 border-[2px] border-white bg-black" />
              <div className="w-2.5 h-2.5 border-[2px] border-white bg-black" />
            </div>
            <div className="space-y-2">
              {loadingLines.map((line, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-bold select-none">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
              {loadingLines.length < 8 && (
                <div className="flex gap-2 items-center">
                  <span className="font-bold select-none">&gt;</span>
                  <span className="h-4 w-2 bg-white animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Error state ── */}
        {state === "error" && (
          <div
            className="mt-10 border-[3px] border-black p-6"
            style={{ background: "var(--accent)", boxShadow: "8px 8px 0 #000" }}
          >
            <div className="text-xs font-black uppercase tracking-[0.3em]">
              // something went wrong
            </div>
            <p className="mt-2 text-sm font-bold">{errorMsg}</p>
            <button
              onClick={() => {
                setState("idle");
                SoundEffects.playTick();
              }}
              onMouseEnter={() => SoundEffects.playTick()}
              className="mt-4 border-[3px] border-black bg-white px-4 py-2 text-xs font-black uppercase hover:bg-black hover:text-white transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Roast Output (Dashboard Metrics) ── */}
        {state === "done" && roastData && (
          <div ref={outputRef} className="mt-10 space-y-6">

            {/* Header statement */}
            <div className="text-2xl font-black uppercase leading-tight sm:text-5xl tracking-tight">
              WE LOOKED AT <span className="text-white px-3 py-1 inline-block mx-1 transform -rotate-1" style={{ background: "var(--accent)" }}>{scannedDomain.toUpperCase()}</span> . WE HAVE NOTES.
            </div>

            {/* Scorecard Box */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              {/* Left Score Block */}
              <div
                className="border-[3px] border-black bg-white p-6 flex flex-col justify-between items-center text-center w-full sm:w-44 shrink-0"
                style={{ boxShadow: "8px 8px 0 #000" }}
              >
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-black/50">
                  ROAST SCORE
                </div>
                <div className="my-4 text-7xl font-black sm:text-8xl leading-none">
                  {roastData.overall}
                </div>
                <div className="text-sm font-black uppercase text-black/50">
                  / 100
                </div>
              </div>

              {/* Right Content */}
              <div
                className="flex-1 border-[3px] border-black bg-black text-white p-6 sm:p-8 flex flex-col justify-center text-left"
                style={{ boxShadow: "8px 8px 0 var(--accent)" }}
              >
                <div className="text-4xl font-black uppercase leading-none sm:text-5xl" style={{ color: "var(--accent)" }}>
                  {roastData.label}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider leading-relaxed text-white/80">
                  {roastData.tagline}
                </p>
              </div>
            </div>

            {/* 6 Metrics Grid */}
            <div className="grid gap-5 sm:grid-cols-2 mt-8">
              {[
                { key: "load", label: "LOAD SPEED", score: roastData.cards.load.score, desc: roastData.cards.load.line },
                { key: "visual", label: "VISUAL DESIGN", score: roastData.cards.visual.score, desc: roastData.cards.visual.line },
                { key: "copy", label: "COPYWRITING", score: roastData.cards.copy.score, desc: roastData.cards.copy.line },
                { key: "originality", label: "ORIGINALITY", score: roastData.cards.originality.score, desc: roastData.cards.originality.line },
                { key: "mobile", label: "MOBILE", score: roastData.cards.mobile.score, desc: roastData.cards.mobile.line },
                { key: "trust", label: "TRUST & POPUPS", score: roastData.cards.trust.score, desc: roastData.cards.trust.line },
              ].map((m) => (
                <div
                  key={m.key}
                  className="border-[3px] border-black p-5 sm:p-6 bg-white flex flex-col justify-between"
                  style={{ boxShadow: "6px 6px 0 #000" }}
                >
                  <div>
                    {/* Header: Label and Score */}
                    <div className="flex justify-between items-baseline mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                        {m.label}
                      </span>
                      <span className="text-xl font-black">{m.score}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-5 border-[3px] border-black bg-white relative mb-4">
                      <div
                        className="h-full bg-black transition-all duration-700 ease-out"
                        style={{ width: `${m.score}%` }}
                      />
                      {/* Slider indicator knob */}
                      <div
                        className="absolute top-[-3px] bottom-[-3px] w-2 border-[2px] border-black transition-all duration-700 ease-out"
                        style={{ left: `calc(${m.score}% - 4px)`, background: "var(--accent)" }}
                      />
                    </div>
                  </div>

                  {/* Desc */}
                  <p className="text-xs font-bold leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            {/* Final Verdict Banner */}
            <div
              className="border-[3px] border-black text-white p-6 sm:p-8 mt-8"
              style={{ background: "var(--accent)", boxShadow: "8px 8px 0 #000" }}
            >
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-2">
                FINAL VERDICT
              </div>
              <p className="text-lg font-black uppercase leading-snug sm:text-2xl">
                {roastData.verdict}
              </p>
            </div>

            {/* Outro Call-To-Action Card */}
            <div
              className="border-[3px] border-black bg-white p-6 sm:p-8 text-black"
              style={{ boxShadow: "8px 8px 0 #000" }}
            >
              <h3 className="text-xl font-black uppercase sm:text-2xl">
                BRUTAL? YES. FIXABLE? ALSO YES.
              </h3>
              <p className="mt-2 text-xs font-bold leading-relaxed opacity-75">
                Roasts are free. Fixes aren&apos;t — but a site people actually trust pays for itself. I build websites, web apps and AI tools that don&apos;t need a roast.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="mailto:venkatsarella12@gmail.com?subject=Fix My Site — I Can Take a Hint"
                  onMouseEnter={() => SoundEffects.playTick()}
                  onClick={() => SoundEffects.playTick()}
                  className="flex-1 border-[3px] border-black bg-black text-white px-5 py-4 text-xs font-black uppercase tracking-wider text-center transition-transform hover:-translate-y-0.5"
                  style={{ boxShadow: "4px 4px 0 var(--accent)" }}
                >
                  ➔ GET IT FIXED
                </a>
                <Link
                  href="/"
                  onMouseEnter={() => SoundEffects.playTick()}
                  onClick={() => SoundEffects.playTick()}
                  className="flex-1 border-[3px] border-black bg-white text-black px-5 py-4 text-xs font-black uppercase tracking-wider text-center transition-colors hover:bg-black hover:text-white"
                >
                  SEE THE WORK
                </Link>
              </div>
            </div>

            {/* Reset / Roast another button */}
            <button
              onClick={() => {
                setState("idle");
                setUrl("");
                setRoastData(null);
                SoundEffects.playChirp();
              }}
              onMouseEnter={() => SoundEffects.playTick()}
              className="w-full border-[3px] border-black bg-white px-5 py-4 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
            >
              ⟳ ROAST ANOTHER
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
