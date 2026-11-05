import { describe, expect, it } from 'vitest';
import { ErroValidacao, formatarProblema, problema } from '../../src/core/compartilhado/erros';
import { desempacotar, falha, sucesso } from '../../src/core/compartilhado/resultado';

describe('ErroValidacao', () => {
  it('lista todos os problemas na mensagem', () => {
    const erro = new ErroValidacao([
      problema('estado inicial não declarado', 'estadoInicial'),
      problema('alfabeto vazio'),
    ]);

    expect(erro.name).toBe('ErroValidacao');
    expect(erro.problemas).toHaveLength(2);
    expect(erro.message).toContain('estadoInicial: estado inicial não declarado');
    expect(erro.message).toContain('- alfabeto vazio');
  });

  it('formata problemas com e sem caminho', () => {
    expect(formatarProblema(problema('msg', 'a.b'))).toBe('a.b: msg');
    expect(formatarProblema(problema('msg'))).toBe('msg');
  });
});

describe('Resultado', () => {
  it('desempacota resultados de sucesso', () => {
    expect(desempacotar(sucesso(42))).toBe(42);
  });

  it('lança ErroValidacao ao desempacotar falhas', () => {
    expect(() => desempacotar(falha([problema('falhou')]))).toThrow(ErroValidacao);
  });
});
