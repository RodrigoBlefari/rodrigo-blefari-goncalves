const FALLBACK_PROJECTS = {
  intro: "Personal experiments mixing Canvas, generative AI and procedural gameplay.",
  ctaLabel: "Open project",
  items: [
    {
      badge: "Generative AI project",
      title: "Generative Game Rogue Like",
      slug: "generative-game-rogue-like",
      description: "HTML5 Canvas rogue-like that alternates between player and learning modes, evolving the agent in real time.",
      href: "../../projetos-pessoais/generative-game-rogue-like/index.html",
      tags: ["Canvas", "Generative AI", "Rogue-like"],
      note: "Hosted on GitHub Pages in the same branch."
    }
  ]
};

function findProjectsSection() {
  const titleEl = Array.from(document.querySelectorAll(".section-title")).find(
    (node) =>
      node.querySelector(".fa-robot") ||
      (node.textContent || "").toLowerCase().includes("conheca meus projetos") ||
      (node.textContent || "").toLowerCase().includes("meet my projects")
  );
  return titleEl?.closest(".section") || null;
}

function resolveProjectsData(c) {
  const data = c?.projects;
  if (data && Array.isArray(data.items) && data.items.length) return data;
  return FALLBACK_PROJECTS;
}

function clearSection(section) {
  if (!section) return;
  const grid = section.querySelector(".projects-grid");
  if (grid) grid.innerHTML = "";
  const intro = section.querySelector(".projects-intro");
  if (intro) {
    intro.textContent = "";
    intro.style.display = "none";
  }
}

export function renderProjects(c) {
  try {
    const section = findProjectsSection();
    if (!section) return;

    const data = resolveProjectsData(c);
    const items = Array.isArray(data.items) ? data.items : [];

    if (!items.length) {
      clearSection(section);
      section.style.display = "none";
      return;
    }

    section.style.display = "";

    let introEl = section.querySelector(".projects-intro");
    if (!introEl) {
      introEl = document.createElement("p");
      introEl.className = "projects-intro";
      section.insertBefore(introEl, section.querySelector(".projects-grid"));
    }

    const introText = (c?.projects?.intro || data.intro || "").trim();
    if (introEl) {
      if (introText) {
        introEl.textContent = introText;
        introEl.style.display = "";
      } else {
        introEl.textContent = "";
        introEl.style.display = "none";
      }
    }

    let grid = section.querySelector(".projects-grid");
    if (!grid) {
      grid = document.createElement("div");
      grid.className = "projects-grid";
      section.appendChild(grid);
    }
    grid.innerHTML = "";

    const linkLabel = (c?.projects?.ctaLabel || data.ctaLabel || "Open project").trim();

    items.forEach((item) => {
      if (!item) return;

      const card = document.createElement("article");
      card.className = "project-card";
      if (item.slug) card.dataset.project = item.slug;

      if (item.badge) {
        const badge = document.createElement("span");
        badge.className = "project-badge";
        badge.textContent = item.badge;
        card.appendChild(badge);
      }

      const title = document.createElement("h3");
      title.textContent = item.title || item.slug || "Projeto";
      card.appendChild(title);

      if (item.slug && item.slug !== item.title) {
        const slug = document.createElement("code");
        slug.className = "project-slug";
        slug.textContent = item.slug;
        card.appendChild(slug);
      }

      if (item.description) {
        const desc = document.createElement("p");
        desc.className = "project-description";
        desc.textContent = item.description;
        card.appendChild(desc);
      }

      if (Array.isArray(item.tags) && item.tags.length) {
        const tagsWrap = document.createElement("div");
        tagsWrap.className = "project-tags";
        item.tags.forEach((tag) => {
          if (!tag) return;
          const chip = document.createElement("span");
          chip.className = "project-chip";
          chip.textContent = tag;
          tagsWrap.appendChild(chip);
        });
        if (tagsWrap.children.length) card.appendChild(tagsWrap);
      }

      if (item.note) {
        const note = document.createElement("p");
        note.className = "project-note";
        note.textContent = item.note;
        card.appendChild(note);
      }

      if (item.href) {
        const link = document.createElement("a");
        link.className = "project-link";
        link.href = item.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = item.linkLabel || linkLabel;
        card.appendChild(link);
      }

      grid.appendChild(card);
    });
  } catch (err) {
    console.warn("Falha ao renderizar projetos pessoais:", err);
  }
}
