/**
 * tech-colors loader + geração de paleta dinâmica (ES Module)
 * - Carrega tech-colors.json
 * - Gera CSS dinâmico para chips (.skill-tag), nomes (.tech-name) e destaques (.tech-highlight)
 */

let TECH_COLORS_CACHE = null;

export async function loadTechColors() {
  if (TECH_COLORS_CACHE) return TECH_COLORS_CACHE;
  try {
    const res = await fetch("/tech-colors.json", { cache: "no-store" });
    if (res.ok) {
      TECH_COLORS_CACHE = await res.json();
      return TECH_COLORS_CACHE;
    }
  } catch (e) {
    console.warn("Falha ao carregar tech-colors.json", e);
  }
  TECH_COLORS_CACHE = {};
  return TECH_COLORS_CACHE;
}

function shadeHex(hex, p) {
  // p entre -1 e 1 (negativo = escurece, positivo = clareia)
  let f = (hex || "").replace("#", "").trim();
  if (f.length === 3) f = f.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(f)) return hex || "#999999";
  const num = parseInt(f, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  const t = p < 0 ? 0 : 255;
  const pr = Math.abs(p);
  r = Math.round((t - r) * pr) + r;
  g = Math.round((t - g) * pr) + g;
  b = Math.round((t - b) * pr) + b;
  return (
    "#" +
    [r, g, b]
      .map((v) => {
        const s = v.toString(16);
        return s.length === 1 ? "0" + s : s;
      })
      .join("")
  );
}

function contrastText(hex) {
  let f = (hex || "").replace("#", "").trim();
  if (f.length === 3) f = f.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(f)) return "#ffffff";
  const r = parseInt(f.substr(0, 2), 16);
  const g = parseInt(f.substr(2, 2), 16);
  const b = parseInt(f.substr(4, 2), 16);
  // YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? "#0b1220" : "#ffffff";
}

export function generateTechPalette(map) {
  if (!map || typeof map !== "object") return;
  const styleId = "tech-palette";
  const old = document.getElementById(styleId);
  if (old && old.parentNode) old.parentNode.removeChild(old);

  let css = "";
  Object.keys(map).forEach((key) => {
    const m = map[key] || {};
    const base = m.base || "#64748b"; // slate-500 fallback
    const stops = Array.isArray(m.gradient) && m.gradient.length >= 2
      ? m.gradient
      : [base, (m.alt || shadeHex(base, -0.2))];
    const grad = `linear-gradient(135deg, ${stops.join(", ")})`;
    const textColor = m.text || contrastText(stops[0]);
    const borderColor = m.border || stops[0];
    // chips (habilidades técnicas)
    css += `.skill-tag[data-tech="${key}"]{background:${grad};color:${textColor};border:2px solid ${borderColor};}`;
    // nomes na tabela + acento de borda
    css += `.tech-name[data-tech="${key}"]{color:${stops[0]};border-left:4px solid ${borderColor};padding-left:8px;}`;
    // destaques nas descrições
    css += `.tech-highlight[data-tech="${key}"]{color:${stops[0]};}`;
  });

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}
