/**
 * Hub de templates sem inline script (compatível com CSP) e com caminho relativo
 * - Carrega templates/templates.json relativo ao index.html (funciona em GitHub Pages)
 * - Mantém suporte ao seletor (se existir) e ao carregamento automático por localStorage
 */

const TEMPLATES_INDEX = "templates/templates.json";
const SELECT_ID = "templateSelector";
const IFRAME_ID = "templateFrame";
const STORAGE_KEY = "currentTemplateId";

async function loadTemplatesList() {
  try {
    const res = await fetch(TEMPLATES_INDEX, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar templates.json");
    const json = await res.json();
    return Array.isArray(json.templates) ? json.templates : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function setIframeTemplate(id) {
  const iframe = document.getElementById(IFRAME_ID);
  if (!iframe) return;
  // Carrega o index.html do template de forma relativa
  const url = `templates/${id}/index.html`;
  iframe.src = url;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
}

function populateSelect(templates, defaultId) {
  const sel = document.getElementById(SELECT_ID);
  if (!sel) return;
  sel.innerHTML = "";
  templates.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = t.name || t.id;
    sel.appendChild(opt);
  });
  sel.value = defaultId;
  sel.addEventListener("change", () => setIframeTemplate(sel.value));
}

async function bootHub() {
  const templates = await loadTemplatesList();
  if (!templates.length) {
    // Fallback para template-moderno se não houver lista
    populateSelect([{ id: "template-moderno", name: "Moderno" }], "template-moderno");
    setIframeTemplate("template-moderno");
    return;
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  const exists = templates.find((t) => t.id === saved);
  const defaultId = exists ? saved : templates[0].id;
  populateSelect(templates, defaultId);
  setIframeTemplate(defaultId);
}

document.addEventListener("DOMContentLoaded", bootHub);
