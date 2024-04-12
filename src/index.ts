import './scss/styles.scss';


import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import {
  FieldsInput,
  IContactsForm,
  IOrderForm,
  PaymentMethods,
} from './types';

import { EventEmitter } from './components/base/events';

import { Basket } from './components/common/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';

import {
  AppState,
  CatalogChangeEvent,
  Product,
} from './components/AppData';
import { Card } from './components/Card';
import { Order } from './components/Order';
import { Page } from './components/Page';
import { ShopAPI } from './components/ShopAPI';

const events = new EventEmitter();
const api = new ShopAPI(CDN_URL, API_URL);

// Templates
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// AppData
const appData = new AppState({}, events);

// Global containers
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);

// Reusable interface
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const orderContacts = new Order(cloneTemplate(contactsTemplate), events);


// Get products from API
api
  .getProductList()
  .then(appData.setCatalog.bind(appData))
  .catch((err) => {
    console.error(err);
  });

// Catalog items changed
events.on<CatalogChangeEvent>('items:changed', () => {
  page.catalog = appData.catalog.map((item) => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:select', item),
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
    });
  });
});


// Open items in basket
events.on('basket:open', () => {
  modal.render({
    content: createElement<HTMLElement>('div', {}, [basket.render()]),
  });
});

events.on('basket:clear', () => {
  basket.items = [];
  appData.order.items = [];
  appData.order.total = 0;
  appData.basket = [];
  page.counter = 0;
  basket.total = 0;
  basket.selected = [];
  appData.order.payment = null;
  order.selected = '';
});


// Order form
events.on('order:submit', () => {
  events.emit('orderContacts:open');
});

events.on('contacts:submit', () => {
  api
    .orderProducts(appData.order)
    .then((result) => {
      const success = new Success(
        cloneTemplate(successTemplate),
        {
          onClick: () => {
            modal.close();
          },
        },
        result.total
      );
      events.emit('basket:clear');

      modal.render({
        content: success.render({}),
      });
    })
    .catch((err) => {
      console.error(err);
    });
});

events.on(
  'formErrors:change',
  (errors: Partial<IOrderForm & IContactsForm>) => {
    const { email, phone, address, payment } = errors;
    orderContacts.valid = !email && !phone;
    orderContacts.errors = Object.values({ phone, email })
      .filter((i) => !!i)
      .join('; ');
    order.valid = !address && !payment;
    order.errors = Object.values({ address, payment })
      .filter((i) => !!i)
      .join('; ');
  }
);

events.on('payment:change', (value: { name: PaymentMethods }) => {
  const { name } = value;
  appData.setOrderField('payment', name);
});

events.on(
  /^(order|contacts)\..*:change/,
  (data: { field: keyof FieldsInput; value: string }) => {
    if (data.field === 'address') {
      appData.setOrderField(data.field, data.value);
    } else {
      appData.setContactsField(data.field, data.value);
    }
  }
);

events.on('order:open', () => {
  modal.render({
    content: order.render({
      payment: null,
      address: '',
      valid: false,
      errors: [],
    }),
  });
});

events.on('orderContacts:open', () => {
  modal.render({
    content: orderContacts.render({
      phone: '',
      email: '',
      valid: false,
      errors: [],
    }),
  });
});

events.on('card:select', (item: Product) => {
  appData.setPreview(item);
});
events.on('preview:changed', (item: Product) => {
  const showItem = (item: Product) => {
    const existingItem = appData.basket.find(
      (product) => item.id === product.id
    );
    const card = new Card(cloneTemplate(cardPreviewTemplate), {
      onClick: () => {
        appData.addToBasket(item);
        events.emit('basket:update');
        page.counter = appData.basket.length;
        if (!existingItem) {
          modal.close();
        }
      },
    });
    card.inBasket = !!existingItem;
    modal.render({
      content: card.render({
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price,
      }),
    });
  };

  if (item) {
    api
      .getProductItem(item.id)
      .then((result) => {
        item.description = result.description;
        showItem(item);
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

events.on('basket:update', () => {
  basket.total = appData.getTotal();
  basket.items = appData.basket.map((item) => {
    const card = new Card(cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit('basket:remove', { itemId: item.id });
      },
    });

    return card.render({
      title: item.title,
      price: item.price,
    });
  });
  appData.order.items = appData.basket.map(({ id }) => id);
  appData.order.total = appData.basket.reduce(
    (acc, { price }) => price + acc,
    0
  );
  basket.selected = appData.basket;
});

events.on('basket:remove', (id: { itemId: string }) => {
  const index = appData.basket.findIndex((prod) => prod.id === id.itemId);
  if (index !== -1) {
    appData.basket.splice(index, 1);
    events.emit('basket:update');
    page.counter = appData.basket.length;
  } else {
    console.log('Элемент не найден в корзине.');
  }
});

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});