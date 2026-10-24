const pool = require ('../db/index')

class ReviewController{
	async getAllReviews(req,res){
		try{
			const review = await pool.query(`SELECT * FROM reviews`)
			res.json(review.rows)
		}catch(error){
			console.log(error)
		}
	}

	async getReviewById(req,res){
		const id = parseInt(req.params.id)
		try{
			const review = await pool.query(`SELECT * FROM reviews WHERE id = $1`, [id])
			res.json(review.rows)
		}catch(error){
			console.log(error)
		}
	}

	async createReview(req,res){
		try{
			const review = await pool.query(`INSERT INTO reviews (application_id, text) VALUES ($1,$2) RETURNING *`, [application_id, text])
			res.json(review.rows)
		}catch(error){
			console.error('error', error)
		}
	}
	
	async updateReview(req,res){
		const id = parseInt(req.params.id, 10)
		const {application_id, text} = req.body 
		try{
			const review = await pool.query(`UPDATE reviews SET application_id = $1, text = $2 WHERE id = $3 RETURNING *`, [application_id, text,id])
			res.json(review.rows)
		}catch(error){
			console.error('error', error)
		}
	}

	async deleteReview(req,res){
		const id = parseInt(req.params.id, 10)
		try{
			const review = await pool.query(`DELETE FROM reviews WHERE id = $1`, [id])
			res.json('Бронь удалена')
		}catch(error){
			console.error('error', error)
		}
	}
	
}
module.exports = new ReviewController();