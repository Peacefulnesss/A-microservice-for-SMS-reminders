const express = require('express');
const dotenv = require("dotenv")
const createTables = require('./db/setup')
const pool = require("./db/index")

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

const userRouter = require("./Routes/userRouter")
const authRouter = require("./Routes/authRouter")
const roomRouter = require("./Routes/roomRouter")
const applicationRouter = require("./Routes/applicationRouter")
const reviewRouter = require("./Routes/reviewRouter")

app.use(express.json());
app.use('/api/auth', authRouter)
app.use("/api/user", userRouter)
app.use('/api/room', roomRouter)
app.use("/api/application", applicationRouter)
app.use('/api/review', reviewRouter)

async function initializeApp(){
	try{
		const status = await pool.query("SELECT typname FROM pg_type WHERE typname = 'status'")
		if(status.rows.length == 0) {
			await pool.query("CREATE TYPE status AS ENUM('Accept','Reject', 'Pending')")
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