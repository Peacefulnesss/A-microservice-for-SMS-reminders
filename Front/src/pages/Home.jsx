import { useNavigate } from 'react-router-dom';
import { ArrowRight, CalendarIcon, BellIcon } from '../components/Icons.jsx';
import RoomPhoto from '../components/RoomPhoto.jsx';
import { reminder } from '../data/mock.js';
import s from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className={s.content}>
      <section className={s.hero}>
        <div className={s.heroText}>
          <div className={s.org}>АО “ЛОТТЕ РУС”</div>
          <h1 className={s.title}>
            Продлите
            <br />
            проживание
          </h1>
          <p className={s.lead}>
            Остались планы на поездку? Мы подготовили для вас специальные условия на продление проживание.
          </p>
          <button type="button" className={s.btnGold} onClick={() => navigate('/extend')}>
            Узнать больше
            <ArrowRight />
          </button>
        </div>
        <RoomPhoto className={s.heroPhoto} label="Номер в отеле с панорамным окном" />
      </section>

      <section className={s.reminder}>
        <div className={s.reminderHead}>
          <span className={s.dot}>
            <BellIcon strokeWidth={2} />
          </span>
          Ближайшее напоминание
        </div>
        <div className={s.reminderItem}>
          <div className={s.reminderIcon}>
            <CalendarIcon big />
          </div>
          <div className={s.reminderInfo}>
            <div className={s.reminderTitle}>{reminder.title}</div>
            <div className={s.reminderDate}>{reminder.date}</div>
          </div>
          <button type="button" className={s.btnOutline} onClick={() => navigate('/extend')}>
            Продлить
          </button>
        </div>
      </section>
    </main>
  );
}
