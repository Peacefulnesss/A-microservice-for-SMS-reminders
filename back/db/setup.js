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
            photo VARCHAR(50) NOT NULL
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

async function createNotificationsTable() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            category VARCHAR(20) NOT NULL,       -- 'sms' | 'system' | 'booking'
            icon VARCHAR(20) NOT NULL,       -- 'bell' | 'percent' | 'check' | 'send'
            tone VARCHAR(10) NOT NULL,       -- 'gold' | 'green' | 'cyan'
            title TEXT NOT NULL,
            body TEXT NOT NULL,
            link TEXT,                       -- куда вести при клике
            is_read BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, created_at DESC);`) 
    } catch(error) {
        console.log("Error creating reviews table: ", error)
    }
}

async function createTables() {
    await createUsersTable()
    await createRoomsTable()
    await createApplicationsTable()
    await createNotificationsTable()
}

module.exports = createTables