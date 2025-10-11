import { loadI18n } from "./core/i18n.js";
import { loadFontForLang } from "./core/fonts.js";
import { loadTechColors, generateTechPalette } from "./core/techColors.js";
import { initHighlightToggle, applyTechHighlights } from "./core/highlight.js";
import { renderHeader } from "./components/header.js";
import { renderSectionTitles } from "./components/sectionTitles.js";
import { renderEducation } from "./components/education.js";
import { renderSummary } from "./components/summary.js";
import { renderExperience } from "./components/experience.js";
import { renderCompanies } from "./components/companies.js";
import { renderObjective } from "./components/objective.js";
import { initReadingMode } from "./features/readingMode.js";
import { printResume, downloadPDF } from "./features/print.js";
import { initSkills } from "./components/skills.js";
import { renderProjects } from "./components/projects.js";
import { applyBackgroundForLang, getBackgroundOverride, setBackgroundOverride, populateBackgroundSelect } from "./core/background.js";

// Estado de idioma
let currentLang = localStorage.getItem("lang") || "pt";

// Limpa conteúdo estático seed para evitar duplicidades antes de renderizar I18N
function cleanStaticSeed() {
  // Resumo
  try {
    const sumTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Resumo") || h.querySelector(".fa-user")
    );
    const sumSection = sumTitle?.closest(".section");
    if (sumSection) {
      Array.from(sumSection.childNodes).forEach((n) => {
        const isTitle =
          n.nodeType === 1 && n.classList && n.classList.contains("section-title");
        if (!isTitle) sumSection.removeChild(n);
      });
    }
  } catch {}

  // Experiência
  try {
    const expTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Experiência") || h.querySelector(".fa-briefcase")
    );
    const expSection = expTitle?.closest(".section");
    expSection?.querySelectorAll(".experience-item")?.forEach((e) => e.remove());
  } catch {}

  // Formação
  try {
    const eduTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Formação") || h.querySelector(".fa-graduation-cap")
    );
    const eduSection = eduTitle?.closest(".section");
    eduSection?.querySelectorAll(".education-item")?.forEach((e) => e.remove());
  } catch {}

  // Objetivo
  try {
    const objTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Objetivo") || h.querySelector(".fa-target")
    );
    const objSection = objTitle?.closest(".section");
    objSection?.querySelectorAll(".description")?.forEach((e) => e.remove());
  } catch {}

  // Empresas
  try {
    const compTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Empresas") || h.querySelector(".fa-building")
    );
    const compSection = compTitle?.closest(".section");
    const grid = compSection?.querySelector(".companies-grid");
    if (grid) grid.innerHTML = "";
  } catch {}

  // Principais competências
  try {
    const keyTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.textContent.trim().includes("Competências") || h.querySelector(".fa-star")
    );
    const keySection = keyTitle?.closest(".section");
    const wrap = keySection?.querySelector(".skill-tags");
    if (wrap) wrap.innerHTML = "";
  } catch {}

  // Projetos pessoais
  try {
    const projTitle = Array.from(document.querySelectorAll(".section-title")).find((h) => {
      const text = (h.textContent || "").toLowerCase();
      return h.querySelector(".fa-robot") || text.includes("conheca meus projetos") || text.includes("meet my projects");
    });
    const projSection = projTitle?.closest(".section");
    if (projSection) {
      const grid = projSection.querySelector(".projects-grid");
      if (grid) grid.innerHTML = "";
      const intro = projSection.querySelector(".projects-intro");
      if (intro) {
        intro.textContent = "";
        intro.style.display = "none";
      }
    }
  } catch {}
}

function populateLanguageSelector() {
  const langSel = document.getElementById("languageSelector");
  if (langSel) {
    const langs = [
      { v: "pt", l: "Português" },
      { v: "en", l: "English" },
      { v: "es", l: "Español" },
      { v: "zh", l: "中文(简体)" },
      { v: "hi", l: "हिंदी" },
      { v: "ar", l: "العربية" },
      { v: "bn", l: "বাংলা" },
      { v: "ru", l: "Русский" },
      { v: "ja", l: "日本語" },
      { v: "pa", l: "ਪੰਜਾਬੀ" }
    ];
    langSel.innerHTML = "";
    langs.forEach(({ v, l }) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = l;
      langSel.appendChild(opt);
    });
    langSel.value = currentLang;
  }
}

async function renderKeySkillsFromI18n(t) {
  try {
    // Primeiro: ancora estável por id (template-agnóstico)
    const anchor = document.getElementById("key-skills");
    if (anchor) {
      anchor.innerHTML = "";
      const labelMap = {
        "react-native": "React Native",
        nodejs: "Node.js",
        csharp: "C#",
        css3: "CSS3",
        html5: "HTML5",
        ga4: "GA4",
        graphql: "GraphQL",
        rest: "REST"
      };
      const skills = Array.isArray(t?.keySkills) ? t.keySkills : [];
      skills.forEach((tech) => {
        if (!tech) return;
        const span = document.createElement("span");
        span.className = "skill-tag";
        span.setAttribute("data-tech", tech);
        span.textContent =
          labelMap[tech] ||
          String(tech).replace(/(^|[-_])\w/g, (s) => s.replace(/[-_]/, " ").toUpperCase());
        anchor.appendChild(span);
      });
      if (anchor.children.length) return;
    }

    // Prefira localizar pela presença do ícone (robusto para todos idiomas)
    let keyTitle = Array.from(document.querySelectorAll(".section-title")).find(
      (h) => h.querySelector(".fa-star")
    );
    console.debug("[KeySkills] lang:", t?.__lang, "| title by icon:", !!keyTitle);
    // Fallback: tente pelo texto vindo do i18n (se existir)
    if (!keyTitle && t?.sections?.keySkills) {
      keyTitle = Array.from(document.querySelectorAll(".section-title")).find((h) =>
        h.textContent.trim().includes(t.sections.keySkills)
      );
      console.debug("[KeySkills] title by i18n text:", !!keyTitle, "| text:", t.sections.keySkills);
    }
    // Fallback adicional: palavra "Compet" para pt-PT/variações (melhora resiliência)
    if (!keyTitle) {
      keyTitle = Array.from(document.querySelectorAll(".section-title")).find((h) =>
        /Compet/i.test(h.textContent)
      );
      console.debug("[KeySkills] title by regex /Compet/:", !!keyTitle);
    }

    let keySection = keyTitle?.closest(".section");
    if (!keySection) {
      // Fallback: cria a seção "Principais Competências" caso ela não exista no template
      console.warn("[KeySkills] Section not found. Creating a new one.");
      const container =
        document.querySelector(".sidebar") ||
        document.querySelector(".tech-sidebar") ||
        document.querySelector("main") ||
        document.body;

      const sec = document.createElement("section");
      sec.className = "section";

      const h2 = document.createElement("h2");
      h2.className = "section-title";
      const icon = document.createElement("i");
      icon.className = "fas fa-star";
      const span = document.createElement("span");
      span.textContent = " " + (t?.sections?.keySkills || "Principais Competências");
      h2.appendChild(icon);
      h2.appendChild(span);

      const tagWrap = document.createElement("div");
      tagWrap.className = "skill-tags";

      sec.appendChild(h2);
      sec.appendChild(tagWrap);

      if (container.firstChild) {
        container.insertBefore(sec, container.firstChild.nextSibling || null);
      } else {
        container.appendChild(sec);
      }

      keySection = sec;
    }

    // Garante container .skill-tags (se for ausente no template)
    let wrap = keySection.querySelector(".skill-tags");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "skill-tags";
      keySection.appendChild(wrap);
      console.debug("[KeySkills] Created .skill-tags container");
    }
    wrap.innerHTML = "";

    const labelMap = {
      "react-native": "React Native",
      nodejs: "Node.js",
      csharp: "C#",
      css3: "CSS3",
      html5: "HTML5",
      ga4: "GA4",
      graphql: "GraphQL",
      rest: "REST"
    };
    const skills = Array.isArray(t?.keySkills) ? t.keySkills : [];
    console.debug("[KeySkills] skills count:", skills.length, "| sample:", skills.slice(0, 5));
    skills.forEach((tech) => {
      if (!tech) return;
      const span = document.createElement("span");
      span.className = "skill-tag";
      span.setAttribute("data-tech", tech);
      span.textContent =
        labelMap[tech] ||
        String(tech).replace(/(^|[-_])\w/g, (s) => s.replace(/[-_]/, " ").toUpperCase());
      wrap.appendChild(span);
    });

    // Fallback defensivo: se por algum motivo não renderizou nada (ex.: falha de i18n pt),
    // tenta reaproveitar as keySkills do inglês para não ficar vazio visualmente.
    if (!wrap.children.length) {
      try {
        const base = (() => {
          const p = location.pathname;
          const idx = p.indexOf("/templates/");
          const basePath = idx !== -1 ? p.substring(0, idx) + "/" : p.replace(/[^/]+$/, "");
          return location.origin + basePath;
        })();
        const resEn = await fetch(new URL("i18n/en.json", base).href, { cache: "no-store" });
        if (resEn.ok) {
          const en = await resEn.json();
          const enSkills = Array.isArray(en?.keySkills) ? en.keySkills : [];
          enSkills.forEach((tech) => {
            if (!tech) return;
            const span = document.createElement("span");
            span.className = "skill-tag";
            span.setAttribute("data-tech", tech);
            span.textContent =
              labelMap[tech] ||
              String(tech).replace(/(^|[-_])\w/g, (s) => s.replace(/[-_]/, " ").toUpperCase());
            wrap.appendChild(span);
          });
          console.warn("[KeySkills] Fallback to EN applied. Rendered:", wrap.children.length);
        } else {
          console.warn("[KeySkills] Could not fetch EN fallback. Status:", resEn.status);
        }
      } catch (err) {
        console.warn("[KeySkills] EN fallback error:", err);
      }
    } else {
      console.debug("[KeySkills] Rendered PT items:", wrap.children.length);
    }
  } catch (e) {
    console.warn("Falha ao renderizar Principais Competências:", e);
  }
}

function updateUILocalizedLabels(t) {
  try {
    // Template Tech: labels de controles
    const lblReading = document.querySelector('label[for="readingMode"] span') || document.querySelector('label[for="readingMode"]');
    if (lblReading && t?.ui?.readingModeLabel) lblReading.textContent = t.ui.readingModeLabel;

    const lblLang = document.querySelector('label[for="languageSelector"] span') || document.querySelector('label[for="languageSelector"]');
    if (lblLang && t?.ui?.languageLabel) lblLang.textContent = t.ui.languageLabel;

    const lblBg = document.querySelector('label[for="backgroundSelector"] span') || document.querySelector('label[for="backgroundSelector"]');
    // Não existe no i18n ainda; se desejar adicionar depois use t.ui.backgroundLabel
    if (lblBg && t?.ui?.backgroundLabel) lblBg.textContent = t.ui.backgroundLabel;

    // Toggle "Destacar tecnologias" (fallback caso não exista no i18n)
    const toggle = document.querySelector('.toggle .slider + span');
    if (toggle) toggle.textContent = t?.ui?.highlightLabel || 'Destacar tecnologias';

    // Botão Imprimir (ambos templates)
    const btnPrint = document.querySelector('.btn.print, .download-btn');
    if (btnPrint && t?.ui?.print) {
      // Mantém ícone se houver e substitui o texto
      const icon = btnPrint.querySelector('i');
      btnPrint.textContent = '';
      if (icon) btnPrint.appendChild(icon);
      const txt = document.createTextNode(' ' + t.ui.print);
      btnPrint.appendChild(txt);
    }
  } catch (e) {
    console.warn('Falha ao aplicar labels de UI:', e);
  }
}

async function renderAll(t) {
  renderHeader(t);
  renderSectionTitles(t);
  renderEducation(t);
  renderSummary(t);
  renderExperience(t);
  renderObjective(t);
  renderCompanies(t);
  renderProjects(t);
  await renderKeySkillsFromI18n(t);
  initSkills();
  updateUILocalizedLabels(t);

  // aplica paleta oficial por tecnologia vinda do arquivo tech-colors
  try {
    const colors = await loadTechColors();
    generateTechPalette(colors || {});
  } catch (e) {
    console.warn("Falha ao aplicar paleta de tecnologias:", e);
  }

  // Destaque de tecnologias (toggle salvo)
  const savedHL = localStorage.getItem("highlightTech") === "1";
  if (savedHL) applyTechHighlights(true);
}

async function boot() {
  initReadingMode();
  populateLanguageSelector();
  loadFontForLang(currentLang);

  cleanStaticSeed();

  const t = await loadI18n(currentLang);
  await applyBackgroundForLang(currentLang, t?.ui?.bannerBackground, getBackgroundOverride());

  // Popular seletor de plano de fundo (se existir)
  const bgSel = document.getElementById("backgroundSelector");
  await populateBackgroundSelect(bgSel, t?.ui?.bannerBackground);
  if (bgSel) {
    bgSel.addEventListener("change", async () => {
      const val = bgSel.value;
      if (val === "auto") setBackgroundOverride(null);
      else setBackgroundOverride(val);
      await applyBackgroundForLang(currentLang, t?.ui?.bannerBackground, getBackgroundOverride());
    });
  }

  await renderAll(t);
  updateUILocalizedLabels(t);

  // Bind changeLanguage
  const langSel = document.getElementById("languageSelector");
  if (langSel) {
    langSel.addEventListener("change", async () => {
      currentLang = langSel.value || "pt";
      localStorage.setItem("lang", currentLang);
      loadFontForLang(currentLang);
      cleanStaticSeed();
      const ti18n = await loadI18n(currentLang);
      await populateBackgroundSelect(document.getElementById("backgroundSelector"), ti18n?.ui?.bannerBackground);
      await applyBackgroundForLang(currentLang, ti18n?.ui?.bannerBackground, getBackgroundOverride());
      await renderAll(ti18n);
      updateUILocalizedLabels(ti18n);
    });
  }

  // Inicializa toggle de destaque
  initHighlightToggle();

  // Expor funções de impressão no escopo global para botões com onclick
  window.printResume = printResume;
  window.downloadPDF = downloadPDF;
}

document.addEventListener("DOMContentLoaded", boot);
