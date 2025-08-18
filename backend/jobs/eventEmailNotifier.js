// backend/jobs/eventEmailNotifier.js

require('dotenv').config();
const cron = require('node-cron');
const db = require('../config/db'); // Adjust path to your MySQL config
const nodemailer = require('nodemailer');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // SMTP host
  port: process.env.EMAIL_PORT || 587,              // Port
  secure: false,                                    // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Utility to format date as YYYY-MM-DD
const formatDate = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Daily cron job at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('[EventEmailNotifier] Running daily event check...');

  try {
    const todayStr = formatDate(new Date());

    // -----------------------
    // 1️⃣ Events on the day
    // -----------------------
    const [todayEvents] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_description, u.email 
       FROM events e 
       JOIN users u ON e.user_id = u.user_id 
       WHERE DATE(e.event_date) = ? 
         AND e.notified_on_day IS NULL`,
      [todayStr]
    );

    for (const ev of todayEvents) {
      await transporter.sendMail({
        from: `"Event Reminder" <${process.env.EMAIL_USER}>`,
        to: ev.email,
        subject: `Today's Event: ${ev.event_name}`,
        text: `Hello,\n\nReminder: Your event "${ev.event_name}" is scheduled for today.\n\nDescription: ${ev.event_description || 'No description'}\n\nThank you!`
      });

      await db.query('UPDATE events SET notified_on_day = NOW() WHERE event_id = ?', [ev.event_id]);
      console.log(`[EventEmailNotifier] Sent on-day email for: ${ev.event_name}`);
    }

    // -----------------------
    // 2️⃣ Events 3 days before
    // -----------------------
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 3);
    const reminderStr = formatDate(reminderDate);

    const [upcomingEvents] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_description, u.email 
       FROM events e 
       JOIN users u ON e.user_id = u.user_id 
       WHERE DATE(e.event_date) = ? 
         AND e.notified_before_day IS NULL`,
      [reminderStr]
    );

    for (const ev of upcomingEvents) {
      await transporter.sendMail({
        from: `"Event Reminder" <${process.env.EMAIL_USER}>`,
        to: ev.email,
        subject: `Upcoming Event: ${ev.event_name}`,
        text: `Hello,\n\nReminder: Your event "${ev.event_name}" is coming in 3 days.\n\nDescription: ${ev.event_description || 'No description'}\n\nThank you!`
      });

      await db.query('UPDATE events SET notified_before_day = NOW() WHERE event_id = ?', [ev.event_id]);
      console.log(`[EventEmailNotifier] Sent 3-day reminder for: ${ev.event_name}`);
    }

    console.log('[EventEmailNotifier] Daily check completed.');
  } catch (err) {
    console.error('[EventEmailNotifier Error]', err);
  }
});
