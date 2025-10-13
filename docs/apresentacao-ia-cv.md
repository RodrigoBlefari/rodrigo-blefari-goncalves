# Apresentação – Projeto de I.A Generativa com Jogo

## Versão curta (para currículo)
Jogo experimental de I.A generativa onde evoluo agentes de “I.A burra” até próximo de “I.A perfeita”. Uso um motor evolutivo (seleção, elitismo, mutação) e métricas (vitórias, sobrevivência, dano) para ajustar pesos/decisões geração a geração. Quando a evolução estagna, faço análise de gargalos e reconfiguração de parâmetros para buscar gerações mais eficientes. Stack: JavaScript (ES Modules), HTML5 Canvas, arquitetura modular, UI de análise.

## Versão estendida
Projeto de I.A generativa com jogo voltado a experimentação rápida. O objetivo é ativar o modo I.A, rodar simulações e avaliar resultados por geração, modelando os pesos/decisões dos agentes para evoluir de uma I.A “burra” até uma I.A “quase perfeita”. O ambiente simples intencionalmente acelera ciclos de aprendizado e facilita a observação de melhorias e estagnações.

Objetivo do jogador: desafiar-se a superar o recorde da geração anterior, manipulando parâmetros (tamanho da população por geração, quantidade de I.A, taxa de mutação, elitismo, critérios de fitness) e analisando os comportamentos dos agentes.

<span style="color: #d32f2f; font-weight: 600;">Atenção:</span> processar muitas I.A simultâneas é intensivo e depende do hardware do usuário. Configurações altas (ex.: milhares de agentes) podem travar ou deixar a aplicação lenta.

A cada geração, um conjunto (população) de agentes é avaliado segundo um critério de fitness (ex.: sobreviver mais, vencer mais, causar/receber menos dano). Aplico seleção e elitismo para preservar os melhores, e mutação para explorar o espaço de soluções. Quando a curva de desempenho “achata”, reavalio parâmetros (tamanho da população por geração, quantidade de I.A, taxa de mutação, número de elites) e, se necessário, ajusto o objetivo de fitness para destravar a evolução.

## Como “jogar”/avaliar
- Ativar modo I.A e iniciar simulações automáticas.
- Acompanhar histórico por geração (taxa de vitórias, tempo de sobrevivência, dano, evolução do fitness).
- Ao estagnar, ajustar parâmetros (tamanho da população por geração, quantidade de I.A, mutação, elites) e repetir o ciclo.
- Meta: aproximar-se do “jogador perfeito” que nunca perde.

## Tecnologias principais
- JavaScript (ES Modules), HTML5 Canvas, DOM API
- Arquitetura modular (core do jogo, entidades/sistemas, UI de análise)
- Algoritmos evolutivos (seleção, elitismo, mutação; crossover opcional)
- Visualização/monitoramento de métricas por geração
- Execução local via navegador (demos HTML) e servidor estático quando necessário

## Responsabilidades/Entregas (síntese)
- Design e implementação do motor evolutivo e orquestração do modo I.A
- Criação de UI para controle, histórico e visualização de métricas
- Organização do jogo (loop, entidades, sistemas) para ciclos rápidos de treino
- Demos focadas em cenários específicos para validação de hipóteses
