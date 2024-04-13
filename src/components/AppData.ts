import { Model } from './base/Model';
import {
  IProduct,
  IOrder,
  IOrderForm,
  FormErrors,
  IAppState,
  IContactsForm,
} from '../types';

export type CatalogChangeEvent = {
  catalog: IProduct[];
};

export class AppState extends Model<IAppState> {
  basket: IProduct[] = [];
  catalog: IProduct[];
  loading: boolean;
  order: IOrder = {
    phone: '',
    address: '',
    email: '',
    payment: null,
    items: [],
    total: 0,
  };
  preview: string | null;
  formErrors: FormErrors = {};

  getTotal(): number {
    const total = this.basket.reduce((acc, item) => acc + item.price, 0);
    return total;
  }

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('preview:changed', item);
  }

  getProduct(): IProduct[] {
    return this.catalog;
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    if (field === 'payment' && (value === 'card' || value === 'cash')) {
      this.order[field] = value;
    } else if (field !== 'payment') {
      this.order[field] = value;
    }

    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  setContactsField(field: keyof IContactsForm, value: string) {
    this.order[field] = value;
    if (this.validateContacts()) {
      this.events.emit('order:ready', this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};

    if (this.order.payment === null) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors;
    this.events.emit('formErrors:change', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  addToBasket(product: IProduct) {
    const existingItem = this.basket.find((item) => item.id === product.id);
    if (existingItem) {
      this.events.emit('basket:open');
    } else {
      this.basket.push(product);
      const totalPrice = this.getTotal();
      const eventData = { totalPrice: totalPrice, unit: 'синапсов' };
      this.events.emit('basket:totalChanged', eventData);
    }
  }
}