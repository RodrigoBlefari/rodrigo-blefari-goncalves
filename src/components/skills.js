/**
 * Skills components (ES Module)
 * - buildTechProficiencyTable: monta a tabela "Tecnologias & Proficiência"
 * - reorganizeTechChips: reorganiza chips de "Habilidades Técnicas" por stacks/categorias e garante cobertura
 */

// Monta a tabela elegante de tecnologias a partir dos chips presentes
export function buildTechProficiencyTable() {
  const container = document.getElementById("tech-proficiency-list");
  if (!container) return;

  // Coleta tecnologias únicas
  const techMap = new Map();
  document.querySelectorAll(".skill-tag[data-tech]").forEach((el) => {
    const key = el.getAttribute("data-tech")?.trim();
    const label = (el.textContent || "").trim();
    if (key && !techMap.has(key)) techMap.set(key, label || key);
  });

  // Níveis (1-5). Ajuste conforme necessário.
  const ratingMap = {
    javascript: 5,
    typescript: 5,
    react: 4,
    "react-native": 3,
    angular: 5,
    nodejs: 4,
    php: 4,
    csharp: 2,
    html5: 5,
    css3: 5,
    mysql: 4,
    postgresql: 4,
    mongodb: 4,
    firebase: 4,
    dynamodb: 4,
    github: 5,
    gitlab: 5,
    jira: 5,
    trello: 5,
    datadog: 5,
    cypress: 5,
    ga4: 4,
    laravel: 3,
    wordpress: 3,

    // Front-end extras
    jquery: 5,
    bootstrap: 4,
    sass: 5,
    scss: 5,
    tailwind: 5,
    webpack: 3,
    vite: 4,
    babel: 4,
    redux: 4,
    storybook: 4,

    // APIs / Back-end extras
    graphql: 3,
    rest: 5,
    apache: 3,

    // Testes
    playwright: 4,
    jest: 5,
    karma: 5,
    jasmine: 5,
    "testing-library": 3,

    // Observabilidade/DevOps
    fullstory: 4,
    azure: 3
  };

  // Ordem de categorias e concorrentes (Angular, depois React, etc.)
  const ordem = {
    "Front-end": [
      "angular",
      "react",
      "react-native",
      "html5",
      "css3",
      "javascript",
      "typescript"
    ],
    "Back-end": ["nodejs", "php", "csharp", "laravel", "wordpress"],
    "Banco de dados": ["mysql", "postgresql", "mongodb", "firebase", "dynamodb"],
    DevOps: ["datadog", "ga4"],
    "CI/CD": ["github", "gitlab", "cypress"]
  };

  container.innerHTML = "";
  // inclui categorias de Testes também
  ordem["Testes"] = [
    "cypress",
    "jest",
    "karma",
    "jasmine",
    "testing-library",
    "playwright",
    "cypress"
  ];

  // Garante que todas tecnologias em 'ordem' estejam presentes no mapa (mesmo que não haja chip)
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
  Object.values(ordem)
    .flat()
    .forEach((k) => {
      if (!techMap.has(k)) {
        const label =
          labelMap[k] ||
          k.replace(/(^|[-_])\w/g, (s) => s.replace(/[-_]/, " ").toUpperCase());
        techMap.set(k, label);
      }
    });

  const table = document.createElement("div");
  table.className = "tech-table";

  const estrelas = (r) => {
    const wrap = document.createElement("span");
    wrap.className = "tech-stars";
    const v = Math.max(0, Math.min(5, r | 0));
    for (let i = 1; i <= 5; i++) {
      const icon = document.createElement("i");
      icon.className = i <= v ? "fa-solid fa-star" : "fa-regular fa-star";
      wrap.appendChild(icon);
    }
    wrap.title = `Nível: ${Math.max(1, Math.min(5, r | 0))}/5`;
    return wrap;
  };

  Object.keys(ordem).forEach((cat) => {
    // Título da categoria
    const h = document.createElement("div");
    h.className = "tech-cat";
    h.textContent = cat;
    table.appendChild(h);

    const rows = document.createElement("div");
    rows.className = "tech-rows";

    // Principais (concorrentes/ordem preferida)
    const principais = ordem[cat]
      .filter((key) => techMap.has(key))
      .map((key) => ({
        key,
        label: techMap.get(key),
        rating: ratingMap[key] ?? 3
      }));

    // Extras pertencentes à mesma categoria (caso apareçam no HTML) e não listados ainda
    const extras = Array.from(techMap.keys())
      .filter((k) => !ordem[cat].includes(k))
      .filter((k) => {
        if (cat === "Front-end")
          return [
            "react",
            "react-native",
            "angular",
            "html5",
            "css3",
            "javascript",
            "typescript"
          ].includes(k);
        if (cat === "Back-end")
          return ["nodejs", "php", "csharp", "laravel", "wordpress"].includes(k);
        if (cat === "Banco de dados")
          return ["mysql", "postgresql", "mongodb", "firebase", "dynamodb"].includes(
            k
          );
        if (cat === "DevOps") return ["datadog", "ga4"].includes(k);
        if (cat === "CI/CD") return ["github", "gitlab", "cypress"].includes(k);
        return false;
      })
      .map((k) => ({
        key: k,
        label: techMap.get(k),
        rating: ratingMap[k] ?? 3
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    [...principais, ...extras].forEach((item) => {
      const row = document.createElement("div");
      row.className = "tech-row";

      const name = document.createElement("span");
      name.className = "tech-name";
      name.setAttribute("data-tech", item.key);
      name.textContent = item.label;

      row.appendChild(name);
      row.appendChild(estrelas(item.rating));
      rows.appendChild(row);
    });

    table.appendChild(rows);
  });

  container.appendChild(table);
}

// Reorganiza os chips de "Habilidades Técnicas" por stacks/categorias e garante todas as tecnologias citadas
export function reorganizeTechChips() {
  const sectionTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (el) => el.textContent.trim().includes("Habilidades Técnicas")
  );
  if (!sectionTitle) return;
  const section = sectionTitle.closest(".section");
  if (!section) return;

  // Mapa de exibição desejada por categoria
  const ordem = {
    "Front-end": [
      "angular",
      "react",
      "react-native",
      "html5",
      "css3",
      "javascript",
      "typescript",
      "jquery",
      "bootstrap",
      "sass",
      "scss",
      "tailwind",
      "webpack",
      "vite",
      "babel",
      "redux",
      "storybook"
    ],
    Testes: ["jest", "karma", "jasmine", "testing-library", "playwright", "cypress"],
    "Back-end": ["nodejs", "php", "csharp", "laravel", "wordpress"],
    "Banco de dados": ["mysql", "postgresql", "mongodb", "firebase", "dynamodb"],
    DevOps: ["datadog", "fullstory", "ga4", "azure", "apache"],
    "CI/CD": ["github", "gitlab"],
    APIs: ["rest", "graphql"],
    Ferramentas: ["jira", "trello"]
  };

  // Coletar todos chips existentes e indexar por data-tech
  const chips = Array.from(document.querySelectorAll(".skill-tag[data-tech]"));
  const byKey = new Map();
  chips.forEach((el) => {
    const key = el.getAttribute("data-tech")?.trim();
    if (key && !byKey.has(key)) byKey.set(key, el);
  });

  // Criar chip SEM mover o original (não desloca os chips de "Principais Competências")
  const ensureChip = (key) => {
    // Sempre cria um novo elemento para não remover do bloco de Principais Competências
    const span = document.createElement("span");
    span.className = "skill-tag";
    span.setAttribute("data-tech", key);
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
    span.textContent =
      labelMap[key] ||
      key.replace(/(^|[-_])\w/g, (s) => s.replace(/[-_]/, " ").toUpperCase());
    return span;
  };

  // Limpar categorias antigas e reconstruir por stacks
  section.querySelectorAll(".skill-category").forEach((n) => n.remove());

  const mkCat = (icon, title, keys) => {
    const cat = document.createElement("div");
    cat.className = "skill-category";
    const h = document.createElement("h4");
    h.innerHTML = `<i class="${icon}"></i> ${title}`;
    const wrap = document.createElement("div");
    wrap.className = "skill-tags";
    keys.forEach((k) => {
      wrap.appendChild(ensureChip(k));
    });
    cat.appendChild(h);
    cat.appendChild(wrap);
    return cat;
  };

  const iconBy = {
    "Front-end": "fas fa-desktop",
    Testes: "fas fa-vial",
    "Back-end": "fas fa-server",
    "Banco de dados": "fas fa-database",
    DevOps: "fas fa-infinity",
    "CI/CD": "fas fa-code-branch",
    APIs: "fas fa-plug",
    Ferramentas: "fas fa-toolbox"
  };

  Object.keys(ordem).forEach((title) => {
    section.appendChild(
      mkCat(iconBy[title] || "fas fa-layer-group", title, ordem[title])
    );
  });
}

// Inicializador prático para ser chamado no bootstrap
export function initSkills() {
  buildTechProficiencyTable();
  reorganizeTechChips();
}
