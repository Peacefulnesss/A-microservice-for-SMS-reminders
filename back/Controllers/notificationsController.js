const pool = require("../db/index")

class NotificationController {
    async listNotifications(req, res) {
    try {
        const { category = 'all' } = req.query;
        const userId = req.body.user_id;

        const params = [userId];
        let where = 'user_id = $1';
        if (category !== 'all') {
        params.push(category);
        where += ` AND category = $${params.length}`;
        }

        const result = await pool.query(`
        SELECT id, category AS cat, icon, tone, title,
            body AS text, link AS to, is_read,
            created_at
            FROM notifications
            WHERE ${where}
            ORDER BY created_at DESC
            LIMIT 100
        `, params);

        res.json(result.rows);
    } catch (e) {
        console.log('listNotifications:', e);
        res.status(500).json({ error: 'Internal server error' });
    }
    }

    // POST /api/notifications/:id/read
    async  markRead(req, res) {
    try {
        await pool.query(
        'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id],
        );
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
    }
    }

}

module.exports = new NotificationController()