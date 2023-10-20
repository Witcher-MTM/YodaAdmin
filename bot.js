const TelegramBot = require('node-telegram-bot-api');
const { startHandler } = require('./commands/start');
const { contactHandler, userAccess } = require('./commands/contact');
const { linkRequest, LinkRequestDivider, LinkRegionRemove, LinkRegionUpdate } = require('./controller/Link');
const { getNextStepList, deleteNextStep } = require('./RegisterNextStep');
const { LinksHandler } = require('./controller/Link');
const { getData } = require('./requsets');
require('dotenv').config()
const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, async (msg) => {
  startHandler(bot, msg)
});

bot.on('contact', (msg) => {
  contactHandler(bot, msg)
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if (userAccess[chatId]) {
    const nextStepList = await getNextStepList()
    if (nextStepList.has(msg.chat.id.toString())) {
      nextStepList.get(msg.chat.id.toString())(bot, msg)
      await deleteNextStep(msg.chat.id.toString())
    }
    if (msg.text === 'Add new link') {
      linkRequest(bot, msg)

    }
    if (msg.text === 'All links') {
      LinksHandler(bot, msg)
    }
  }
})
bot.on('callback_query', async (callbackQuery) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
  var link
  if (userAccess[chatId]) {
    const links = await getData(`${process.env.API_URL}/link`)
    for (let i = 0; i < links.length; i++) {
      if (links[i].region == action) {
        link = links[i];
        break;
      }
    }
    const actionParts = action.split(':');
    if (actionParts.length === 2) {
      const [actionType, linkId] = actionParts;

      if (actionType === 'upd') {
        LinkRegionUpdate(bot, chatId, linkId);
      } else if (actionType === 'rem') {
        LinkRegionRemove(bot, chatId, linkId)
      }
    }
    else {
      LinkRequestDivider(bot, chatId, link);
    }
  }

});

bot.on('polling_error', (error) => {
  console.log(`Помилка polling: ${error.message}`);

});

