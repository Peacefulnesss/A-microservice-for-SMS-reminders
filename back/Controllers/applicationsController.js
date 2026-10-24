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

	async createApplication(req,res){
		try{
			const application = await pool.query(`INSERT INTO applications (user_id,room_id,status,start_date,end_date) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [user_id,room_id,status,start_date,end_date])
			res.json(application.rows)
		}catch(error){
			console.error('error', error)
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