export class HistoricoIA {
  constructor(elementoRaiz) {
    this.elementoRaiz = elementoRaiz;
    this.lista = elementoRaiz?.querySelector("#historico-lista") ?? null;
    this.historico = [];
  }

  adicionarEntrada(texto, timestamp = null) {
    if (!this.lista) {
      return;
    }
    
    const entrada = {
      texto,
      timestamp: timestamp || new Date(),
    };
    
    // Adiciona ao início do histórico (mais recente primeiro)
    this.historico.unshift(entrada);
    
    // Limita o histórico a 50 entradas para performance
    if (this.historico.length > 50) {
      this.historico = this.historico.slice(0, 50);
    }
    
    this._atualizarLista();
  }

  limpar() {
    this.historico = [];
    this._atualizarLista();
  }

  _atualizarLista() {
    if (!this.lista) {
      return;
    }
    
    this.lista.innerHTML = "";
    
    this.historico.forEach((entrada) => {
      const item = document.createElement("div");
      item.className = "historico-item";
      
      const dataFormatada = this._formatarData(entrada.timestamp);
      item.textContent = `${dataFormatada} - ${entrada.texto}`;
      
      this.lista.appendChild(item);
    });
  }

  _formatarData(data) {
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
}
