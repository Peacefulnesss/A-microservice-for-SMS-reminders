import s from "./CreateAppointment.module.css"
import { useState, useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import axios from "axios"

import Calendar from "../components/Calendar"

export default function CreateAppointment() {
    const [room, setRoom] = useState([])
    const [bookedRanges, setBookedRanges] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation()

    async function loadData() {
        const rm = await axios.get(`http://127.0.0.1:3000/api${location.pathname}`)
        const bk = await axios.get(`http://127.0.0.1:3000/api/application/dates/${rm.data[0].id}`)
        setRoom(rm.data[0])
        setBookedRanges(bk.data);
    }

    useEffect(() => {
        loadData()
    }, [])

    const bookedDates = buildBookedSet(bookedRanges);

    async function handleBook() {
        if (!startDate || !endDate) return;
            setLoading(true);
        try {
            let user = localStorage.getItem('user')
            user = user.split(',')[0].split(':')[1]
            await axios.post(`http://127.0.0.1:3000/api/application`, {
                user_id: user,
                room_id: room.id,
                start_date: toISO(startDate),
                end_date: toISO(endDate),
            });
            const bookedRes = await axios.get(`http://127.0.0.1:3000/api/application/dates/${room.id}`);
            setBookedRanges(bookedRes.data);
            setStartDate(null);
            setEndDate(null);
            alert('Забронировано!');
        } catch (e) {
            alert(e.response?.data?.error || 'Ошибка бронирования');
        } finally {
            setLoading(false);
        }
    }

    function toISO(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    function buildBookedSet(ranges) {
        const set = new Set();
        for (const { start_date, end_date } of ranges) {
            let cur = new Date(start_date);
            const end = new Date(end_date);
            while (cur < end) {
                set.add(toISO(cur));
                cur.setDate(cur.getDate() + 1);
            }
    }
        return set;
    }

    function isRangeFree(start, end, bookedSet) {
        let cur = new Date(start);
        while (cur < end) {
            if (bookedSet.has(toISO(cur))) return false;
            cur.setDate(cur.getDate() + 1);
        }
            return true;
    }

    function handleDayClick(dayDate) {
        const iso = toISO(dayDate);
        
        if (bookedDates.has(iso)) return;
        if (dayDate < new Date(new Date().toDateString())) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(dayDate);
            setEndDate(null);
            return;
        }

        if (dayDate <= startDate) {
            setStartDate(dayDate);
            return;
        }

        if (!isRangeFree(startDate, dayDate, bookedDates)) {
            alert('В выбранном диапазоне есть занятые даты');
            return;
        }

        setEndDate(dayDate);
        }

    return (
        <main className={s.content}>
            <section className={s.hero}>
            <h1 className={s.h1}>Номер: {room.name}</h1>
            <p className={s.subtitle}>Бронируйте этот номер на определённые даты</p>
            <div className={s.calendar_div}>
                <img className={s.img} src={`http://127.0.0.1:3000/uploads/${room.photo}.jpg`}></img>
                <Calendar className={s.calendar}
                    bookedDates={bookedDates}
                    startDate={startDate}
                    endDate={endDate}
                    onDayClick={handleDayClick}
                />
            </div>
            </section>
            <button className={s.button} onClick={handleBook}>Забронировать</button>
        </main>
    )
}