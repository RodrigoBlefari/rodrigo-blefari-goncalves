export function desenharStick({
  contexto,
  x,
  y,
  largura,
  altura,
  corLinha = "#f8f9fa",
  alpha = 1,
  sombraCor = "rgba(82, 143, 255, 0.35)",
  sombraDeslocamentoY = 6,
  sombraBlur = 18,
  animacaoTempo,
  espessura = 4,
}) {
  const tempo =
    typeof animacaoTempo === "number"
      ? animacaoTempo
      : typeof performance !== "undefined"
      ? performance.now()
      : Date.now();
  const centroX = x + largura / 2;
  const centroY = y + altura / 2;
  const escala = altura / 64;
  const animacao = Math.sin(tempo / 180);

  contexto.save();
  contexto.globalAlpha = alpha;
  contexto.strokeStyle = corLinha;
  contexto.lineWidth = espessura * escala;
  contexto.lineCap = "round";
  contexto.shadowColor = sombraCor;
  contexto.shadowBlur = sombraBlur * escala;
  contexto.shadowOffsetY = sombraDeslocamentoY * escala;
  contexto.translate(centroX, centroY);

  contexto.beginPath();
  contexto.arc(0, -20 * escala, 14 * escala, 0, Math.PI * 2);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(0, -6 * escala);
  contexto.lineTo(0, 24 * escala);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(0, 24 * escala);
  contexto.lineTo(-14 * escala, 44 * escala);
  contexto.moveTo(0, 24 * escala);
  contexto.lineTo(14 * escala, 44 * escala);
  contexto.stroke();

  contexto.beginPath();
  contexto.moveTo(0, 4 * escala);
  contexto.lineTo(-22 * escala, animacao * 10 * escala);
  contexto.moveTo(0, 4 * escala);
  contexto.lineTo(22 * escala, -animacao * 10 * escala);
  contexto.stroke();
  contexto.restore();
}
