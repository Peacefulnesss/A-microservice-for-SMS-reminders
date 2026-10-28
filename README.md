# A-microservice-for-SMS-reminders

<h1>КАК ЗАПУСКАТЬ:</h1>

<ol>
    <li>Переходим в папку /back и пишем в терминали npm run dev</li>
    <li>Аналогичные действия из верхнего пунка делаем для папки /frontend-lotte</li>
    <li>В папке /back редактируем файл .env, меняем параметры с префиксом DB под свои настройки Postgres</li>
</ol>

<h1>КАК СОЗДАТЬ КОМНАТЫ:</h1>

<ol>
    <li>Открываем Insomnia и прописываем в url: 127.0.0.1:3000/api/room, выбираем метод POST</li>
    <li>В body прописываем поля по примеру ниже, где photo - название файла .jpg из папки /back/uploads (Можно добавить свои фото)
    {
        "name": "Стандарт",
        "price": 15000,
        "is_active": true,
        "capacity": 3,
        "photo": "photo3"
    }
    </li>
</ol>

<p>Чиназес</p>