import ScrambleText from "./ScrambleText";

export default function Hero() {
  return (
    <section className="relative pt-14 sm:pt-20 pb-4">
      {/* Status badge */}
      <span
        className="inline-flex items-center gap-2 border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase tracking-widest"
        style={{ background: "var(--accent)" }}
      >
        <span className="h-2.5 w-2.5 bg-black blink-dot" />
        Available for freelance work
      </span>

      {/* Hero headline — mixed solid / outline */}
      <h1 className="mt-6 text-[15vw] font-black uppercase leading-[0.82] tracking-tighter sm:text-[7rem]">
        <span>
          <ScrambleText text="I BUILD" delay={0} duration={500} />
        </span>
        <br />
        <span className="text-outline-black">
          <ScrambleText text="AI-POWERED" delay={150} duration={600} />
        </span>
        <br />
        <span>
          <ScrambleText text="PRODUCTS." delay={300} duration={700} />
        </span>
      </h1>

      {/* Bio */}
      <p className="mt-7 max-w-xl border-l-[6px] border-black pl-4 text-base leading-relaxed sm:text-lg">
        Computer Science student specializing in AI/ML &amp; Freelance Full-Stack Developer.
        I architect, build, and deploy full-stack web applications and AI-integrated systems — from
        React&nbsp;+&nbsp;TypeScript frontends to Supabase backends.
      </p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#contact"
          className="border-[3px] border-black bg-black px-7 py-4 text-center text-base font-black uppercase tracking-wider text-white transition-transform hover:-translate-x-1 hover:-translate-y-1"
          style={{ boxShadow: "6px 6px 0 var(--accent)" }}
        >
          START A PROJECT →
        </a>
        <a
          href="https://github.com/SARELLA-VENKAT"
          target="_blank"
          rel="noopener noreferrer"
          className="border-[3px] border-black px-7 py-4 text-center text-base font-black uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
        >
          VIEW GITHUB ↗
        </a>
      </div>

      {/* Quick stats */}
      <div className="mt-10 flex flex-wrap gap-4">
        {[
          { value: "B.TECH", label: "CSE (AI/ML) Student" },
          { value: "MECH", label: "Diploma Graduate" },
          { value: "AI/ML", label: "Specialisation" },
          { value: "GEN AI", label: "Certified" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-[3px] border-black px-4 py-3"
            style={{ boxShadow: "4px 4px 0 var(--accent)" }}
          >
            <div className="text-xl font-black">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-black/50">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
