import { useState } from 'react';
import { GuestIcon } from '../components/Icons.jsx';
import RoomPhoto from '../components/RoomPhoto.jsx';
import { availableRooms, currentBooking } from '../data/mock.js';
import { formatPrice, pluralNights } from '../utils/format.js';
import s from './Extend.module.css';

const MIN_NIGHTS = 1;
const MAX_NIGHTS = 14;

export default function Extend() {
  const [nights, setNights] = useState(2);
  const [selectedId, setSelectedId] = useState(null);

  const selected = availableRooms.find((r) => r.id === selectedId) ?? null;

  function toggleRoom(id) {
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function confirm() {
    // TODO: отправка продления на сервер
  }

  return (
    <main className={s.content}>
      <h1 className={s.h1}>Продление проживания</h1>
      <p className={s.subtitle}>Продлите ваше пребывание в комфортных условиях</p>

      {/* Текущее проживание */}
      <section className={`${s.card} ${s.stay}`}>
        <RoomPhoto className={s.stayPhoto} label={currentBooking.room} />
        <div>
          <div className={s.stayTitle}>Текущее проживание</div>
          <div className={s.meta}>{currentBooking.room}</div>
          <div className={s.meta}>{currentBooking.period}</div>
          <span className={s.pill}>
            Выезд: <b>{currentBooking.checkout}</b>
          </span>
        </div>
      </section>

      {/* Выбор ночей */}
      <section className={`${s.card} ${s.nights}`}>
        <h2 className={s.nightsTitle}>Выберите дополнительные ночи</h2>
        <div className={s.stepper} role="group" aria-label="Количество ночей">
          <button
            type="button"
            className={`${s.stepBtn} ${s.minus}`}
            aria-label="Меньше"
            disabled={nights <= MIN_NIGHTS}
            onClick={() => setNights((n) => Math.max(MIN_NIGHTS, n - 1))}
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
            disabled={nights >= MAX_NIGHTS}
            onClick={() => setNights((n) => Math.min(MAX_NIGHTS, n + 1))}
          >
            +
          </button>
        </div>
      </section>

      {/* Доступные номера */}
      <h2 className={s.roomsTitle}>Доступные номера</h2>
      <section className={s.rooms}>
        {availableRooms.map((room) => {
          const isSelected = room.id === selectedId;
          return (
            <article key={room.id} className={`${s.card} ${s.room} ${isSelected ? s.roomSelected : ''}`}>
              <RoomPhoto className={s.roomPhoto} label={`Номер ${room.name}`} />
              <div className={s.roomInfo}>
                <div className={s.roomName}>
                  Номер <b>{room.name}</b>
                </div>
                <div className={s.guests}>
                  <GuestIcon />
                  {room.guests}
                </div>
                <div className={s.perNight}>+ {formatPrice(room.pricePerNight)} / ночь</div>
              </div>
              <div className={s.total}>{formatPrice(room.pricePerNight * nights)}</div>
              <div className={s.divider} />
              <div className={s.selectWrap}>
                <button
                  type="button"
                  className={`${s.btnSelect} ${isSelected ? s.btnSelected : ''}`}
                  onClick={() => toggleRoom(room.id)}
                >
                  {isSelected ? 'Выбрано' : 'Выбрать'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Подтверждение */}
      {selected && (
        <div className={s.confirm}>
          <div className={s.confirmText}>
            Продление на{' '}
            <b>
              {nights} {pluralNights(nights)}
            </b>{' '}
            — итого <b>{formatPrice(selected.pricePerNight * nights)}</b>
          </div>
          <button type="button" className={s.confirmBtn} onClick={confirm}>
            Подтвердить продление
          </button>
        </div>
      )}
    </main>
  );
}
