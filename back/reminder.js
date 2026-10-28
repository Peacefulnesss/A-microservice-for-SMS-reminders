const pool = require("./db/index")
const cron = require('node-cron');
const { sendCheckoutEmail } = require('./mailer');
const  createNotification  = require('./db/notifications');

// Каждый час проверяем брони, у которых выезд — завтра
cron.schedule('0 * * * *', async () => {
    console.log('[cron] check checkout reminders', new Date().toISOString());
  const client = await pool.connect();
  try {
    const due = await client.query(`
        SELECT a.id, a.user_id, a.end_date, a.room_id,
        r.name AS room_name, u.email
        FROM applications a
        JOIN rooms r ON r.id = a.room_id
        JOIN users u ON u.id = a.user_id
        WHERE a.status = 'Активно'
            AND a.end_date = CURRENT_DATE + INTERVAL '1 day'
        FOR UPDATE OF a SKIP LOCKED
    `);

    for (const b of due.rows) {
      await client.query('BEGIN');

      // 1) in-app уведомление
      await createNotification(b.user_id,'system','bell','gold','Напоминание о выезде',`Ваше проживание заканчивается ${b.end_date.toISOString().slice(0,10)}. Хотите продлить?`,`/extend?booking=${b.id}`,);

      // 2) email
      try {
        await sendCheckoutEmail({
          to: b.email,
          roomName: b.room_name,
          endDate: b.end_date.toISOString().slice(0, 10),
          bookingId: b.id,
        });

        // 3) уведомление "письмо отправлено"
        await createNotification(b.user_id,'sms','send','cyan','Письмо отправлено',`На почту ${b.email} отправлено напоминание о выезде.`,null);
      } catch (mailErr) {
        console.log('Email failed:', mailErr);
        // не ставим флаг — попробуем в следующий час
        await client.query('ROLLBACK');
        continue;
      }

      await client.query('COMMIT');
    }
  } catch (err) {
    console.log('Reminder cron error:', err);
  } finally {
    client.release();
  }
});