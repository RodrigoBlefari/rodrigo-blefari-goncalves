let contadorId = 0;

export function gerarId(prefixo = "id") {
  contadorId += 1;
  return `${prefixo}-${contadorId}`;
}

export function limparCanvas(contexto, largura, altura) {
  contexto.clearRect(0, 0, largura, altura);
}

export function limitar(valor, minimo, maximo) {
  return Math.max(minimo, Math.min(maximo, valor));
}

export function aleatorioIntervalo(minimo, maximo) {
  return Math.random() * (maximo - minimo) + minimo;
}

export function escolherAleatorio(lista) {
  if (!lista.length) {
    return undefined;
  }
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}
