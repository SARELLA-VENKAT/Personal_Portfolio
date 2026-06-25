function seedRng(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const pick = (rng: () => number, arr: string[]) => arr[Math.floor(rng() * arr.length)];
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

interface Finding {
  code: string;
  sev: number;
  line: string;
}

interface FinalizedMetric {
  score: number;
  findings: Finding[];
  goodLines: string[];
}

function finalize(score: number, findings: Finding[], goodLines: string[]): FinalizedMetric {
  score = clamp(score);
  findings.sort((a, b) => b.sev - a.sev);
  return { score, findings, goodLines };
}

function cardLine(metric: FinalizedMetric, rng: () => number) {
  if (metric.findings.length === 0) return pick(rng, metric.goodLines);
  const top = metric.findings.slice(0, 2);
  return (top.length > 1 && rng() < 0.25 ? top[1] : top[0]).line;
}

function scoreLoad(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (code: string, sev: number, line: string) => f.push({ code, sev, line });

  if (s.jsKB > 3000) { score -= 45; push('js', 9, `${(s.jsKB / 1024).toFixed(1)}MB of JavaScript to render what is, functionally, a page.`); }
  else if (s.jsKB > 1500) { score -= 35; push('js', 8, `${(s.jsKB / 1024).toFixed(1)}MB of JS. Your framework brought friends.`); }
  else if (s.jsKB > 800) { score -= 25; push('js', 6, `${s.jsKB}KB of JavaScript for a page that mostly sits there.`); }
  else if (s.jsKB > 400) { score -= 14; push('js', 4, `${s.jsKB}KB of JS — a little heavy, a little needy.`); }

  if (s.totalKB > 5000) { score -= 25; push('weight', 7, `${(s.totalKB / 1024).toFixed(1)}MB total. People on mobile data are crying.`); }
  else if (s.totalKB > 3000) { score -= 18; push('weight', 6, `${(s.totalKB / 1024).toFixed(1)}MB to load. Hope nobody's on a train.`); }
  else if (s.totalKB > 1500) { score -= 10; push('weight', 4, `${(s.totalKB / 1024).toFixed(1)}MB total weight — snackable, not light.`); }

  if (s.requests > 120) { score -= 18; push('reqs', 5, `${s.requests} requests. It's not a website, it's a group project.`); }
  else if (s.requests > 60) { score -= 10; push('reqs', 3, `${s.requests} network requests before anything is usable.`); }

  if (s.renderBlocking > 0) { score -= Math.min(15, s.renderBlocking * 4); push('block', 5, `${s.renderBlocking} render-blocking script(s) in the head, holding the page hostage.`); }
  if (!s.compressed) { score -= 6; push('gzip', 2, `No gzip/brotli — shipping uncompressed bytes like it's 2009.`); }

  return finalize(score, f, [
    'Loads before you finish blinking. Suspicious, but fine.',
    'Honestly fast. I checked twice looking for the catch.',
  ]);
}

function scoreVisual(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (c: string, sev: number, l: string) => f.push({ code: c, sev, line: l });

  if (s.fontCount > 6) { score -= 30; push('fonts', 9, `${s.fontCount} fonts. Three are fighting, two are losing, one is just here for the vibes.`); }
  else if (s.fontCount > 4) { score -= 18; push('fonts', 7, `${s.fontCount} different typefaces — pick a personality.`); }
  else if (s.fontCount > 3) { score -= 8; push('fonts', 4, `${s.fontCount} fonts is one font too many.`); }

  if (s.colorCount > 24) { score -= 15; push('color', 6, `${s.colorCount} colors in the stylesheet. This isn't a palette, it's a paint spill.`); }
  else if (s.colorCount > 15) { score -= 8; push('color', 4, `${s.colorCount} colors — somebody never met a hex code they didn't like.`); }

  if (s.importantCount > 30) { score -= 10; push('imp', 5, `${s.importantCount} !important rules — the CSS equivalent of yelling.`); }
  else if (s.importantCount > 12) { score -= 5; push('imp', 3, `${s.importantCount} !important flags. The cascade gave up; so did I.`); }

  if (s.inlineStyleCount > 60) { score -= 8; push('inline', 3, `${s.inlineStyleCount} inline styles. Someone's allergic to a stylesheet.`); }

  return finalize(score, f, [
    'Clean. Restrained. Annoyingly tasteful.',
    'Looks designed by a human who slept. Rare.',
  ]);
}

function scoreCopy(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (c: string, sev: number, l: string) => f.push({ code: c, sev, line: l });

  if (s.wordCount < 40) { score -= 16; push('thin', 6, `${s.wordCount} words of copy. Mysterious — and not in the good way.`); }
  if (s.h1Count === 0) { score -= 12; push('noh1', 6, `No <h1>. The page never says what it actually is.`); }
  else if (s.h1Text.split(' ').length > 12) { score -= 6; push('longh1', 3, `Your headline is a paragraph. Headlines are supposed to win, not negotiate.`); }

  const ratio = s.selfCount / (s.youCount + 1);
  if (s.youCount === 0 && s.selfCount > 4) { score -= 20; push('me', 8, `It's all "we / our / the journey." Zero about my problem. This is a diary.`); }
  else if (ratio > 3) { score -= 14; push('me', 7, `Talks about itself ${Math.round(ratio)}× more than about the visitor. Cool story.`); }
  else if (ratio > 1.8) { score -= 7; push('me', 4, `Leans "we" over "you". The reader is the main character — write like it.`); }

  if (s.buzzCount > 0) { score -= Math.min(18, s.buzzCount * 3); push('buzz', 5, `${s.buzzCount} buzzword(s) detected. "Seamless," "leverage," "elevate" — say nothing, but make it sound expensive.`); }
  if (s.exclamations > 8) { score -= 6; push('bang', 3, `${s.exclamations} exclamation marks. Enthusiasm is not a value proposition!`); }
  if (s.hasLorem) { score -= 20; push('lorem', 9, `Lorem ipsum still on the page. It shipped in its pajamas.`); }

  return finalize(score, f, [
    'Says what it does, fast, in human words. Witchcraft.',
    'Actually about the customer. I have no notes. Suspicious.',
  ]);
}

function scoreOriginality(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (c: string, sev: number, l: string) => f.push({ code: c, sev, line: l });

  if (s.builders.length) { score -= 20; push('tmpl', 7, `Built on ${s.builders.join('/')}. The template is doing the heavy lifting — and everyone has seen it.`); }
  if (s.gradientCount > 4) { score -= 12; push('grad', 6, `${s.gradientCount} gradients. Big "purple-to-blue startup" energy.`); }
  if (s.hasBlob) { score -= 8; push('blob', 5, `The floating gradient blob. We've all met it. We're tired.`); }
  if (s.phoneMockup) { score -= 10; push('phone', 6, `Floating phone mockup in the hero. Groundbreaking. Like every other launch page.`); }
  if (s.genericHero) { score -= 6; push('hero', 3, `Hero + CTA + three feature cards. The landing-page starter pack.`); }

  return finalize(score, f, [
    'Actually looks like nobody else. Respect.',
    'No template smell. Someone made decisions here.',
  ]);
}

function scoreMobile(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (c: string, sev: number, l: string) => f.push({ code: c, sev, line: l });

  if (!s.hasViewport) { score -= 42; push('vp', 9, `No mobile viewport tag. On a phone this is a pinch-and-zoom adventure.`); }
  else if (s.blocksZoom) { score -= 8; push('zoom', 4, `Zoom is disabled. Accessibility left the chat.`); }

  if (s.mediaQueries === 0) { score -= 25; push('mq', 8, `Zero media queries. It's "responsive" the way a brick is aerodynamic.`); }
  else if (s.mediaQueries < 3) { score -= 10; push('mq', 5, `Only ${s.mediaQueries} breakpoint(s). Mobile was clearly an afterthought.`); }

  if (s.fixedWidths > 15) { score -= 15; push('fixed', 6, `${s.fixedWidths} hard-coded pixel widths. Say hello to the horizontal scrollbar.`); }
  else if (s.fixedWidths > 6) { score -= 7; push('fixed', 4, `${s.fixedWidths} fixed px widths fighting small screens.`); }

  if (!s.responsiveUnits) { score -= 12; push('units', 5, `Barely any flex/grid/% — layout is held together with hope.`); }

  return finalize(score, f, [
    'Actually works on a phone. The bar is low and you cleared it.',
    'Responsive and proud of it. Good.',
  ]);
}

function scoreTrust(s: any): FinalizedMetric {
  let score = 100;
  const f: Finding[] = [];
  const push = (c: string, sev: number, l: string) => f.push({ code: c, sev, line: l });

  if (!s.isHttps) { score -= 20; push('http', 8, `Served over plain HTTP. The browser is putting a "Not secure" sign on your lawn.`); }
  if (s.cookieBanner) { score -= 12; push('cookie', 6, `Cookie banner the size of Belgium. I just wanted to read.`); }
  if (s.popup) { score -= 16; push('popup', 7, `Newsletter pop-up / overlay ambush. We met four seconds ago.`); }
  if (s.trackers.length > 8) { score -= 16; push('track', 7, `${s.trackers.length} tracking scripts. Your site has a surveillance budget.`); }
  else if (s.trackers.length > 4) { score -= 9; push('track', 5, `${s.trackers.length} trackers following the visitor around.`); }
  else if (s.trackers.length > 1) { score -= 4; push('track', 2, `${s.trackers.length} analytics/trackers loaded.`); }
  if (s.autoplay) { score -= 8; push('auto', 5, `Autoplaying media. Bold choice for someone in an open-plan office.`); }
  if (!s.hasPrivacy) { score -= 5; push('priv', 2, `No privacy/terms link anywhere. Trust me, bro.`); }

  return finalize(score, f, [
    'No pop-ups, no cookie wall, no nonsense. A calm place. Weird.',
    'Lets you just... read. Revolutionary act of restraint.',
  ]);
}

const WEIGHTS: { [key: string]: number } = { load: 0.22, mobile: 0.2, trust: 0.15, copy: 0.15, visual: 0.15, originality: 0.13 };

const BANDS = [
  { min: 88, label: 'ELITE', taglines: ['ANNOYINGLY GOOD. I HATE IT.', 'NO NOTES. I LOOKED.'] },
  { min: 75, label: 'SOLID', taglines: ["IT'S GOOD. DON'T LET IT GET SMUG.", 'KNOWS WHAT IT IS. RARE.'] },
  { min: 62, label: 'DECENT', taglines: ['FINE. FINE IS THE CEILING RIGHT NOW.', 'NOT EMBARRASSING. AIM HIGHER.'] },
  { min: 50, label: 'MID', taglines: ["IT'S THERE. THAT'S THE WHOLE REVIEW.", 'PERFECTLY FORGETTABLE.'] },
  { min: 38, label: 'ROUGH', taglines: ["IT'S TRYING. THAT'S THE SAD PART.", 'EFFORT: VISIBLE. RESULT: NOT.'] },
  { min: 25, label: 'BAD', taglines: ['THIS NEEDED A SECOND OPINION. AND A FIRST.', 'SOMETHING WENT WRONG EARLY.'] },
  { min: 0, label: 'DISASTER', taglines: ['CALL SOMEONE. CALL ANYONE.', 'WE NEED TO TALK.'] },
];

const LABEL_NAMES: { [key: string]: string } = {
  load: 'Load Speed', visual: 'Visual Design', copy: 'Copywriting',
  originality: 'Originality', mobile: 'Mobile', trust: 'Trust & Popups',
};

function bandFor(score: number) {
  return BANDS.find((b) => score >= b.min) || BANDS[BANDS.length - 1];
}

function finalVerdict(overall: number, metrics: { [key: string]: FinalizedMetric }, rng: () => number) {
  const entries = Object.entries(metrics);
  const worst = entries.reduce((a, b) => (b[1].score < a[1].score ? b : a));
  const worstName = LABEL_NAMES[worst[0]];

  if (overall >= 88)
    return pick(rng, [
      `Genuinely sharp. Fast, clear, and it respects the visitor's time. The kind of site that makes a roast feel petty. ${worstName} is the only place left to tighten.`,
      `This one earns it. It loads, it speaks human, it works on a phone. My job here is mostly to applaud and quietly fix ${worstName}.`,
    ]);
  if (overall >= 75)
    return pick(rng, [
      `Strong site that knows its job. ${worstName} is the loose thread — pull it and this goes from "good" to "people remember it."`,
      `Solid all round. The fundamentals are there; ${worstName} is the difference between competent and convincing.`,
    ]);
  if (overall >= 62)
    return pick(rng, [
      `It's decent, which is also the problem — decent doesn't get talked about. ${worstName} is dragging it, and fixing that is the cheapest win you'll ever buy.`,
      `Functional and unremarkable. Nothing here is broken; nothing here is bragging either. Start with ${worstName} and give it a reason to be memorable.`,
    ]);
  if (overall >= 50)
    return pick(rng, [
      `It's not bad. It's worse: it's forgettable. ${worstName} is where it loses people, and forgettable is the one thing I refuse to build.`,
      `Right in the middle of the road, which is exactly where sites get run over. ${worstName} needs the most help — that's where the bleak is.`,
    ]);
  if (overall >= 38)
    return pick(rng, [
      `You can see the effort, and that's the heartbreaker — it's working hard and landing soft. ${worstName} is the anchor; cut it loose and the whole thing lifts.`,
      `There's a real site trying to get out of this one. ${worstName} is the wall it keeps walking into. Good news: walls move.`,
    ]);
  if (overall >= 25)
    return pick(rng, [
      `This is fixable, but not by tweaking — ${worstName} alone is doing visible damage, and it's not alone. Time for a real pass, not a patch.`,
      `Something went sideways early. ${worstName} is the loudest problem, but the foundation needs the attention. Rebuild beats rescue here.`,
    ]);
  return pick(rng, [
    `I'm not going to dunk on this — I'm going to help. ${worstName} is critical, the basics are missing, and that's a from-scratch conversation, not a touch-up.`,
    `Honest answer: this needs a do-over, starting with ${worstName}. The good part is everything from here is upside.`,
  ]);
}

export function roast(analysis: any) {
  const s = analysis.stats;
  const rng = seedRng(analysis.url);

  const metrics: { [key: string]: FinalizedMetric } = {
    load: scoreLoad(s),
    visual: scoreVisual(s),
    copy: scoreCopy(s),
    originality: scoreOriginality(s),
    mobile: scoreMobile(s),
    trust: scoreTrust(s),
  };

  const overall = clamp(
    Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + metrics[k].score * w, 0)
  );
  const band = bandFor(overall);

  const cards = Object.fromEntries(
    Object.entries(metrics).map(([k, m]) => [
      k,
      { name: LABEL_NAMES[k], score: m.score, line: cardLine(m, rng) },
    ])
  );

  return {
    url: analysis.url,
    overall,
    label: band.label,
    tagline: pick(rng, band.taglines),
    cards,
    verdict: finalVerdict(overall, metrics, rng),
    weights: WEIGHTS,
    raw: s,
  };
}
