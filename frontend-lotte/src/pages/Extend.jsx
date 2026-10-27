import { useEffect, useState } from 'react';
import axios from 'axios';
import { GuestIcon } from '../components/Icons.jsx';
import RoomPhoto from '../components/RoomPhoto.jsx';
import { formatPrice, pluralNights } from '../utils/format.js';
import s from './Extend.module.css';

const HARD_MAX = 14; // общий лимит на всякий случай

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDate(iso) {
  return iso.split("T")[0]
}

export default function Extend() {
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);       // текущая бронь
  const [maxNights, setMaxNights] = useState(0);      // сколько можно продлить
  const [nights, setNights] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Загружаем бронь и лимит
  useEffect(() => {
    async function load() {
      try {
        let user = localStorage.getItem('user')
        user = user.split(',')[0].split(':')[1]
        console.log(user)
        const res = await axios.post('http://127.0.0.1:3000/api/application/bookings/current', {'user_id': user});
        console.log(res.data)
        if (res.data.booking) {
          setBooking(res.data.booking);
          setMaxNights(res.data.maxNights);
          // если продлить нельзя — nights не важен
          setNights(res.data.maxNights >= 1 ? 1 : 0);
        }
      } catch (e) {
        setError('Не удалось загрузить текущую бронь');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Что показываем, пока грузимся / нет брони / продлить нельзя
  if (loading) {
    return <main className={s.content}><p className={s.subtitle}>Загрузка…</p></main>;
  }
  if (error) {
    return <main className={s.content}><p className={s.subtitle}>{error}</p></main>;
  }
  if (!booking) {
    return (
      <main className={s.content}>
        <h1 className={s.h1}>Продление проживания</h1>
        <p className={s.subtitle}>У вас нет активных бронирований</p>
      </main>
    );
  }

  const canExtend = maxNights >= 1;

  // Считаем новую дату выезда
  const newEndDate = (() => {
    const d = new Date(booking.end_date + 'T00:00:00');
    d.setDate(d.getDate() + nights);
    return d;
  })();

  const totalPrice = nights * booking.price;

  async function confirm() {
    if (!canExtend) return;
    setSubmitting(true);
    try {
      let user = localStorage.getItem('user')
      user = user.split(',')[0].split(':')[1]
      await axios.post(
        `http://127.0.0.1:3000/api/application/bookings/${booking.id}/extend`, { nights, 'user_id':  user});
      // Обновляем локально, чтобы UI сразу отразил новую дату
      setBooking((b) => ({
        ...b,
        end_date: toISO(newEndDate),
      }));
      setMaxNights((m) => Math.max(0, m - nights));
      setNights(1);
    } catch (e) {
      setError(e.response?.data?.error || 'Не удалось продлить бронь');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={s.content}>
      <h1 className={s.h1}>Продление проживания</h1>
      <p className={s.subtitle}>Продлите ваше пребывание в комфортных условиях</p>

      {/* Текущее проживание */}
      <section className={`${s.card} ${s.stay}`}>
        <img className={s.stayPhoto} src={`http://127.0.0.1:3000/uploads/${booking.photo}.jpg`}></img>
        <div>
          <div className={s.stayTitle}>Текущее проживание</div>
          <div className={s.meta}>{booking.room_name}</div>
          <div className={s.meta}>
            {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
          </div>
          <span className={s.pill}>
            Выезд: <b>{formatDate(booking.end_date)}</b>
          </span>
        </div>
      </section>

      {/* Выбор ночей */}
      <section className={`${s.card} ${s.nights}`}>
        <h2 className={s.nightsTitle}>Выберите дополнительные ночи</h2>

        {!canExtend ? (
          <p className={s.meta} style={{ marginTop: 12 }}>
            К сожалению, номер занят сразу после вашей даты выезда — продление невозможно.
          </p>
        ) : (
          <>
            <div className={s.stepper} role="group" aria-label="Количество ночей">
              <button
                type="button"
                className={`${s.stepBtn} ${s.minus}`}
                aria-label="Меньше"
                disabled={nights <= 1}
                onClick={() => setNights((n) => Math.max(1, n - 1))}
              >
                -
              </button>
              <output className={s.count} aria-live="polite">
                {nights}
              </output>
              <button
                type="button"
                className={`${s.stepBtn} ${s.plus}`}
                aria-label="Больше"
                disabled={nights >= Math.min(maxNights, HARD_MAX)}
                onClick={() => setNights((n) => Math.min(maxNights, HARD_MAX, n + 1))}
              >
                +
              </button>
            </div>
            <p className={s.meta} style={{ marginTop: 10 }}>
              Доступно ночей для продления: <b>{Math.min(maxNights, HARD_MAX)}</b>
            </p>
          </>
        )}
      </section>

      {/* Подтверждение */}
      {canExtend && (
        <div className={s.confirm}>
          <div className={s.confirmText}>
            Продление на{' '}
            <b>{nights} {pluralNights(nights)}</b>{' '}
            — итого <b>{formatPrice(totalPrice)}</b>
          </div>
          <button
            type="button"
            className={s.confirmBtn}
            onClick={confirm}
            disabled={submitting}
          >
            {submitting ? 'Отправка…' : 'Подтвердить продление'}
          </button>
        </div>
      )}

      {error && (
        <p className={s.meta} style={{ marginTop: 12, color: '#c66' }}>{error}</p>
      )}
    </main>
  );
}