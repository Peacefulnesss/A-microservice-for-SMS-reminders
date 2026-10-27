const pool = require ("../db/index")

class ApplicationController{
	async getAllApplications(req,res){
		try{
			const application = await pool.query(`SELECT * FROM applications`)
			res.json(application.rows)
		}catch(error){
			console.log(error)
		}
	}

	async getApplicationById(req,res){
		const id = parseInt(req.params.id)
		try{
			const application = await pool.query(`SELECT * FROM applications WHERE id = $1`, [id])
			res.json(application.rows)
		}catch(error){
			console.log(error)
		}
	}

	async getApplicationByUserId(req,res){
		const id = parseInt(req.params.id)
		try{
			const application = await pool.query(`SELECT applications.id, user_id, name, photo, price, start_date, end_date, status FROM applications JOIN rooms ON applications.room_id = rooms.id WHERE user_id = $1 ORDER BY end_date`, [id])
			res.json(application.rows)
		}catch(error){
			console.log(error)
		}
	}

	async getBookedDates(req, res) {
		try {
			const { id } = req.params;
			const result = await pool.query(`SELECT start_date, end_date FROM applications WHERE room_id = $1`, [id]);
			res.json(result.rows);
		} catch (error) {
			console.log("Error getting booked dates: ", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getCurrentBooking(req, res) {
		try {
			const userId = req.body.user_id;
			// Текущая активная бронь: сегодня между start и end
			const cur = await pool.query(`
				SELECT a.id, a.room_id, a.start_date, a.end_date, a.status,
					r.name, r.price, r.photo
					FROM applications AS a JOIN rooms AS r ON r.id = a.room_id
					WHERE a.user_id = $1 AND a.start_date <= CURRENT_DATE AND a.end_date >= CURRENT_DATE
					ORDER BY a.end_date ASC 
					LIMIT 1`, [userId]);
			if (cur.rows.length === 0) {
				return res.json({ booking: null });
			}
			const booking = cur.rows[0];

			// Ближайшая следующая бронь этой же комнаты
			const next = await pool.query(`
				SELECT start_date
				FROM applications
				WHERE room_id = $1
				AND id <> $2
				AND status IN ('Активно', 'Завершено')
				AND start_date >= $3
				ORDER BY start_date ASC
				LIMIT 1
			`, [booking.room_id, booking.id, booking.end_date]);

			// Сколько ночей свободно после end_date
			let maxNights;
			if (next.rows.length === 0) {
				maxNights = 4; // или сколько хочешь — общий лимит
			} else {
				const diffMs = new Date(next.rows[0].start_date) - new Date(booking.end_date);
				maxNights = Math.floor(diffMs / (1000 * 60 * 60 * 24));
			}

			res.json({ booking, maxNights });
		} catch (error) {
			console.log("Error getting current booking: ", error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async createApplication(req,res){
		const {user_id, room_id, start_date, end_date} = req.body
			try{
				if (!start_date || !end_date) {
				return res.status(400).json({ error: "Dates required" });
			}
			if (new Date(start_date) >= new Date(end_date)) {
				return res.status(400).json({ error: "End date must be after start date" });
			}
			if (new Date(start_date) < new Date(new Date().toDateString())) {
				return res.status(400).json({ error: "Start date in the past" });
			}

			const conflict = await pool.query(`SELECT id FROM applications WHERE room_id = $1 AND status IN ('Активно', 'Завершено') AND start_date < $3 AND end_date > $2 FOR UPDATE`, [room_id, start_date, end_date]);

			if (conflict.rows.length > 0) {
				return res.status(409).json({ error: "Dates already booked" });
			}

			const result = await pool.query(`INSERT INTO applications (user_id, room_id, status, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [user_id, room_id, 'Активно', start_date, end_date]);

			res.status(201).json(result.rows[0]);
		}catch(error){
			console.error('error', error)
		} finally {
        	pool.release();
    	}
	}

	// POST /api/bookings/:id/extend
	async extendBooking(req, res) {
		const client = await pool.connect();
		try {
			const { id } = req.params;
			const { nights } = req.body;
			const userId = req.body.user_id;

			if (!Number.isInteger(nights) || nights < 1) {
				return res.status(400).json({ error: "Invalid nights" });
			}

			await client.query('BEGIN');

			// Забираем бронь с блокировкой
			const cur = await client.query(`
				SELECT id, room_id, end_date
				FROM applications
				WHERE id = $1 AND user_id = $2
				AND status IN ('Активно', 'Завершено')
				FOR UPDATE
			`, [id, userId]);

			if (cur.rows.length === 0) {
				await client.query('ROLLBACK');
				return res.status(404).json({ error: "Booking not found" });
			}

			const booking = cur.rows[0];
			const newEnd = new Date(booking.end_date);
			newEnd.setDate(newEnd.getDate() + nights);

			// Проверяем, что сдвинутый конец не залезает в чужую бронь
			const conflict = await client.query(`
				SELECT id FROM applications
				WHERE room_id = $1
				AND id <> $2
				AND status IN ('Активно', 'Завершено')
				AND start_date < $3
				AND end_date   > $4
				FOR UPDATE
			`, [booking.room_id, booking.id, newEnd, booking.end_date]);

			if (conflict.rows.length > 0) {
				await client.query('ROLLBACK');
				return res.status(409).json({ error: "Dates already booked" });
			}

			const updated = await client.query(`
				UPDATE applications
				SET end_date = $1
				WHERE id = $2
				RETURNING *
			`, [newEnd, id]);

			await client.query('COMMIT');
			res.json(updated.rows[0]);
		} catch (error) {
			await client.query('ROLLBACK');
			console.log("Error extending booking: ", error);
			res.status(500).json({ error: "Internal server error" });
		} finally {
			client.release();
		}
	}
	
	async updateApplication(req,res){
		const id = parseInt(req.params.id, 10)
		const {user_id,room_id,status,start_date,end_date} = req.body 
		try{
			const application = await pool.query(`UPDATE applications SET user_id = $1,room_id = $2,status = $3,start_date = $4,end_date = $5 WHERE id = $6 RETURNING *`, [user_id,room_id,status,start_date,end_date,id])
			res.json(application.rows)
		}catch(error){
			console.error('error', error)
		}
	}

	async changeApplicationStatus(req,res){
		const id = parseInt(req.params.id, 10)
		try{
			const application = await pool.query(`UPDATE applications SET status = $1 WHERE id = $2 RETURNING *`, ["Завершено", id])
			res.json(application.rows)
		}catch(error){
			console.error('error', error)
		}
	}

	async deleteApplication(req,res){
		const id = parseInt(req.params.id, 10)
		try{
			const application = await pool.query(`DELETE FROM applications WHERE id = $1`, [id])
			res.json('Бронь удалена')
		}catch(error){
			console.error('error', error)
		}
	}
	
}
module.exports = new ApplicationController();