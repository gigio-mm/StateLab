import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parsearGramaticaJson, simularGramatica } from '../src/gramatica';

describe('Módulo 3 - Gramática Livre de Contexto', () => {
  it('aceita o exemplo do enunciado: S -> aSb | λ com entrada "aaabbb"', () => {
    const glc = parsearGramaticaJson(readFileSync('exemplos/gramatica.json', 'utf-8'));
    const resultado = simularGramatica(glc, 'aaabbb');

    expect(resultado.aceita).toBe(true);
    expect(resultado.passos[0]).toBe('Derivação: S => aSb => aaSbb => aaaSbbb => aaabbb');
    expect(resultado.passos.at(-1)).toBe('Aceita');
  });

  it('aceita a cadeia vazia λ quando S -> λ', () => {
    const glc = parsearGramaticaJson(readFileSync('exemplos/gramatica.json', 'utf-8'));
    const resultado = simularGramatica(glc, 'λ');

    expect(resultado.aceita).toBe(true);
    expect(resultado.passos[0]).toBe('Derivação: S => λ');
  });

  it('rejeita cadeia desbalanceada "aaabb"', () => {
    const glc = parsearGramaticaJson(readFileSync('exemplos/gramatica.json', 'utf-8'));
    const resultado = simularGramatica(glc, 'aaabb');

    expect(resultado.aceita).toBe(false);
    expect(resultado.passos).toEqual(['Rejeita']);
  });
});
