import Link from "next/link";

export default function RoastBanner() {
  return (
    <section className="pb-14 sm:pb-20">
      <Link
        href="/roast"
        className="block border-[3px] border-black p-8 text-black transition-transform hover:-translate-x-1 hover:-translate-y-1 sm:p-12"
        style={{ background: "var(--accent)", boxShadow: "10px 10px 0 #000" }}
      >
        <div className="text-xs font-black uppercase tracking-[0.3em]">
          // the side quest
        </div>
        <p className="mt-3 text-4xl font-black uppercase leading-none sm:text-7xl">
          ROAST A SITE 🔥
        </p>
        <p className="mt-4 max-w-xl text-base font-bold leading-snug">
          Paste any URL and watch AI tear it apart, line by line — then let me
          fix it. Free brutality. Click to play →
        </p>
      </Link>
    </section>
  );
}
