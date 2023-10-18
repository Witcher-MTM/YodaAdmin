const TelegramBot = require('node-telegram-bot-api');
const { getMainKeyboard } = require('./mainKeyBoard');
const {getNextStepList, deleteNextStep} = require("./RegisterNextStep");
require('dotenv').config()
const token = process.env.BOT_API;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
    const startQuestion = 'Ви бажаєте надіслати свій номер телефона або нікнейм?';

const replyKeyboard = {
  keyboard: [
    [{ text: 'Номер телефона', request_contact: true }],
  ],
  one_time_keyboard: true, // Призначено для одноразового використання
};

    const chatId = msg.chat.id;
    const mainKeyboard = await getMainKeyboard();
    const message = `
  🌟 <b>Welcome to the Admin Panel for Links in ToDo App</b> 🌟
  
  Here's what you can do:
  ➕ Add new link - Add a new region and a new link for this region.
  🔍 All links - I will send you all the links we have.
  ❌ Remove link - Choose a link you want to delete.
  🔄 Update link - Choose a region and send me a new link for this region.
    `;
  
    const options = {
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(replyKeyboard)//mainKeyboard
    };
  
    bot.sendMessage(chatId, startQuestion, options);
  });

  bot.on('contact', (msg) => {
    const chatId = msg.chat.id;
    const phoneNumber = msg.contact.phone_number;
  
    bot.sendMessage(chatId, `Ви надіслали свій номер телефона: ${phoneNumber}`);
  });

bot.on('message', async(msg)=>{
    const chatId = msg.chat.id;
    if(msg.text === 'Add new link'){
        bot.sendMessage(chatId, 'Add new link');
    }
    if(msg.text === 'All links'){
        bot.sendMessage(chatId, 'All links');
    }
    if(msg.text === 'Update link'){
        bot.sendMessage(chatId, 'Update link');
    }
    if(msg.text === 'Remove link'){
        bot.sendMessage(chatId, 'Remove link');
    }
})
bot.on('callback_query', async(callbackQuery) => {
    const action = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
});

bot.on('polling_error', (error) => {
  console.log(`Помилка polling: ${error.message}`);
  
});

