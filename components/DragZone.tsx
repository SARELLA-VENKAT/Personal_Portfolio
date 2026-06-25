"use client";

import { useRef, useEffect } from "react";

const STICKERS = [
  { label: "DRAG ME →",     x: 24,  y: 28,  rot: -6 },
  { label: "REACT + TS",    x: 220, y: 55,  rot: 5  },
  { label: "AI BUILDER",    x: 70,  y: 155, rot: -3 },
  { label: "SHIP IT 🚀",    x: 310, y: 145, rot: 8  },
  { label: "FULL-STACK",    x: 140, y: 245, rot: -7 },
  { label: "HYDERABAD 🇮🇳", x: 355, y: 240, rot: 4  },
  { label: "DETAILS > VIBES", x: 195, y: 100, rot: -2 },
  { label: "OPEN SOURCE",   x: 30,  y: 230, rot: 6  },
];

export default function DragZone() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stickers = container.querySelectorAll<HTMLButtonElement>(".sticker");

    stickers.forEach((el) => {
      let startX = 0, startY = 0, initX = 0, initY = 0;
      let active = false;

      const onDown = (e: PointerEvent) => {
        active = true;
        el.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startY = e.clientY;
        const t = new DOMMatrix(getComputedStyle(el).transform);
        initX = t.e;
        initY = t.f;
        el.style.zIndex = "10";
        e.preventDefault();
      };

      const onMove = (e: PointerEvent) => {
        if (!active) return;
        const rect = container.getBoundingClientRect();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let nx = initX + dx;
        let ny = initY + dy;

        // Clamp within container
        nx = Math.max(0, Math.min(nx, rect.width - el.offsetWidth));
        ny = Math.max(0, Math.min(ny, rect.height - el.offsetHeight));

        // Preserve rotation from the inline style
        const rot = el.dataset.rot ?? "0";
        el.style.transform = `translate(${nx}px, ${ny}px) rotate(${rot}deg)`;
      };

      const onUp = () => {
        active = false;
        el.style.zIndex = "";
      };

      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);
    });
  }, []);

  return (
    <section className="pb-14 sm:pb-20">
      <h2 className="mb-2 text-4xl font-black uppercase tracking-tighter sm:text-6xl">
        DRAG STUFF AROUND
      </h2>
      <p className="mb-6 text-sm font-bold uppercase tracking-widest text-black/50">
        // because static is boring. grab the stickers.
      </p>
      <div
        ref={containerRef}
        className="relative h-[340px] w-full overflow-hidden border-[3px] border-black bg-white sm:h-[320px]"
        style={{
          boxShadow: "8px 8px 0 #000",
          backgroundImage: "radial-gradient(#0001 1.5px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      >
        {STICKERS.map((s) => (
          <button
            key={s.label}
            className="sticker border-[3px] border-black px-4 py-2 text-sm font-black uppercase tracking-wide"
            data-rot={s.rot}
            style={{
              transform: `translate(${s.x}px, ${s.y}px) rotate(${s.rot}deg)`,
              background: "var(--accent)",
              boxShadow: "5px 5px 0 #000",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );
}
