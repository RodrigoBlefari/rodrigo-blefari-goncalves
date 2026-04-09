/**
 * Hub simples: CV padrão + Projetos com dropdown
 */

const CONFIG = {
  defaultCV: "template-moderno",
  projects: [
    { id: "ia-rogue", name: "🤖 I.A (Rogue-Like)", url: "projetos-pessoais/generative-game-rogue-like/index.html" },
    { id: "gh300", name: "🎓 Certificação Copilot", url: "gh300-simulator.html" }
  ]
};

const IFRAME_ID = "templateFrame";
const STORAGE_KEY = "currentPage";

function setPage(type, id) {
  const iframe = document.getElementById(IFRAME_ID);
  if (!iframe) return;

  let url;
  if (type === "cv") {
    url = `templates/${id}/index.html`;
  } else if (type === "project") {
    const project = CONFIG.projects.find(p => p.id === id);
    url = project?.url;
  }

  if (url) {
    iframe.src = url;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ type, id }));
    } catch {}
    updateBreadcrumb(type, id);
  }
}

function updateBreadcrumb(type, id) {
  const breadcrumb = document.getElementById("navBreadcrumb");
  if (!breadcrumb) return;

  if (type === "cv") {
    breadcrumb.textContent = "📄 Meu CV";
  } else if (type === "project") {
    const project = CONFIG.projects.find(p => p.id === id);
    if (project) breadcrumb.textContent = project.name;
  }
}

function buildDropdown() {
  const container = document.getElementById("projectNav");
  if (!container) return;

  // Botão CV
  const cvBtn = document.createElement("button");
  cvBtn.className = "nav-item active";
  cvBtn.id = "cvBtn";
  cvBtn.innerHTML = "📄 Meu CV";
  cvBtn.addEventListener("click", () => {
    setPage("cv", CONFIG.defaultCV);
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    cvBtn.classList.add("active");
    const dropdown = document.getElementById("projectsDropdown");
    if (dropdown) dropdown.classList.remove("show");
  });
  container.appendChild(cvBtn);

  // Dropdown Projetos
  const dropdownWrapper = document.createElement("div");
  dropdownWrapper.className = "dropdown-wrapper";

  const projectsBtn = document.createElement("button");
  projectsBtn.className = "nav-item dropdown-toggle";
  projectsBtn.innerHTML = "📁 Projetos ▼";
  projectsBtn.addEventListener("click", () => {
    const dropdown = document.getElementById("projectsDropdown");
    dropdown.classList.toggle("show");
  });
  dropdownWrapper.appendChild(projectsBtn);

  const dropdown = document.createElement("div");
  dropdown.id = "projectsDropdown";
  dropdown.className = "dropdown-menu";

  CONFIG.projects.forEach(proj => {
    const item = document.createElement("button");
    item.className = "dropdown-item";
    item.innerHTML = proj.name;
    item.addEventListener("click", () => {
      setPage("project", proj.id);
      document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
      projectsBtn.classList.add("active");
      dropdown.classList.remove("show");
    });
    dropdown.appendChild(item);
  });

  dropdownWrapper.appendChild(dropdown);
  container.appendChild(dropdownWrapper);
}

function bootHub() {
  buildDropdown();

  // Carregar último ou padrão
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {}

  if (saved && (saved.type === "cv" || saved.type === "project")) {
    setPage(saved.type, saved.id);
  } else {
    setPage("cv", CONFIG.defaultCV);
  }
}

document.addEventListener("DOMContentLoaded", bootHub);
