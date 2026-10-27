const express = require('express');
const path = require('path');
const dotenv = require("dotenv")
const createTables = require('./db/setup')
const pool = require("./db/index")
const cors = require("cors")

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

const userRouter = require("./Routes/userRouter")
const authRouter = require("./Routes/authRouter")
const roomRouter = require("./Routes/roomRouter")
const applicationRouter = require("./Routes/applicationRouter")
const reviewRouter = require("./Routes/reviewRouter")

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:5173' // адрес вашего фронтенда
}));
app.use('/', (req,res,next) => {
	console.log(`${req.method}://${req.url}`)
	next()
})
app.use('/api/auth', authRouter)
app.use("/api/user", userRouter)
app.use('/api/room', roomRouter)
app.use("/api/application", applicationRouter)
app.use('/api/review', reviewRouter)

async function initializeApp(){
	try{
		const status = await pool.query("SELECT typname FROM pg_type WHERE typname = 'status'")
		if(status.rows.length == 0) {
			await pool.query("CREATE TYPE status AS ENUM('Завершено','Reject','Активно')")
			console.log("Type status was created!")
		}
		createTables()
		app.listen(PORT, () => {
			console.log(`Server is running on port: ${PORT}`);
		});
	}catch(error){
		console.error(`Error initializing app`, error.message)
	}
}

initializeApp();