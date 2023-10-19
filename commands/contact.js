const { getMainKeyboard } = require('../mainKeyBoard');
const { getData } = require('../requsets');
const userAccess = {};
const contactHandler = async (bot, msg) => {
    const chatId = msg.chat.id;
    const contact = msg.contact
    const phoneNumber = contact.phone_number;
    const user = await getData(`${process.env.API_URL}/user/${phoneNumber}`)
    console.log(user)
    if (user) {
        bot.sendMessage(chatId, `Thanks for trust`);
        userAccess[chatId] = true;
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
            reply_markup: JSON.stringify(mainKeyboard)
        };
        bot.sendMessage(chatId, message, options);
    } else {
        userAccess[chatId] = false;
        bot.sendMessage(chatId, `U didnt have permission for this bot!`);
    }
}

module.exports = { contactHandler , userAccess}