/**
 * Section titles component (ES Module)
 * - Atualiza os títulos das seções mantendo o ícone
 */

function updateSectionTitle(iconClass, text) {
  const h2 = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.querySelector("i")?.classList.contains(iconClass.split(" ").pop())
  );
  if (h2 && typeof text === "string") {
    const icon = h2.querySelector("i");
    h2.innerHTML = "";
    if (icon) h2.appendChild(icon);
    const span = document.createElement("span");
    span.textContent = " " + text;
    h2.appendChild(span);
  }
}

export function renderSectionTitles(c) {
  updateSectionTitle("fa-address-book", c.sections.contact);
  updateSectionTitle("fa-star", c.sections.keySkills);
  updateSectionTitle("fa-code", c.sections.techSkills);
  updateSectionTitle("fa-medal", c.sections.techProficiency);
  updateSectionTitle("fa-graduation-cap", c.sections.education);
  updateSectionTitle("fa-user", c.sections.summary);
  updateSectionTitle("fa-briefcase", c.sections.experience);
  updateSectionTitle("fa-building", c.sections.companies);
  updateSectionTitle("fa-target", c.sections.objective);
}
