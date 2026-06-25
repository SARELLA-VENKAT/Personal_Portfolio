const SKILLS = [
  { cat: "Languages",     items: ["JavaScript", "TypeScript", "Python", "Java", "SQL", "C"] },
  { cat: "Frontend",      items: ["React.js", "Vite", "HTML5", "CSS3", "Tailwind CSS v4"] },
  { cat: "Backend & DB",  items: ["Supabase", "PostgreSQL", "MongoDB", "REST APIs", "OAuth 2.0", "RLS"] },
  { cat: "AI / ML",       items: ["Gemini / OpenAI API", "Prompt Engineering", "LLM Integration"] },
  { cat: "Tools",         items: ["Node.js", "Git", "GitHub", "Vercel", "VS Code", "Jupyter"] },
];

const EXPERIENCE = [
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed / Remote",
    location: "Hyderabad, India",
    period: "Jun 2024 – Present",
    bullets: [
      "Architect and deploy full-stack web apps, databases, and AI-powered automation tools for clients.",
      "Build responsive, production-ready UIs using React, TypeScript, and Tailwind CSS.",
      "Design database schemas, establish row-level security, and write SQL migrations via Supabase.",
      "Integrate Gemini & OpenAI APIs and configure OAuth 2.0 auth flows (Google, email/password).",
      "Manage complete CI/CD pipelines (Vercel, GitHub) for fast, reliable delivery.",
    ],
  },
  {
    role: "Quality Apprentice",
    company: "Rockwell Industries",
    location: "Hyderabad, India",
    period: "Oct 2023 – Apr 2024",
    bullets: [
      "Quality inspection and validation of precision manufacturing components.",
      "Collaborated with multidisciplinary teams to maintain strict quality standards.",
    ],
  },
];

export default function AboutMe() {
  return (
    <section id="about" className="pb-14 sm:pb-20">
      <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-6xl">
        ABOUT ME
      </h2>

      {/* Bio card */}
      <div
        className="border-[3px] border-black p-6 sm:p-10"
        style={{ boxShadow: "8px 8px 0 #000" }}
      >
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-black/50">
          // who I am
        </div>
        <p className="mt-4 text-lg font-black uppercase leading-snug sm:text-2xl">
          Results-driven Freelance Full-Stack Developer &amp; CS student
          specialising in{" "}
          <span style={{ color: "var(--accent)" }}>AI/ML</span>.
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed opacity-75">
          Experienced in architecting, developing, and deploying full-stack web
          applications and AI-integrated systems for clients and independent
          projects. Proficient in React, TypeScript, and Supabase/PostgreSQL.
          Adept at transforming client requirements into scalable, secure, and
          user-friendly digital products. Currently pursuing B.Tech in Computer
          Science (AI &amp; ML) at St. Peter&apos;s Engineering College, Hyderabad.
        </p>

        {/* Education pills */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="border-[3px] border-black px-4 py-2" style={{ boxShadow: "4px 4px 0 var(--accent)" }}>
            <div className="text-xs font-bold uppercase tracking-widest text-black/50">Current</div>
            <div className="text-sm font-black uppercase">B.Tech CS (AI &amp; ML)</div>
            <div className="text-xs opacity-60">St. Peter&apos;s · CGPA 8.00</div>
          </div>
          <div className="border-[3px] border-black px-4 py-2" style={{ boxShadow: "4px 4px 0 #000" }}>
            <div className="text-xs font-bold uppercase tracking-widest text-black/50">Prior</div>
            <div className="text-sm font-black uppercase">Diploma Mech. Engg.</div>
            <div className="text-xs opacity-60">Govt. Polytechnic · GPA 8.35</div>
          </div>
        </div>
      </div>

      {/* Skills grid */}
      <div className="mt-8">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-black/50 mb-4">
          // technical skills
        </div>
        <div className="space-y-4">
          {SKILLS.map((group) => (
            <div key={group.cat} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-6">
              <div className="w-32 shrink-0 text-xs font-black uppercase tracking-widest text-black/40 pt-1">
                {group.cat}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag border-[3px] border-black px-3 py-1.5 text-xs font-black uppercase"
                    style={{ boxShadow: "3px 3px 0 #000" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mt-10">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-black/50 mb-4">
          // experience
        </div>
        <div className="space-y-5">
          {EXPERIENCE.map((exp, i) => (
            <div
              key={i}
              className="border-[3px] border-black p-5 sm:p-6"
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-black uppercase leading-none">{exp.role}</h3>
                  <div className="mt-1 text-xs font-bold uppercase tracking-wide text-black/50">
                    {exp.company} · {exp.location}
                  </div>
                </div>
                <span
                  className="border-[2px] border-black px-2 py-1 text-xs font-black uppercase whitespace-nowrap"
                  style={{ background: "var(--accent)" }}
                >
                  {exp.period}
                </span>
              </div>
              <ul className="mt-4 space-y-1.5">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex gap-2 text-xs leading-relaxed opacity-75">
                    <span className="shrink-0 font-black" style={{ color: "var(--accent)" }}>→</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="mt-10">
        <div className="text-xs font-bold uppercase tracking-[0.25em] text-black/50 mb-4">
          // certifications
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { name: "Generative AI Mastermind", issuer: "Outskill" },
            { name: "Data Analysis with Python", issuer: "IBM / Coursera" },
            { name: "Python for Data Analysis", issuer: "Coursera Project Network" },
            { name: "AI Tools Workshop", issuer: "be10x" },
          ].map((cert) => (
            <div
              key={cert.name}
              className="border-[3px] border-black p-4"
              style={{ boxShadow: "4px 4px 0 var(--accent)" }}
            >
              <div className="text-sm font-black uppercase leading-tight">{cert.name}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wide text-black/50">{cert.issuer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
