import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, CheckBoxIcon, ChevronRight, PercentIcon, SendIcon } from '../components/Icons.jsx';
import { notifications } from '../data/mock.js';
import s from './Notifications.module.css';

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'sms', label: 'СМС' },
  { id: 'system', label: 'Системные' },
  { id: 'booking', label: 'Бронирования', wide: true },
];

const ICONS = {
  bell: BellIcon,
  percent: PercentIcon,
  check: CheckBoxIcon,
  send: SendIcon,
};

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const visible = notifications.filter((n) => filter === 'all' || n.cat === filter);

  return (
    <main className={s.content}>
      <h1 className={s.h1}>Уведомления</h1>
      <p className={s.subtitle}>Ваши сообщения и напоминания</p>

      <div className={s.filters} role="tablist">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`${s.chip} ${f.wide ? s.wide : ''} ${filter === f.id ? s.chipActive : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className={s.list}>
        {visible.map((n) => {
          const Icon = ICONS[n.icon];
          return (
            <button
              key={n.id}
              type="button"
              className={s.note}
              onClick={() => n.to && navigate(n.to)}
            >
              <span className={`${s.ico} ${s[n.tone]}`}>
                <Icon />
              </span>
              <span className={s.body}>
                <span className={s.title}>{n.title}</span>
                <span className={s.text}>{n.text}</span>
              </span>
              <span className={s.side}>
                <span className={s.time}>{n.time}</span>
                <ChevronRight className={s.arrow} />
              </span>
            </button>
          );
        })}
      </section>

      {visible.length === 0 && <p className={s.empty}>В этой категории пока нет уведомлений</p>}
    </main>
  );
}
