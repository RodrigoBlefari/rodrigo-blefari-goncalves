/**
 * Hub simples: CV padrao + Projetos com dropdown
 */

const CONFIG = {
  defaultCV: "template-moderno",
  examsIndexUrl: "data/exams/index.json",
  examPage: "gh300-simulator.html",
  staticProjects: [
    { id: "ia-rogue", name: "🤖 I.A (Rogue-Like)", url: "projetos-pessoais/generative-game-rogue-like/index.html" }
  ]
};

const IFRAME_ID = "templateFrame";
const STORAGE_KEY = "currentPage";

let PROJECTS = [];

async function loadProjects() {
  const projects = [...CONFIG.staticProjects];

  try {
    const res = await fetch(new URL(CONFIG.examsIndexUrl, window.location.href).href, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const exams = Array.isArray(data?.exams) ? data.exams : [];

      exams.forEach((exam) => {
        if (!exam || !exam.id) return;
        projects.push({
          id: `exam:${exam.id}`,
          name: exam.label || exam.title || exam.id,
          url: `${CONFIG.examPage}?exam=${encodeURIComponent(exam.id)}`,
        });
      });
    }
  } catch (err) {
    console.warn("Falha ao carregar lista de provas:", err);
  }

  PROJECTS = projects;
}

function setPage(type, id) {
  const iframe = document.getElementById(IFRAME_ID);
  if (!iframe) return;

  let url;
  if (type === "cv") {
    url = `templates/${id}/index.html`;
  } else if (type === "project") {
    const project = PROJECTS.find(p => p.id === id);
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
    const project = PROJECTS.find(p => p.id === id);
    if (project) breadcrumb.textContent = project.name;
  }
}

function buildDropdown() {
  const container = document.getElementById("projectNav");
  if (!container) return;

  // Botao CV
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

  PROJECTS.forEach((proj) => {
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

async function bootHub() {
  await loadProjects();
  buildDropdown();

  // Deep link: index.html?exam=gh300 or ?project=exam:gh300
  const params = new URLSearchParams(window.location.search);
  const examId = params.get('exam');
  const projectId = params.get('project');
  if (examId) {
    const target = `exam:${examId}`;
    const exists = PROJECTS.find(p => p.id === target);
    if (exists) {
      setPage('project', target);
      return;
    }
  }
  if (projectId) {
    const exists = PROJECTS.find(p => p.id === projectId);
    if (exists) {
      setPage('project', projectId);
      return;
    }
  }

  // Carregar ultimo ou padrao
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
