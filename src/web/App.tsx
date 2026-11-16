import { Fragment, type ReactNode, useState } from 'react';
import afdExemplo from '../../exemplos/afd.json';
import afnExemplo from '../../exemplos/afn.json';
import gramaticaExemplo from '../../exemplos/gramatica.json';
import {
  VAZIO,
  analisarCadeia,
  concatenar,
  gerarEstrelaKleene,
  gerarFechoPositivo,
} from '../linguagens';
import { type Automato, parsearAutomatoJson, simularAutomato } from '../automato';
import { type Gramatica, parsearGramaticaJson, simularGramatica } from '../gramatica';
import { simularPilha } from '../pilha';
import { simularTuring } from '../turing';
import { TABELA_COMPLEXIDADE } from '../complexidade';

const ABAS = [
  { titulo: '1. Linguagens', Modulo: ModuloLinguagens },
  { titulo: '2. Autômato (AFD/AFN)', Modulo: ModuloAutomato },
  { titulo: '3. Gramática (GLC)', Modulo: ModuloGramatica },
  { titulo: '4. Pilha (AP)', Modulo: ModuloPilha },
  { titulo: '5. Máquina de Turing', Modulo: ModuloTuring },
  { titulo: '6. Complexidade', Modulo: ModuloComplexidade },
];

export function App() {
  const [aba, setAba] = useState(0);

  return (
    <div className="container">
      <header className="topo">
        <h1>StateLab</h1>
        <p className="subtitulo">Simulador de Linguagens Formais e Modelos Computacionais</p>
        <nav className="abas">
          {ABAS.map(({ titulo }, i) => (
            <button
              key={titulo}
              className={aba === i ? 'aba ativa' : 'aba'}
              onClick={() => setAba(i)}
            >
              {titulo}
            </button>
          ))}
        </nav>
      </header>

      {/* Todos os módulos ficam montados para não perder o que foi digitado ao trocar de aba. */}
      {ABAS.map(({ titulo, Modulo }, i) => (
        <div key={titulo} hidden={aba !== i}>
          <Modulo />
        </div>
      ))}
    </div>
  );
}

// ---------- Componentes de layout compartilhados ----------

function Painel(props: { titulo: string; descricao: ReactNode; children: ReactNode }) {
  return (
    <section className="painel">
      <h2>{props.titulo}</h2>
      <p className="descricao">{props.descricao}</p>
      {props.children}
    </section>
  );
}

function Secao(props: { numero: number; titulo: string; children: ReactNode }) {
  return (
    <div className="secao">
      <h3>
        <span className="numero">{props.numero}</span>
        {props.titulo}
      </h3>
      {props.children}
    </div>
  );
}

function Campo(props: { rotulo: string; dica?: string; children: ReactNode }) {
  return (
    <label className="campo">
      <span className="rotulo">{props.rotulo}</span>
      {props.children}
      {props.dica && <small className="dica">{props.dica}</small>}
    </label>
  );
}

function ControlePassos(props: {
  indice: number;
  total: number;
  legenda: string;
  aoMudar: (indice: number) => void;
}) {
  const { indice, total, legenda, aoMudar } = props;
  return (
    <div className="controle-passos">
      <button disabled={indice <= 0} onClick={() => aoMudar(0)}>
        « Início
      </button>
      <button disabled={indice <= 0} onClick={() => aoMudar(indice - 1)}>
        ‹ Anterior
      </button>
      <span className="contador">
        Passo {indice + 1} de {total}
        <small>{legenda}</small>
      </span>
      <button disabled={indice >= total - 1} onClick={() => aoMudar(indice + 1)}>
        Próximo ›
      </button>
      <button disabled={indice >= total - 1} onClick={() => aoMudar(total - 1)}>
        Fim »
      </button>
    </div>
  );
}

function Veredito(props: { aceita: boolean; titulo?: string; detalhe?: ReactNode }) {
  return (
    <div className={`veredito ${props.aceita ? 'aceita' : 'rejeita'}`}>
      <strong>{props.titulo ?? (props.aceita ? 'ACEITA' : 'REJEITA')}</strong>
      {props.detalhe && <span>{props.detalhe}</span>}
    </div>
  );
}

function CadeiaLida(props: { simbolos: string[]; lidos: number }) {
  return (
    <div className="cadeia-lida">
      <span className="rotulo">Cadeia de entrada</span>
      {props.simbolos.length === 0 && <span className="simbolo">λ</span>}
      {props.simbolos.map((s, i) => (
        <span
          key={i}
          className={`simbolo ${i < props.lidos - 1 ? 'lido' : ''} ${i === props.lidos - 1 ? 'atual' : ''}`}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function LogTexto(props: { linhas: string[] }) {
  return (
    <details className="log">
      <summary>Ver passo a passo em texto</summary>
      <pre>{props.linhas.join('\n')}</pre>
    </details>
  );
}

function paraSimbolos(cadeia: string): string[] {
  return cadeia === '' || cadeia === VAZIO ? [] : Array.from(cadeia);
}

function listaPorVirgula(texto: string): string[] {
  return texto
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function conjunto(itens: string[]): string {
  return `{ ${itens.join(', ')} }`;
}

// ---------- Módulo 1 ----------

function ModuloLinguagens() {
  const [sigma, setSigma] = useState('a,b');
  const [linguagem, setLinguagem] = useState('ab,abba');
  const [cadeia, setCadeia] = useState('abba');
  const [outra, setOutra] = useState('ba');
  const [limite, setLimite] = useState(2);

  const listaSigma = listaPorVirgula(sigma);
  const listaL = listaPorVirgula(linguagem);
  const analise = analisarCadeia(listaSigma, cadeia, listaL);
  const estrela = gerarEstrelaKleene(listaSigma, limite);
  const positivo = gerarFechoPositivo(listaSigma, limite);

  return (
    <Painel
      titulo="Módulo 1 — Linguagens Formais"
      descricao="Defina um alfabeto Σ e uma linguagem L, informe uma cadeia e veja a validação e as operações. Exemplo do enunciado: Σ = {a, b} com a entrada abba."
    >
      <Secao numero={1} titulo="Entrada">
        <div className="grade-campos">
          <Campo rotulo="Alfabeto Σ" dica="Símbolos separados por vírgula">
            <input value={sigma} onChange={(e) => setSigma(e.target.value)} />
          </Campo>
          <Campo rotulo="Linguagem L" dica="Cadeias separadas por vírgula">
            <input value={linguagem} onChange={(e) => setLinguagem(e.target.value)} />
          </Campo>
          <Campo rotulo="Cadeia w" dica="Use λ para a cadeia vazia">
            <input value={cadeia} onChange={(e) => setCadeia(e.target.value)} />
          </Campo>
          <Campo rotulo="Cadeia v" dica="Usada na concatenação w · v">
            <input value={outra} onChange={(e) => setOutra(e.target.value)} />
          </Campo>
          <Campo rotulo="Tamanho máximo k" dica="Limite para listar Σ* e Σ+ (0 a 5)">
            <input
              type="number"
              min={0}
              max={5}
              value={limite}
              onChange={(e) => setLimite(Math.min(5, Math.max(0, Number(e.target.value))))}
            />
          </Campo>
        </div>
      </Secao>

      <Secao numero={2} titulo="Resultado">
        <Veredito
          aceita={analise.aceita}
          titulo={analise.passos[0]}
          detalhe={analise.passos.slice(1).join('  ·  ')}
        />
        <div className="cartoes">
          <div className="cartao">
            <h4>Definições</h4>
            <p>
              Σ = <code>{conjunto(listaSigma)}</code>
            </p>
            <p>
              L = <code>{conjunto(listaL)}</code>
            </p>
            <p>
              w = <code>{cadeia || VAZIO}</code> e v = <code>{outra || VAZIO}</code>
            </p>
          </div>
          <div className="cartao">
            <h4>Operações</h4>
            <p>
              w · v = <code>{concatenar(cadeia, outra)}</code>
            </p>
            <p>
              Σ* (até tamanho {limite}) = <code>{conjunto(estrela)}</code>{' '}
              <small className="nota">{estrela.length} cadeias</small>
            </p>
            <p>
              Σ+ (até tamanho {limite}) = <code>{conjunto(positivo)}</code>{' '}
              <small className="nota">{positivo.length} cadeias</small>
            </p>
          </div>
        </div>
      </Secao>
    </Painel>
  );
}

// ---------- Módulo 2 ----------

type ExemploAF = 'AFD' | 'AFN';
const EXEMPLOS_AF: Record<ExemploAF, unknown> = { AFD: afdExemplo, AFN: afnExemplo };

function ModuloAutomato() {
  const [exemplo, setExemplo] = useState<ExemploAF | null>('AFD');
  const [json, setJson] = useState(JSON.stringify(afdExemplo, null, 2));
  const [cadeia, setCadeia] = useState('ab');
  const [passo, setPasso] = useState(0);

  let automato: Automato | null = null;
  let erro = '';
  try {
    automato = parsearAutomatoJson(json);
  } catch (e) {
    erro = e instanceof Error ? e.message : 'JSON inválido';
  }

  function carregarExemplo(nome: ExemploAF) {
    setExemplo(nome);
    setJson(JSON.stringify(EXEMPLOS_AF[nome], null, 2));
    setPasso(0);
  }

  return (
    <Painel
      titulo="Módulo 2 — Autômato Finito (AFD / AFN)"
      descricao="Carregue um autômato em JSON (estados, estado inicial, estados finais e função de transição) e acompanhe a leitura da cadeia símbolo a símbolo. Exemplo do enunciado: q0 –a→ q1, q1 –b→ q2 com a entrada ab. O AFN de exemplo aceita cadeias terminadas em ab."
    >
      <Secao numero={1} titulo="Entrada">
        <div className="linha">
          <div className="campo">
            <span className="rotulo">Autômato</span>
            <div className="grupo-botoes">
              {(['AFD', 'AFN'] as const).map((nome) => (
                <button
                  key={nome}
                  className={exemplo === nome ? 'selecionado' : ''}
                  onClick={() => carregarExemplo(nome)}
                >
                  Exemplo {nome}
                </button>
              ))}
            </div>
            <small className="dica">
              {exemplo ? `Exemplo ${exemplo} carregado` : 'JSON personalizado carregado'}
            </small>
          </div>
          <Campo rotulo="Cadeia de entrada" dica="Use λ para a cadeia vazia">
            <input
              value={cadeia}
              onChange={(e) => {
                setCadeia(e.target.value);
                setPasso(0);
              }}
            />
          </Campo>
        </div>
        <details className="editor">
          <summary>Editar JSON do autômato</summary>
          <textarea
            rows={12}
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setExemplo(null);
              setPasso(0);
            }}
          />
        </details>
        {erro && <p className="erro">{erro}</p>}
      </Secao>

      {automato && (
        <VisualAutomato automato={automato} cadeia={cadeia} passo={passo} aoMudarPasso={setPasso} />
      )}
    </Painel>
  );
}

function VisualAutomato(props: {
  automato: Automato;
  cadeia: string;
  passo: number;
  aoMudarPasso: (indice: number) => void;
}) {
  const { automato, cadeia, passo, aoMudarPasso } = props;
  const simulacao = simularAutomato(automato, cadeia);
  const caminho = simulacao.passos[0] ?? '';

  if (caminho === 'Símbolo fora do alfabeto') {
    return (
      <Secao numero={2} titulo="Resultado">
        <Veredito
          aceita={false}
          detalhe={`A cadeia contém símbolo fora do alfabeto Σ = ${conjunto(automato.alfabeto)}`}
        />
      </Secao>
    );
  }

  const etapas = caminho.split(' -> ');
  const indice = Math.min(passo, etapas.length - 1);
  const etapaAtual = etapas[indice] ?? '';
  const ativos = etapaAtual.replace(/^\{|\}$/g, '').split(',');
  const simbolos = paraSimbolos(cadeia);
  const destino = etapaAtual === '∅' ? '∅ (nenhum estado ativo)' : etapaAtual;
  const legenda =
    indice === 0
      ? `Configuração inicial: ${etapaAtual}`
      : `Leu "${simbolos[indice - 1]}" e foi para ${destino}`;

  return (
    <>
      <Secao numero={2} titulo="Visualização passo a passo">
        <CadeiaLida simbolos={simbolos} lidos={indice} />
        <div className="visual-automato">
          <div>
            <div className="estados-box">
              {automato.estados.map((estado) => (
                <div
                  key={estado}
                  className={`estado-no ${automato.estadosFinais.includes(estado) ? 'final' : ''} ${ativos.includes(estado) ? 'ativo' : ''}`}
                >
                  {automato.estadoInicial === estado ? `→ ${estado}` : estado}
                </div>
              ))}
            </div>
            <p className="legenda">
              → estado inicial · borda dupla = estado final · amarelo = estado ativo
            </p>
          </div>
          <TabelaTransicoes automato={automato} ativos={ativos} />
        </div>
        <ControlePassos
          indice={indice}
          total={etapas.length}
          legenda={legenda}
          aoMudar={aoMudarPasso}
        />
      </Secao>

      <Secao numero={3} titulo="Resultado">
        <Veredito aceita={simulacao.aceita} detalhe={caminho} />
        <LogTexto linhas={simulacao.passos} />
      </Secao>
    </>
  );
}

function TabelaTransicoes(props: { automato: Automato; ativos: string[] }) {
  const { automato, ativos } = props;
  const usaVazio = Object.values(automato.transicoes).some((t) => VAZIO in t);
  const simbolos = usaVazio ? [...automato.alfabeto, VAZIO] : automato.alfabeto;

  return (
    <table className="tabela-compacta">
      <caption>Função de transição δ</caption>
      <thead>
        <tr>
          <th>Estado</th>
          {simbolos.map((s) => (
            <th key={s}>{s}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {automato.estados.map((estado) => (
          <tr key={estado} className={ativos.includes(estado) ? 'ativa' : ''}>
            <td>
              {automato.estadoInicial === estado && '→ '}
              {automato.estadosFinais.includes(estado) && '* '}
              {estado}
            </td>
            {simbolos.map((s) => (
              <td key={s}>{automato.transicoes[estado]?.[s]?.join(', ') || '—'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------- Módulo 3 ----------

function ModuloGramatica() {
  const [json, setJson] = useState(JSON.stringify(gramaticaExemplo, null, 2));
  const [cadeia, setCadeia] = useState('aaabbb');

  let gramatica: Gramatica | null = null;
  let erro = '';
  try {
    gramatica = parsearGramaticaJson(json);
  } catch (e) {
    erro = e instanceof Error ? e.message : 'JSON inválido';
  }

  const resultado = gramatica ? simularGramatica(gramatica, cadeia) : null;
  const linhaDerivacao = resultado?.passos.find((p) => p.startsWith('Derivação: ')) ?? '';
  const derivacao = linhaDerivacao ? linhaDerivacao.replace('Derivação: ', '').split(' => ') : [];
  const inicioArvore = resultado ? resultado.passos.indexOf('Árvore de derivação:') : -1;
  const arvore = resultado && inicioArvore >= 0 ? resultado.passos.slice(inicioArvore + 1, -1) : [];

  return (
    <Painel
      titulo="Módulo 3 — Gramática Livre de Contexto (GLC)"
      descricao="Defina variáveis, terminais, produções e símbolo inicial. O simulador procura a derivação mais à esquerda da cadeia e monta a árvore de derivação. Exemplo do enunciado: S → aSb | λ com a entrada aaabbb."
    >
      <Secao numero={1} titulo="Entrada">
        <div className="linha">
          <Campo rotulo="Cadeia de entrada" dica="Use λ para a cadeia vazia">
            <input value={cadeia} onChange={(e) => setCadeia(e.target.value)} />
          </Campo>
        </div>
        {gramatica && (
          <div className="cartao gramatica-formal">
            <h4>Gramática carregada</h4>
            <p>
              Variáveis: <code>{conjunto(gramatica.variaveis)}</code> · Terminais:{' '}
              <code>{conjunto(gramatica.terminais)}</code> · Símbolo inicial:{' '}
              <code>{gramatica.simboloInicial}</code>
            </p>
            {Object.entries(gramatica.producoes).map(([variavel, corpos]) => (
              <p key={variavel} className="producao">
                {variavel} → {corpos.join(' | ')}
              </p>
            ))}
          </div>
        )}
        <details className="editor">
          <summary>Editar JSON da gramática</summary>
          <textarea rows={9} value={json} onChange={(e) => setJson(e.target.value)} />
          <button onClick={() => setJson(JSON.stringify(gramaticaExemplo, null, 2))}>
            Restaurar exemplo do enunciado
          </button>
        </details>
        {erro && <p className="erro">{erro}</p>}
      </Secao>

      {gramatica && resultado && (
        <Secao numero={2} titulo="Resultado">
          <Veredito
            aceita={resultado.aceita}
            detalhe={
              resultado.aceita
                ? `A cadeia é gerada a partir de ${gramatica.simboloInicial}`
                : resultado.passos.length > 1
                  ? resultado.passos[0]
                  : 'Nenhuma derivação encontrada para a cadeia'
            }
          />
          {resultado.aceita && (
            <div className="cartoes">
              <div className="cartao">
                <h4>Derivação mais à esquerda (passo a passo)</h4>
                <ol className="derivacao">
                  {derivacao.map((forma, i) => (
                    <li key={i}>{i === 0 ? forma : `⇒ ${forma}`}</li>
                  ))}
                </ol>
              </div>
              <div className="cartao">
                <h4>Árvore de derivação simplificada</h4>
                <ArvoreDerivacao linhas={arvore} variaveis={gramatica.variaveis} />
              </div>
            </div>
          )}
          <LogTexto linhas={resultado.passos} />
        </Secao>
      )}
    </Painel>
  );
}

function ArvoreDerivacao(props: { linhas: string[]; variaveis: string[] }) {
  return (
    <div className="arvore">
      {props.linhas.map((linha, i) => {
        const simbolo = linha.trim();
        const nivel = (linha.length - linha.trimStart().length) / 2;
        const tipo = props.variaveis.includes(simbolo)
          ? 'no-variavel'
          : simbolo === VAZIO
            ? 'no-vazio'
            : 'no-terminal';
        return (
          <div key={i} style={{ paddingLeft: nivel * 22 }}>
            {nivel > 0 && <span className="ramo">└ </span>}
            <span className={tipo}>{simbolo}</span>
          </div>
        );
      })}
      <p className="legenda">azul = variável · verde = terminal · cinza = λ</p>
    </div>
  );
}

// ---------- Módulo 4 ----------

function parsearLinhaAP(linha: string) {
  const [leitura = '', estado = '', pilha = ''] = linha
    .split('|')
    .map((parte) => parte.slice(parte.indexOf(':') + 1).trim());
  return { leitura, estado, pilha };
}

function ModuloPilha() {
  const [cadeia, setCadeia] = useState('aabb');
  const [passo, setPasso] = useState(0);

  const simulacao = simularPilha(cadeia);
  const linhas = simulacao.passos.slice(0, -1).map(parsearLinhaAP);
  const indice = Math.min(passo, linhas.length - 1);
  const atual = linhas[indice] ?? { leitura: '-', estado: 'q0', pilha: VAZIO };
  const itensPilha = atual.pilha === VAZIO ? [] : Array.from(atual.pilha);
  const bloqueado = atual.estado === 'bloqueado';
  const legenda =
    indice === 0
      ? 'Configuração inicial'
      : `Leu "${atual.leitura}"${bloqueado ? ' — nenhuma transição possível' : ''}`;

  return (
    <Painel
      titulo="Módulo 4 — Autômato com Pilha (AP)"
      descricao="Reconhece L = { aⁿbⁿ | n ≥ 1 }: cada a lido empilha um A e cada b lido desempilha um A. A cadeia é aceita se terminar no estado q1 com a pilha vazia."
    >
      <Secao numero={1} titulo="Entrada">
        <div className="linha">
          <Campo rotulo="Cadeia de entrada" dica="Exemplos: ab, aabb, aaabbb">
            <input
              value={cadeia}
              onChange={(e) => {
                setCadeia(e.target.value);
                setPasso(0);
              }}
            />
          </Campo>
        </div>
      </Secao>

      <Secao numero={2} titulo="Visualização passo a passo">
        <CadeiaLida simbolos={paraSimbolos(cadeia)} lidos={indice} />
        <div className="ap-visual">
          <div className="info-passo">
            <span className="rotulo">Estado atual</span>
            <div className={`estado-no ${bloqueado ? 'bloqueado' : 'ativo'}`}>{atual.estado}</div>
          </div>
          <div className="info-passo">
            <span className="rotulo">Pilha</span>
            <small className="nota">topo</small>
            <div className="pilha-box">
              {itensPilha.length === 0 ? (
                <div className="pilha-vazia">vazia (λ)</div>
              ) : (
                itensPilha.map((s, i) => (
                  <div key={i} className="pilha-bloco">
                    {s}
                  </div>
                ))
              )}
            </div>
            <small className="nota">base</small>
          </div>
        </div>
        <ControlePassos
          indice={indice}
          total={linhas.length}
          legenda={legenda}
          aoMudar={setPasso}
        />
        <table className="tabela-passos">
          <thead>
            <tr>
              <th>Passo</th>
              <th>Leitura</th>
              <th>Estado</th>
              <th>Conteúdo da pilha (topo à esquerda)</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha, i) => (
              <tr
                key={i}
                className={`clicavel ${i === indice ? 'ativa' : ''}`}
                onClick={() => setPasso(i)}
              >
                <td>{i + 1}</td>
                <td>{linha.leitura}</td>
                <td>{linha.estado}</td>
                <td>{linha.pilha}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="legenda">Clique em uma linha da tabela para ir direto ao passo.</p>
      </Secao>

      <Secao numero={3} titulo="Resultado">
        <Veredito
          aceita={simulacao.aceita}
          detalhe={
            simulacao.aceita
              ? 'Terminou em q1 com a pilha vazia: a cadeia pertence a L'
              : 'A cadeia não pertence a L = { aⁿbⁿ | n ≥ 1 }'
          }
        />
      </Secao>
    </Painel>
  );
}

// ---------- Módulo 5 ----------

const LEGENDA_TURING = [
  ['q0', 'Percorre o primeiro número até encontrar o separador 1'],
  ['q1', 'Trocou o 1 por 0 e percorre o segundo número até o branco _'],
  ['q2', 'Voltou uma célula para apagar o último 0'],
  ['qf', 'Parada: a soma está escrita na fita'],
];

function ModuloTuring() {
  const [cadeia, setCadeia] = useState('000100');
  const [passo, setPasso] = useState(0);

  const simulacao = simularTuring(cadeia);
  const linhasFita = simulacao.passos.filter((p) => p.startsWith('Estado:'));
  const indice = Math.min(passo, linhasFita.length - 1);
  const linhaAtual = linhasFita[indice] ?? 'Estado: q0 | Fita: [_]';
  const estado = linhaAtual.split('|')[0]?.replace('Estado:', '').trim() ?? 'q0';
  const fitaBruta = linhaAtual.split('Fita:')[1]?.trim() ?? '[_]';
  const celulas = Array.from(fitaBruta.replace(/\[|\]/g, ''));
  const posCabeca = Math.max(0, fitaBruta.indexOf('['));
  const operandos = /^(0*)1(0*)$/.exec(cadeia);

  return (
    <Painel
      titulo="Módulo 5 — Máquina de Turing (Opção B: soma unária)"
      descricao="Soma dois números em representação unária: cada número é um bloco de 0 e os blocos são separados por 1. Exemplo do enunciado: 000100 (3 + 2) resulta em 00000 (5)."
    >
      <Secao numero={1} titulo="Entrada">
        <div className="linha">
          <Campo rotulo="Fita de entrada" dica="Use 0 para as unidades e 1 como separador">
            <input
              value={cadeia}
              onChange={(e) => {
                setCadeia(e.target.value);
                setPasso(0);
              }}
            />
          </Campo>
          <p className="nota">
            {operandos
              ? `Representa: ${operandos[1]!.length} + ${operandos[2]!.length}`
              : 'Formato esperado: 0...010...0'}
          </p>
        </div>
      </Secao>

      <Secao numero={2} titulo="Visualização passo a passo">
        <p>
          <span className="rotulo">Estado atual </span>
          <span className="estado-badge">{estado}</span>
        </p>
        <div className="fita-box">
          {celulas.map((simbolo, i) => (
            <div key={i} className={`fita-celula ${i === posCabeca ? 'ativa' : ''}`}>
              <div className="cabecote">{i === posCabeca ? '▼' : ''}</div>
              <div>{simbolo}</div>
            </div>
          ))}
        </div>
        <p className="legenda">▼ = posição do cabeçote · _ = célula em branco</p>
        <ControlePassos
          indice={indice}
          total={linhasFita.length}
          legenda={indice === 0 ? 'Configuração inicial' : `Estado ${estado}`}
          aoMudar={setPasso}
        />
        <ul className="lista-legenda">
          {LEGENDA_TURING.map(([q, texto]) => (
            <li key={q} className={q === estado ? 'ativo' : ''}>
              <span className="estado-badge pequeno">{q}</span> {texto}
            </li>
          ))}
        </ul>
      </Secao>

      <Secao numero={3} titulo="Resultado">
        <Veredito
          aceita={simulacao.aceita}
          detalhe={
            simulacao.aceita
              ? `Resultado na fita: ${simulacao.resultado} (= ${simulacao.resultado.length})`
              : 'Nenhuma transição definida para o símbolo lido: a entrada não está no formato esperado'
          }
        />
        <LogTexto linhas={simulacao.passos} />
      </Secao>
    </Painel>
  );
}

// ---------- Módulo 6 ----------

const NOMES_MODULOS: Record<string, string> = {
  M1: 'Módulo 1 — Linguagens Formais',
  M2: 'Módulo 2 — Autômato Finito',
  M3: 'Módulo 3 — Gramática Livre de Contexto',
  M4: 'Módulo 4 — Autômato com Pilha',
  M5: 'Módulo 5 — Máquina de Turing',
};

const VARIAVEIS_COMPLEXIDADE = [
  ['n', 'tamanho da cadeia de entrada'],
  ['|Σ|', 'tamanho do alfabeto'],
  ['k', 'tamanho máximo das cadeias geradas'],
  ['|u|, |v|', 'tamanhos das cadeias concatenadas'],
  ['|Q|', 'número de estados do autômato'],
  ['b', 'máximo de alternativas de uma variável'],
  ['d', 'profundidade da derivação'],
];

function Limite(props: { texto: string }) {
  const [notacao, observacao] = props.texto.split(' — ');
  return (
    <>
      <span className="notacao">{notacao}</span>
      {observacao && <small className="nota">{observacao}</small>}
    </>
  );
}

function ModuloComplexidade() {
  return (
    <Painel
      titulo="Módulo 6 — Complexidade Computacional"
      descricao="Análise assintótica dos algoritmos implementados nos módulos 1 a 5, com melhor caso (Ω), caso médio (Θ) e pior caso (O)."
    >
      <Secao numero={1} titulo="Legenda das variáveis">
        <div className="legenda-variaveis">
          {VARIAVEIS_COMPLEXIDADE.map(([simbolo, significado]) => (
            <span key={simbolo}>
              <code>{simbolo}</code> {significado}
            </span>
          ))}
        </div>
      </Secao>

      <Secao numero={2} titulo="Tabela de complexidade">
        <table>
          <thead>
            <tr>
              <th>Algoritmo</th>
              <th>Melhor caso (Ω)</th>
              <th>Caso médio (Θ)</th>
              <th>Pior caso (O)</th>
            </tr>
          </thead>
          <tbody>
            {TABELA_COMPLEXIDADE.map((item, i) => {
              const modulo = item.algoritmo.split(':')[0] ?? '';
              const anterior = TABELA_COMPLEXIDADE[i - 1]?.algoritmo.split(':')[0];
              return (
                <Fragment key={item.algoritmo}>
                  {modulo !== anterior && (
                    <tr className="grupo">
                      <td colSpan={4}>{NOMES_MODULOS[modulo] ?? modulo}</td>
                    </tr>
                  )}
                  <tr>
                    <td>{item.algoritmo.slice(item.algoritmo.indexOf(':') + 1).trim()}</td>
                    <td>
                      <Limite texto={item.melhor} />
                    </td>
                    <td>
                      <Limite texto={item.medio} />
                    </td>
                    <td>
                      <Limite texto={item.pior} />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Secao>
    </Painel>
  );
}
