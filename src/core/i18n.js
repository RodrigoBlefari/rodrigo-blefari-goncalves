/**
 * i18n loader (ES Module)
 * - Carrega i18n/{lang}.json
 * - Usa cache em localStorage
 * - Fallback local para en.json (sem chamadas externas)
 */
let CURRENT_I18N = null;

export async function loadI18n(lang) {
  if (CURRENT_I18N && CURRENT_I18N.__lang === lang) return CURRENT_I18N;

  const cacheKey = `i18n_${lang}`;

  // 1) Tenta arquivo local do idioma selecionado
  try {
    const res = await fetch(`/i18n/${lang}.json`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      data.__lang = lang;
      CURRENT_I18N = data;
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {}
      return data;
    }
  } catch {}

  // 2) Tenta cache do idioma
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      data.__lang = lang;
      CURRENT_I18N = data;
      return data;
    }
  } catch {}

  // 3) Fallback para EN local
  try {
    const resEn = await fetch("/i18n/en.json", { cache: "no-store" });
    const en = await resEn.json();
    en.__lang = "en";
    CURRENT_I18N = en;
    return en;
  } catch {
    // 4) Último recurso: objeto mínimo
    const minimal = {
      __lang: "en",
      ui: { readingModeLabel: "Reading mode", languageLabel: "Language", print: "Print" },
      sections: {},
      categories: {}
    };
    CURRENT_I18N = minimal;
    return minimal;
  }
}

export function getCurrentI18n() {
  return CURRENT_I18N;
}
