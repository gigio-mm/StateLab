import type { ResultadoSimulacao } from './automato';

export type Direcao = 'E' | 'D' | 'P';

export type AcaoMT = {
  escreve: string;
  move: Direcao;
  proximoEstado: string;
};

export type TransicoesMT = Record<string, Record<string, AcaoMT>>;

const BRANCO = '_';

// Máquina de Turing para soma unária (Opção B): troca o '1' separador por '0' e apaga o último '0'.
const TRANSICOES_SOMA_UNARIA: TransicoesMT = {
  q0: {
    '0': { escreve: '0', move: 'D', proximoEstado: 'q0' },
    '1': { escreve: '0', move: 'D', proximoEstado: 'q1' },
  },
  q1: {
    '0': { escreve: '0', move: 'D', proximoEstado: 'q1' },
    [BRANCO]: { escreve: BRANCO, move: 'E', proximoEstado: 'q2' },
  },
  q2: {
    '0': { escreve: BRANCO, move: 'P', proximoEstado: 'qf' },
  },
};

function formatarFita(fita: string[], cabeca: number): string {
  return fita.map((s, idx) => (idx === cabeca ? `[${s}]` : s)).join('');
}

export function simularTuring(
  cadeia: string,
  transicoes: TransicoesMT = TRANSICOES_SOMA_UNARIA,
): ResultadoSimulacao & { resultado: string } {
  const fita = cadeia.length > 0 ? [...Array.from(cadeia), BRANCO] : [BRANCO];
  let cabeca = 0;
  let estado = 'q0';
  const passos: string[] = [`Estado: ${estado} | Fita: ${formatarFita(fita, cabeca)}`];
  let limite = 0;

  while (estado !== 'qf' && limite < 1000) {
    const lido = fita[cabeca] ?? BRANCO;
    const acao = transicoes[estado]?.[lido];

    if (!acao) {
      passos.push('REJEITA');
      return { aceita: false, passos, resultado: '' };
    }

    fita[cabeca] = acao.escreve;
    estado = acao.proximoEstado;
    if (acao.move === 'D') cabeca++;
    if (acao.move === 'E') cabeca = Math.max(0, cabeca - 1);
    if (cabeca >= fita.length) fita.push(BRANCO);

    passos.push(`Estado: ${estado} | Fita: ${formatarFita(fita, cabeca)}`);
    limite++;
  }

  const aceita = estado === 'qf';
  const resultado = fita.filter((s) => s !== BRANCO).join('');
  passos.push(`Resultado: ${resultado}`);
  passos.push(aceita ? 'ACEITA' : 'REJEITA');
  return { aceita, passos, resultado };
}
