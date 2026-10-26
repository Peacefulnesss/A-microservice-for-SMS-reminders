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

	async createApplication(req,res){
		const client = await pool.connect();
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

			await client.query('BEGIN');

			const conflict = await client.query(`SELECT id FROM applications WHERE room_id = $1 AND status IN ('Pending', 'Accept') AND start_date < $3 AND end_date > $2 FOR UPDATE`, [room_id, start_date, end_date]);

			if (conflict.rows.length > 0) {
				await client.query('ROLLBACK');
				return res.status(409).json({ error: "Dates already booked" });
			}

			const result = await client.query(`INSERT INTO applications (user_id, room_id, status, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [user_id, room_id, 'Pending', start_date, end_date]);

			await client.query('COMMIT');
			res.status(201).json(result.rows[0]);
		}catch(error){
			console.error('error', error)
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