#!/usr/bin/env python3
"""
Script para adicionar traduções das opções nas questões
Transforma cada questão adicionando options em PT
"""

import json
import re

# Dicionário de traduções de opções
translations = {
    # Q1
    1: ["Enterprise permite customização usando sua própria base de código", "Business é apenas para indivíduos", "Sem diferença", "Enterprise é mais barato"],
    # Q2
    2: ["Suas organizações no menu suspenso de perfil", "Configurações do GitHub", "Configurações do Repositório", "Dashboard do Copilot"],
    # Q3
    3: ["Geram resumos concisão de PR", "Auto-mesclam todos os PRs", "Impedem criação de PR", "Apenas para repos privados"],
    # Q4
    4: ["Criar coleções customizadas de código e docs internos", "Deletar documentação", "Impedir acesso doc", "Não suportado"],
    # Q5
    5: ["Sugere refatoração baseada em contexto", "Deleta classes", "Previne criação", "Não consegue assistir"],
    # Q6
    6: ["Sugere snippets de código baseado em erro", "Geração aleatória", "Deleta código bugado", "Não consegue corrigir"],
    # Q7
    7: ["Gera descrições em linguagem natural", "Recusa explicação", "Modifica código", "Não consegue explicar"],
    # Q8
    8: ["Explica causa e sugere correções", "Ignora erro", "Deleta arquivo", "Não consegue assistir"],
    # Q9
    9: ["Gera comentários de prompts naturais", "Remove comentários", "Previne docs", "Não consegue gerar"],
    # Q10
    10: ["Opções ao digitar", "Sugestões esmaecidas enquanto digita", "Código oculto não-editável", "Código deletado recuperável"],
    # Q11
    11: ["Clique ícone chat na sidebar", "Ctrl+i (Windows) ou Cmd+i (Mac)", "Ctrl+j", "Ctrl+k"],
    # Q12
    12: ["Perguntas em contexto específico", "Apenas debugging", "Impedir Copilot", "Não suportado"],
    # Q13
    13: ["Melhores respostas sem prompts longos", "Deprecado", "Faz mais difícil", "Sem benefícios"],
    # Q14
    14: ["Suporte proxy VPN com certs auto-assinados", "Ghost text", "Chat", "Completion"],
    # Q15
    15: ["Pressione tecla Tab", "Pressione Enter", "Pressione Espaço", "Clique sugestão"],
    # Q16
    16: ["Programador par de IA para sugestões código", "Controle de versão", "Ferramenta de planejamento", "Rastreador de bugs"],
    # Q17
    17: ["Contexto de código no editor", "Aleatório", "Último digitado", "Tamanho arquivo"],
    # Q18
    18: ["Personaliza para padrões e práticas de org", "Ignora padrões", "Apenas código público", "Não consegue customizar"],
    # Q19
    19: ["Usa prompts naturalis e contexto código", "Lê mentes", "Apenas linguagens específicas", "Sempre online"],
    # Q20
    20: ["Aprendizado zero-shot, one-shot, few-shot", "Armazena todos prompts", "Não aprende", "Precisa treinamento manual"],
    # Q21
    21: ["Análise estatística e reconhecimento padrão", "Tokenização", "Geração embedding", "Decoding"],
    # Q22
    22: ["Considera contexto código mais amplo", "Limita linha atual", "Ignora surroundings", "Não melhora"],
    # Q23
    23: ["Apresentada ao usuário para aceitação", "Auto-aplicada", "Deletada", "Armazenada permanentemente"],
    # Q24
    24: ["Revise cada uma usando setas esq/dir", "Auto-seleciona melhor", "Todas de uma vez", "Apenas primeira mostrada"],
    # Q25
    25: ["Garante precisão e completude", "Perda de tempo", "Desnecessário", "Deletar output"],
}

# Ler arquivo
with open('data/gh300-questions.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Encontrar todas as questões e adicionar opções traduzidas
lines = content.split('\n')
output = []
current_id = None

i = 0
while i < len(lines):
    line = lines[i]
    
    # Detectar ID
    if '"id":' in line and not current_id:
        match = re.search(r'"id":\s*(\d+)', line)
        if match:
            current_id = int(match.group(1))
    
    # Processar linha
    output.append(line)
    
    # Se encontramos "pt": {
    if '"pt": {' in line and current_id in translations:
        i += 1
        output.append(lines[i])  # question line
        
        # Adicionar options em PT
        output.append('      options: [' + ', '.join([f'"{opt}"' for opt in translations[current_id]]) + '],')
        output.append('      correct: ' + re.search(r'"correct":\s*(\d+)', '\n'.join(lines[max(0, i-10):i])).group(1) + ',')
        
        # Pular as linhas antigas de answer/wrongReasons se existirem
        i += 1
        while i < len(lines):
            next_line = lines[i]
            if 'answer:' in next_line:
                output.append(next_line)
                break
            i += 1
        
        current_id = None
    
    i += 1

# Salvar arquivo
with open('data/gh300-questions.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print("✅ Traduções de opções adicionadas!")
