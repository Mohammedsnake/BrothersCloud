// test-email-notifier.js
require('dotenv').config();
const db = require('./config/db'); // MySQL connection (mysql2/promise)
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or other email service
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // app password for Gmail
  }
});

async function sendEventEmails(today = new Date()) {
  try {
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2,'0');
    const dd = String(today.getDate()).padStart(2,'0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // ------------------------------
    // 1️⃣ EVENTS ON THE DAY
    // ------------------------------
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
        subject: `Today: ${ev.event_name}`,
        text: `Reminder: Your event "${ev.event_name}" is scheduled for today.\n\nDescription: ${ev.event_description || 'No description'}`
      });

      await db.query('UPDATE events SET notified_on_day = NOW() WHERE event_id = ?', [ev.event_id]);
      console.log(`[EmailNotifier] Sent on-day email for: ${ev.event_name}`);
    }

    // ------------------------------
    // 2️⃣ EVENTS 3 DAYS BEFORE
    // ------------------------------
    const reminderDate = new Date(today);
    reminderDate.setDate(today.getDate() + 3);
    const yyyyR = reminderDate.getFullYear();
    const mmR = String(reminderDate.getMonth() + 1).padStart(2,'0');
    const ddR = String(reminderDate.getDate()).padStart(2,'0');
    const reminderStr = `${yyyyR}-${mmR}-${ddR}`;

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
        text: `Reminder: Your event "${ev.event_name}" is coming in 3 days.\n\nDescription: ${ev.event_description || 'No description'}`
      });

      await db.query('UPDATE events SET notified_before_day = NOW() WHERE event_id = ?', [ev.event_id]);
      console.log(`[EmailNotifier] Sent 3-day reminder for: ${ev.event_name}`);
    }

    console.log('[EmailNotifier] Test run completed.');
  } catch (err) {
    console.error('[EmailNotifier Error]', err);
  }
}

// Run immediately for testing
sendEventEmails();
