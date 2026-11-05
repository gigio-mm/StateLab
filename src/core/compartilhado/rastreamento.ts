export type StatusSimulacao = 'ACEITA' | 'REJEITADA' | 'LIMITE_ATINGIDO';

export interface Passo<Instantaneo> {
  readonly indice: number;
  readonly instantaneo: Instantaneo;
  readonly descricao: string;
}

export interface Rastreamento<Instantaneo> {
  readonly passos: readonly Passo<Instantaneo>[];
  readonly status: StatusSimulacao;
  readonly aceita: boolean;
  readonly motivo: string;
}

export interface LimitesSimulacao {
  readonly maxPassos: number;
}

export const LIMITES_PADRAO: LimitesSimulacao = { maxPassos: 10_000 };

export function resolverLimites(limites?: Partial<LimitesSimulacao>): LimitesSimulacao {
  const maxPassos = limites?.maxPassos ?? LIMITES_PADRAO.maxPassos;
  if (!Number.isInteger(maxPassos) || maxPassos <= 0) {
    throw new RangeError(`maxPassos deve ser um inteiro positivo (recebido: ${maxPassos}).`);
  }
  return { maxPassos };
}

export class ConstrutorRastreamento<Instantaneo> {
  private readonly passos: Passo<Instantaneo>[] = [];

  adicionar(instantaneo: Instantaneo, descricao: string): Passo<Instantaneo> {
    // Clona e congela para que mutações posteriores na simulação não alterem passos já gravados.
    const passo: Passo<Instantaneo> = Object.freeze({
      indice: this.passos.length,
      instantaneo: congelarProfundo(structuredClone(instantaneo)),
      descricao,
    });
    this.passos.push(passo);
    return passo;
  }

  get tamanho(): number {
    return this.passos.length;
  }

  finalizar(status: StatusSimulacao, motivo: string): Rastreamento<Instantaneo> {
    return Object.freeze({
      passos: Object.freeze([...this.passos]),
      status,
      aceita: status === 'ACEITA',
      motivo,
    });
  }
}

function congelarProfundo<T>(valor: T): T {
  if (valor !== null && typeof valor === 'object' && !Object.isFrozen(valor)) {
    Object.freeze(valor);
    for (const chave of Reflect.ownKeys(valor)) {
      congelarProfundo((valor as Record<PropertyKey, unknown>)[chave]);
    }
  }
  return valor;
}
