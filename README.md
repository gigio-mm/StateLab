# StateLab — Simulador de Linguagens Formais e Modelos Computacionais

Projeto prático de **Aspectos Teóricos da Computação (AV3)** — Prof. Ildo Ramos Vieira.

**Dupla:**

- Gigio Moura Melo — Matrícula: 2410408
- Aaron Magno Campos Nogueira — Matrícula: 2413085

---

## Como Executar

### Pré-requisitos

- Node.js 20+

### Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar o menu interativo no console
npm run cli

# Executar testes automatizados
npm test

# Validar tipagem, lint e testes
npm run check
```

> No menu interativo (`npm run cli`), basta pressionar **Enter** nas perguntas para usar os valores padrão do enunciado.

---

## Estrutura do Projeto

```text
src/
  linguagens.ts    -> Módulo 1: alfabeto Σ, linguagem L, validação, Σ*, Σ+, tamanho e concatenação
  automato.ts      -> Módulo 2: simulador unificado de AFD e AFN + carregamento por JSON
  gramatica.ts     -> Módulo 3: GLC com derivação mais à esquerda (BFS com poda) e árvore textual
  pilha.ts         -> Módulo 4: Autômato com Pilha para L = { aⁿbⁿ | n ≥ 1 }
  turing.ts        -> Módulo 5: Máquina de Turing para soma unária (Opção B)
  complexidade.ts  -> Módulo 6: tabela de complexidade assintótica (O, Ω, Θ)
  cli.ts           -> Menu interativo de console (readline)
exemplos/
  afd.json         -> Exemplo de AFD do enunciado
  afn.json         -> Exemplo de AFN (cadeias terminadas em "ab")
  gramatica.json   -> Exemplo de GLC do enunciado (S -> aSb | λ)
tests/             -> Testes unitários (Vitest) de cada módulo
docs/              -> Documento técnico e diagramas UML
```

---

## Exemplos de Entrada e Saída

### Módulo 1 — Linguagens Formais

- **Entrada:** `Σ = {a, b}`, cadeia `abba`
- **Saída:**

```text
Cadeia válida para Σ
Tamanho = 4
Concatenação (abba + ba) = abbaba
Σ* (até 2) = { λ, a, b, aa, ab, ba, bb }
Σ+ (até 2) = { a, b, aa, ab, ba, bb }
```

### Módulo 2 — Simulador de Autômato Finito (`exemplos/afd.json`)

- **Entrada:** arquivo `exemplos/afd.json` (`q0 -a-> q1`, `q1 -b-> q2`), cadeia `ab`
- **Saída:**

```text
q0 -> q1 -> q2
ACEITA
```

### Módulo 3 — Simulador de Gramática Livre de Contexto (`exemplos/gramatica.json`)

- **Entrada:** `S -> aSb | λ`, cadeia `aaabbb`
- **Saída:**

```text
Derivação: S => aSb => aaSbb => aaaSbbb => aaabbb
Árvore de derivação:
S
  a
  S
    a
    S
      a
      S
        λ
      b
    b
  b
Aceita
```

### Módulo 4 — Simulador de Autômato com Pilha

- **Entrada:** linguagem $L = \{ a^n b^n \mid n \ge 1 \}$, cadeia `aabb`
- **Saída:**

```text
Leitura: - | Estado: q0 | Pilha: λ
Leitura: a | Estado: q0 | Pilha: A
Leitura: a | Estado: q0 | Pilha: AA
Leitura: b | Estado: q1 | Pilha: A
Leitura: b | Estado: q1 | Pilha: λ
ACEITA
```

### Módulo 5 — Máquina de Turing (Opção B: Soma Unária)

- **Entrada:** `000100` (representando `3 + 2`)
- **Saída:**

```text
Estado: q0 | Fita: [0]00100_
Estado: q0 | Fita: 0[0]0100_
Estado: q0 | Fita: 00[0]100_
Estado: q0 | Fita: 000[1]00_
Estado: q1 | Fita: 0000[0]0_
Estado: q1 | Fita: 00000[0]_
Estado: q1 | Fita: 000000[_]
Estado: q2 | Fita: 00000[0]_
Estado: qf | Fita: 00000[_]_
Resultado: 00000
ACEITA
```

### Módulo 6 — Complexidade Computacional

| Algoritmo                           | Melhor Caso                   | Caso Médio                | Pior Caso                                 |
| ----------------------------------- | ----------------------------- | ------------------------- | ----------------------------------------- |
| M1: Validar cadeia em Σ* (Set)      | Ω(1) — 1º símbolo inválido    | Θ(n)                      | O(n) — percorre toda a cadeia             |
| M1: Gerar Σ* e Σ+ até tamanho k     | Ω(\|Σ\|^k)                    | Θ(\|Σ\|^k)                | O(\|Σ\|^k) — enumera todas as combinações |
| M1: Tamanho e concatenação          | Ω(1)                          | Θ(\|u\| + \|v\|)          | O(\|u\| + \|v\|)                          |
| M2: Simulação AFD / AFN             | Ω(1) — bloqueia no 1º símbolo | Θ(n · \|Q\|)              | O(n · \|Q\|²) — transições densas         |
| M3: Derivação GLC (BFS com poda)    | Ω(n) — gramática linear       | Θ(b^d) — busca em largura | O(b^d) — exponencial na profundidade d    |
| M4: Simulação AP para aⁿbⁿ          | Ω(1) — 1º símbolo inválido    | Θ(n)                      | O(n) — 1 transição por símbolo            |
| M5: Máquina de Turing (soma unária) | Ω(1) — rejeição imediata      | Θ(n)                      | O(n) — varre a fita uma vez               |
