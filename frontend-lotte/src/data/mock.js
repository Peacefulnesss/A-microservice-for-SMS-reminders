// Моковые данные. Позже их можно заменить запросами к API.

export const reminder = {
  title: 'Срок проживания истекает',
  date: '12 июня 2025',
};

export const currentBooking = {
  id: 'LH-45872',
  hotel: 'LOTTE HOTEL',
  room: 'Номер Deluxe',
  period: '10.06.2025 - 12.06.2025 (2 ночи)',
  checkout: '12.06.2025 12:00',
  status: 'Подтверждено',
  price: 28000,
};

export const bookingHistory = [
  { id: 'h1', number: 'LH-45872', hotel: 'LOTTE HOTEL', room: 'Номер Deluxe', period: '10.06.2025 - 12.06.2025 (2 ночи)', status: 'Завершено' },
  { id: 'h2', number: 'LH-45872', hotel: 'LOTTE HOTEL', room: 'Номер Deluxe', period: '10.06.2025 - 12.06.2025 (2 ночи)', status: 'Завершено' },
  { id: 'h3', number: 'LH-45872', hotel: 'LOTTE HOTEL', room: 'Номер Deluxe', period: '10.06.2025 - 12.06.2025 (2 ночи)', status: 'Завершено' },
];

export const availableRooms = [
  { id: 'r1', name: 'Deluxe', guests: 2, pricePerNight: 12000 },
  { id: 'r2', name: 'Deluxe', guests: 2, pricePerNight: 12000 },
];

// cat: sms | system | booking — по ним работают фильтры
// icon: bell | percent | check | send; tone: gold | green | cyan
export const notifications = [
  {
    id: 'n1', cat: 'system', icon: 'bell', tone: 'gold', to: '/extend',
    title: 'Напоминание о выезде',
    text: 'Ваше проживание заканчивается 12.06.2025 в 12:00. Хотите продлить?',
    time: '10.06.2025 09:00',
  },
  {
    id: 'n2', cat: 'booking', icon: 'percent', tone: 'gold', to: '/extend',
    title: 'Предложение продлить проживание',
    text: 'Мы подготовили для вас специальное предложение на продление....',
    time: '09.06.2025 11:00',
  },
  {
    id: 'n3', cat: 'booking', icon: 'check', tone: 'green', to: '/bookings',
    title: 'Подтверждение бронирования',
    text: 'Ваше бронирование № LH-45872 успешно подтверждено.',
    time: '06.06.2025 15:00',
  },
  {
    id: 'n4', cat: 'sms', icon: 'send', tone: 'cyan', to: null,
    title: 'Письмо отправлено',
    text: 'На почту example@mail.com отправлено уведомление о выезде.',
    time: '06.06.2025 15:00',
  },
];
