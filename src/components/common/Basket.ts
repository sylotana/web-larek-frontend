import { Component } from '../base/Component';
import { createElement, ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';
import { Product } from '../AppData';

interface IBasket {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export class Basket extends Component<IBasket> {
  protected _list: HTMLUListElement;
  protected _total: HTMLSpanElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this._total = this.container.querySelector('.basket__price');
    this._button = this.container.querySelector('.basket__button');
    this.setDisabled(this._button, true);

    if (this._button) {
      this._button.addEventListener('click', () => {
        events.emit('order:open');
      });
    }

    this.items = [];
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      items.forEach((item, index) => {
        const numbering = item.querySelector('.basket__item-index');
        numbering.textContent = `${index + 1}`;
      });
      this._list.replaceChildren(...items);
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        })
      );
    }
  }

  set selected(items: Product[]) {
    if (items.length) {
      this.setDisabled(this._button, false);
    } else {
      this.setDisabled(this._button, true);
    }
  }

  set total(value: number) {
    this.setText(this._total, `${value} синапсисов`);
  }
}