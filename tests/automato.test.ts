import { describe, expect, it } from 'vitest';
import { carregarAutomatoJson, simularAutomato } from '../src/automato';

describe('Módulo 2 - Autômato Finito (AFD e AFN)', () => {
  it('executa o exemplo do enunciado (AFD com entrada "ab")', () => {
    const afd = carregarAutomatoJson('exemplos/afd.json');
    const resultado = simularAutomato(afd, 'ab');

    expect(resultado.aceita).toBe(true);
    expect(resultado.passos).toEqual(['q0 -> q1 -> q2', 'ACEITA']);
  });

  it('rejeita cadeia inválida no AFD', () => {
    const afd = carregarAutomatoJson('exemplos/afd.json');
    const resultado = simularAutomato(afd, 'aa');

    expect(resultado.aceita).toBe(false);
    expect(resultado.passos).toEqual(['q0 -> q1 -> ∅', 'REJEITA']);
  });

  it('simula AFN (cadeias terminadas em "ab")', () => {
    const afn = carregarAutomatoJson('exemplos/afn.json');

    expect(simularAutomato(afn, 'aab')).toEqual({
      aceita: true,
      passos: ['q0 -> {q0,q1} -> {q0,q1} -> {q0,q2}', 'ACEITA'],
    });
    expect(simularAutomato(afn, 'aba').aceita).toBe(false);
  });
});
