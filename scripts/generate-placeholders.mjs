// One-off generator for local placeholder imagery (no network, no proprietary assets).
// Run: node scripts/generate-placeholders.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public");

const palette = {
  cream: "#F2ECE0",
  creamDark: "#E9DEC8",
  ink: "#2B1810",
  lime: "#D7E85C",
  limeDark: "#B9CC3E",
  navy: "#33436B",
  terracotta: "#B85C3E",
  paleYellow: "#FAF0C8",
  yellow: "#E8B84B",
  lavender: "#B9A8D9",
  blue: "#8FB3C9",
  tan: "#C9A576",
  white: "#FFFFFF",
};

function write(path, svg) {
  mkdirSync(join(root, path, "..").replace(/\/\.\.$/, ""), { recursive: true });
  writeFileSync(join(root, path), svg, "utf8");
}

// --- Product photo placeholder: square, beige studio bg + abstract jar/bottle shape ---
function productSvg({ w = 800, h = 800, bg = palette.cream, jar = palette.tan, cap = palette.ink }) {
  const cx = w / 2;
  const jarW = w * 0.34;
  const jarH = h * 0.46;
  const jarX = cx - jarW / 2;
  const jarY = h * 0.32;
  const capH = h * 0.07;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <ellipse cx="${cx}" cy="${h * 0.82}" rx="${jarW * 0.62}" ry="${h * 0.035}" fill="${palette.ink}" opacity="0.08"/>
  <rect x="${jarX}" y="${jarY}" width="${jarW}" height="${jarH}" rx="${jarW * 0.14}" fill="${jar}"/>
  <rect x="${jarX + jarW * 0.08}" y="${jarY + jarH * 0.18}" width="${jarW * 0.84}" height="${jarH * 0.42}" rx="${jarW * 0.06}" fill="${palette.white}" opacity="0.85"/>
  <rect x="${jarX + jarW * 0.18}" y="${jarY - capH * 0.7}" width="${jarW * 0.64}" height="${capH}" rx="${capH * 0.3}" fill="${cap}"/>
  <circle cx="${cx}" cy="${jarY + jarH * 0.39}" r="${jarW * 0.16}" fill="${jar}" opacity="0.35"/>
</svg>`;
}

const jarColors = [palette.tan, palette.yellow, palette.lavender, palette.blue];
for (let i = 1; i <= 8; i++) {
  write(`placeholders/product-${i}.svg`, productSvg({ jar: jarColors[(i - 1) % jarColors.length] }));
}

// --- Lifestyle / editorial photo placeholder: soft gradient + concentric arcs ---
function lifestyleSvg({ w = 1200, h = 1500, tone = palette.cream, accent = palette.terracotta }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${tone}"/>
      <stop offset="100%" stop-color="${palette.creamDark}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.28}" fill="${accent}" opacity="0.14"/>
  <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.18}" fill="${accent}" opacity="0.18"/>
  <circle cx="${w * 0.5}" cy="${h * 0.42}" r="${w * 0.08}" fill="${palette.ink}" opacity="0.12"/>
</svg>`;
}
const tones = [
  [palette.cream, palette.terracotta],
  [palette.paleYellow, palette.navy],
  [palette.creamDark, palette.lime],
  [palette.cream, palette.tan],
  [palette.paleYellow, palette.terracotta],
  [palette.creamDark, palette.blue],
];
for (let i = 1; i <= 8; i++) {
  const [tone, accent] = tones[(i - 1) % tones.length];
  write(`placeholders/lifestyle-${i}.svg`, lifestyleSvg({ tone, accent }));
}

// --- Hero placeholders (wide) ---
for (let i = 1; i <= 3; i++) {
  const [tone, accent] = tones[(i - 1) % tones.length];
  write(`placeholders/hero-${i}.svg`, lifestyleSvg({ w: 1600, h: 1200, tone, accent }));
}

// --- Blog thumbnails ---
for (let i = 1; i <= 4; i++) {
  const [tone, accent] = tones[(i + 2) % tones.length];
  write(`placeholders/blog-${i}.svg`, lifestyleSvg({ w: 900, h: 700, tone, accent }));
}

// --- Founder polaroid photos ---
for (let i = 1; i <= 3; i++) {
  const [tone, accent] = tones[(i + 4) % tones.length];
  write(`placeholders/founder-${i}.svg`, lifestyleSvg({ w: 800, h: 900, tone, accent }));
}

// --- Avatar placeholders (initials on circle) ---
function avatarSvg(initials, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="60" fill="${bg}"/>
  <text x="60" y="68" font-family="Georgia, serif" font-size="34" fill="${palette.white}" text-anchor="middle">${initials}</text>
</svg>`;
}
const avatarNames = ["ML", "SB", "AK", "JD", "RT", "CN"];
const avatarBgs = [palette.terracotta, palette.navy, palette.tan, palette.limeDark, palette.blue, palette.ink];
avatarNames.forEach((n, i) => write(`placeholders/avatar-${i + 1}.svg`, avatarSvg(n, avatarBgs[i % avatarBgs.length])));

// --- Press logo placeholders (generic wordmarks, not real outlets) ---
function pressLogoSvg(label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60">
  <text x="100" y="38" font-family="Georgia, serif" font-size="26" letter-spacing="2" fill="${palette.ink}" text-anchor="middle">${label}</text>
</svg>`;
}
["THE DAILY", "MODERN LIVING", "CITY MAG", "WELLNESS CO", "THE JOURNAL"].forEach((label, i) =>
  write(`logos/press-${i + 1}.svg`, pressLogoSvg(label))
);

// --- Category tile placeholders for "moments" grid ---
for (let i = 1; i <= 8; i++) {
  const [tone, accent] = tones[(i - 1) % tones.length];
  write(`placeholders/moment-${i}.svg`, lifestyleSvg({ w: 500, h: 640, tone, accent }));
}

console.log("Placeholders generated.");
