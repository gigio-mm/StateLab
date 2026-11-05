import { describe, expect, it } from 'vitest';
import { VERSAO } from '../src/core/index';

describe('inicial', () => {
  it('expõe a versão do núcleo', () => {
    expect(VERSAO).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
