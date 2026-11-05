export const EPSILON = 'ε';

export const BRANCO = '_';

export const ALIASES_EPSILON: readonly string[] = [EPSILON, 'eps', 'epsilon', 'λ', 'lambda', ''];

export function ehEpsilon(simbolo: string): boolean {
  return ALIASES_EPSILON.includes(simbolo.trim().toLowerCase());
}

export function normalizarSimbolo(simbolo: string): string {
  return ehEpsilon(simbolo) ? EPSILON : simbolo.trim();
}

// Aliases textuais ('eps') não são aplicados aqui pois podem ser cadeias válidas sobre {e, p, s}.
export function paraSimbolos(cadeia: string): string[] {
  if (cadeia === '' || cadeia === EPSILON) return [];
  return Array.from(cadeia);
}

export function formatarCadeia(simbolos: readonly string[] | string): string {
  const cadeia = typeof simbolos === 'string' ? simbolos : simbolos.join('');
  return cadeia.length === 0 ? EPSILON : cadeia;
}
