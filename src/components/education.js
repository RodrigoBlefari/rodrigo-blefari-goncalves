/**
 * Education component (ES Module)
 * - renderEducation: substitui itens pela lista do I18N
 */
export function renderEducation(c) {
  const eduTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.textContent.trim().includes("Formação") || h.querySelector(".fa-graduation-cap")
  );
  const eduSection = eduTitle?.closest(".section");
  if (!eduSection) return;

  // remove itens existentes
  eduSection.querySelectorAll(".education-item").forEach((n) => n.remove());

  // insere em ordem
  (c.education || []).forEach((item) => {
    const wrap = document.createElement("div");
    wrap.className = "education-item";
    wrap.innerHTML = `
      <div class="education-title">${item.title}</div>
      <div class="education-institution">${item.institution}</div>
      <div class="education-period">${item.period}</div>
    `;
    eduSection.appendChild(wrap);
  });
}
