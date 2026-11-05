import { useState } from 'react';
import afdExemplo from '../../exemplos/afd.json';
import afnExemplo from '../../exemplos/afn.json';
import gramaticaExemplo from '../../exemplos/gramatica.json';
import { analisarCadeia, concatenar, gerarEstrelaKleene, gerarFechoPositivo } from '../linguagens';
import { type Automato, parsearAutomatoJson, simularAutomato } from '../automato';
import { parsearGramaticaJson, simularGramatica } from '../gramatica';
import { simularPilha } from '../pilha';
import { simularTuring } from '../turing';
import { TABELA_COMPLEXIDADE } from '../complexidade';

export function App() {
  const [aba, setAba] = useState(1);

  // Módulo 1
  const [sigma, setSigma] = useState('a,b');
  const [linguagem, setLinguagem] = useState('ab,abba');
  const [cadeiaM1, setCadeiaM1] = useState('abba');
  const [outraM1, setOutraM1] = useState('ba');
  const [limiteK, setLimiteK] = useState(2);

  // Módulo 2
  const [jsonAutomato, setJsonAutomato] = useState(JSON.stringify(afdExemplo, null, 2));
  const [cadeiaM2, setCadeiaM2] = useState('ab');
  const [passoM2, setPassoM2] = useState(0);

  // Módulo 3
  const [jsonGramatica, setJsonGramatica] = useState(JSON.stringify(gramaticaExemplo, null, 2));
  const [cadeiaM3, setCadeiaM3] = useState('aaabbb');

  // Módulo 4
  const [cadeiaM4, setCadeiaM4] = useState('aabb');
  const [passoM4, setPassoM4] = useState(0);

  // Módulo 5
  const [cadeiaM5, setCadeiaM5] = useState('000100');
  const [passoM5, setPassoM5] = useState(0);

  return (
    <div className="container">
      <header className="topo">
        <h1>StateLab — Simulador de Teoria da Computação</h1>
        <nav className="abas">
          {[
            [1, '1. Linguagens'],
            [2, '2. Autômato (AFD/AFN)'],
            [3, '3. Gramática (GLC)'],
            [4, '4. Pilha (AP)'],
            [5, '5. Máquina de Turing'],
            [6, '6. Complexidade'],
          ].map(([id, titulo]) => (
            <button
              key={id}
              className={aba === id ? 'aba ativa' : 'aba'}
              onClick={() => setAba(Number(id))}
            >
              {titulo}
            </button>
          ))}
        </nav>
      </header>

      {aba === 1 &&
        renderLinguagens(
          sigma,
          setSigma,
          linguagem,
          setLinguagem,
          cadeiaM1,
          setCadeiaM1,
          outraM1,
          setOutraM1,
          limiteK,
          setLimiteK,
        )}
      {aba === 2 &&
        renderAutomato(jsonAutomato, setJsonAutomato, cadeiaM2, setCadeiaM2, passoM2, setPassoM2)}
      {aba === 3 && renderGramatica(jsonGramatica, setJsonGramatica, cadeiaM3, setCadeiaM3)}
      {aba === 4 && renderPilha(cadeiaM4, setCadeiaM4, passoM4, setPassoM4)}
      {aba === 5 && renderTuring(cadeiaM5, setCadeiaM5, passoM5, setPassoM5)}
      {aba === 6 && renderComplexidade()}
    </div>
  );
}

function renderLinguagens(
  sigma: string,
  setSigma: (v: string) => void,
  linguagem: string,
  setLinguagem: (v: string) => void,
  cadeia: string,
  setCadeia: (v: string) => void,
  outra: string,
  setOutra: (v: string) => void,
  limite: number,
  setLimite: (v: number) => void,
) {
  const listaSigma = sigma
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const listaL = linguagem
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const analise = analisarCadeia(listaSigma, cadeia, listaL);

  return (
    <section className="painel">
      <h2>Módulo 1 — Linguagens Formais</h2>
      <div className="grade-campos">
        <label>
          Alfabeto Σ: <input value={sigma} onChange={(e) => setSigma(e.target.value)} />
        </label>
        <label>
          Linguagem L: <input value={linguagem} onChange={(e) => setLinguagem(e.target.value)} />
        </label>
        <label>
          Cadeia w: <input value={cadeia} onChange={(e) => setCadeia(e.target.value)} />
        </label>
        <label>
          Cadeia v (concatenar): <input value={outra} onChange={(e) => setOutra(e.target.value)} />
        </label>
        <label>
          Limite k (Σ* / Σ+):{' '}
          <input
            type="number"
            min={0}
            max={5}
            value={limite}
            onChange={(e) => setLimite(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="resultado">
        {analise.passos.map((p, i) => (
          <p key={i}>
            <strong>{p}</strong>
          </p>
        ))}
        <p>
          Concatenação (w · v): <code>{concatenar(cadeia, outra)}</code>
        </p>
        <p>
          Σ* (até {limite}): <code>{gerarEstrelaKleene(listaSigma, limite).join(', ')}</code>
        </p>
        <p>
          Σ+ (até {limite}): <code>{gerarFechoPositivo(listaSigma, limite).join(', ')}</code>
        </p>
      </div>
    </section>
  );
}

function renderAutomato(
  json: string,
  setJson: (v: string) => void,
  cadeia: string,
  setCadeia: (v: string) => void,
  passo: number,
  setPasso: (v: number) => void,
) {
  let automato: Automato | null = null;
  let erro = '';
  try {
    automato = parsearAutomatoJson(json);
  } catch (e) {
    erro = e instanceof Error ? e.message : 'JSON inválido';
  }

  const simulacao = automato ? simularAutomato(automato, cadeia) : null;
  const etapas = simulacao ? simulacao.passos[0]!.split(' -> ') : [];
  const indice = Math.min(passo, Math.max(0, etapas.length - 1));
  const textoAtivo = etapas[indice] ?? '';
  const ativos = textoAtivo.replace(/^\{|\}$/g, '').split(',');

  return (
    <section className="painel">
      <h2>Módulo 2 — Simulador de Autômato Finito (AFD / AFN)</h2>
      <div className="controles">
        <button
          onClick={() => {
            setJson(JSON.stringify(afdExemplo, null, 2));
            setPasso(0);
          }}
        >
          Carregar AFD
        </button>
        <button
          onClick={() => {
            setJson(JSON.stringify(afnExemplo, null, 2));
            setPasso(0);
          }}
        >
          Carregar AFN
        </button>
        <label>
          Cadeia:{' '}
          <input
            value={cadeia}
            onChange={(e) => {
              setCadeia(e.target.value);
              setPasso(0);
            }}
          />
        </label>
      </div>
      <textarea
        rows={7}
        value={json}
        onChange={(e) => {
          setJson(e.target.value);
          setPasso(0);
        }}
      />
      {erro && <p className="erro">{erro}</p>}

      {automato && simulacao && (
        <>
          <div className="controles">
            <button disabled={indice <= 0} onClick={() => setPasso(indice - 1)}>
              ◀ Passo Anterior
            </button>
            <span>
              Passo {indice + 1} de {etapas.length} ({textoAtivo})
            </span>
            <button disabled={indice >= etapas.length - 1} onClick={() => setPasso(indice + 1)}>
              Próximo Passo ▶
            </button>
          </div>
          <div className="estados-box">
            {automato.estados.map((est) => {
              const ehFinal = automato.estadosFinais.includes(est);
              const ehAtivo = ativos.includes(est);
              return (
                <div
                  key={est}
                  className={`estado-no ${ehFinal ? 'final' : ''} ${ehAtivo ? 'ativo' : ''}`}
                >
                  {automato.estadoInicial === est ? `→ ${est}` : est}
                </div>
              );
            })}
          </div>
          <pre className="resultado">{simulacao.passos.join('\n')}</pre>
        </>
      )}
    </section>
  );
}

function renderGramatica(
  json: string,
  setJson: (v: string) => void,
  cadeia: string,
  setCadeia: (v: string) => void,
) {
  let saida: string[] = [];
  try {
    const glc = parsearGramaticaJson(json);
    saida = simularGramatica(glc, cadeia).passos;
  } catch (e) {
    saida = [e instanceof Error ? e.message : 'JSON inválido'];
  }

  return (
    <section className="painel">
      <h2>Módulo 3 — Gramática Livre de Contexto (GLC)</h2>
      <label>
        Cadeia: <input value={cadeia} onChange={(e) => setCadeia(e.target.value)} />
      </label>
      <textarea rows={6} value={json} onChange={(e) => setJson(e.target.value)} />
      <pre className="resultado">{saida.join('\n')}</pre>
    </section>
  );
}

function renderPilha(
  cadeia: string,
  setCadeia: (v: string) => void,
  passo: number,
  setPasso: (v: number) => void,
) {
  const simulacao = simularPilha(cadeia);
  const linhas = simulacao.passos.slice(0, -1);
  const indice = Math.min(passo, Math.max(0, linhas.length - 1));
  const partes = (linhas[indice] ?? '').split('|').map((s) => s.split(':')[1]?.trim() ?? '');
  const [leitura = '-', estado = 'q0', pilhaTexto = 'λ'] = partes;
  const itensPilha = pilhaTexto === 'λ' ? [] : Array.from(pilhaTexto);

  return (
    <section className="painel">
      <h2>Módulo 4 — Autômato com Pilha (L = &#123; aⁿbⁿ | n ≥ 1 &#125;)</h2>
      <div className="controles">
        <label>
          Cadeia:{' '}
          <input
            value={cadeia}
            onChange={(e) => {
              setCadeia(e.target.value);
              setPasso(0);
            }}
          />
        </label>
        <button disabled={indice <= 0} onClick={() => setPasso(indice - 1)}>
          ◀ Passo Anterior
        </button>
        <span>
          Passo {indice + 1} de {linhas.length}
        </span>
        <button disabled={indice >= linhas.length - 1} onClick={() => setPasso(indice + 1)}>
          Próximo Passo ▶
        </button>
      </div>
      <div className="ap-visual">
        <div>
          <p>
            Leitura atual: <strong>{leitura}</strong>
          </p>
          <div className="estado-no ativo">{estado}</div>
        </div>
        <div className="pilha-box">
          <span className="pilha-titulo">Topo da Pilha</span>
          {itensPilha.length === 0 ? (
            <div className="pilha-vazia">λ (vazia)</div>
          ) : (
            itensPilha.map((s, i) => (
              <div key={i} className="pilha-bloco">
                {s}
              </div>
            ))
          )}
        </div>
      </div>
      <pre className="resultado">{simulacao.passos.join('\n')}</pre>
    </section>
  );
}

function renderTuring(
  cadeia: string,
  setCadeia: (v: string) => void,
  passo: number,
  setPasso: (v: number) => void,
) {
  const simulacao = simularTuring(cadeia);
  const linhasFita = simulacao.passos.filter((p) => p.startsWith('Estado:'));
  const indice = Math.min(passo, Math.max(0, linhasFita.length - 1));
  const linhaAtual = linhasFita[indice] ?? 'Estado: q0 | Fita: [_]';
  const estado = linhaAtual.split('|')[0]?.replace('Estado:', '').trim() ?? 'q0';
  const fitaBruta = linhaAtual.split('Fita:')[1]?.trim() ?? '[_]';
  const celulas = Array.from(fitaBruta.replace(/\[|\]/g, ''));
  const posCabeca = Math.max(0, fitaBruta.indexOf('['));

  return (
    <section className="painel">
      <h2>Módulo 5 — Máquina de Turing (Soma Unária)</h2>
      <div className="controles">
        <label>
          Fita de entrada:{' '}
          <input
            value={cadeia}
            onChange={(e) => {
              setCadeia(e.target.value);
              setPasso(0);
            }}
          />
        </label>
        <button disabled={indice <= 0} onClick={() => setPasso(indice - 1)}>
          ◀ Passo Anterior
        </button>
        <span>
          Passo {indice + 1} de {linhasFita.length} (Estado: {estado})
        </span>
        <button disabled={indice >= linhasFita.length - 1} onClick={() => setPasso(indice + 1)}>
          Próximo Passo ▶
        </button>
      </div>
      <div className="fita-box">
        {celulas.map((simbolo, i) => (
          <div key={i} className={`fita-celula ${i === posCabeca ? 'ativa' : ''}`}>
            <div className="cabecote">{i === posCabeca ? '▼' : ''}</div>
            <div>{simbolo}</div>
          </div>
        ))}
      </div>
      <pre className="resultado">{simulacao.passos.join('\n')}</pre>
    </section>
  );
}

function renderComplexidade() {
  return (
    <section className="painel">
      <h2>Módulo 6 — Complexidade Computacional</h2>
      <table>
        <thead>
          <tr>
            <th>Algoritmo</th>
            <th>Melhor Caso</th>
            <th>Caso Médio</th>
            <th>Pior Caso</th>
          </tr>
        </thead>
        <tbody>
          {TABELA_COMPLEXIDADE.map((item) => (
            <tr key={item.algoritmo}>
              <td>{item.algoritmo}</td>
              <td>{item.melhor}</td>
              <td>{item.medio}</td>
              <td>{item.pior}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
