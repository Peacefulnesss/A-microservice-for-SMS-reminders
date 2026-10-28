const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // true для порта 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendCheckoutEmail({ to, roomName, endDate, bookingId }) {
  const extendUrl = `${process.env.APP_URL}/extend?booking=${bookingId}`;
  await transporter.sendMail({
    from: `"Hotel" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Срок проживания подходит к концу',
    html: `
      <p>Здравствуйте!</p>
      <p>Ваше проживание в номере <b>${roomName}</b> заканчивается
         <b>${endDate}</b>.</p>
      <p>Хотите продлить бронь? Это можно сделать в один клик:</p>
      <p><a href="${extendUrl}">Продлить проживание</a></p>
      <p>Если продление невозможно — номер уже забронирован на следующие даты,
         вы увидите это на странице.</p>
    `,
  });
}

module.exports = { sendCheckoutEmail };