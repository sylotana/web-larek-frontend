# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Проект построен с учетом MVP подхода.

### Слой модели данных

Модель данных предназначена для работы с бизнес-логикой приложения.

Слой реализован с помощью следующих классов:

- Класс, который реализуют основную работу с данными приложения:
  - работа с товарами добавленными в корзину 
  - получение товаров
  - установка полей формы и валидация форм 
---

### Слой коммуникации

Данный слой служит связующим звеном в приложении.
Он позволяет получать информацию из API приложения.

Слой реализован с помощью следующих классов:

- Класс, реализующий возможность обращения к API приложения
---

### Слой представления

Слоя представления необходим для отрисовки интерфейса,
с помощью которого пользователь будет взаимодействовать с приложеним.

Слой реализован с помощью следующих классов:

- Класс для отрисовки карточки товара
- Класс для работы с корзиной товаров
- Класс для работы с модальными окнами
- Класс, реализующий форму
- Класс для управления данными внутри формы заказа
- Класс, отрисовывающий главную страницу
- Класс успешного оформления заказа
---

## Описание данных
```typescript
// Интерфейс продукта
export interface IProduct {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price: number | null;
  category?: string;
}

// Интерфейс состояния приложения
export interface IAppState {
  catalog: IProduct[];
  basket: string[];
  preview: string | null;
  order: IOrder | null;
}

// Интерфейс формы заказа
export interface IOrderForm {
  payment: PaymentMethods;
  address: string;
}

// Интерфейс формы контактной информации
export interface IContactsForm {
  email: string;
  phone: string;
}

// Интерфейс заказа
export interface IOrder extends IOrderForm, IContactsForm {
  items: string[];
  total: number;
}

// Интерфейс резульатат заказа
export interface IOrderResult {
  id: string;
  total: number;
}

// Тип способа оплаты
export type PaymentMethods = 'card' | 'cash';

// Тип полей формы
export type FieldsInput = Pick<IOrderForm, 'address'> & IContactsForm;

// Тип ошибки формы
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Компоненты модели данных

### Абстрактный класс Model
Базовая модель, которая позволяет на своей основе создавать новые модели

Конструктор принимает такие аргументы:
1. `data: Partial<T>` — данные
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `emitChanges(event: string, payload?: object)` — сообщить всем, что модель поменялась. Принимает следущие параметры: `event: string` — отслеживаемое событие; `payload?: object` — используемый объект
---

### Класс AppState
Класс для управления состоянием приложения. Наследуется от абстрактного класса Model.

Класс имеет такие методы:
- `getTotal(): number` — возвращает общую стоимость товаров в корзине
- `setCatalog(items: IProduct[])` — установить каталог товаров
В качестве параметра `items: IProduct[]` принимает список товаров
- `setPreview(item: IProduct)` — устанавливает превью для товара. Принимает параметр `item:  IProduct` — объект продукта
- `getProduct(): IProduct[]` — возвращает список товаров
- `setOrderField(field: keyof IOrderForm, value: string)` — установить поля формы заказа. Принимает следующие параметры: `field: keyof IOrderForm` — поле формы заказа; `value: string` — значение поля
- `setContactsField(field: keyof IContactsForm, value: string)` — установить поля формы контактов. Принимает следующием параметры: `field: keyof IContactsForm` — поле контактной информации; `value: string` — значение поля
- `validateOrder()` — валидация формы заказа
- `validateContacts()` — валидация формы контактных данных
- `addToBasket(product: IProduct)` — добавление в корзину. Принимает параметр `product: IProduct` — товар, добавляемый в корзину
---

## Слой коммуникации

### Класс ShopAPI
Класс расширяющий Api. Используется для работы с API приложения. Наследуется от абстрактного класса Api.

Конструктор принимает такие аргументы:
1. `cdn: string` — ссылка на ресурсы
1. `baseUrl: string` — ссылка для доступа к API
1. `options?: RequestInit` — параметры запроса

Класс имеет такие методы:
- `getProductItem(id: string): Promise<IProduct>` — получить информацию об одном продукте. В качестве параметра принимает `id: string` — идентификатор продукта
- `getProductList(): Promise<IProduct[]>` — получить список продуктов
- `orderProducts(order: IOrderForm): Promise<IOrderResult>` — оформить заказ. Принимает параметр `order: IOrderForm` — форма заказа
---

## Слой представления

### Абстрактный класс Component
Абстрактный класс, являющийся основой для всех компонентов в проекте. Он предоставляет основные методы для работы с элементами DOM.

Конструктор принимает такие аргументы:
1. `protected readonly container: HTMLElement` — DOM-элемент, в котором будет размещен компонент

Класс имеет такие методы:
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` — переключить класс
- `protected setText(element: HTMLElement, value: unknown)` — установить текстовое содержимое
- `setDisabled(element: HTMLElement, state: boolean)` — сменить статус блокировки
- `protected setHidden(element: HTMLElement)` — скрыть элемент
- `protected setVisible(element: HTMLElement)` — показать элемент
- `protected setImage(element: HTMLImageElement, src: string, alt?: string)` — установить изображение с алтернативным текстом
- `render(data?: Partial<T>): HTMLElement` — вернуть корневой DOM-элемент
---

### Класс Basket
Класс, отвечающий за работу с корзиной. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер корзины
1. `protected events: EventEmitter` — события

Класс имеет такие методы:
- `set items(items: HTMLElement[])` — список товаров в корзине. В качестве параметра принимает `items: HTMLElement[]` — список DOM-элементов 
- `set selected(items: IProduct[])` — блокирует кнопку оформления заказа, в зависимости от наличия товаров в корзине. Принимает параметр `items: IProduct[]` — список добавленных товаров в корзину
- `set total(value: number)` — итоговая стоимость товаров. Параметр `total: number` — итоговая сумма заказа
---

### Класс Form
Класс, отвечающий за работу с формой заказа. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLFormElement` — контейнер формы
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `set valid(value: boolean)` — состояние валидности формы
- `set errors(value: string)` — текст ошибки формы
- `protected onInputChange(field: keyof T, value: string)` — событие изменения поля ввода
- `render(state: Partial<T> & IFormState)` — вернуть корневой DOM-элемент
---

### Класс Modal
Класс, отвечающий за работу с модальными окнами. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер модального окна
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `set content(value: HTMLElement)` — контент в модальном окне
- `open()` — открытие модального окна
- `order()` — событие открытия заказа
- `orderContacts()` — событие открытия контактов
- `close()` — закрытие модального окна
- `render(data: IModalData): HTMLElement` — вернуть корневой DOM-элемент
---

### Класс Success
Класс, отвечающий за отображение успешного оформления заказа. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер успешного заказа
1. `actions: ISuccessActions` — события
1. `total: number` — итоговая стоимость товаров
---

### Класс Card
Класс для создания карточки товара. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер карточки товара
1. `actions?: ICardActions` — события

Класс имеет такие методы:
- `set id(value: string)` — установить id
- `get id(): string` — получить id или пустую строку
- `set title(value: string)` — установить название товара
- `get title(): string` — получить название товара
- `set description(value: string | string[])` — установить описание
- `set image(value: string)` — установить картинку
- `set price(value: string)` — установить цену
- `get price(): string` — получить цену
- `set category(value: string)` — установить категорию
- `get category(): string` — получить категорию
- `set inBasket(value: boolean)` — текст для кнопки в зависимости от наличия в товара корзине
---

### Класс Order
Класс для управления данными внутри формы заказа. Наследуется от класса Form.

Конструктор принимает такие аргументы:
1. `protected container: HTMLFormElement` — контейнер карточки товара
1. `events: IEvents` — события

Класс имеет такие методы:
- `set address(value: string)` — установить адрес доставки
- `set phone(value: string)` — установить номер телефона
- `set email(value: string)` — установить электронную почту
- `set selected(name: string)` — установить способ оплаты
---

### Класс Page
Класс для работы с главной страницей сайта. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLFormElement` — контейнер карточки товара
1. `events: IEvents` — события

Класс имеет такие методы:
- `set counter(value: number)` — установить счетчик товаров в корзине
- `set catalog(items: HTMLElement[])` — вывести карточки товаров внутри каталога
- `set locked(value: boolean)` — заблокировать скролл (при открытии модальных окон)