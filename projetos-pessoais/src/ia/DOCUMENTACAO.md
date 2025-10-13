# Projeto de I.A Generativa (Jogo) — Documentação

## 1) Apresentação (para leigos)
Projeto de I.A generativa com jogo.

Objetivo do jogador: desafiar-se a superar o recorde da geração anterior, manipulando parâmetros (tamanho da população por geração, quantidade de I.A, taxa de mutação, elitismo, critérios de fitness) e analisando os comportamentos dos agentes. O foco é aprender com as evoluções, identificar estagnações e ajustar o sistema para alcançar gerações cada vez mais eficientes — aproximando-se de uma I.A “quase perfeita”.

Ambiente simples, aprendizado rápido: o cenário foi propositalmente mantido simples para acelerar ciclos de treino e facilitar a observação das melhorias geração a geração.

<span style="color: #d32f2f; font-weight: 600;">Atenção:</span> processar muitas I.A simultâneas é intensivo e depende do hardware do usuário. Configurações altas (ex.: milhares de agentes) podem travar ou deixar a aplicação lenta.

---

## 2) Como jogar (passo a passo)
- Abrir uma demo:
  - Recomenda-se começar por: `projetos-pessoais/generative-game-rogue-like/index.html`
  - Também há demos focadas em comportamentos específicos (ex.: `demo-inimigos-atiradores.html`, `demo-rastreamento-resultados.html`).
- Ativar modo I.A:
  - Utilize o painel de controles (UI) para alternar entre jogo manual e jogo com agentes controlados pela I.A.
  - A I.A jogará múltiplas rodadas automaticamente (simulações).
- Avaliar resultados:
  - Acompanhe métricas de cada geração (taxa de vitórias, dano, tempo de sobrevivência, etc.). Telas de histórico/visualização ajudam (ex.: `src/ui/historicoIA.js`, `src/ui/visualizacaoIA.js`).
- Ajustar parâmetros:
  - Se a evolução estagnar, mude parâmetros como taxa de mutação, tamanho da população por geração, quantidade de I.A, número de elites, etc. (vide seção “Parâmetros de treino”).
- Repetir ciclo:
  - Continue treinando e ajustando até melhorar as métricas. O objetivo é aproximar-se do “jogador perfeito”.

Dica: Use as demos específicas para validar hipóteses (por exemplo, comportamento contra inimigos atiradores, ajuste fino de rastreamento, etc.).

---

## 3) Conceitos do aprendizado utilizado
- Agente: “jogador” controlado por um conjunto de pesos (parâmetros de decisão).
- População: conjunto de agentes testados por geração.
- Fitness (aptidão): medida do quão bom foi o desempenho de um agente (por exemplo, sobreviver mais tempo, causar mais dano, vencer a partida).
- Seleção e Elitismo: os melhores agentes são usados para gerar a próxima geração (alguns podem ser copiados diretamente — elites).
- Mutação: mudanças aleatórias nos pesos para explorar novas soluções.
- (Opcional) Crossover: combinação de pesos de dois agentes “pais” (se ativado/implementado).
- Estagnação: quando as métricas param de melhorar significativamente por várias gerações.

Esses conceitos são orquestrados pelo motor evolutivo e pelos sistemas de monitoramento do projeto.

---

## 4) Tecnologias e arquitetura
- Linguagens e APIs:
  - JavaScript (ES Modules)
  - HTML5 Canvas para renderização do jogo
  - DOM API para UI/controles
- Núcleo do jogo:
  - Loop de jogo: `projetos-pessoais/src/core/loopJogo.js`
  - Entidades e sistemas:
    - Entidades: `projetos-pessoais/src/entidades/` (ex.: `jogador.js`, `inimigoBase.js`, `inimigoVoador.js`, `projetil.js`)
    - Sistemas: `projetos-pessoais/src/sistemas/` (ex.: `sistemaJogador.js`, `gerenciadorInimigos.js`, `gerenciadorProjeteis.js`, `controleTeclado.js`, `sistemaAudio.js`)
  - Efeitos/ambiente: `projetos-pessoais/src/efeitos/fundoParalaxe.js`
- I.A (aprendizado e visualização):
  - Orquestração da I.A: `projetos-pessoais/src/ia/sistemaIA.js`
  - Motor evolutivo (seleção, mutação, geração): `projetos-pessoais/src/ia/motorEvolutivo.js`
  - Monitoramento e métricas: `projetos-pessoais/src/ia/monitorAprendizado.js`
  - Execução em simulação independente (headless/light): `projetos-pessoais/src/ia/simulacaoIndependente.js`
  - Visual/auxílio a agentes: `projetos-pessoais/src/ia/sombrasAgentes.js`
- UI da I.A e do jogo:
  - Painel/controles e HUD: `projetos-pessoais/src/ui/painelControles.js`, `hudVida.js`, `indicadorQualidade.js`, `telaDerrota.js`
  - Histórico e visualização: `projetos-pessoais/src/ui/historicoIA.js`, `visualizacaoIA.js`
- Demos e tema de UI:
  - Demos do roguelike: `projetos-pessoais/generative-game-rogue-like/*.html`
  - Scripts e tema: `projetos-pessoais/generative-game-rogue-like/scripts/` (ex.: `bloco-controle.js`, `tema-ui.js`)
  - Estilos/tema: `projetos-pessoais/generative-game-rogue-like/theme.css`, `styles.css`

Arquitetura em módulos ES6, sem frameworks, visando legibilidade e facilidade de experimentação.

---

## 5) Parâmetros de treino (para experimentar)
- Tamanho da população por geração: quantos agentes testados por geração.
- Quantidade de I.A (agentes simultâneos): até 2.000 (depende do hardware; valores altos podem travar ou degradar a aplicação).
- Taxa de mutação: intensidade/frequência das alterações nos pesos.
- Elitismo: quantos melhores agentes passam direto para a próxima geração.
- Critérios de fitness: como a pontuação é calculada (ex.: vitórias, sobrevivência, dano).
- Limites de parada: número máximo de gerações, ou parada por estagnação (sem melhora por N gerações).
- Semente aleatória (opcional): para repetir experimentos com reprodutibilidade.

Esses parâmetros podem estar expostos no `painelControles` e/ou em configurações dos módulos de I.A.

---

## 6) Métricas e análise
- Principais métricas:
  - Taxa de vitórias / tentativas
  - Tempo médio de sobrevivência
  - Dano causado vs. recebido
  - Evolução do fitness por geração
  - Diversidade dos pesos entre agentes
- Ferramentas de análise:
  - Histórico de resultados por geração (UI)
  - Visualização de agentes e decisões (UI)
  - Logs/sumários via `monitorAprendizado.js`

Quando a curva de desempenho “achatar”, ajuste a taxa de mutação, reinicie com elites diferentes ou modifique o critério de fitness.

---

## 7) Como executar
- Método simples:
  - Abra os arquivos HTML diretamente no navegador:
    - `projetos-pessoais/generative-game-rogue-like/index.html`
    - ou os `demo-*.html` para cenários específicos.
- Se o navegador bloquear ES Modules por `file://`:
  - Utilize um servidor estático (ex.: extensões como “Live Server” no VSCode) ou
  - Rode um servidor local (ex.: `npx serve .` na raiz do repositório).
- Fluxo recomendado:
  1) Abrir uma demo
  2) Ativar modo I.A no painel
  3) Configurar parâmetros (tamanho da população por geração, quantidade de I.A, mutação, elites)
  4) Rodar gerações e observar o histórico
  5) Ajustar quando estagnar e repetir

---

## 8) Estrutura relevante (mapa rápido)
- Núcleo e utilitários: `projetos-pessoais/src/core/`
- Entidades do jogo: `projetos-pessoais/src/entidades/`
- Sistemas do jogo: `projetos-pessoais/src/sistemas/`
- I.A (este projeto): `projetos-pessoais/src/ia/`
  - `sistemaIA.js`, `motorEvolutivo.js`, `monitorAprendizado.js`, `simulacaoIndependente.js`, `sombrasAgentes.js`
- UI do jogo/IA: `projetos-pessoais/src/ui/`
- Demos do roguelike: `projetos-pessoais/generative-game-rogue-like/`

---

## 9) Roadmap (ideias futuras)
- Exportar/importar o “melhor agente” (persistência dos pesos)
- Habilitar/experimentar crossover com diferentes estratégias
- Expandir critérios de fitness multiobjetivo (ex.: agressividade vs. sobrevivência)
- Ferramentas de depuração visual dos pesos/decisões em tempo real
- Benchmark de seeds e cenários (reprodutibilidade)

---

## 10) Texto (mais completo) para usar no currículo
Projeto de I.A generativa com jogo. A ideia principal é ativar o modo I.A, avaliar resultados por geração e modelar pesos/decisões para evoluir de uma I.A “burra” até uma I.A “quase perfeita”. O ambiente foi mantido simples para acelerar ciclos de aprendizado e permitir análises rápidas. O sistema utiliza um motor evolutivo (seleção, elitismo e mutação) e monitora métricas como taxa de vitórias, tempo de sobrevivência e dano. Quando a evolução estagna, ajusto parâmetros (população, mutação, elites) e objetivos (fitness) para buscar gerações mais eficientes. Tecnologia base em JavaScript (ES Modules) e HTML5 Canvas, com arquitetura modular (loop de jogo, entidades/sistemas, UI de controle e histórico). As demos do roguelike mostram comportamentos específicos e apoiam a experimentação contínua.

---

## 11) Créditos técnicos (arquivos-chave)
- I.A:
  - `src/ia/sistemaIA.js` — orquestração do modo I.A no jogo
  - `src/ia/motorEvolutivo.js` — lógica de evolução (gera novas populações)
  - `src/ia/monitorAprendizado.js` — coleta/relato de métricas e histórico
  - `src/ia/simulacaoIndependente.js` — execuções de treino desacopladas da renderização
  - `src/ia/sombrasAgentes.js` — utilidades visuais/apoio aos agentes
- Jogo/engine:
  - `src/core/loopJogo.js` — game loop
  - `src/entidades/*` — jogador, inimigos, projéteis
  - `src/sistemas/*` — entrada, áudio, projéteis, inimigos, jogador
- UI:
  - `src/ui/painelControles.js`, `src/ui/historicoIA.js`, `src/ui/visualizacaoIA.js` — controle e análise
- Demos:
  - `generative-game-rogue-like/*.html` + `scripts/*.js` — cenários e tema de UI

Pronto. Esta documentação foca somente no projeto de I.A dentro do repositório, descrevendo tecnologia, arquitetura, como jogar e como evoluir os agentes de forma iterativa.
