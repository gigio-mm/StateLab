export type ItemComplexidade = {
  algoritmo: string;
  melhor: string;
  medio: string;
  pior: string;
};

// Complexidade assintótica dos algoritmos implementados nos módulos 1 a 5 (n = tamanho da cadeia).
export const TABELA_COMPLEXIDADE: ItemComplexidade[] = [
  {
    algoritmo: 'M1: Validar cadeia em Σ* (Set)',
    melhor: 'Ω(1) — 1º símbolo inválido',
    medio: 'Θ(n)',
    pior: 'O(n) — percorre toda a cadeia',
  },
  {
    algoritmo: 'M1: Gerar Σ* e Σ+ até tamanho k',
    melhor: 'Ω(|Σ|^k)',
    medio: 'Θ(|Σ|^k)',
    pior: 'O(|Σ|^k) — enumera todas as combinações',
  },
  {
    algoritmo: 'M1: Tamanho e concatenação',
    melhor: 'Ω(1)',
    medio: 'Θ(|u| + |v|)',
    pior: 'O(|u| + |v|)',
  },
  {
    algoritmo: 'M2: Simulação AFD / AFN (conjunto de estados)',
    melhor: 'Ω(1) — bloqueia no 1º símbolo',
    medio: 'Θ(n · |Q|)',
    pior: 'O(n · |Q|²) — transições densas',
  },
  {
    algoritmo: 'M3: Derivação GLC mais à esquerda (BFS com poda)',
    melhor: 'Ω(n) — gramática linear determinística',
    medio: 'Θ(b^d) — busca em largura',
    pior: 'O(b^d) — exponencial na profundidade d',
  },
  {
    algoritmo: 'M4: Simulação AP para aⁿbⁿ',
    melhor: 'Ω(1) — 1º símbolo inválido',
    medio: 'Θ(n)',
    pior: 'O(n) — 1 transição por símbolo',
  },
  {
    algoritmo: 'M5: Máquina de Turing (soma unária)',
    melhor: 'Ω(1) — rejeição imediata',
    medio: 'Θ(n)',
    pior: 'O(n) — varre a fita uma vez',
  },
];

export function exibirTabelaComplexidade(): void {
  console.table(TABELA_COMPLEXIDADE);
}
