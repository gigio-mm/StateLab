import { describe, expect, it } from 'vitest';
import { simularTuring } from '../src/turing';

describe('Módulo 5 - Máquina de Turing (Soma Unária - Opção B)', () => {
  it('soma o exemplo do enunciado: "000100" (3 + 2) -> "00000"', () => {
    const execucao = simularTuring('000100');

    expect(execucao.aceita).toBe(true);
    expect(execucao.resultado).toBe('00000');
    expect(execucao.passos).toContain('Resultado: 00000');
    expect(execucao.passos.at(-1)).toBe('ACEITA');
  });

  it('soma "010" (1 + 1) -> "00"', () => {
    const execucao = simularTuring('010');

    expect(execucao.aceita).toBe(true);
    expect(execucao.resultado).toBe('00');
  });

  it('rejeita cadeia sem separador "000" ou com símbolo inválido', () => {
    expect(simularTuring('000').aceita).toBe(false);
    expect(simularTuring('00a00').aceita).toBe(false);
  });
});
