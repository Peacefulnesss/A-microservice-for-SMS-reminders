import { useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight } from '../components/Icons.jsx';
import RoomPhoto from '../components/RoomPhoto.jsx';
import { bookingHistory, currentBooking } from '../data/mock.js';
import { formatPrice } from '../utils/format.js';
import s from './Bookings.module.css';

export default function Bookings() {
  const [tab, setTab] = useState('history');
  const historyRef = useRef(null);
  const { scrollRef } = useOutletContext();
  const navigate = useNavigate();

  // Вкладки подсвечиваются и плавно прокручивают контент к нужному блоку
  function selectTab(next) {
    setTab(next);
    const scroller = scrollRef.current;
    if (!scroller) return;
    let top = 0;
    if (next === 'history' && historyRef.current) {
      top =
        historyRef.current.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop -
        16;
    }
    scroller.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <main className={s.content}>
      <h1 className={s.h1}>Мои бронирования</h1>
      <p className={s.subtitle}>Актуальные и завершенные бронирования</p>

      <div className={s.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'current'}
          className={`${s.tab} ${tab === 'current' ? s.tabActive : ''}`}
          onClick={() => selectTab('current')}
        >
          Текущие
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'history'}
          className={`${s.tab} ${tab === 'history' ? s.tabActive : ''}`}
          onClick={() => selectTab('history')}
        >
          История
        </button>
      </div>

      {/* Текущее бронирование */}
      <section className={s.current}>
        <RoomPhoto className={s.currentPhoto} label={currentBooking.room} />
        <div className={s.info}>
          <div className={s.hotel}>{currentBooking.hotel}</div>
          <div className={s.meta}>{currentBooking.room}</div>
          <div className={s.meta}>{currentBooking.period}</div>
          <div className={s.meta}>№ бронирования: {currentBooking.id}</div>
          <span className={s.badge}>{currentBooking.status}</span>
          <div className={s.actions}>
            <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => navigate('/extend')}>
              Продлить проживание
            </button>
            <button type="button" className={`${s.btn} ${s.btnSecondary}`}>
              Подробнее
            </button>
          </div>
        </div>
        <div className={s.price}>
          <div className={s.sum}>{formatPrice(currentBooking.price)}</div>
          <div className={s.cap}>Проживание</div>
        </div>
      </section>

      {/* История */}
      <h2 className={s.historyTitle} ref={historyRef}>
        История бронирований
      </h2>
      <section className={s.history}>
        {bookingHistory.map((b) => (
          <article key={b.id} className={s.item}>
            <RoomPhoto className={s.itemPhoto} label={b.room} />
            <div className={s.info}>
              <div className={s.hotel}>{b.hotel}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>{b.room}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>{b.period}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>№ {b.number}</div>
            </div>
            <span className={`${s.badge} ${s.itemBadge}`}>{b.status}</span>
            <ChevronRight className={s.arrow} />
          </article>
        ))}
      </section>
    </main>
  );
}
