export default function Contact() {
  return (
    <section id="contact" className="border-t-[3px] border-black bg-black text-white">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        {/* Headline */}
        <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-tighter sm:text-8xl">
          LET&apos;S
          <br />
          <span className="text-outline-white">BUILD</span>
          <br />
          SOMETHING.
        </h2>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70">
          Open for freelance projects and full-time opportunities. Tell me what
          you&apos;re making — or just say hi.
        </p>

        {/* Contact grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {/* Email display */}
          <div className="sm:col-span-2">
            <a
              href="mailto:venkatsarella12@gmail.com?subject=Hey Sarella — Let's Work Together"
              className="block w-full break-all border-[3px] border-black bg-white px-5 py-4 text-left text-lg font-black uppercase tracking-wide text-black transition-colors hover:bg-black hover:text-white"
              style={{ boxShadow: "6px 6px 0 var(--accent)" }}
            >
              venkatsarella12@gmail.com
            </a>
          </div>

          <a
            href="mailto:venkatsarella12@gmail.com?subject=Hey Sarella — Let's Work Together"
            className="border-[3px] border-white px-5 py-4 text-lg font-black uppercase transition-colors hover:bg-white hover:text-black"
          >
            EMAIL →
          </a>
          <a
            href="https://linkedin.com/in/venkat-sarella-01b645333"
            target="_blank"
            rel="noopener noreferrer"
            className="border-[3px] border-white px-5 py-4 text-lg font-black uppercase transition-colors hover:bg-white hover:text-black"
          >
            LINKEDIN →
          </a>
          <a
            href="https://github.com/SARELLA-VENKAT"
            target="_blank"
            rel="noopener noreferrer"
            className="border-[3px] border-white px-5 py-4 text-lg font-black uppercase transition-colors hover:bg-white hover:text-black"
          >
            GITHUB →
          </a>
          <a
            href="tel:+916305210365"
            className="border-[3px] border-white px-5 py-4 text-lg font-black uppercase transition-colors hover:bg-white hover:text-black"
          >
            +91-6305210365
          </a>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-white/30 pt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
          <span>
            Sarella Venkat — Full-Stack Developer &amp; AI Builder
          </span>
          <span>Hyderabad, India · {new Date().getFullYear()}</span>
        </footer>
      </div>
    </section>
  );
}
