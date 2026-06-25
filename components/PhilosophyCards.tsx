const CARDS = [
  {
    num: "01",
    heading: "I BUILD THINGS THAT ACTUALLY SHIP.",
    body: "Ideas are table stakes. Execution is everything. I take products from concept to deployed, functional, and loved — not just designed.",
    dark: false,
  },
  {
    num: "02",
    heading: "I TREAT AI AS A TOOL, NOT A TRICK.",
    body: "Every AI feature I build serves a real user need. Gimmicks don't make the cut. I integrate intelligence where it genuinely helps.",
    dark: true,
  },
  {
    num: "03",
    heading: "CLEAN CODE IS A PRODUCT FEATURE.",
    body: "Messy code ships fast and breaks faster. I write for the next developer — which is usually future me at 2am.",
    dark: false,
  },
  {
    num: "04",
    heading: "I WORK LIKE A PARTNER, NOT A VENDOR.",
    body: "I ask why we're building this — and I'll tell you when I think we shouldn't. Your success is my success.",
    dark: true,
  },
];

export default function PhilosophyCards() {
  return (
    <section className="pb-14 sm:pb-20">
      <h2 className="mb-8 text-4xl font-black uppercase tracking-tighter sm:text-6xl">
        HOW I THINK
      </h2>
      <div className="space-y-5">
        {CARDS.map((card) => (
          <div
            key={card.num}
            className="border-[3px] border-black p-6 sm:p-8"
            style={{
              boxShadow: "8px 8px 0 #000",
              background: card.dark ? "#000" : "#fff",
              color: card.dark ? "#fff" : "#000",
            }}
          >
            <div
              className="text-xs font-black uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)" }}
            >
              {card.num}
            </div>
            <p className="mt-2 text-2xl font-black uppercase leading-tight sm:text-4xl">
              {card.heading}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-70">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
