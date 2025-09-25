/**
 * Background por idioma (ES Module)
 * - Lê /assets/backgrounds/backgrounds.json
 * - Aplica imagem de fundo por idioma (fallback para 'en' ou primeira disponível)
 */
function getRepoBase() {
  const path = location.pathname;
  const idx = path.indexOf("/templates/");
  const basePath = idx !== -1 ? path.substring(0, idx + 1) : path.replace(/[^/]+$/, "");
  return location.origin + basePath;
}

let BG_MAP = null;

async function loadBackgroundMap() {
  if (BG_MAP) return BG_MAP;
  try {
    const res = await fetch(new URL("assets/backgrounds/backgrounds.json", getRepoBase()).href, { cache: "no-store" });
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

// ===== Seleção manual de background (galeria) =====
const BG_OVERRIDE_KEY = "bgOverrideFile";

export function getBackgroundOverride() {
  try {
    const v = localStorage.getItem(BG_OVERRIDE_KEY);
    return v && v !== "auto" ? v : null;
  } catch {
    return null;
  }
}

export function setBackgroundOverride(fileOrNull) {
  try {
    if (!fileOrNull) {
      localStorage.removeItem(BG_OVERRIDE_KEY);
    } else {
      localStorage.setItem(BG_OVERRIDE_KEY, String(fileOrNull));
    }
  } catch {}
}

export async function getBackgroundOptions() {
  try {
    const res = await fetch(new URL("assets/backgrounds/gallery.json", getRepoBase()).href, { cache: "no-store" });
    if (!res.ok) return [];
    const j = await res.json();
    const arr = Array.isArray(j.files) ? j.files : [];
    return arr.filter((x) => x && typeof x.file === "string");
  } catch {
    return [];
  }
}

export async function populateBackgroundSelect(selectEl, currentFile) {
  if (!selectEl) return;
  const options = await getBackgroundOptions();
  // Limpa e popula
  selectEl.innerHTML = "";
  const optAuto = document.createElement("option");
  optAuto.value = "auto";
  optAuto.textContent = "Automático (por idioma)";
  selectEl.appendChild(optAuto);
  options.forEach((o) => {
    const opt = document.createElement("option");
    opt.value = o.file;
    opt.textContent = o.label || o.file;
    selectEl.appendChild(opt);
  });
  // Define valor atual (override > i18n)
  const override = getBackgroundOverride();
  const value = override || currentFile || "auto";
  selectEl.value = value;
}

export async function applyBackgroundForLang(lang, i18nOverride, userOverride) {
  const map = await loadBackgroundMap();
  const filename =
    (userOverride && String(userOverride).trim()) ||
    (i18nOverride && String(i18nOverride).trim()) ||
    resolveFilenameForLang(map, lang);
  const url = filename ? new URL(`assets/backgrounds/${filename}`, getRepoBase()).href : null;

  const body = document.body;
  // preserva outras propriedades do body (gradientes, temas etc.)
  if (url) {
    body.classList.add("bg-image-active");
    body.style.backgroundImage = `url("${url}")`;
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center center";
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundAttachment = "fixed";

    // Também aplica no header do template-moderno (se existir)
    const header = document.querySelector("header.header");
    if (header) {
      let bg = header.querySelector(".header-bg");
      if (!bg) {
        bg = document.createElement("div");
        bg.className = "header-bg";
        header.appendChild(bg);
      }
      bg.style.backgroundImage = `url("${url}")`;
    }
  } else {
    body.classList.remove("bg-image-active");
    body.style.removeProperty("background-image");
    body.style.removeProperty("background-size");
    body.style.removeProperty("background-position");
    body.style.removeProperty("background-repeat");
    body.style.removeProperty("background-attachment");

    // Remove o background do header (se existir)
    const header = document.querySelector("header.header");
    if (header) {
      const bg = header.querySelector(".header-bg");
      if (bg) header.removeChild(bg);
    }
  }
}
