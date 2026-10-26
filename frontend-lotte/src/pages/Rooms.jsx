import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronRight } from '../components/Icons.jsx';
import s from './Rooms.module.css';
import axios from 'axios';

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const navigate = useNavigate();

  async function getRooms() {
    const rooms = await axios.get("http://127.0.0.1:3000/api/room")
    console.log(rooms.data)
    setRooms(rooms.data)
  }

  useEffect(() => {
    getRooms()
  },[])

  return (
    <main className={s.content}>
      <section className={s.hero}>
        <h1 className={s.h1}>Номера</h1>
        <p className={s.subtitle}>Бронируйте комнаты на определённые даты</p>
      </section>
      <section className={s.history}>
        {
          rooms.map((room) => {
            return (
              <article key={room.id} className={s.item} onClick={() => {navigate(`/room/${room.id}`)}}>
                <img src={`http://127.0.0.1:3000/uploads/${room.photo}.jpg`} className={s.itemPhoto} />
                <div className={s.info}>
                  <div className={`${s.h1} ${s.metaLoose}`}>{room.name}</div>
                  <div className={`${s.meta} ${s.metaLoose}`}>Цена за ночь: {room.price} руб</div>
                  <div className={`${s.meta} ${s.metaLoose}`}>Кол-во кроватей: {room.capacity}</div>
                </div>
                <ChevronRight className={s.arrow} />
              </article>
            )
          })
        }
      </section>
    </main>
  );
}
