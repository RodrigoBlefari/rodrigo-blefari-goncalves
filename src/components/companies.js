/**
 * Companies component (ES Module)
 * - renderCompanies: popula grade de empresas a partir de c.companies
 */
export function renderCompanies(c) {
  const companiesTitle = Array.from(document.querySelectorAll(".section-title")).find(
    (h) => h.textContent.trim().includes("Empresas") || h.querySelector(".fa-building")
  );
  const section = companiesTitle?.closest(".section");
  if (!section) return;
  const grid = section.querySelector(".companies-grid");
  if (!grid) return;

  grid.innerHTML = "";
  const names = Array.isArray(c.companies) ? c.companies : [];

  // Mapeia nomes conhecidos para slugs usados no CSS (data-company)
  const slugMap = {
    "Itaú Unibanco": "itau",
    Flytour: "flytour",
    Duosystem: "duosystem",
    "ITWS Group": "itws",
    GT40: "gt40",
    "Dominic 360": "dominic",
    AMB: "amb",
    "Associação Médica Brasileira": "amb",
    "Trevisan MKT": "trevisan",
    D360: "d360",
    QUIDDE: "quidde",
    Vivo: "vivo",
    OpenTravel: "opentravel",
  };

  const slugify = (s) =>
    (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .trim();

  names.forEach((name) => {
    const div = document.createElement("div");
    const slug = slugMap[name] || slugify(name);
    div.className = "company-item";
    div.setAttribute("data-company", slug);
    div.textContent = name;
    grid.appendChild(div);
  });
}
