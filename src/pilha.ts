import type { ResultadoSimulacao } from './automato';
import { VAZIO } from './linguagens';

export type TransicaoAP = {
  estado: string;
  leitura: string;
  desempilha: string;
  novoEstado: string;
  empilha: string;
};

// Tabela de transições do AP para L = { aⁿbⁿ | n ≥ 1 }.
const TRANSICOES_ANBN: TransicaoAP[] = [
  { estado: 'q0', leitura: 'a', desempilha: VAZIO, novoEstado: 'q0', empilha: 'A' },
  { estado: 'q0', leitura: 'b', desempilha: 'A', novoEstado: 'q1', empilha: VAZIO },
  { estado: 'q1', leitura: 'b', desempilha: 'A', novoEstado: 'q1', empilha: VAZIO },
];

export function empilhar(pilha: string[], simbolo: string): void {
  if (simbolo !== VAZIO) pilha.push(simbolo);
}

export function desempilhar(pilha: string[]): string | undefined {
  return pilha.pop();
}

function formatarPilha(pilha: string[]): string {
  return pilha.length === 0 ? VAZIO : [...pilha].reverse().join('');
}

export function simularPilha(cadeia: string, transicoes = TRANSICOES_ANBN): ResultadoSimulacao {
  const simbolos = cadeia === '' || cadeia === VAZIO ? [] : Array.from(cadeia);
  const pilha: string[] = [];
  let estado = 'q0';
  const passos: string[] = [`Leitura: - | Estado: ${estado} | Pilha: ${formatarPilha(pilha)}`];

  for (const simbolo of simbolos) {
    const topo = pilha.at(-1) ?? VAZIO;
    const regra = transicoes.find(
      (t) =>
        t.estado === estado &&
        t.leitura === simbolo &&
        (t.desempilha === VAZIO || t.desempilha === topo),
    );

    if (!regra) {
      passos.push(`Leitura: ${simbolo} | Estado: bloqueado | Pilha: ${formatarPilha(pilha)}`);
      passos.push('REJEITA');
      return { aceita: false, passos };
    }

    if (regra.desempilha !== VAZIO) desempilhar(pilha);
    empilhar(pilha, regra.empilha);
    estado = regra.novoEstado;
    passos.push(`Leitura: ${simbolo} | Estado: ${estado} | Pilha: ${formatarPilha(pilha)}`);
  }

  const aceita = estado === 'q1' && pilha.length === 0;
  passos.push(aceita ? 'ACEITA' : 'REJEITA');
  return { aceita, passos };
}
