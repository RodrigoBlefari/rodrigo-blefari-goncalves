/**
 * Storage Service - Gerencia localStorage e dados de sessão
 * Centraliza todo gerenciamento de persistência de dados
 */

class StorageService {
  constructor() {
    this.STORAGE_KEYS = {
      // User Preferences
      THEME: 'gh300_theme',
      LANGUAGE: 'gh300_language',
      SHOW_TIPS: 'gh300_show_tips',
      SHOW_ANSWERS: 'gh300_show_answers',
      SHOW_DOTS: 'gh300_show_dots',
      
      // Current Exam Progress
      CURRENT_EXAM_ID: 'gh300_current_exam_id',
      CURRENT_EXAM_STATE: 'gh300_current_exam_state',
      CURRENT_QUESTION: 'gh300_current_question',
      ANSWERS: 'gh300_answers',
      
      // Exam History
      EXAM_HISTORY: 'gh300_exam_history',
    };

    this.DEFAULTS = {
      THEME: 'light',
      LANGUAGE: 'en',
      SHOW_TIPS: false,
      SHOW_ANSWERS: false,
      SHOW_DOTS: true,
    };
  }

  /**
   * FUNÇÃO: get()
   * Obtém valor do localStorage com fallback para default
   * @param {string} key - Chave armazenada
   * @param {*} defaultValue - Valor padrão se não encontrado
   * @returns {*} Valor armazenado ou padrão
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      
      // Tenta parsear JSON, se falhar retorna string
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (e) {
      console.warn(`StorageService.get(${key}) error:`, e);
      return defaultValue;
    }
  }

  /**
   * FUNÇÃO: set()
   * Salva valor no localStorage
   * @param {string} key - Chave para armazenar
   * @param {*} value - Valor a ser armazenado
   * @returns {boolean} true se sucesso, false se erro
   */
  set(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (e) {
      console.warn(`StorageService.set(${key}) error:`, e);
      return false;
    }
  }

  /**
   * FUNÇÃO: remove()
   * Remove valor do localStorage
   * @param {string} key - Chave a remover
   * @returns {boolean} true se sucesso
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`StorageService.remove(${key}) error:`, e);
      return false;
    }
  }

  /**
   * FUNÇÃO: clear()
   * Limpa TODOS os dados GH300 armazenados
   * @returns {boolean} true se sucesso
   */
  clear() {
    try {
      Object.values(this.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (e) {
      console.warn('StorageService.clear() error:', e);
      return false;
    }
  }

  /**
   * FUNÇÃO: getTheme()
   * Retorna tema atual (light|dark)
   * @returns {string} 'light' ou 'dark'
   */
  getTheme() {
    return this.get(this.STORAGE_KEYS.THEME, this.DEFAULTS.THEME);
  }

  /**
   * FUNÇÃO: setTheme()
   * Salva preferência de tema
   * @param {string} theme - 'light' ou 'dark'
   * @returns {boolean} true se sucesso
   */
  setTheme(theme) {
    if (!['light', 'dark'].includes(theme)) {
      console.warn(`Invalid theme: ${theme}`);
      return false;
    }
    return this.set(this.STORAGE_KEYS.THEME, theme);
  }

  /**
   * FUNÇÃO: getLanguage()
   * Retorna idioma atual
   * @returns {string} 'en' ou 'pt'
   */
  getLanguage() {
    return this.get(this.STORAGE_KEYS.LANGUAGE, this.DEFAULTS.LANGUAGE);
  }

  /**
   * FUNÇÃO: setLanguage()
   * Salva preferência de idioma
   * @param {string} lang - 'en' ou 'pt'
   * @returns {boolean} true se sucesso
   */
  setLanguage(lang) {
    if (!['en', 'pt'].includes(lang)) {
      console.warn(`Invalid language: ${lang}`);
      return false;
    }
    return this.set(this.STORAGE_KEYS.LANGUAGE, lang);
  }

  /**
   * FUNÇÃO: getAnswers()
   * Retorna objeto com todas as respostas do usuário
   * @returns {object} { questionId: selectedIndex, ... }
   */
  getAnswers() {
    return this.get(this.STORAGE_KEYS.ANSWERS, {});
  }

  /**
   * FUNÇÃO: setAnswers()
   * Salva objeto inteiro de respostas
   * @param {object} answers - { questionId: selectedIndex, ... }
   * @returns {boolean} true se sucesso
   */
  setAnswers(answers) {
    if (typeof answers !== 'object' || answers === null) {
      console.warn('Answers must be an object');
      return false;
    }
    return this.set(this.STORAGE_KEYS.ANSWERS, answers);
  }

  /**
   * FUNÇÃO: setAnswer()
   * Salva ÚNICA resposta do usuário
   * @param {number} questionId - ID da questão
   * @param {number} selectedIndex - Índice da opção selecionada
   * @returns {boolean} true se sucesso
   */
  setAnswer(questionId, selectedIndex) {
    const answers = this.getAnswers();
    answers[questionId] = selectedIndex;
    return this.setAnswers(answers);
  }

  /**
   * FUNÇÃO: getCurrentQuestion()
   * Retorna índice da questão atual
   * @returns {number} índice (0-49)
   */
  getCurrentQuestion() {
    return this.get(this.STORAGE_KEYS.CURRENT_QUESTION, 0);
  }

  /**
   * FUNÇÃO: setCurrentQuestion()
   * Salva índice da questão atual
   * @param {number} index - índice (0-49)
   * @returns {boolean} true se sucesso
   */
  setCurrentQuestion(index) {
    if (typeof index !== 'number' || index < 0 || index > 49) {
      console.warn('Invalid question index');
      return false;
    }
    return this.set(this.STORAGE_KEYS.CURRENT_QUESTION, index);
  }

  /**
   * FUNÇÃO: getUIPreferences()
   * Retorna preferências de UI (tips, answers, dots)
   * @returns {object} { showTips, showAnswers, showDots }
   */
  getUIPreferences() {
    return {
      showTips: this.get(this.STORAGE_KEYS.SHOW_TIPS, this.DEFAULTS.SHOW_TIPS),
      showAnswers: this.get(this.STORAGE_KEYS.SHOW_ANSWERS, this.DEFAULTS.SHOW_ANSWERS),
      showDots: this.get(this.STORAGE_KEYS.SHOW_DOTS, this.DEFAULTS.SHOW_DOTS),
    };
  }

  /**
   * FUNÇÃO: setUIPreference()
   * Salva preferência individual de UI
   * @param {string} preference - 'showTips'|'showAnswers'|'showDots'
   * @param {boolean} value - true|false
   * @returns {boolean} true se sucesso
   */
  setUIPreference(preference, value) {
    const validPreferences = ['showTips', 'showAnswers', 'showDots'];
    if (!validPreferences.includes(preference) || typeof value !== 'boolean') {
      console.warn(`Invalid preference: ${preference}`);
      return false;
    }

    const key = this.STORAGE_KEYS['SHOW_' + preference.slice(4).toUpperCase()];
    return this.set(key, value);
  }

  /**
   * FUNÇÃO: getAllData()
   * Retorna TODOS os dados armazenados (DEBUG)
   * @returns {object} todos os dados
   */
  getAllData() {
    return {
      theme: this.getTheme(),
      language: this.getLanguage(),
      currentQuestion: this.getCurrentQuestion(),
      answers: this.getAnswers(),
      uiPreferences: this.getUIPreferences(),
      currentExamState: this.getCurrentExamState(),
      examHistory: this.getExamHistory(),
    };
  }

  /**
   * FUNÇÃO: generateExamId()
   * Gera ID único para uma prova (timestamp + random)
   * @returns {string} ID único
   */
  generateExamId() {
    return `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * FUNÇÃO: saveExamState()
   * Salva o estado ATUAL da prova em progresso
   * Chamada frequentemente enquanto o usuário faz a prova
   * @param {object} state - { currentQuestion, answers, startTime, examId, lastSavedAt }
   * @returns {boolean} true se sucesso
   */
  saveExamState(state) {
    // Garante que sempre tem um ID de exame
    if (!state.examId) {
      state.examId = this.generateExamId();
    }
    
    state.lastSavedAt = Date.now();
    
    return this.set(this.STORAGE_KEYS.CURRENT_EXAM_STATE, state);
  }

  /**
   * FUNÇÃO: getCurrentExamState()
   * Recupera o estado da prova EM PROGRESSO
   * Retorna null se nenhuma prova em andamento
   * @returns {object|null} estado da prova ou null
   */
  getCurrentExamState() {
    return this.get(this.STORAGE_KEYS.CURRENT_EXAM_STATE, null);
  }

  /**
   * FUNÇÃO: clearCurrentExamState()
   * Limpa o estado da prova em progresso
   * Chamada após finalizar uma prova
   * @returns {boolean} true se sucesso
   */
  clearCurrentExamState() {
    return this.remove(this.STORAGE_KEYS.CURRENT_EXAM_STATE);
  }

  /**
   * FUNÇÃO: completeExam()
   * Salva uma prova como COMPLETADA no histórico
   * @param {object} completedExam - { examId, answers, score, percentage, totalTime, completedAt }
   * @returns {boolean} true se sucesso
   */
  completeExam(completedExam) {
    // Adicionar timestamp de conclusão
    completedExam.completedAt = Date.now();
    
    // Obter histórico atual
    let history = this.getExamHistory();
    
    // Adicionar nova prova ao topo (mais recentes primeiro)
    history.unshift(completedExam);
    
    // Manter apenas as últimas 20 provas (economia de espaço)
    if (history.length > 20) {
      history = history.slice(0, 20);
    }
    
    // Salvar histórico atualizado
    return this.set(this.STORAGE_KEYS.EXAM_HISTORY, history);
  }

  /**
   * FUNÇÃO: getExamHistory()
   * Retorna lista de TODAS as provas completadas (mais recentes primeiro)
   * @returns {array} array de provas completadas
   */
  getExamHistory() {
    return this.get(this.STORAGE_KEYS.EXAM_HISTORY, []);
  }

  /**
   * FUNÇÃO: getExamById()
   * Recupera uma prova completada específica
   * @param {string} examId - ID da prova
   * @returns {object|null} dados da prova ou null se não encontrada
   */
  getExamById(examId) {
    const history = this.getExamHistory();
    return history.find(exam => exam.examId === examId) || null;
  }

  /**
   * FUNÇÃO: deleteExam()
   * Remove uma prova do histórico
   * @param {string} examId - ID da prova a remover
   * @returns {boolean} true se sucesso
   */
  deleteExam(examId) {
    let history = this.getExamHistory();
    history = history.filter(exam => exam.examId !== examId);
    return this.set(this.STORAGE_KEYS.EXAM_HISTORY, history);
  }

  /**
   * FUNÇÃO: loadExamAnswers()
   * Carrega as respostas de uma prova anterior para reabrir
   * @param {string} examId - ID da prova
   * @returns {object|null} respostas da prova ou null se não encontrada
   */
  loadExamAnswers(examId) {
    const exam = this.getExamById(examId);
    if (!exam) return null;
    
    return exam.answers;
  }
}

// Criar instância global
window.storageService = new StorageService();
