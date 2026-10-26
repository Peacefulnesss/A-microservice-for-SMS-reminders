import { useState } from 'react';
import {
  MONTHS, WEEKDAYS, getMonthMatrix, toISO, today,
} from '../utils/date';
import s from './Calendar.module.css';

export default function Calendar({
  bookedDates = new Set(),   // Set<string> занятых дат
  startDate = null,          // Date | null
  endDate = null,            // Date | null
  onDayClick,                // (Date) => void
  initialMonth,              // необязательно: { year, month }
}) {
  const now = today();
  const [view, setView] = useState(
    initialMonth || { year: now.getFullYear(), month: now.getMonth() }
  );

  function prevMonth() {
    setView((v) => {
      const m = v.month - 1;
      return m < 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: m };
    });
  }

  function nextMonth() {
    setView((v) => {
      const m = v.month + 1;
      return m > 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: m };
    });
  }

  // Кнопки «назад» не даём уйти раньше текущего месяца
  const isPrevDisabled =
    view.year === now.getFullYear() && view.month === now.getMonth();

  const weeks = getMonthMatrix(view.year, view.month);

  // Проверка, попадает ли день в выбранный диапазон
  function inRange(day) {
    if (!startDate) return false;
    if (startDate && !endDate) return day.getTime() === startDate.getTime();
    return day >= startDate && day <= endDate;
  }

  return (
    <div className={s.calendar}>
      {/* Шапка: стрелки и название месяца */}
      <div className={s.header}>
        <button
          type="button"
          className={s.navBtn}
          onClick={prevMonth}
          disabled={isPrevDisabled}
          aria-label="Предыдущий месяц"
        >
          ‹
        </button>
        <div className={s.title}>
          {MONTHS[view.month]} {view.year}
        </div>
        <button
          type="button"
          className={s.navBtn}
          onClick={nextMonth}
          aria-label="Следующий месяц"
        >
          ›
        </button>
      </div>

      {/* Дни недели */}
      <div className={s.weekdays}>
        {WEEKDAYS.map((wd, i) => (
          <div
            key={wd}
            className={`${s.weekday} ${i >= 5 ? s.weekend : ''}`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Сетка дней */}
      <div className={s.grid}>
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (!day) {
              return (
                <div key={`empty-${wi}-${di}`} className={s.empty} />
              );
            }

            const iso = toISO(day);
            const isPast = day < now;
            const isBooked = bookedDates.has(iso);
            const isStart = startDate && day.getTime() === startDate.getTime();
            const isEnd = endDate && day.getTime() === endDate.getTime();
            const isInRange = inRange(day) && !isStart && !isEnd;
            const isToday = day.getTime() === now.getTime();
            const isDisabled = isPast || isBooked;

            const classes = [
              s.day,
              isPast && s.dayPast,
              isBooked && s.dayBooked,
              isInRange && s.dayInRange,
              isStart && s.dayStart,
              isEnd && s.dayEnd,
              isToday && s.dayToday,
            ].filter(Boolean).join(' ');

            return (
              <button
                key={iso}
                type="button"
                className={classes}
                disabled={isDisabled}
                onClick={() => onDayClick?.(day)}
              >
                {day.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}