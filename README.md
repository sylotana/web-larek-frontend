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

### Абстрактные классы

---
#### Абстрактный класс Model
Базовая модель, которая позволяет на своей основе создавать новые модели

Конструктор принимает такие аргументы:
1. `data: Partial<T>` — данные
1. `protected events: IEvents` — события

Класс имеет такие методы:
- `emitChanges` — сообщить всем, что модель поменялась

---
#### Абстрактный класс Component
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
