import { describe, expect, it } from 'vitest';
import { simularPilha } from '../src/pilha';

describe('Módulo 4 - Autômato com Pilha (aⁿbⁿ, n ≥ 1)', () => {
  it('aceita "ab" e "aabb" mostrando leitura, estado e pilha', () => {
    const resultado = simularPilha('aabb');

    expect(resultado.aceita).toBe(true);
    expect(resultado.passos).toEqual([
      'Leitura: - | Estado: q0 | Pilha: λ',
      'Leitura: a | Estado: q0 | Pilha: A',
      'Leitura: a | Estado: q0 | Pilha: AA',
      'Leitura: b | Estado: q1 | Pilha: A',
      'Leitura: b | Estado: q1 | Pilha: λ',
      'ACEITA',
    ]);
  });

  it('rejeita a cadeia vazia λ (pois n ≥ 1)', () => {
    expect(simularPilha('λ').aceita).toBe(false);
  });

  it('rejeita cadeias desbalanceadas ou fora de ordem ("aab", "abb", "ba")', () => {
    expect(simularPilha('aab').aceita).toBe(false);
    expect(simularPilha('abb').aceita).toBe(false);
    expect(simularPilha('ba').aceita).toBe(false);
  });
});
