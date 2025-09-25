/**
 * Objective component (ES Module)
 * - renderObjective: escreve c.objectiveText na seção Objetivo
 */
export function renderObjective(c) {
  const objTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.textContent.trim().includes("Objetivo") || h.querySelector(".fa-target")
  );
  const section = objTitle?.closest(".section");
  if (!section) return;

  const desc = section.querySelector(".description") || document.createElement("p");
  desc.className = "description";
  desc.textContent = c.objectiveText || "";
  if (!desc.parentElement) section.appendChild(desc);
}
