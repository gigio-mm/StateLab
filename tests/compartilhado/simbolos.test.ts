import { describe, expect, it } from 'vitest';
import {
  EPSILON,
  ehEpsilon,
  formatarCadeia,
  normalizarSimbolo,
  paraSimbolos,
} from '../../src/core/compartilhado/simbolos';

describe('simbolos', () => {
  it('reconhece ε e seus aliases', () => {
    for (const alias of ['ε', 'eps', 'EPSILON', 'λ', 'lambda', '', '  ']) {
      expect(ehEpsilon(alias)).toBe(true);
    }
    expect(ehEpsilon('a')).toBe(false);
  });

  it('normaliza aliases para o ε canônico', () => {
    expect(normalizarSimbolo('eps')).toBe(EPSILON);
    expect(normalizarSimbolo(' a ')).toBe('a');
  });

  it('divide cadeias em símbolos e trata ε como cadeia vazia', () => {
    expect(paraSimbolos('abba')).toEqual(['a', 'b', 'b', 'a']);
    expect(paraSimbolos('')).toEqual([]);
    expect(paraSimbolos(EPSILON)).toEqual([]);
  });

  it('não trata aliases textuais como cadeia vazia ao dividir', () => {
    expect(paraSimbolos('eps')).toEqual(['e', 'p', 's']);
  });

  it('formata a cadeia vazia como ε', () => {
    expect(formatarCadeia([])).toBe(EPSILON);
    expect(formatarCadeia('')).toBe(EPSILON);
    expect(formatarCadeia(['a', 'b'])).toBe('ab');
  });
});
