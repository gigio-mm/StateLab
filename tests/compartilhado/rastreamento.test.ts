import { describe, expect, it } from 'vitest';
import {
  ConstrutorRastreamento,
  LIMITES_PADRAO,
  resolverLimites,
} from '../../src/core/compartilhado/rastreamento';

describe('ConstrutorRastreamento', () => {
  it('registra passos indexados e finaliza com o status da simulação', () => {
    const construtor = new ConstrutorRastreamento<{ estado: string }>();
    construtor.adicionar({ estado: 'q0' }, 'início');
    construtor.adicionar({ estado: 'q1' }, 'δ(q0, a) = q1');

    const rastreamento = construtor.finalizar('ACEITA', 'estado final q1 alcançado');

    expect(rastreamento.passos.map((passo) => passo.indice)).toEqual([0, 1]);
    expect(rastreamento.passos[1]?.descricao).toBe('δ(q0, a) = q1');
    expect(rastreamento.aceita).toBe(true);
    expect(construtor.finalizar('REJEITADA', 'x').aceita).toBe(false);
  });

  it('armazena cópias imutáveis dos instantâneos', () => {
    const construtor = new ConstrutorRastreamento<{ pilha: string[] }>();
    const pilha = ['Z'];
    construtor.adicionar({ pilha }, 'início');
    pilha.push('A');

    const rastreamento = construtor.finalizar('REJEITADA', 'fim');
    const gravada = rastreamento.passos[0]!.instantaneo.pilha;

    expect(gravada).toEqual(['Z']);
    expect(() => (gravada as string[]).push('B')).toThrow(TypeError);
  });
});

describe('resolverLimites', () => {
  it('usa valores padrão quando nada é informado', () => {
    expect(resolverLimites()).toEqual(LIMITES_PADRAO);
  });

  it('aceita limites personalizados e rejeita valores inválidos', () => {
    expect(resolverLimites({ maxPassos: 50 }).maxPassos).toBe(50);
    expect(() => resolverLimites({ maxPassos: 0 })).toThrow(RangeError);
    expect(() => resolverLimites({ maxPassos: 1.5 })).toThrow(RangeError);
  });
});
