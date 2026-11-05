export const VAZIO = 'λ';

export function tamanhoCadeia(cadeia: string): number {
  if (cadeia === '' || cadeia === VAZIO || cadeia === 'ε') return 0;
  return cadeia.length;
}

export function validarCadeia(alfabeto: string[], cadeia: string): boolean {
  if (tamanhoCadeia(cadeia) === 0) return true;
  const conjunto = new Set(alfabeto);
  for (const simbolo of cadeia) {
    if (!conjunto.has(simbolo)) return false;
  }
  return true;
}

export function pertenceLinguagem(linguagem: string[], cadeia: string): boolean {
  const normalizada = tamanhoCadeia(cadeia) === 0 ? VAZIO : cadeia;
  return linguagem.map((p) => (tamanhoCadeia(p) === 0 ? VAZIO : p)).includes(normalizada);
}

export function concatenar(u: string, v: string): string {
  const parteU = tamanhoCadeia(u) === 0 ? '' : u;
  const parteV = tamanhoCadeia(v) === 0 ? '' : v;
  const resultado = parteU + parteV;
  return resultado.length === 0 ? VAZIO : resultado;
}

export function gerarFechoPositivo(alfabeto: string[], ateTamanho: number): string[] {
  const resultado: string[] = [];
  let nivelAtual = [''];

  // Gera todas as combinações de comprimento 1 até ateTamanho.
  for (let comp = 1; comp <= ateTamanho; comp++) {
    const proximoNivel: string[] = [];
    for (const prefixo of nivelAtual) {
      for (const simbolo of alfabeto) {
        const palavra = prefixo + simbolo;
        proximoNivel.push(palavra);
        resultado.push(palavra);
      }
    }
    nivelAtual = proximoNivel;
  }

  return resultado;
}

export function gerarEstrelaKleene(alfabeto: string[], ateTamanho: number): string[] {
  return [VAZIO, ...gerarFechoPositivo(alfabeto, ateTamanho)];
}

export function analisarCadeia(
  alfabeto: string[],
  cadeia: string,
  linguagem?: string[],
): { aceita: boolean; passos: string[] } {
  const aceita = validarCadeia(alfabeto, cadeia);
  const passos = [
    aceita ? 'Cadeia válida para Σ' : 'Cadeia inválida para Σ',
    `Tamanho = ${tamanhoCadeia(cadeia)}`,
  ];

  if (linguagem) {
    passos.push(pertenceLinguagem(linguagem, cadeia) ? 'Pertence a L' : 'Não pertence a L');
  }

  return { aceita, passos };
}
