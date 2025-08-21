require("dotenv").config();
const db = require("../config/db");
const nodemailer = require("nodemailer");

async function checkEventsAndNotify() {
  try {
    // 🔍 Fetch today’s events that have not been notified
    const [events] = await db.query(
      `SELECT e.event_id, e.event_name, e.event_description, e.event_date, u.email
       FROM events e
       JOIN users u ON e.user_id = u.user_id
       WHERE DATE(e.event_date) = CURDATE()
       AND e.notified_on_day IS NULL`
    );

    if (events.length === 0) {
      console.log("ℹ️ No events today or already notified.");
      return;
    }

    // ✉️ Setup transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (const event of events) {
      await transporter.sendMail({
        from: `"Event Reminder" <${process.env.EMAIL_USER}>`,
        to: event.email,
        subject: `Event Reminder: ${event.event_name}`,
        text: `Hello,

Reminder: Your event "${event.event_name}" is scheduled for today (${event.event_date}).

Description: ${event.event_description || "No description"}

Thank you!`,
      });

      // ✅ Mark as notified
      await db.query(
        "UPDATE events SET notified_on_day = NOW() WHERE event_id = ?",
        [event.event_id]
      );

      console.log(`✅ Email sent for: ${event.event_name} → ${event.email}`);
    }

    console.log("✅ All notifications sent.");
  } catch (err) {
    console.error("❌ Error in notifier:", err.message);
  }
}

module.exports = checkEventsAndNotify;
