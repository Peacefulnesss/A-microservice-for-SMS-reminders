import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BellIcon, CheckBoxIcon, ChevronRight, PercentIcon, SendIcon } from '../components/Icons.jsx';
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

function formatTime(iso) {
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        let user = localStorage.getItem('user')
        user = user.split(',')[0].split(':')[1]
        const res = await axios.post(
          `http://127.0.0.1:3000/api/notifications?category=${filter}`, {'user_id': user}
        );
        if (!cancelled) setItems(res.data);
      } catch (e) {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filter]);

  async function handleClick(n) {
    if (!n.is_read) {
      axios.post(
        `http://127.0.0.1:3000/api/notifications/${n.id}/read`,
        {},
        { withCredentials: true },
      ).catch(() => {});
    }
    if (n.to) navigate(n.to);
  }

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
        {items.map((n) => {
          const Icon = ICONS[n.icon] ?? BellIcon;
          return (
            <button
              key={n.id}
              type="button"
              className={s.note}
              onClick={() => handleClick(n)}
            >
              <span className={`${s.ico} ${s[n.tone]}`}>
                <Icon />
              </span>
              <span className={s.body}>
                <span className={s.title}>{n.title}</span>
                <span className={s.text}>{n.text}</span>
              </span>
              <span className={s.side}>
                <span className={s.time}>{formatTime(n.created_at)}</span>
                <ChevronRight className={s.arrow} />
              </span>
            </button>
          );
        })}
      </section>

      {!loading && items.length === 0 && (
        <p className={s.empty}>В этой категории пока нет уведомлений</p>
      )}
    </main>
  );
}