import { Outlet } from 'react-router-dom';
import s from './AuthLayout.module.css';

// Оболочка для /login и /register: слева фирменная панель, справа форма
export default function AuthLayout() {
  return (
    <div className={s.page}>
      <aside className={s.brandPanel}>
        <div>
          <div className={s.logo}>LOTTE</div>
          <div className={s.company}>АО “ЛОТТЕ РУС”</div>
        </div>

        <div>
          <div className={s.rule} />
          <h2 className={s.tagline}>Личный кабинет гостя</h2>
          <p className={s.tagText}>
            Управляйте бронированиями, получайте напоминания и продлевайте проживание в пару кликов.
          </p>
        </div>
      </aside>

      <main className={s.content}>
        <Outlet />
      </main>
    </div>
  );
}
