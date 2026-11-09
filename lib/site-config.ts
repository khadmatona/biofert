import type { NavCategory, NavLink, MomentTile } from "./types";

/**
 * `key` values here index into the `nav.*` namespaces of
 * `messages/{locale}.json` — labels are resolved at render time via
 * `useTranslations`/`getTranslations`, never stored here, so the same
 * config drives every locale.
 */
export const siteConfig = {
  name: "BioFertMaroc",
};

export const productMegaMenu: NavCategory[] = [
  {
    key: "elle",
    href: "/collections/elle",
    links: [
      { key: "bellafert", href: "/products/bellafert" },
      { key: "relaxesWoman", href: "/products/relaxes-woman" },
      { key: "cyclecare", href: "/products/cyclecare" },
    ],
    images: ["/products/bellafert.png", "/products/cyclecare.png"],
  },
  {
    key: "lui",
    href: "/collections/lui",
    links: [
      { key: "fertimen", href: "/products/fertimen" },
      { key: "fertiPower", href: "/products/ferti-power" },
      { key: "powermen", href: "/products/powermen" },
      { key: "smokecleanMen", href: "/products/smokeclean-men" },
    ],
    images: ["/products/fertimen.png", "/products/powermen.png"],
  },
  {
    key: "duo",
    href: "/collections/duo",
    links: [{ key: "packCouple", href: "/products/pack-couple" }],
    images: ["/products/pack-couple.png", "/products/bellafert.png"],
  },
  {
    key: "essentiels",
    href: "/collections/essentiels",
    links: [
      { key: "fertiPower", href: "/products/ferti-power" },
      { key: "powermen", href: "/products/powermen" },
      { key: "smokecleanMen", href: "/products/smokeclean-men" },
      { key: "relaxesWoman", href: "/products/relaxes-woman" },
      { key: "cyclecare", href: "/products/cyclecare" },
    ],
    images: ["/products/fertipower.png", "/products/relaxeswoman.png"],
  },
  {
    key: "bestSellers",
    href: "/collections/best-sellers",
    links: [
      { key: "bellafert", href: "/products/bellafert" },
      { key: "fertimen", href: "/products/fertimen" },
      { key: "packCouple", href: "/products/pack-couple" },
    ],
    images: ["/products/bellafert.png", "/products/fertimen.png"],
  },
];

export const resourcesMenu: NavLink[] = [
  { key: "blog", href: "/blog" },
  { key: "guides", href: "/guides" },
  { key: "faq", href: "/faq" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

export const momentTiles: MomentTile[] = [
  { key: "elle", href: "/products/bellafert", image: "/placeholders/Katie-19.webp" },
  { key: "lui", href: "/products/fertimen", image: "/placeholders/acc6681798d84408f49df7075930f68d.jpg" },
  { key: "duo", href: "/products/pack-couple", image: "/placeholders/JM_SHOOTING_CELINE-0620.webp" },
  { key: "vitaliteLui", href: "/products/ferti-power", image: "/placeholders/11271a6c6c5659120631072b7da58036.jpg" },
  { key: "performance", href: "/products/powermen", image: "/placeholders/da4159e3377b9b7552fb4ef9e35a3da6.jpg" },
  { key: "detox", href: "/products/smokeclean-men", image: "/placeholders/893ad68020bb0ac7f38673363d0a7d9e.jpg" },
  { key: "sereniteElle", href: "/products/relaxes-woman", image: "/placeholders/pexels-aliona-zueva-42707571-11554690.jpg" },
  { key: "confortCycle", href: "/products/cyclecare", image: "/placeholders/143d96aee1fec0c6151129078e6d985e.jpg" },
];

export const footerNav = {
  shop: [
    { key: "elle", href: "/collections/elle" },
    { key: "lui", href: "/collections/lui" },
    { key: "duo", href: "/collections/duo" },
    { key: "essentiels", href: "/collections/essentiels" },
    { key: "bestSellers", href: "/collections/best-sellers" },
  ],
  company: [
    { key: "about", href: "/about" },
    { key: "blog", href: "/blog" },
    { key: "reviews", href: "/#avis" },
    { key: "contact", href: "/contact" },
  ],
  help: [
    { key: "faq", href: "/faq" },
    { key: "shipping", href: "/faq" },
    { key: "orderTracking", href: "/contact" },
  ],
  legal: [
    { key: "terms", href: "/terms" },
    { key: "privacy", href: "/privacy" },
  ],
};
