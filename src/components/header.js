/**
 * Header component (ES Module)
 * - renderHeader: nome, título, localização e contatos
 */
export function renderHeader(c) {
  const nameEl = document.querySelector(".profile-info h1");
  const titleEl = document.querySelector(".profile-info .title");
  const locEl = document.querySelector(".profile-info .location");
  if (nameEl) nameEl.textContent = c.header.name;
  if (titleEl) titleEl.textContent = c.header.title;
  if (locEl) {
    const icon = locEl.querySelector("i");
    locEl.innerHTML = "";
    if (icon) locEl.appendChild(icon);
    const span = document.createElement("span");
    span.textContent = " " + c.header.location;
    locEl.appendChild(span);
  }

  // Contato (4 itens)
  const contactSection = Array.from(
    document.querySelectorAll(".section-title")
  ).find(
    (h) =>
      h.textContent.trim().includes("Contato") ||
      h.querySelector(".fa-address-book")
  );
  const container = contactSection?.closest(".section");
  if (container) {
    // Suporta ambos os formatos:
    // - .contact-item .contact-text a (template-moderno)
    // - .contact-item a (template-tech)
    const links = container.querySelectorAll(".contact-item .contact-text a, .contact-item a");
    if (links[0]) links[0].textContent = c.header.contactLocationLabel;
    if (links[1]) links[1].textContent = c.header.phone;
    if (links[2]) links[2].textContent = c.header.email;
    if (links[3]) links[3].textContent = c.header.linkedinLabel;
  }
}
