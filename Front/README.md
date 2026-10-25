# LOTTE — личный кабинет (React)

Vite + React 18 + React Router 6. Макет рассчитан на экран 1440×1024.

## Запуск

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # сборка в dist/
npm run preview  # предпросмотр сборки
```

## Структура

```
public/hotel-room.jpg      фото номера (замените на настоящее, имя файла оставьте)
src/
  App.jsx                  маршруты
  components/
    Layout.jsx             сайдбар + шапка + область прокрутки (Outlet)
    Icons.jsx              все SVG-иконки
    RoomPhoto.jsx          фото номера
  pages/
    Home.jsx               /                Главная
    Bookings.jsx           /bookings        Мои бронирования
    Extend.jsx             /extend          Продление проживания
    Notifications.jsx      /notifications   Уведомления
  data/mock.js             моковые данные (заменить на API)
  utils/format.js          цена, склонение «ночь/ночи/ночей»
  styles/global.css        цвета (CSS-переменные) и сброс стилей
```

Стили страниц и компонентов — CSS-модули (`*.module.css`), цвета берутся из переменных в `global.css`.

## Вход и регистрация

- Страницы `/login` и `/register` (`pages/Login.jsx`, `pages/Register.jsx`), общая оболочка — `components/AuthLayout.jsx`.
- Остальные страницы закрыты: без входа `RequireAuth.jsx` отправляет на `/login`.
- Авторизация пока **ненастоящая**: пользователи и сессия лежат в `localStorage` браузера (`context/AuthContext.jsx`).
  Демо-вход: `demo@lotte.ru` / `123456`. Когда появится бэкенд, замените функции `login`, `register`, `logout` в этом файле запросами к API.
- Проверка полей — `utils/validate.js`, поле с подписью и ошибкой — `components/TextField.jsx`.
- Подсказку с демо-данными на странице входа удалите вместе с блоком `.hint`.

## Что ещё не подключено

- «Подтвердить продление» (`Extend.jsx`, функция `confirm`)
- «Подробнее» и клик по карточке истории в `Bookings.jsx`
