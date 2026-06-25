"use client";

import { useState } from "react";

const SERVICES = [
  {
    num: "01",
    title: "WEBSITES THAT EARN TRUST",
    desc: "Marketing sites that make people believe you before they ever pick up the phone — fast, clear, and built to convert.",
  },
  {
    num: "02",
    title: "WEB APPS THAT FEEL SIMPLE",
    desc: "Dashboards, portals and SaaS products with real architecture underneath and an interface people actually enjoy using.",
  },
  {
    num: "03",
    title: "AI TOOLS THAT MAKE SENSE",
    desc: "LLM features that remove busywork instead of adding noise — explained so clearly the magic feels obvious.",
  },
  {
    num: "04",
    title: "REDESIGNS THAT MAKE THINGS UP",
    desc: "Taking something dated and slow and turning it into something modern, quick, and unmistakably yours.",
  },
];

export default function ServicesGrid() {
  const [activeIndex, setActiveIndex] = useState<string>("01"); // First card expanded by default

  const toggle = (num: string) => {
    setActiveIndex(activeIndex === num ? "" : num);
  };

  return (
    <section className="pb-14 sm:pb-20">
      <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-6xl">
        WHAT I BUILD
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const isOpen = activeIndex === s.num;
          return (
            <div
              key={s.num}
              onClick={() => toggle(s.num)}
              className="v2-card block border-[3px] border-black bg-white p-6 text-left cursor-pointer select-none"
              style={{ boxShadow: "8px 8px 0 #000" }}
            >
              <div className="flex items-baseline justify-between">
                <span
                  className="text-5xl font-black sm:text-6xl transition-colors duration-200"
                  style={
                    isOpen
                      ? { color: "var(--accent)", WebkitTextStroke: "2px #000" }
                      : { color: "transparent", WebkitTextStroke: "2px #000" }
                  }
                >
                  {s.num}
                </span>
                <span className="text-2xl font-black">{isOpen ? "–" : "+"}</span>
              </div>
              <h3 className="mt-3 text-2xl font-black uppercase leading-none">
                {s.title}
              </h3>
              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                  maxHeight: isOpen ? "200px" : "0px",
                  opacity: isOpen ? 1 : 0,
                  marginTop: isOpen ? "12px" : "0px",
                }}
              >
                <p className="text-sm leading-relaxed opacity-70">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
