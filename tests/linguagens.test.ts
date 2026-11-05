import { describe, expect, it } from 'vitest';
import {
  analisarCadeia,
  concatenar,
  gerarEstrelaKleene,
  gerarFechoPositivo,
  pertenceLinguagem,
  tamanhoCadeia,
  validarCadeia,
} from '../src/linguagens';

describe('Módulo 1 - Linguagens Formais', () => {
  it('valida o exemplo do enunciado: Σ = {a,b} e entrada "abba"', () => {
    const resultado = analisarCadeia(['a', 'b'], 'abba');
    expect(resultado.aceita).toBe(true);
    expect(resultado.passos).toEqual(['Cadeia válida para Σ', 'Tamanho = 4']);
  });

  it('rejeita cadeia com símbolo fora do alfabeto', () => {
    expect(validarCadeia(['a', 'b'], 'abca')).toBe(false);
  });

  it('calcula tamanho, concatenação e pertinência na linguagem L', () => {
    expect(tamanhoCadeia('λ')).toBe(0);
    expect(concatenar('ab', 'ba')).toBe('abba');
    expect(concatenar('λ', 'ab')).toBe('ab');
    expect(pertenceLinguagem(['ab', 'abba'], 'abba')).toBe(true);
    expect(pertenceLinguagem(['ab', 'abba'], 'aa')).toBe(false);
  });

  it('gera Σ+ e Σ* até o comprimento informado', () => {
    expect(gerarFechoPositivo(['a', 'b'], 2)).toEqual(['a', 'b', 'aa', 'ab', 'ba', 'bb']);
    expect(gerarEstrelaKleene(['a', 'b'], 2)).toEqual(['λ', 'a', 'b', 'aa', 'ab', 'ba', 'bb']);
  });
});
