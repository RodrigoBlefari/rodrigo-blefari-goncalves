/**
 * Background por idioma (ES Module)
 * - Lê /assets/backgrounds/backgrounds.json
 * - Aplica imagem de fundo por idioma (fallback para 'en' ou primeira disponível)
 */
let BG_MAP = null;

async function loadBackgroundMap() {
  if (BG_MAP) return BG_MAP;
  try {
    const res = await fetch("/assets/backgrounds/backgrounds.json", { cache: "no-store" });
    if (res.ok) {
      BG_MAP = await res.json();
      return BG_MAP;
    }
  } catch (e) {
    console.warn("Falha ao carregar backgrounds.json:", e);
  }
  BG_MAP = {};
  return BG_MAP;
}

function resolveFilenameForLang(map, lang) {
  if (!map || typeof map !== "object") return null;
  if (map[lang]) return map[lang];
  if (map.en) return map.en;
  const first = Object.values(map).find((v) => typeof v === "string" && v.trim().length > 0);
  return first || null;
}

export async function applyBackgroundForLang(lang) {
  const map = await loadBackgroundMap();
  const filename = resolveFilenameForLang(map, lang);
  const url = filename ? `/assets/backgrounds/${filename}` : null;

  const body = document.body;
  // preserva outras propriedades do body (gradientes, temas etc.)
  if (url) {
    body.classList.add("bg-image-active");
    body.style.backgroundImage = `url("${url}")`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "fixed";
  } else {
    body.classList.remove("bg-image-active");
    body.style.removeProperty("background-image");
    body.style.removeProperty("background-size");
    body.style.removeProperty("background-position");
    body.style.removeProperty("background-repeat");
    body.style.removeProperty("background-attachment");
  }
}
