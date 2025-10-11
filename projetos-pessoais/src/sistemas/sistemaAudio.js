// Sistema de áudio usando a Web Audio API
export class SistemaAudio {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 1.0;
    this.sons = new Map();
    this.volumes = {
      jogador: 0.8,
      inimigo: 0.6,
      projeteis: 0.7,
      ambiente: 0.5
    };
    
    // Inicializa o contexto de áudio quando o usuário interagir com a página
    this._inicializarAudioContext();
  }

 _inicializarAudioContext() {
    // O contexto de áudio precisa ser iniciado após uma interação do usuário
    const inicializar = () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Remove os event listeners após a inicialização
      document.removeEventListener('keydown', inicializar);
      document.removeEventListener('click', inicializar);
      document.removeEventListener('touchstart', inicializar);
    };

    // Adiciona event listeners para inicializar o áudio após interação do usuário
    document.addEventListener('keydown', inicializar);
    document.addEventListener('click', inicializar);
    document.addEventListener('touchstart', inicializar);
  }

  // Gera um som simples usando osciladores para o jogador
 tocarSomJogador(tipo = 'movimento', volume = null) {
    if (!this.audioContext) return;
    
    const volumeFinal = volume !== null ? volume : this.volumes.jogador * this.masterVolume;
    this._tocarSomBasico(tipo, volumeFinal, 'jogador');
  }

  // Gera um som simples usando osciladores para inimigos
  tocarSomInimigo(tipo = 'movimento', volume = null) {
    if (!this.audioContext) return;
    
    const volumeFinal = volume !== null ? volume : this.volumes.inimigo * this.masterVolume;
    this._tocarSomBasico(tipo, volumeFinal, 'inimigo');
  }

  // Gera um som simples usando osciladores para projéteis
  tocarSomProjetil(tipo = 'tiro', volume = null) {
    if (!this.audioContext) return;
    
    const volumeFinal = volume !== null ? volume : this.volumes.projeteis * this.masterVolume;
    this._tocarSomBasico(tipo, volumeFinal, 'projeteis');
  }

  // Gera um som simples usando osciladores para ambiente
  tocarSomAmbiente(tipo = 'fundo', volume = null) {
    if (!this.audioContext) return;
    
    const volumeFinal = volume !== null ? volume : this.volumes.ambiente * this.masterVolume;
    this._tocarSomBasico(tipo, volumeFinal, 'ambiente');
  }

 _tocarSomBasico(tipo, volume, categoria) {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    // Ajusta o volume
    gainNode.gain.value = volume;
    
    // Define a frequência baseada no tipo de som e categoria
    switch (tipo) {
      case 'movimento':
        oscillator.frequency.value = categoria === 'jogador' ? 20 : 180;
        oscillator.type = 'sine';
        break;
      case 'tiro':
        oscillator.frequency.value = categoria === 'jogador' ? 40 : 30;
        oscillator.type = 'square';
        break;
      case 'impacto':
        oscillator.frequency.value = categoria === 'jogador' ? 10 : 150;
        oscillator.type = 'sawtooth';
        break;
      case 'dano':
        oscillator.frequency.value = categoria === 'jogador' ? 80 : 120;
        oscillator.type = 'triangle';
        break;
      case 'fundo':
        oscillator.frequency.value = 60;
        oscillator.type = 'sine';
        break;
      default:
        oscillator.frequency.value = 220;
        oscillator.type = 'sine';
    }
    
    // Aplica um envelope simples para evitar cliques
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    oscillator.start(now);
    oscillator.stop(now + 0.5);
  }

  // Ajusta o volume geral
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  // Ajusta o volume de uma categoria específica
  setVolumeCategoria(categoria, volume) {
    if (this.volumes.hasOwnProperty(categoria)) {
      this.volumes[categoria] = Math.max(0, Math.min(1, volume));
    }
 }

  // Para todos os sons
  pararTodosSons() {
    // Não é possível parar os sons gerados por osciladores após iniciados
    // Esta função é fornecida para compatibilidade com interfaces que esperam esse método
  }
}
