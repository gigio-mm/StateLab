import { describe, expect, it } from 'vitest';
import { VERSION } from '../src/core/index';

describe('setup', () => {
  it('exposes the core version', () => {
    expect(VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
