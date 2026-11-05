export interface ProblemaValidacao {
  readonly caminho: string;
  readonly mensagem: string;
}

export function problema(mensagem: string, caminho = ''): ProblemaValidacao {
  return { caminho, mensagem };
}

export function formatarProblema({ caminho, mensagem }: ProblemaValidacao): string {
  return caminho ? `${caminho}: ${mensagem}` : mensagem;
}

export class ErroValidacao extends Error {
  readonly problemas: readonly ProblemaValidacao[];

  constructor(problemas: readonly ProblemaValidacao[], titulo = 'Definição inválida') {
    super([titulo, ...problemas.map((item) => `  - ${formatarProblema(item)}`)].join('\n'));
    this.name = 'ErroValidacao';
    this.problemas = problemas;
  }
}
