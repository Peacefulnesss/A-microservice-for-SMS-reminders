const pool = require ('../db/index')

class RoomController{
	async getAllRooms(req,res) {
		try{
			const room = await pool.query(`SELECT * FROM rooms`)
			res.json(room.rows)
		}catch(error){
			console.log(error)
		}
	}

	async getRoomById(req,res){
		const id = parseInt(req.params.id)
		try{
			const room = await pool.query(`SELECT * FROM rooms WHERE id = $1`, [id])
			res.json(room.rows)
		}catch(error){
			console.log(error)
		}
	}

	async createRoom(req,res){
		const { name, price, is_active, capacity, photo } = req.body;
		try{
			const room = await pool.query(`INSERT INTO rooms (name,price,is_active,capacity,photo) VALUES ($1,$2,$3,$4,$5) RETURNING *`, [name,price,is_active,capacity,photo])
			res.json(room.rows)
		}catch(error){
			console.error('error', error)
		}
	}
	
	async updateRoom(req,res){
		const id = parseInt(req.params.id, 10)
		const {name,price,is_active,capacity,photo} = req.body 
		try{
			const room = await pool.query(`UPDATE rooms SET name = $1,price = $2,is_active = $3,capacity = $4,photo = $5 WHERE id = $6 RETURNING *`, [name,price,is_active,capacity,photo,id])
			res.json(room.rows)
		}catch(error){
			console.error('error', error)
		}
	}

	async deleteRoom(req,res){
		const id = parseInt(req.params.id, 10)
		try{
			const room = await pool.query(`DELETE FROM rooms WHERE id = $1`, [id])
			res.json('Номер удален')
		}catch(error){
			console.error('error', error)
		}
	}
	
}
module.exports = new RoomController();