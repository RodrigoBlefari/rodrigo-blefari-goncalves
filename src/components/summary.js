/**
 * Summary component (ES Module)
 * - renderSummary: reconstrói os parágrafos a partir de c.summaryText
 */
export function renderSummary(c) {
  const sumTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.textContent.trim().includes("Resumo") || h.querySelector(".fa-user")
  );
  const section = sumTitle?.closest(".section");
  if (!section) return;

  // remove tudo após o título (evita <br> acumulados)
  const kids = Array.from(section.childNodes);
  kids.forEach((n) => {
    const isTitle =
      n.nodeType === 1 &&
      n.classList &&
      n.classList.contains("section-title");
    if (!isTitle) section.removeChild(n);
  });

  // reconstroi parágrafos, adicionando <br> somente entre eles
  (c.summaryText || []).forEach((p, idx) => {
    const para = document.createElement("p");
    para.className = "description";
    para.textContent = p;
    section.appendChild(para);
    if (idx < (c.summaryText || []).length - 1) {
      section.appendChild(document.createElement("br"));
    }
  });
}
