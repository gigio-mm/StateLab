# Modelagem UML — StateLab

Diagramas UML atualizados refletindo a arquitetura enxuta em `src/`.

## 1. Casos de Uso (`casos-de-uso.mmd`)

```mermaid
flowchart LR
  Estudante(["Estudante / Usuário"])

  subgraph M1["Módulo 1: Linguagens Formais"]
    UC1["UC01: Definir Σ e L, validar cadeia, calcular |w|, u·v, Σ* e Σ+"]
  end

  subgraph M2["Módulo 2: Autômatos Finitos"]
    UC2["UC02: Carregar AFD/AFN por JSON e simular cadeia passo a passo"]
  end

  subgraph M3["Módulo 3: Gramática Livre de Contexto"]
    UC3["UC03: Carregar GLC e exibir derivação passo a passo e árvore"]
  end

  subgraph M4["Módulo 4: Autômato com Pilha"]
    UC4["UC04: Simular AP para aⁿbⁿ exibindo leitura, estado e pilha"]
  end

  subgraph M5["Módulo 5: Máquina de Turing"]
    UC5["UC05: Simular soma unária exibindo estado, fita e cabeçote"]
  end

  subgraph M6["Módulo 6: Complexidade"]
    UC6["UC06: Exibir tabela O, Ω e Θ (melhor, médio e pior caso)"]
  end

  Estudante --> UC1
  Estudante --> UC2
  Estudante --> UC3
  Estudante --> UC4
  Estudante --> UC5
  Estudante --> UC6
```

## 2. Diagrama de Módulos e Tipos (`classes.mmd`)

```mermaid
classDiagram
  direction TB

  class ResultadoSimulacao {
    +aceita: boolean
    +passos: string[]
  }

  class ModuloLinguagens {
    <<src/linguagens.ts>>
    +tamanhoCadeia(cadeia: string) number
    +validarCadeia(alfabeto: string[], cadeia: string) boolean
    +pertenceLinguagem(linguagem: string[], cadeia: string) boolean
    +concatenar(u: string, v: string) string
    +gerarFechoPositivo(alfabeto: string[], ateTamanho: number) string[]
    +gerarEstrelaKleene(alfabeto: string[], ateTamanho: number) string[]
    +analisarCadeia(alfabeto: string[], cadeia: string, linguagem?: string[]) ResultadoSimulacao
  }

  class Automato {
    <<src/automato.ts>>
    +estados: string[]
    +alfabeto: string[]
    +estadoInicial: string
    +estadosFinais: string[]
    +transicoes: Record~string, Record~string, string[]~~
    +carregarAutomatoJson(caminho: string) Automato
    +simularAutomato(automato: Automato, cadeia: string) ResultadoSimulacao
  }

  class Gramatica {
    <<src/gramatica.ts>>
    +variaveis: string[]
    +terminais: string[]
    +simboloInicial: string
    +producoes: Record~string, string[]~
    +carregarGramaticaJson(caminho: string) Gramatica
    +simularGramatica(gramatica: Gramatica, cadeia: string) ResultadoSimulacao
  }

  class ModuloPilha {
    <<src/pilha.ts>>
    +empilhar(pilha: string[], simbolo: string) void
    +desempilhar(pilha: string[]) string
    +simularPilha(cadeia: string) ResultadoSimulacao
  }

  class ModuloTuring {
    <<src/turing.ts>>
    +simularTuring(cadeia: string) ResultadoSimulacao
  }

  class ModuloComplexidade {
    <<src/complexidade.ts>>
    +TABELA_COMPLEXIDADE: ItemComplexidade[]
    +exibirTabelaComplexidade() void
  }

  class MenuCLI {
    <<src/cli.ts>>
    +iniciarMenu() Promise~void~
  }

  MenuCLI --> ModuloLinguagens
  MenuCLI --> Automato
  MenuCLI --> Gramatica
  MenuCLI --> ModuloPilha
  MenuCLI --> ModuloTuring
  MenuCLI --> ModuloComplexidade
  ModuloLinguagens ..> ResultadoSimulacao
  Automato ..> ResultadoSimulacao
  Gramatica ..> ResultadoSimulacao
  ModuloPilha ..> ResultadoSimulacao
  ModuloTuring ..> ResultadoSimulacao
```

## 3. Diagrama de Sequência (`sequencia.mmd`)

```mermaid
sequenceDiagram
  autonumber
  actor Usuario as Usuário
  participant CLI as Menu Console (src/cli.ts)
  participant Modulo as Simulador do Módulo (src/*.ts)

  Usuario->>CLI: Escolhe opção (1 a 6) e informa cadeia de entrada
  CLI->>Modulo: Executa função do módulo (ex.: simularAutomato / simularGramatica)
  Modulo->>Modulo: Valida entrada e processa passo a passo
  Modulo-->>CLI: Retorna { aceita: boolean, passos: string[] }
  CLI-->>Usuario: Imprime os passos e o resultado final no console
```
