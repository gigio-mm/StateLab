import { ErroValidacao, type ProblemaValidacao } from './erros';

export type Resultado<T, E = readonly ProblemaValidacao[]> =
  { readonly sucesso: true; readonly valor: T } | { readonly sucesso: false; readonly erro: E };

export function sucesso<T>(valor: T): Resultado<T, never> {
  return { sucesso: true, valor };
}

export function falha<E>(erro: E): Resultado<never, E> {
  return { sucesso: false, erro };
}

export function desempacotar<T>(resultado: Resultado<T>): T {
  if (resultado.sucesso) return resultado.valor;
  throw new ErroValidacao(resultado.erro);
}
