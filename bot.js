require("dotenv").config();
const { Telegraf, Telegram } = require("telegraf");
const schedule = require("node-schedule");

const { sendSchedule, returnPollResult, rollDice, help } = require("./actions");

if (process.env.BOT_TOKEN === undefined) {
  throw new TypeError("BOT_TOKEN must be provided!");
}
const app = new Telegraf(process.env.BOT_TOKEN);

// app.command("schedule", sendSchedule);

app.on("poll", returnPollResult);
app.command("roll", rollDice);

app.help(help);

app.launch(); // запуск бота
console.info("Bot launched!");

schedule.scheduleJob("*/5 * * * * *", () => sendSchedule(app));

// Enable graceful stop
process.once("SIGINT", async () => {
  app.stop("SIGINT");
});
process.once("SIGTERM", async () => {
  app.stop("SIGTERM");
});
