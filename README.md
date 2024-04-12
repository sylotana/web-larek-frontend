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
- src/styles/styles.scss — корневой файл стилей
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

## Базовый код

---
### Абстрактный класс Model
Базовая модель, которая позволяет на своей основе создавать новые модели

Конструктор принимает такие аргументы:
1. `data: Partial<T>` — данные
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `emitChanges` — сообщить всем, что модель поменялась



## Слой представления

---
### Абстрактный класс Component
Абстрактный класс, являющийся основой для всех компонентов в проекте. Он предоставляет основные методы для работы с элементами DOM.

Конструктор принимает такие аргументы:
1. `protected readonly container: HTMLElement` — DOM-элемент, в котором будет размещен компонент

Класс имеет такие методы:
- `toggleClass` — переключить класс
- `setText` — установить текстовое содержимое
- `setDisabled` — сменить статус блокировки
- `setHidden` — скрыть элемент
- `setVisible` — показать элемент
- `setImage` — установить изображение с алтернативным текстом
- `render` — вернуть корневой DOM-элемент

---
### Класс Basket
Класс, отвечающий за работу с корзиной. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер корзины
1. `protected events: EventEmitter` — события

- `set items` — список товаров в корзине
- `set selected` — блокирует кнопку оформления заказа, в зависимости от наличия товаров в корзине
- `set total` — итоговая стоимость товаров

---
### Класс Form
Класс, отвечающий за работу с формой заказа. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLFormElement` — контейнер формы
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `set valid` — состояние валидности формы
- `set errors` — текст ошибки формы
- `protected onInputChange` — событие изменения поля ввода
- `render` — вернуть корневой DOM-элемент

---
### Класс Modal
Класс, отвечающий за работу с модальными окнами. Наследуется от абстрактного класса Component.

Конструктор принимает такие аргументы:
1. `protected container: HTMLElement` — контейнер модального окна
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `set content` — контент в модальном окне
- `open` — открытие модального окна
- `order` — событие открытия заказа
- `orderContacts` — событие открытия контактов
- `close` — закрытие модального окна
- `render` — вернуть корневой DOM-элемент

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
- `set id` — установить id
- `get id` — получить id или пустую строку
- `set title` — установить название товара
- `get title` — получить название товара
- `set description` — установить описание
- `set image` — установить картинку
- `set price` — установить цену
- `get price` — получить цену
- `set category` — установить категорию
- `get category` — получить категорию
- `set inBasket` — текст для кнопки в зависимости от наличия в товара корзине
