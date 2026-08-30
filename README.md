# 04-react-query


  - Створено репозиторій `04-react-query`
  - При здачі роботи надаються два посилання: на вихідні файли (репозиторій) та на робочу сторінку завдання, розгорнуту на [Vercel](https://vercel.com/).
  - Проєкт створено за допомогою [Vite](https://vitejs.dev/).
  - Під час запуску коду в консолі не повинно бути помилок або попереджень.
  - Для кожного компонента у папці `src/components` має бути окрема папка, яка містить файл самого React компонента та файл його стилів. Назва папки, файлу компонента (з розширенням `.tsx`) та файлу стилів (перед `.module.css`) однакова і відповідає назвам, вказаним у завданнях (якщо вони були).


  - У кожній папці компонента мають бути:

      1. Файл компонента з розширенням `.tsx` (наприклад, `App.tsx`);
      2. Файл стилів, назва якого закінчується на `.module.css`, з такою самою назвою (наприклад, `App.module.css`).


  - Для експорту компонентів використовується експорт за замовчуванням (`export default`).
  - Загальні типи, які використовуються в кількох компонентах, винесені в окремий файл (`src/types/movie.ts`). Типи та інтерфейси, які стосуються лише одного компонента, оголошені безпосередньо у файлі цього компонента.
  - Для типізації пропсів компонентів використовується `interface`.
  - Інтерфейс для пропсів компонента називається за схемою: *Ім’яКомпонентаProps* (наприклад, `UserCardProps`).
  - Усі події компонентів типізовані.
  - Для виконання HTTP-запитів використовується бібліотека [axios](https://axios-http.com/).
  - TypeScript-код має бути **чистим, зрозумілим** і відформатованим за допомогою Prettier.
  - Стилізація виконується за допомогою CSS-модулів.
  - Використовується `modern-normalize` для уніфікації стилів у різних браузерах.


## Пошук фільмів


Доповни свій застосунок пошуку фільмів пагінацією. Подивіться демо-відео роботи застосунку.

https://goitlmsstorage.b-cdn.net/68ea3e4e-fa63-445e-bf0f-88b7a0a8bf8c2025-04-16%2017-45-27.mp4


Для збереження колекції відповідей від бекенда та керування станом запитів використовуйте бібліотеку [TanStack Query](https://tanstack.com/query/latest).


Необхідно зробити рефакторинг логіки отримання і збереження фільмів, а також відповідних станів. Не забудь, що налаштування роботи клієнта `react-query` потрібно робити на верхньому рівні, тобто у файлі src/main.tsx, а використовувати відповідні хуки безпосередньо в тому компоненті, де необхідна обробка отриманих даних – у нашому випадку, у компоненті `App`.


## Пагінація фільмів


Сервіс [TMDB](https://developer.themoviedb.org/docs/getting-started) підтримує пагінацію, для цього вам потрібно передати у http-запиті додатково параметр `page`.


Тепер у відповідь бекенда вас буде цікавити не лише властивість results, а і total_page. Тому не забудьте оновити інтерфейс для типізації відповіді з бекенду.


Для відображення елементів пагінації використовуйте біліотеку [React Paginate](https://www.npmjs.com/package/react-paginate). Зверніть увагу, що вона містить готовий компонент пагінації, але без стилів. Тому додайте підготовлені нами стилі для неї у файл `App.module.css`:

```
.pagination {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin: 16px 0;
    list-style: none;
    padding: 0;
}

.pagination li {
    width: 40px;
    height: 40px;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
}

.pagination a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.active {
    background-color: #0a66c2;
    color: white;
    font-weight: bold;
}
```

Зверніть увагу, що є собливість імпорту бібліотеки react-paginate у Vite версії 8+. Для правильного імпорту та типізації використайте наступний код:

```
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

// Далі в jsx використувуємо компонент ReactPaginate звичайним чином.
```

Компоненту `ReactPaginate` передайте наступні пропси:

```
pageCount={totalPages}
pageRangeDisplayed={5}
marginPagesDisplayed={1}
onPageChange={({ selected }) => setPage(selected + 1)}
forcePage={page - 1}
containerClassName={css.pagination}
activeClassName={css.active}
nextLabel="→"
previousLabel="←"
```

Пагінація має рендеритися лише тоді, коли кількість сторінок із завантаженими фільмами більше ніж 1.
