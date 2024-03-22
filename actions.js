let messageInfo;

const sendSchedule = async (app) => {
  messageInfo = await app.telegram.sendPoll(
    process.env.CHAT_ID,
    `Когда играем? \n Опрос закроется через ${
      process.env.CLOSE_POLL_TIMER / 1000
    } секунд`,
    [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
    { is_anonymous: false, allows_multiple_answers: true }
  );

  await setTimeout(
    () => app.telegram.stopPoll(process.env.CHAT_ID, messageInfo.message_id),
    process.env.CLOSE_POLL_TIMER
  );
};

const returnPollResult = async (ctx) => {
  let pollResultMessage = `${process.env.MENTION_USER}\n*Результаты опроса:*`;

  if (ctx.poll.is_closed === true) {
    const pollResult = ctx.poll.options.map((option, index) => {
      if (option.voter_count === 0) {
        pollResultMessage += `\n_${option.text}_ : *${option.voter_count}* человек`;
      }
    });

    ctx.telegram.sendMessage(messageInfo.chat.id, pollResultMessage, {
      parse_mode: "Markdown",
    });
  }
};

const rollDice = (ctx) => ctx.sendDice({ disable_notification: false });

const help = (ctx) =>
  ctx.reply(
    `Бот запускает в чате опрос каждое воскресенье в 18:00 и через 24 часа подводит итоги голосования.\n\nДоступные команды:\n/help - вызвать справку\n/roll - бросить d6`
  );

module.exports = { sendSchedule, returnPollResult, rollDice, help };
