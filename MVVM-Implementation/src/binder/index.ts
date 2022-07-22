import type ViewModel from '../view-model';

import Parser from './Parser/';

interface BinderSource {
  el: string;
}

export default class Binder {
  private $el: HTMLElement;

  private $parser: Parser;

  constructor(props: BinderSource) {
    this.$el = document.querySelector(props.el)
      ?? document.body;

    this.$parser = new Parser(this.$el);
  }

  public bind(viewModel: ViewModel) {
    viewModel.subscribe(this);
    this.$parser.parse(viewModel);
  }

  public update(viewModel: ViewModel) {
    this.$parser.parse(viewModel);
  }
}
