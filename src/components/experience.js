/**
 * Experience component (ES Module)
 * - renderExperience: substitui os cards pela lista do I18N
 */
export function renderExperience(c) {
  const expTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.textContent.trim().includes("Experiência") || h.querySelector(".fa-briefcase")
  );
  const section = expTitle?.closest(".section");
  if (!section) return;

  // remove cards existentes
  section.querySelectorAll(".experience-item").forEach((n) => n.remove());

  (c.experience || []).forEach((exp) => {
    const item = document.createElement("div");
    item.className = "experience-item";
    const icon = exp.icon || "fas fa-briefcase";
    const introHtml = exp.intro ? `<p class="description">${exp.intro}</p><br />` : "";
    const list = exp.highlights || exp.bullets || [];
    const listHtml = list.length
      ? `<p class="description">${list.map((x) => `• ${x}`).join("<br />")}</p>`
      : "";
    item.innerHTML = `
      <h3 class="job-title">
        <i class="${icon}"></i>
        ${exp.title}
      </h3>
      <div class="company">${exp.company}</div>
      <div class="period">
        <i class="fas fa-calendar-alt"></i>
        ${exp.period}
      </div>
      ${introHtml}
      ${listHtml}
    `;
    section.appendChild(item);
  });
}
