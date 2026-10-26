import { useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  CalendarIcon,
  ChevronDown,
  HistoryIcon,
  HomeIcon,
  LogoutIcon,
  UserIcon,
} from './Icons.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import s from './Layout.module.css';

const NAV = [
  { to: '/', label: 'Главная', icon: HomeIcon, end: true },
  { to: '/bookings', label: 'Мои бронирования', icon: CalendarIcon },
  { to: '/rooms', label: 'Номера', icon: ChevronDown },
  { to: '/extend', label: 'Предложение проживание', icon: HistoryIcon },
  { to: '/notifications', label: 'Уведомления', icon: BellIcon },
];

export default function Layout() {
  const scrollRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // При смене страницы прокручиваем контент наверх
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className={s.page}>
      <aside className={s.sidebar}>
        <div className={s.brand}>
          <div className={s.logo}>LOTTE</div>
          <div className={s.company}>АО “ЛОТТЕ РУС”</div>
        </div>

        <nav className={s.nav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `${s.link} ${isActive ? s.active : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className={s.logout} onClick={logout}>
          <LogoutIcon />
          Выйти
        </button>
      </aside>

      <div className={s.main}>
        <header className={s.topbar}>
          <button type="button" className={s.bellBtn} aria-label="Уведомления" onClick={() => navigate('/notifications')}>
            <BellIcon strokeWidth={1.6} />
          </button>
          <button type="button" className={s.user}>
            <span className={s.avatar}>
              <UserIcon />
            </span>
            {user.name}
            <ChevronDown className={s.chev} />
          </button>
        </header>

        <div className={s.scroll} ref={scrollRef}>
          <Outlet context={{ scrollRef }} />
        </div>
      </div>
    </div>
  );
}
