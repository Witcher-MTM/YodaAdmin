const { getMainKeyboard } = require('../mainKeyBoard');

const startHandler = async (bot, msg) => {
    const startQuestion = 'For work i need your phone number';
    const chatId = msg.chat.id;
    const replyKeyboard = {
        keyboard: [
            [{ text: 'Number', request_contact: true }],
        ],
        one_time_keyboard: true,
    };
    const options = {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify(replyKeyboard)
    };
    bot.sendMessage(chatId, startQuestion, options);
}

module.exports = { startHandler }