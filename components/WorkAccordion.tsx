"use client";

import { useState } from "react";

interface Project {
  num: string;
  title: string;
  problem: string;
  idea: string;
  outcome: string;
  quote: string;
  tags: string[];
  live?: string;
  github?: string;
}

const PROJECTS: Project[] = [
  {
    num: "01",
    title: "New Life Church Platform",
    problem:
      "A church with no digital home — events scattered across DMs, musicians without a hub, admin drowning in WhatsApp.",
    idea:
      "Three portals in one: a public site, a Musician Worship Hub, and an Admin Dashboard — all in real-time sync via Supabase.",
    outcome:
      "Role-based access (Admin/Musician/Member), Google OAuth, and a community that finally has a living, breathing digital heartbeat.",
    quote:
      "◆ I BUILD SYSTEMS THAT SERVE REAL COMMUNITIES — NOT JUST DEMO CREDENTIALS.",
    tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS v4", "Supabase", "PostgreSQL", "Google OAuth"],
    live: "https://new-life-church-of-god.vercel.app/",
    github: "https://github.com/SARELLA-VENKAT/New-life-church-of-God-",
  },
  {
    num: "02",
    title: "HireLens AI",
    problem:
      "Recruiters waste hours manually screening resumes that don't match the job — and candidates never know why they were rejected.",
    idea:
      "Let AI evaluate resume-to-job compatibility using hybrid semantic scoring, then generate structured skill-gap feedback.",
    outcome:
      "Instant compatibility scores, actionable resume suggestions, and an interface that makes hiring less of a black box.",
    quote: "◆ I BUILD AI THAT WORKS FOR PEOPLE — NOT THE OTHER WAY AROUND.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Gemini API"],
    live: "https://hirelen-ai.vercel.app/",
    github: "https://github.com/SARELLA-VENKAT/Hirelens-Ai-",
  },
  {
    num: "03",
    title: "NeedFeeder",
    problem:
      "Donors, NGOs, and volunteers can't find each other — resources sit wasted while real needs go unmet.",
    idea:
      "A location-aware platform that connects the three, tracks donations in real-time, and coordinates volunteer workflows.",
    outcome:
      "A community-driven platform that makes giving as simple and visible as it should always have been.",
    quote:
      "◆ GOOD TECH CAN CLOSE THE GAP BETWEEN THOSE WHO HAVE AND THOSE WHO NEED.",
    tags: ["React", "JavaScript", "Vite", "Tailwind CSS", "Vercel"],
    live: "https://needfeeder.vercel.app/",
    github: "https://github.com/SARELLA-VENKAT/NEEDFEEDER",
  },
];

export default function WorkAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="work" className="py-14 sm:py-20">
      <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-6xl">
        SELECTED WORK
      </h2>

      <div
        className="border-[3px] border-black"
        style={{ boxShadow: "8px 8px 0 #000" }}
      >
        {PROJECTS.map((project, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={project.num}
              className={i > 0 ? "border-t-[3px] border-black" : ""}
            >
              {/* ── Header row ── */}
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
                style={
                  isOpen
                    ? { background: "var(--accent)", color: "#000" }
                    : { background: "#fff", color: "#000" }
                }
              >
                <span className="flex items-baseline gap-4">
                  <span className="text-sm font-black opacity-60">
                    {project.num}
                  </span>
                  <span className="text-2xl font-black uppercase leading-none sm:text-4xl">
                    {project.title}
                  </span>
                </span>
                <span className="shrink-0 text-2xl font-black">
                  {isOpen ? "–" : "+"}
                </span>
              </button>

              {/* ── Accordion body ── */}
              <div className={`accordion-body ${isOpen ? "open" : ""}`}>
                <div className="border-t-[3px] border-black bg-white p-5 sm:p-6">

                  {/* 3-column grid: Problem / Idea / Outcome */}
                  <div className="grid gap-5 sm:grid-cols-3">
                    {[
                      { label: "PROBLEM", text: project.problem },
                      { label: "IDEA", text: project.idea },
                      { label: "OUTCOME", text: project.outcome },
                    ].map((col) => (
                      <div key={col.label}>
                        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-black/40">
                          {col.label}
                        </div>
                        <p className="text-sm leading-relaxed">{col.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t-[2px] border-black" />

                  {/* Quote */}
                  <p
                    className="text-sm font-black uppercase tracking-wide"
                    style={{ color: "var(--accent)" }}
                  >
                    {project.quote}
                  </p>

                  {/* Tech tags + links */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-[2px] border-black px-2 py-0.5 text-xs font-black uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-[3px] border-black bg-black px-4 py-2 text-xs font-black uppercase text-white transition-transform hover:-translate-y-0.5"
                        style={{ boxShadow: "4px 4px 0 var(--accent)" }}
                      >
                        VIEW LIVE →
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-[3px] border-black px-4 py-2 text-xs font-black uppercase transition-colors hover:bg-black hover:text-white"
                      >
                        GITHUB ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
