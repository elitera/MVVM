import { InputableElement } from '../../types';

import type ViewModel from '../../view-model';
import type { ViewModelSource } from '../../view-model';

import { NODE_TYPE, checkIsInputable } from '../../utils';

import MustacheParser, { MUSTACHE_REGEX } from './MustacheParser';

interface ParseCommonParams {
  clonedEl: HTMLElement;
  renderedEl: HTMLElement;
}

interface ParseDocumentParams extends ParseCommonParams {
  viewModel: ViewModel;
}

interface ParseMustacheParams extends ParseCommonParams {
  data: ViewModelSource['data'];
}

interface ParseAttributesParams extends ParseCommonParams {
  viewModel: ViewModel;
  data: ViewModelSource['data'];
}

interface ParseDataBindAttributeParams extends ParseAttributesParams {
  attributeValue: string;
}

interface ParseEventAttributeParams extends Omit<ParseAttributesParams, 'data'> {
  attributeName: string;
  attributeValue: string;
}

export default class Parser {
  private $el: HTMLElement;
  private $clonedDocument: DocumentFragment;

  constructor(el: HTMLElement) {
    this.$el = el;
    this.$clonedDocument = this.cloneDocument();
  }

  public parse(viewModel: ViewModel) {
    const isInitialRendering = !this.$el.hasChildNodes();

    if (isInitialRendering) {
      const parsedDocument = this.parseDocument({
        clonedEl: this.$clonedDocument.cloneNode(true) as HTMLElement,
        renderedEl: null,
        viewModel
      });

      this.$el.appendChild(parsedDocument);
    } else {
      this.parseDocument({
        clonedEl: this.$clonedDocument.cloneNode(true) as HTMLElement,
        renderedEl: this.$el,
        viewModel
      });
    }
  }

  private parseDocument(params: ParseDocumentParams) {
    const $clonedEl = params.clonedEl;

    switch ($clonedEl.nodeType) {
      case NODE_TYPE.TEXT_NODE: {
        this.parseMustache({
          ...params,
          data: params.viewModel.data
        });

        return;
      };
      case NODE_TYPE.ELEMENT_NODE: {
        this.parseAttributes({
          ...params,
          data: params.viewModel.data
        });

        break;
      };
    }

    const childNodesOfRenderedEl = params.renderedEl?.childNodes;

    $clonedEl.childNodes.forEach((clonedChildNode: HTMLElement, idx: number) => {
      this.parseDocument({
        clonedEl: clonedChildNode,
        renderedEl: childNodesOfRenderedEl
          ? childNodesOfRenderedEl[idx] as HTMLElement
          : null,
        viewModel: params.viewModel
      });
    });

    return $clonedEl;
  }

  private parseMustache(params: ParseMustacheParams) {
    const {
      clonedEl,
      renderedEl,
      data
    } = params;

    const trimmedTextContent = clonedEl.textContent.trim();

    if (!trimmedTextContent) {
      return '';
    }

    const hasMustacheSyntax = MUSTACHE_REGEX.test(trimmedTextContent);

    if (!hasMustacheSyntax) {
      return;
    }

    try {
      const parsedTextContent = MustacheParser.parse(
        data,
        trimmedTextContent
      );

      const targetEl = renderedEl ?? clonedEl;

      targetEl.textContent = parsedTextContent;
    } catch(e) {
      return;
    }
  }

  private parseAttributes(params: ParseAttributesParams) {
    const elAttributes = Array.from(params.clonedEl.attributes);

    elAttributes.forEach(attribute => {
      const { name: attributeName, value: attributeValue } = attribute;

      if (attributeName === 'data-bind') {
        this.parseDataBindAttribute({
          ...params,
          attributeValue
        });
      }

      if (attributeName.startsWith('@')) {
        this.parseEventAttribute({
          ...params,
          attributeName,
          attributeValue
        });
      }
    });
  }

  private parseDataBindAttribute(params: ParseDataBindAttributeParams) {
    const {
      clonedEl,
      renderedEl,
      data,
      attributeValue,
      viewModel
    } = params;

    if (!checkIsInputable(clonedEl.tagName)) {
      return;
    }

    const inputableElement = (renderedEl ?? clonedEl) as InputableElement;

    const value = data[attributeValue] ?? '';

    inputableElement.value = value;

    // Initial Rendering
    if (!renderedEl) {
      inputableElement.oninput = ({ target }) => {
        viewModel.setData({
          [attributeValue]: (target as InputableElement).value
        });
      };
    }
  }

  private parseEventAttribute(params: ParseEventAttributeParams) {
    const {
      clonedEl,
      renderedEl,
      attributeName,
      attributeValue,
      viewModel
    } = params;

    const [, eventType] = attributeName.split('@');
    const fn = viewModel.options?.methods[attributeValue];

    // Initial Rendering
    if (eventType && fn && !renderedEl) {
      clonedEl.addEventListener(eventType, fn.bind(viewModel));
    }
  }

  private cloneDocument() {
    const clonedDocument = document.createDocumentFragment();
    let childNode;
    
    while (childNode = this.$el.firstChild) {
      clonedDocument.appendChild(childNode);
    }

    return clonedDocument;
  }
}
