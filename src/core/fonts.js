/**
 * Fontes por idioma + direção de escrita (ES Module)
 * Aplica fonte Google Fonts adequada e RTL quando necessário.
 */
const FONT_MAP = {
  pt: { family: "Inter", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap", dir: "ltr" },
  en: { family: "Inter", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap", dir: "ltr" },
  es: { family: "Inter", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap", dir: "ltr" },
  zh: { family: "Noto Sans SC", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap", dir: "ltr" },
  hi: { family: "Noto Sans Devanagari", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap", dir: "ltr" },
  ar: { family: "Noto Naskh Arabic", href: "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap", dir: "rtl" },
  bn: { family: "Noto Sans Bengali", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap", dir: "ltr" },
  ru: { family: "Noto Sans", href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap", dir: "ltr" },
  ja: { family: "Noto Sans JP", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap", dir: "ltr" },
  pa: { family: "Noto Sans Gurmukhi", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Gurmukhi:wght@400;700&display=swap", dir: "ltr" }
};

export function loadFontForLang(lang) {
  const cfg = FONT_MAP[lang] || FONT_MAP.en;
  let link = document.getElementById("locale-font");
  if (!link) {
    link = document.createElement("link");
    link.id = "locale-font";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== cfg.href) link.href = cfg.href;
  document.body.style.fontFamily = `"${cfg.family}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  document.documentElement.setAttribute("dir", cfg.dir || "ltr");
  document.documentElement.setAttribute("lang", lang);
}
