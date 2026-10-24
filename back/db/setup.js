const pool = require("./index")

async function createUsersTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE
            );`) 
    } catch(error) {
        console.log("Error creating users table: ", error)
    }
}

async function createRoomsTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS rooms(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            price DECIMAL(8,2) NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            capacity INTEGER NOT NULL,
            photo BYTEA NOT NULL
            );`) 
    } catch(error) {
        console.log("Error creating rooms table: ", error)
    }
}

async function createApplicationsTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS applications(
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            room_id INTEGER NOT NULL REFERENCES rooms(id),
            status status,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL
            );`) 
    } catch(error) {
        console.log("Error creating applications table: ", error)
    }
}

async function createReviewsTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS reviews(
            id SERIAL PRIMARY KEY,
            application_id INTEGER NOT NULL UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
            );`) 
    } catch(error) {
        console.log("Error creating reviews table: ", error)
    }
}

async function createTables() {
    await createUsersTable()
    await createRoomsTable()
    await createApplicationsTable()
    await createReviewsTable()
}

module.exports = createTables