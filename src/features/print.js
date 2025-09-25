/**
 * Print / PDF (ES Module)
 * - printResume: imprime escondendo controles
 * - downloadPDF: exporta PDF usando html2pdf (biblioteca já incluída no index)
 */

function hideControls() {
  const controlElements = document.querySelectorAll(".download-btn, .theme-selector");
  controlElements.forEach((el) => (el.style.visibility = "hidden"));
  return () => controlElements.forEach((el) => (el.style.visibility = "visible"));
}

export function printResume() {
  const restore = hideControls();
  setTimeout(() => {
    window.print();
    setTimeout(restore, 1000);
  }, 100);
}

export function downloadPDF() {
  const element = document.getElementById("resume");
  if (!element || typeof html2pdf === "undefined") {
    console.warn("html2pdf não encontrado ou #resume ausente.");
    return;
  }
  const restore = hideControls();

  // Configurações otimizadas para PDF com margens mínimas
  const opt = {
    margin: [0.1, 0.1, 0.1, 0.1],
    filename: "Rodrigo_Blefari_Curriculo_Completo.pdf",
    image: {
      type: "jpeg",
      quality: 0.98,
      crossOrigin: "anonymous",
    },
    html2canvas: {
      scale: 1.2,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      logging: false,
      backgroundColor: "#ffffff",
      removeContainer: false,
      imageTimeout: 10000,
      height: element.scrollHeight,
      width: element.scrollWidth,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
      windowHeight: element.scrollHeight,
      x: 0,
      y: 0,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: false,
    },
    pagebreak: {
      mode: ["avoid-all", "css", "legacy"],
      before: ".section",
      after: ".experience-item",
      avoid: ["h1", "h2", "h3", ".job-title", ".section-title"],
    },
  };

  // Aguardar carregamento de imagens
  const images = element.querySelectorAll("img");
  const imagePromises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      if (img.complete) resolve();
      else {
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 2000);
      }
    });
  });

  Promise.all(imagePromises).then(() => {
    setTimeout(() => {
      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(restore)
        .catch((error) => {
          console.error("Erro ao gerar PDF:", error);
          restore();
        });
    }, 500);
  });
}
