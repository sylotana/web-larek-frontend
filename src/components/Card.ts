import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  category?: string;
  title: string;
  image?: string;
  price: number | null;
  description?: string;
  button?: string;
}

export class Card extends Component<ICard> {
  protected _category?: HTMLSpanElement;
  protected _title: HTMLHeadingElement;
  protected _image?: HTMLImageElement;
  protected _price: HTMLSpanElement;
  protected _description?: HTMLParagraphElement;
  protected _button?: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._category = container.querySelector(`.card__category`);
    this._title = ensureElement<HTMLHeadingElement>(`.card__title`, container);
    this._image = container.querySelector(`.card__image`);
    this._price = ensureElement<HTMLSpanElement>(`.card__price`, container);
    this._description = container.querySelector(`.card__text`);
    this._button = container.querySelector(`.card__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || '';
  }

  set description(value: string | string[]) {
    this.setText(this._description, value);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set price(value: string) {
    if (value === null) {
      this.setText(this._price, 'Бесценно');
      this._button?.setAttribute('disabled', 'disabled');
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  get price(): string {
    return this._price.textContent;
  }

  set category(value: string) {
    this.setText(this._category, value);
  }

  get category(): string {
    return this._category.textContent || '';
  }

  set inBasket(value: boolean) {
    if (this._button) {
      if (value) {
        this._button.innerText = 'Перейти в корзину';
      } else {
        this._button.innerText = 'Добавить в корзину';
      }
    }
  }
}