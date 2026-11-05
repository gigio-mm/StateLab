import { readFileSync } from 'node:fs';
import { VAZIO, validarCadeia } from './linguagens';

export type ResultadoSimulacao = {
  aceita: boolean;
  passos: string[];
};

export type Automato = {
  estados: string[];
  alfabeto: string[];
  estadoInicial: string;
  estadosFinais: string[];
  transicoes: Record<string, Record<string, string[]>>;
};

export function carregarAutomatoJson(caminhoArquivo: string): Automato {
  const conteudo = readFileSync(caminhoArquivo, 'utf-8');
  const dados = JSON.parse(conteudo) as Partial<Automato>;

  if (
    !Array.isArray(dados.estados) ||
    !Array.isArray(dados.alfabeto) ||
    typeof dados.estadoInicial !== 'string' ||
    !Array.isArray(dados.estadosFinais) ||
    typeof dados.transicoes !== 'object' ||
    dados.transicoes === null
  ) {
    throw new Error('JSON de autômato inválido: campos obrigatórios ausentes.');
  }

  return dados as Automato;
}

function fechoVazio(automato: Automato, estados: string[]): string[] {
  const visitados = new Set(estados);
  const fila = [...estados];

  while (fila.length > 0) {
    const atual = fila.shift()!;
    const destinos = automato.transicoes[atual]?.[VAZIO] ?? [];
    for (const destino of destinos) {
      if (!visitados.has(destino)) {
        visitados.add(destino);
        fila.push(destino);
      }
    }
  }

  return [...visitados];
}

function formatarConjunto(estados: string[]): string {
  return estados.length === 1 ? estados[0]! : `{${estados.join(',')}}`;
}

export function simularAutomato(automato: Automato, cadeia: string): ResultadoSimulacao {
  if (!validarCadeia(automato.alfabeto, cadeia)) {
    return { aceita: false, passos: ['Símbolo fora do alfabeto', 'REJEITA'] };
  }

  const simbolos = cadeia === '' || cadeia === VAZIO ? [] : Array.from(cadeia);
  let atuais = fechoVazio(automato, [automato.estadoInicial]);
  const rastro: string[] = [formatarConjunto(atuais)];

  // Mantém o conjunto de estados ativos a cada símbolo lido (serve para AFD e AFN).
  for (const simbolo of simbolos) {
    const proximos = new Set<string>();
    for (const estado of atuais) {
      const destinos = automato.transicoes[estado]?.[simbolo] ?? [];
      for (const destino of destinos) proximos.add(destino);
    }

    atuais = fechoVazio(automato, [...proximos]);
    if (atuais.length === 0) {
      rastro.push('∅');
      break;
    }
    rastro.push(formatarConjunto(atuais));
  }

  const aceita = atuais.some((estado) => automato.estadosFinais.includes(estado));
  return {
    aceita,
    passos: [rastro.join(' -> '), aceita ? 'ACEITA' : 'REJEITA'],
  };
}
