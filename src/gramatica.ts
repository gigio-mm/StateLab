import { readFileSync } from 'node:fs';
import type { ResultadoSimulacao } from './automato';
import { VAZIO, validarCadeia } from './linguagens';

export type Gramatica = {
  variaveis: string[];
  terminais: string[];
  producoes: Record<string, string[]>;
  simboloInicial: string;
};

type RegraAplicada = { variavel: string; corpo: string };

type EstadoBusca = {
  forma: string;
  historico: string[];
  regras: RegraAplicada[];
};

export function carregarGramaticaJson(caminhoArquivo: string): Gramatica {
  const dados = JSON.parse(readFileSync(caminhoArquivo, 'utf-8')) as Partial<Gramatica>;
  if (
    !Array.isArray(dados.variaveis) ||
    !Array.isArray(dados.terminais) ||
    typeof dados.simboloInicial !== 'string' ||
    typeof dados.producoes !== 'object' ||
    dados.producoes === null
  ) {
    throw new Error('JSON de gramática inválido: campos obrigatórios ausentes.');
  }
  return dados as Gramatica;
}

function podeGerarAlvo(forma: string, variaveis: Set<string>, alvo: string): boolean {
  let qtdTerminais = 0;
  let antesDaPrimeiraVariavel = true;

  for (const simbolo of forma) {
    if (variaveis.has(simbolo)) {
      antesDaPrimeiraVariavel = false;
    } else {
      if (antesDaPrimeiraVariavel && alvo[qtdTerminais] !== simbolo) return false;
      qtdTerminais++;
    }
  }

  return qtdTerminais <= alvo.length;
}

function montarArvoreTexto(
  simbolo: string,
  regras: RegraAplicada[],
  variaveis: Set<string>,
  nivel = 0,
): string[] {
  const recuo = '  '.repeat(nivel);
  if (!variaveis.has(simbolo)) return [`${recuo}${simbolo}`];

  const regra = regras.shift();
  if (!regra) return [`${recuo}${simbolo}`];

  const filhos = regra.corpo === VAZIO ? [VAZIO] : Array.from(regra.corpo);
  const linhas = [`${recuo}${simbolo}`];
  for (const filho of filhos) {
    linhas.push(...montarArvoreTexto(filho, regras, variaveis, nivel + 1));
  }
  return linhas;
}

export function simularGramatica(gramatica: Gramatica, cadeia: string): ResultadoSimulacao {
  if (!validarCadeia(gramatica.terminais, cadeia)) {
    return { aceita: false, passos: ['Símbolo fora dos terminais', 'Rejeita'] };
  }

  const alvo = cadeia === VAZIO ? '' : cadeia;
  const variaveis = new Set(gramatica.variaveis);
  const fila: EstadoBusca[] = [
    { forma: gramatica.simboloInicial, historico: [gramatica.simboloInicial], regras: [] },
  ];
  const visitados = new Set<string>([gramatica.simboloInicial]);
  let passosExplorados = 0;

  // Busca em largura na derivação mais à esquerda com poda por prefixo e número de terminais.
  while (fila.length > 0 && passosExplorados < 5000) {
    const atual = fila.shift()!;
    passosExplorados++;

    if (atual.forma === alvo) {
      const arvore = montarArvoreTexto(gramatica.simboloInicial, [...atual.regras], variaveis);
      return {
        aceita: true,
        passos: [
          `Derivação: ${atual.historico.join(' => ')}`,
          'Árvore de derivação:',
          ...arvore,
          'Aceita',
        ],
      };
    }

    const idxVariavel = Array.from(atual.forma).findIndex((s) => variaveis.has(s));
    if (idxVariavel === -1) continue;

    const variavel = atual.forma[idxVariavel]!;
    for (const corpo of gramatica.producoes[variavel] ?? []) {
      const substituicao = corpo === VAZIO ? '' : corpo;
      const novaForma =
        atual.forma.slice(0, idxVariavel) + substituicao + atual.forma.slice(idxVariavel + 1);

      if (!visitados.has(novaForma) && podeGerarAlvo(novaForma, variaveis, alvo)) {
        visitados.add(novaForma);
        fila.push({
          forma: novaForma,
          historico: [...atual.historico, novaForma === '' ? VAZIO : novaForma],
          regras: [...atual.regras, { variavel, corpo }],
        });
      }
    }
  }

  return { aceita: false, passos: ['Rejeita'] };
}
