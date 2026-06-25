import * as cheerio from 'cheerio';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36 RoastBot/1.0';

interface PageResult {
  ok: boolean;
  status: number;
  finalUrl: string;
  bytes: number;
  text: string;
  contentEncoding: string;
}

async function fetchPage(url: string, timeoutMs = 15000): Promise<PageResult> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
    });
    const buf = Buffer.from(await res.arrayBuffer());
    return {
      ok: res.ok,
      status: res.status,
      finalUrl: res.url || url,
      bytes: buf.length,
      text: buf.toString('utf8'),
      contentEncoding: res.headers.get('content-encoding') || '',
    };
  } finally {
    clearTimeout(t);
  }
}

async function fetchSize(url: string, timeoutMs = 8000): Promise<{ bytes: number; text: string } | 0> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { 'user-agent': UA } });
    if (!res.ok) return 0;
    const buf = Buffer.from(await res.arrayBuffer());
    return { bytes: buf.length, text: buf.toString('utf8') };
  } catch {
    return 0;
  } finally {
    clearTimeout(t);
  }
}

function pLimit(n: number) {
  let active = 0;
  const queue: { fn: () => Promise<any>; resolve: (val: any) => void; reject: (err: any) => void }[] = [];
  const next = () => {
    if (active >= n || queue.length === 0) return;
    active++;
    const item = queue.shift();
    if (!item) return;
    const { fn, resolve, reject } = item;
    fn().then(resolve, reject).finally(() => {
      active--;
      next();
    });
  };
  return <T>(fn: () => Promise<T>): Promise<T> =>
    new Promise((resolve, reject) => {
      queue.push({ fn, resolve, reject });
      next();
    });
}

function abs(href: string | undefined, base: string): string | null {
  if (!href) return null;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

const TRACKER_HOSTS = [
  'google-analytics', 'googletagmanager', 'gtag', 'doubleclick', 'facebook.net',
  'connect.facebook', 'hotjar', 'segment', 'mixpanel', 'fullstory', 'clarity.ms',
  'amplitude', 'intercom', 'drift', 'tiktok', 'snap.licdn', 'bat.bing', 'criteo',
  'taboola', 'outbrain', 'quantserve', 'scorecardresearch', 'cdn.heapanalytics',
];
const COOKIE_LIBS = ['cookiebot', 'onetrust', 'osano', 'cookieconsent', 'iubenda', 'termly', 'didomi'];
const BUILDERS: [string, RegExp][] = [
  ['wix', /wix\.com|_wix|wixstatic/i],
  ['Squarespace', /squarespace/i],
  ['Webflow', /webflow/i],
  ['WordPress', /wp-content|wp-includes|wordpress/i],
  ['Elementor', /elementor/i],
  ['Framer', /framer\.(com|website)|__framer/i],
  ['Shopify', /cdn\.shopify|shopify/i],
  ['GoDaddy', /godaddy|websitebuilder/i],
  ['Carrd', /carrd\.co/i],
];
const BUZZWORDS = [
  'synergy', 'leverage', 'seamless', 'cutting-edge', 'cutting edge', 'revolutionary',
  'game-changing', 'game changing', 'disrupt', 'innovative solution', 'best-in-class',
  'best in class', 'world-class', 'world class', 'next-level', 'next level', 'paradigm',
  'holistic', 'turnkey', 'robust', 'empower', 'unlock', 'elevate', 'supercharge',
  'unleash', 'frictionless', 'bespoke', 'curated', 'redefine', 'reimagine',
];

export async function analyze(inputUrl: string) {
  let url = inputUrl.trim();
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  const page = await fetchPage(url);
  const $ = cheerio.load(page.text);
  const base = page.finalUrl;
  const limit = pLimit(8);

  // --- collect linked resources ---
  const scriptSrcs: { url: string; el: any }[] = [];
  $('script[src]').each((_, el) => {
    const srcAttr = $(el).attr('src');
    const s = abs(srcAttr, base);
    if (s && /^https?:/.test(s)) scriptSrcs.push({ url: s, el });
  });
  const cssHrefs: string[] = [];
  $('link[rel="stylesheet"], link[as="style"]').each((_, el) => {
    const hrefAttr = $(el).attr('href');
    const h = abs(hrefAttr, base);
    if (h && /^https?:/.test(h)) cssHrefs.push(h);
  });

  let inlineJsBytes = 0;
  $('script:not([src])').each((_, el) => {
    inlineJsBytes += ($(el).html() || '').length;
  });
  let inlineCss = '';
  $('style').each((_, el) => {
    inlineCss += $(el).html() || '';
  });

  // render-blocking scripts in <head> with no async/defer
  let renderBlocking = 0;
  $('head script[src]').each((_, el) => {
    const a = $(el).attr() || {};
    if (!('async' in a) && !('defer' in a)) renderBlocking++;
  });

  // --- fetch sub-resource sizes (bounded) ---
  const allRes = [...scriptSrcs.map((s) => s.url), ...cssHrefs].slice(0, 60);
  let jsBytes = inlineJsBytes;
  let cssBytes = inlineCss.length;
  let cssCollected = inlineCss;
  const sizeResults = await Promise.all(
    allRes.map((u) =>
      limit(async () => {
        const r = await fetchSize(u);
        return { u, r };
      })
    )
  );
  for (const { u, r } of sizeResults) {
    if (!r) continue;
    if (cssHrefs.includes(u)) {
      cssBytes += r.bytes;
      cssCollected += '\n' + (r.text || '');
    } else {
      jsBytes += r.bytes;
    }
  }

  const allCss = (inlineCss + '\n' + cssCollected).slice(0, 800000); // cap regex work
  const styleAttrs = $('[style]').map((_, el) => $(el).attr('style')).get().join(';');
  const lowerHtml = page.text.toLowerCase();

  // --- images ---
  const imgs = $('img');
  let lazyImgs = 0,
    sizedImgs = 0;
  imgs.each((_, el) => {
    const a = $(el).attr() || {};
    if ((a.loading || '').toLowerCase() === 'lazy') lazyImgs++;
    if (a.width || a.height) sizedImgs++;
  });

  // --- VISUAL signals ---
  const fontFamilies = new Set<string>();
  // google fonts links
  $('link[href*="fonts.googleapis"]').each((_, el) => {
    const hrefAttr = $(el).attr('href') || '';
    const m = hrefAttr.match(/family=([^&]+)/g) || [];
    m.forEach((g) => g.replace(/family=/, '').split('|').forEach((f) => fontFamilies.add(decodeURIComponent(f.split(':')[0]))));
  });
  (allCss + ';' + styleAttrs).replace(/font-family\s*:\s*([^;}{]+)/gi, (_, fam) => {
    fontFamilies.add(fam.split(',')[0].replace(/['"]/g, '').trim().toLowerCase());
    return '';
  });
  (allCss.match(/@font-face/gi) || []).forEach((_, i) => fontFamilies.add('__face' + i));
  fontFamilies.delete('');
  const hexColors = new Set((allCss.match(/#[0-9a-f]{3,8}\b/gi) || []).map((c) => c.toLowerCase()));
  const importantCount = (allCss.match(/!important/gi) || []).length;
  const inlineStyleCount = $('[style]').length;

  // --- COPYWRITING signals ---
  const bodyClone = cheerio.load(page.text);
  bodyClone('script,style,noscript,svg').remove();
  const visibleText = bodyClone('body').text().replace(/\s+/g, ' ').trim();
  const words = visibleText ? visibleText.split(/\s+/) : [];
  const wordCount = words.length;
  const lc = visibleText.toLowerCase();
  const countWord = (re: RegExp) => (lc.match(re) || []).length;
  const youCount = countWord(/\b(you|your|you're|yours)\b/g);
  const selfCount = countWord(/\b(i|we|we're|our|ours|us|my|me)\b/g) + countWord(/\b(journey|passion|mission|founded|story)\b/g);
  const buzzCount = BUZZWORDS.reduce((n, b) => n + countWord(new RegExp('\\b' + b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'g')), 0);
  const exclamations = (visibleText.match(/!/g) || []).length;
  const h1s = $('h1');
  const h1Text = (h1s.first().text() || '').replace(/\s+/g, ' ').trim();
  const hasLorem = /lorem ipsum/i.test(page.text);

  // --- ORIGINALITY signals ---
  const generator = ($('meta[name="generator"]').attr('content') || '').trim();
  const foundBuilders: string[] = [];
  for (const [name, re] of BUILDERS) if (re.test(page.text)) foundBuilders.push(name);
  if (generator) foundBuilders.push(generator.split(' ')[0]);
  const gradientCount = (allCss.match(/linear-gradient|radial-gradient|conic-gradient/gi) || []).length;
  const hasBlob = /blob/i.test(page.text) || /class=["'][^"']*blob/i.test(page.text);
  let phoneMockup = false;
  imgs.each((_, el) => {
    const a = $(el).attr() || {};
    const blob = `${a.alt || ''} ${a.class || ''} ${a.src || ''}`.toLowerCase();
    if (/(iphone|mockup|phone|device|app-?screen|screenshot-frame)/.test(blob)) phoneMockup = true;
  });
  const genericHero = /class=["'][^"']*\bhero\b/i.test(page.text) && /class=["'][^"']*\bcta\b/i.test(page.text);

  // --- MOBILE signals ---
  const viewport = $('meta[name="viewport"]').attr('content') || '';
  const hasViewport = /width\s*=\s*device-width/i.test(viewport);
  const blocksZoom = /(maximum-scale\s*=\s*1|user-scalable\s*=\s*(no|0))/i.test(viewport);
  const mediaQueries = (allCss.match(/@media[^{]+\{/gi) || []).length;
  const fixedWidths = (allCss.match(/\bwidth\s*:\s*\d{3,}px/gi) || []).length;
  const responsiveUnits = /\b(\d|\.)+(rem|vw|vh|%)\b/.test(allCss) || allCss.includes('flex') || allCss.includes('grid');

  // --- TRUST & POPUPS signals ---
  const isHttps = base.startsWith('https://');
  const cookieBanner =
    COOKIE_LIBS.some((c) => lowerHtml.includes(c)) ||
    (/\b(cookie|consent|gdpr)\b/i.test(visibleText.slice(0, 4000)) && /\b(accept|agree|allow|reject)\b/i.test(visibleText.slice(0, 4000)));
  const popup = /class=["'][^"']*(modal|popup|overlay|newsletter|subscribe|lightbox|dialog)/i.test(page.text) ||
    /(subscribe|sign up|join our|get \d+% off|don'?t miss)/i.test(visibleText.slice(0, 3000));
  const trackers = new Set<string>();
  scriptSrcs.forEach(({ url: s }) => TRACKER_HOSTS.forEach((h) => { if (s.includes(h)) trackers.add(h); }));
  TRACKER_HOSTS.forEach((h) => { if (lowerHtml.includes(h)) trackers.add(h); });
  const autoplay = /<(video|audio)[^>]*autoplay/i.test(page.text);
  const hasPrivacy = /href=["'][^"']*(privacy|terms|legal)/i.test(page.text);

  const totalKB = Math.round((page.bytes + jsBytes + cssBytes) / 1024);

  return {
    url: base,
    requestedUrl: url,
    status: page.status,
    stats: {
      htmlKB: Math.round(page.bytes / 1024),
      jsKB: Math.round(jsBytes / 1024),
      cssKB: Math.round(cssBytes / 1024),
      totalKB,
      requests: 1 + scriptSrcs.length + cssHrefs.length + imgs.length,
      scriptCount: scriptSrcs.length,
      imgCount: imgs.length,
      lazyImgs,
      renderBlocking,
      compressed: !!page.contentEncoding,

      fontCount: fontFamilies.size,
      colorCount: hexColors.size,
      importantCount,
      inlineStyleCount,

      wordCount,
      youCount,
      selfCount,
      buzzCount,
      exclamations,
      h1Text,
      h1Count: h1s.length,
      hasLorem,

      builders: [...new Set(foundBuilders)],
      gradientCount,
      hasBlob,
      phoneMockup,
      genericHero,

      hasViewport,
      blocksZoom,
      mediaQueries,
      fixedWidths,
      responsiveUnits,

      isHttps,
      cookieBanner: !!cookieBanner,
      popup: !!popup,
      trackers: [...trackers],
      autoplay,
      hasPrivacy,
    },
  };
}
