/**
 * Reading mode (ES Module)
 * - Aplica classes no body conforme seleção (light, sepia, dark, contrast)
 */
export function applyReadingMode() {
  const select = document.getElementById("readingMode");
  const mode = select?.value || localStorage.getItem("readingMode") || "light";
  const body = document.body;
  body.classList.remove("mode-light", "mode-sepia", "mode-dark", "mode-contrast");
  body.classList.add(`mode-${mode}`);
  localStorage.setItem("readingMode", mode);
  if (select && select.value !== mode) select.value = mode;
}

export function initReadingMode() {
  const savedMode = localStorage.getItem("readingMode") || "light";
  const modeSel = document.getElementById("readingMode");
  if (modeSel) {
    modeSel.value = savedMode;
    modeSel.addEventListener("change", applyReadingMode);
  }
  applyReadingMode();
}
