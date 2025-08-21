const cron = require("node-cron");
const checkEventsAndNotify = require("../utils/notifier");

// Run every day at 9 AM
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running daily event email notifier...");
  await checkEventsAndNotify();
});

// Run once when starting (for testing)
(async () => {
  console.log("🚀 Running notifier immediately (startup test)...");
  await checkEventsAndNotify();
})();
