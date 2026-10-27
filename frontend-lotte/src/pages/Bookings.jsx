import { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronRight } from '../components/Icons.jsx';
import RoomPhoto from '../components/RoomPhoto.jsx';
import { bookingHistory, currentBooking } from '../data/mock.js';
import { formatPrice } from '../utils/format.js';
import axios from "axios"
import s from './Bookings.module.css';

export default function Bookings() {
  const [appoinments, setAppointments] = useState([])
  const [endedAppointments, setEndedAppointments] = useState([])
  const [tab, setTab] = useState('history');
  const historyRef = useRef(null);
  const { scrollRef } = useOutletContext();
  const navigate = useNavigate();

  async function getApplications() {
    let user = localStorage.getItem('user')
    user = user.split(',')[0].split(':')[1]
    const appls = await axios.get(`http://127.0.0.1:3000/api/application/user/${user}`)
    const active_appls = appls.data.filter((appointment) => {
      return (appointment.status == "Активно")
    })
    setAppointments(active_appls)
    const inactive_appls = appls.data.filter((appointment) => {
      return (appointment.status == "Завершено")
    })
    setEndedAppointments(inactive_appls)
  }

  useEffect(() => {
    getApplications()
  },[])

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
      {appoinments.map((appoinment) => {
        //currentPhoto
        return (
          <section className={s.current} key={appoinment.id}>
            <img className={s.currentPhoto} src={`http://127.0.0.1:3000/uploads/${appoinment.photo}.jpg`}></img>
            <div className={s.info}>
              <div className={s.hotel}>LOTTE HOTEL</div>
              <div className={s.meta}>{appoinment.name}</div>
              <div className={s.meta}>{appoinment.start_date.split("T")[0]} - {appoinment.end_date.split("T")[0]}</div>
              <div className={s.meta}>№ бронирования: {appoinment.id}</div>
              <span className={s.badge}>{appoinment.status}</span>
              <div className={s.actions}>
                <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => navigate('/extend')}>
                  Продлить проживание
                </button>
                <button type="button" className={`${s.btn} ${s.btnSecondary}`}>
                  Подробнее
                </button>
              </div>
            </div>
          </section>
        )
        })}

      {/* История */}
      <h2 className={s.historyTitle} ref={historyRef}>
        История бронирований
      </h2>
      <section className={s.history}>
        {endedAppointments.map((appointment) => {
          return (
            <article key={appointment.id} className={s.item}>
            <img className={s.itemPhoto} src={`http://127.0.0.1:3000/uploads/${appointment.photo}.jpg`}></img>
            <div className={s.info}>
              <div className={s.hotel}>{appointment.hotel}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>{appointment.name}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>{appointment.start_date.split("T")[0]} - {appointment.end_date.split("T")[0]}</div>
              <div className={`${s.meta} ${s.metaLoose}`}>№ {appointment.id}</div>
            </div>
            <span className={`${s.badge} ${s.itemBadge}`}>{appointment.status}</span>
            <ChevronRight className={s.arrow} />
          </article>
          )
        })}
      </section>
    </main>
  );
}
