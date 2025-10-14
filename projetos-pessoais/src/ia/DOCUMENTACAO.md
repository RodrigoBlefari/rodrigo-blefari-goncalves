# Documentação do Sistema de IA - Melhorias Implementadas

## Visão Geral

Este documento descreve as melhorias implementadas no sistema de IA do projeto, focando em:

1. Separação da população (morte/geração) da quantidade de IA na tela
2. Correção de cálculos de pontuação e velocidade
3. Limpeza e organização do código

## 1. Separação da População e Quantidade de IA na Tela

### Antes
- O parâmetro `tamanhoPopulacao` controlava tanto a população total quanto a quantidade de IAs visíveis na tela
- Isso limitava a flexibilidade do sistema

### Depois
- Criado novo parâmetro `quantidadeIAsTreinando` que controla quantas IAs são visíveis e ativas na tela
- O parâmetro `tamanhoPopulacao` agora controla apenas a população total para fins de evolução
- Isso permite ter uma população grande para evolução, mas visualizar apenas uma parte dela na tela

### Implementação
- Atualizado `configuracao.js` para incluir o novo parâmetro
- Atualizado `painelControles.js` para adicionar o controle do novo parâmetro
- Atualizado `sistemaIA.js` para usar o novo parâmetro no cálculo da coorte

## 2. Correção de Cálculos de Pontuação e Velocidade

### Problema Antes
- O cálculo de fitness favorecia IAs mais rápidas injustamente
- Quando a velocidade era aumentada, as IAs acumulavam mais distância rapidamente, resultando em scores mais altos
- IAs que morriam rapidamente devido à alta velocidade ainda podiam ter scores altos

### Solução Implementada
- Atualizado o método `_atualizarFitness()` em `sombrasAgentes.js`
- Adicionado um fator de tempo para normalizar o impacto da distância percorrida
- Agora o fitness é calculado com base principalmente no tempo de vida e habilidades de desvio, não na velocidade

### Fórmula Atualizada
```javascript
const fatorTempo = Math.min(1.0, tempo / 0.5); // Normaliza o impacto da distância com base no tempo
const fitness = (tempo * 80 + bonusDesvio + sobrevivente - penalidade) + (distancia * 0.4 * fatorTempo);
```

## 3. Organização e Limpeza do Código

### Remoção de Duplicações
- Removidos campos duplicados em `configuracao.js`
- Padronizados os nomes dos parâmetros

### Melhorias na Legibilidade
- Adicionados comentários explicativos
- Organização lógica dos parâmetros
- Melhor separação de responsabilidades

## 4. Novos Recursos

### Controle de Quantidade de IAs Treinando
- Agora é possível controlar quantas IAs estão ativas na tela independentemente do tamanho da população
- Isso melhora o desempenho e permite melhor visualização

### Melhoria no Cálculo de Coorte
- O tamanho da coorte agora respeita o novo parâmetro `quantidadeIAsTreinando`
- Isso permite um controle mais preciso de quantas IAs estão sendo simuladas por vez

## 5. Benefícios das Melhorias

1. **Melhor desempenho**: Possibilidade de ter populações grandes sem impactar a visualização
2. **Mais controle**: Separação clara entre população e visualização
3. **Cálculos justos**: Avaliação mais justa do desempenho das IAs
4. **Melhor experiência de usuário**: Controle mais granular sobre os parâmetros
5. **Código mais limpo**: Organização e documentação melhoradas

## 6. Parâmetros Chave

- `tamanhoPopulacao`: Define o tamanho total da população para evolução
- `quantidadeIAsTreinando`: Define quantas IAs são visíveis e ativas na tela
- Ambos os parâmetros podem ser ajustados independentemente no painel de controles
