const pool = require("./index")

async function createNotification(userId, category, icon, tone, title, body, link = null ) {
  const result = await pool.query(`
    INSERT INTO notifications (user_id, category, icon, tone, title, body, link)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [userId, category, icon, tone, title, body, link]);
  return result.rows[0];
}

module.exports = createNotification ;