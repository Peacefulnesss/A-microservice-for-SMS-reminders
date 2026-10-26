// "YYYY-MM-DD" без таймзонных сюрпризов
export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Локальная полночь — чтобы сравнения не ломались из-за времени
export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Сегодняшняя полночь (для блокировки прошедших дней)
export function today() {
  return startOfDay(new Date());
}

// Названия месяцев/дней — можно вынести в i18n потом
export const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Матрица дней месяца. Понедельник — первый день недели.
// null в ячейках — пустые клетки до 1-го числа и после последнего.
export function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // getDay(): 0 = Вс, 1 = Пн ... 6 = Сб
  // Приводим к понедельнику как первому дню: (day + 6) % 7
  const offset = (first.getDay() + 6) % 7;

  const daysInMonth = last.getDate();
  const cells = [];

  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  // Разбиваем на недели
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}