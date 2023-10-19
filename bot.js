const TelegramBot = require('node-telegram-bot-api');
const { getData } = require('./requsets');
const { startHandler } = require('./commands/start');
const { contactHandler , userAccess} = require('./commands/contact');
const { LinkRequset } = require('./messages/linkRequest');
const { getNextStepList, deleteNextStep } = require('./RegisterNextStep');
const { LinksHandler } = require('./commands/links');
require('dotenv').config()
const token = process.env.BOT_API;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  startHandler(bot, msg)
});

bot.on('contact', (msg) => {
  contactHandler(bot,msg)
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  if(userAccess[chatId]){
    const nextStepList = await getNextStepList()
    if (nextStepList.has(msg.chat.id.toString())) {
        nextStepList.get(msg.chat.id.toString())(bot, msg)
        await deleteNextStep(msg.chat.id.toString())
    }
    if (msg.text === 'Add new link') {
      LinkRequset(bot,msg)
    }
    if (msg.text === 'All links') {
      bot.sendMessage(chatId, `Here all links we have\n`);
    }
    if (msg.text === 'Update link') {
      bot.sendMessage(chatId, 'Update link');
    }
    if (msg.text === 'Remove link') {
      bot.sendMessage(chatId, 'Remove link');
    }
  }else{
    startHandler(bot,msg)
  }
})
bot.on('callback_query', async (callbackQuery) => {
  const action = callbackQuery.data;
  const chatId = callbackQuery.message.chat.id;
});

bot.on('polling_error', (error) => {
  console.log(`Помилка polling: ${error.message}`);

});

