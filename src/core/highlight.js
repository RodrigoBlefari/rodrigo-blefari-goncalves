/**
 * Destaque de tecnologias nas descrições de experiência (ES Module)
 * - Procura termos técnicos em textos e envolve com span.tech-highlight[data-tech]
 * - Usa localStorage para lembrar o toggle
 */

const TECH_TERMS = [
  "angular",
  "react native",
  "react",
  "node.js",
  "nodejs",
  "php",
  "c#",
  "csharp",
  "javascript",
  "typescript",
  "html5",
  "css3",
  "mysql",
  "postgresql",
  "mongodb",
  "firebase",
  "dynamodb",
  "github",
  "gitlab",
  "jira",
  "trello",
  "datadog",
  "cypress",
  "ga4",
  "laravel",
  "wordpress",
  "jquery",
  "bootstrap",
  "sass",
  "scss",
  "tailwind",
  "webpack",
  "vite",
  "babel",
  "redux",
  "storybook",
  "graphql",
  "apache",
  "rest",
  "fullstory",
  "azure",
  "jest",
  "karma",
  "jasmine",
  "testing library",
  "testing-library",
  "playwright"
];

function normalizeTech(t) {
  const low = t.toLowerCase();
  if (low === "c#" || low === "csharp") return "csharp";
  if (low === "react native") return "react-native";
  if (low === "node.js") return "nodejs";
  return low.replace(/\s+/g, "-").replace(/\./g, "");
}

const TECH_REGEX = new RegExp(
  `\\b(${TECH_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

function unwrap(node) {
  const parent = node.parentNode;
  while (node.firstChild) parent.insertBefore(node.firstChild, node);
  parent.removeChild(node);
}

export function removeTechHighlights(container) {
  const scope = container || document;
  scope.querySelectorAll(".description .tech-highlight").forEach(unwrap);
}

function highlightInElement(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);

  nodes.forEach((textNode) => {
    const text = textNode.nodeValue;
    if (!TECH_REGEX.test(text)) {
      TECH_REGEX.lastIndex = 0;
      return;
    }
    TECH_REGEX.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m;
    while ((m = TECH_REGEX.exec(text)) !== null) {
      const match = m[0];
      const start = m.index;
      const end = start + match.length;
      if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
      const span = document.createElement("span");
      span.className = "tech-highlight";
      span.setAttribute("data-tech", normalizeTech(match));
      span.textContent = match;
      frag.appendChild(span);
      last = end;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode.replaceChild(frag, textNode);
  });
}

function getSectionByIcon(iconSuffix) {
  const h = Array.from(document.querySelectorAll(".section-title")).find(
    (el) => el.querySelector(`.${iconSuffix}`)
  );
  return h?.closest(".section");
}

export function applyTechHighlights(enabled) {
  const sections = [getSectionByIcon("fa-briefcase"), getSectionByIcon("fa-user")].filter(Boolean);
  if (!sections.length) return;

  // limpa sempre antes nos escopos encontrados
  sections.forEach((sec) => removeTechHighlights(sec));

  if (!enabled) return;

  sections.forEach((sec) => {
    sec.querySelectorAll(".description").forEach((el) => highlightInElement(el));
  });
}

export function initHighlightToggle() {
  const checkbox = document.getElementById("highlightTech");
  const saved = localStorage.getItem("highlightTech") === "1";
  if (checkbox) {
    checkbox.checked = saved;
    checkbox.addEventListener("change", (ev) => {
      const enabled = !!ev.target.checked;
      localStorage.setItem("highlightTech", enabled ? "1" : "0");
      applyTechHighlights(enabled);
    });
  }
  // aplica se já salvo
  if (saved) applyTechHighlights(true);
}
