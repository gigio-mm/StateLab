import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { analisarCadeia, concatenar, gerarEstrelaKleene, gerarFechoPositivo } from './linguagens';
import { carregarAutomatoJson, simularAutomato } from './automato';
import { carregarGramaticaJson, simularGramatica } from './gramatica';
import { simularPilha } from './pilha';
import { simularTuring } from './turing';
import { exibirTabelaComplexidade } from './complexidade';

const rl = createInterface({ input, output });

async function perguntar(texto: string, padrao = ''): Promise<string> {
  try {
    const resposta = (await rl.question(texto)).trim();
    return resposta === '' ? padrao : resposta;
  } catch {
    return padrao || '0';
  }
}

async function menuLinguagens(): Promise<void> {
  const textoSigma = await perguntar('Alfabeto Σ separado por vírgula [a,b]: ', 'a,b');
  const alfabeto = textoSigma
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const textoL = await perguntar(
    'Linguagem L separada por vírgula (opcional) [ab,abba]: ',
    'ab,abba',
  );
  const linguagem = textoL
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const cadeia = await perguntar('Cadeia de entrada [abba]: ', 'abba');
  const outra = await perguntar('Segunda cadeia para concatenar [ba]: ', 'ba');
  const limite = Number(await perguntar('Tamanho máximo para Σ* e Σ+ [2]: ', '2'));

  const analise = analisarCadeia(alfabeto, cadeia, linguagem);
  console.log('\n' + analise.passos.join('\n'));
  console.log(`Concatenação (${cadeia} + ${outra}) = ${concatenar(cadeia, outra)}`);
  console.log(`Σ* (até ${limite}) = { ${gerarEstrelaKleene(alfabeto, limite).join(', ')} }`);
  console.log(`Σ+ (até ${limite}) = { ${gerarFechoPositivo(alfabeto, limite).join(', ')} }`);
}

async function menuAutomato(): Promise<void> {
  const caminho = await perguntar('Arquivo JSON [exemplos/afd.json]: ', 'exemplos/afd.json');
  const cadeia = await perguntar('Cadeia de entrada [ab]: ', 'ab');
  const automato = carregarAutomatoJson(caminho);
  const resultado = simularAutomato(automato, cadeia);
  console.log('\n' + resultado.passos.join('\n'));
}

async function menuGramatica(): Promise<void> {
  const caminho = await perguntar(
    'Arquivo JSON [exemplos/gramatica.json]: ',
    'exemplos/gramatica.json',
  );
  const cadeia = await perguntar('Cadeia de entrada [aaabbb]: ', 'aaabbb');
  const gramatica = carregarGramaticaJson(caminho);
  const resultado = simularGramatica(gramatica, cadeia);
  console.log('\n' + resultado.passos.join('\n'));
}

async function menuPilha(): Promise<void> {
  console.log('Linguagem: L = { aⁿbⁿ | n ≥ 1 }');
  const cadeia = await perguntar('Cadeia de entrada [aabb]: ', 'aabb');
  const resultado = simularPilha(cadeia);
  console.log('\n' + resultado.passos.join('\n'));
}

async function menuTuring(): Promise<void> {
  console.log('Opção B: Soma unária (ex.: 000100 representa 3 + 2)');
  const cadeia = await perguntar('Cadeia de entrada [000100]: ', '000100');
  const resultado = simularTuring(cadeia);
  console.log('\n' + resultado.passos.join('\n'));
}

async function iniciarMenu(): Promise<void> {
  while (true) {
    console.log('\n=== StateLab — Simulador de Teoria da Computação ===');
    console.log('1. Módulo 1 — Linguagens Formais');
    console.log('2. Módulo 2 — Autômato Finito (AFD / AFN)');
    console.log('3. Módulo 3 — Gramática Livre de Contexto (GLC)');
    console.log('4. Módulo 4 — Autômato com Pilha (AP)');
    console.log('5. Módulo 5 — Máquina de Turing (MT)');
    console.log('6. Módulo 6 — Complexidade Computacional');
    console.log('0. Sair');

    const opcao = await perguntar('Escolha uma opção: ');
    try {
      if (opcao === '1') await menuLinguagens();
      else if (opcao === '2') await menuAutomato();
      else if (opcao === '3') await menuGramatica();
      else if (opcao === '4') await menuPilha();
      else if (opcao === '5') await menuTuring();
      else if (opcao === '6') exibirTabelaComplexidade();
      else if (opcao === '0') break;
      else console.log('Opção inválida.');
    } catch (erro) {
      console.error('Erro:', erro instanceof Error ? erro.message : erro);
    }
  }
  rl.close();
}

void iniciarMenu();
