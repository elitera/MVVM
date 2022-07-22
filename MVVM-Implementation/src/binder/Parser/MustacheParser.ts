import type { ViewModelSource } from '../../view-model';

export const MUSTACHE_REGEX = /{{\s?([^}]*)\s?}}/g;
export const MUSTACHE_INNER_VALUE_REGEX = /[^{\{]+(?=}\})/g;

export default class MustacheParser {
  public static parse(
    _data: ViewModelSource['data'],
    textContent: string
  ) {
    const parsedTextContent = textContent.replace(MUSTACHE_REGEX, val => {
      const [expression] = val.match(MUSTACHE_INNER_VALUE_REGEX);
      const executedExpression = eval(`_data.${expression.trim()}`);

      return executedExpression;
    });

    return parsedTextContent;
  }
}
