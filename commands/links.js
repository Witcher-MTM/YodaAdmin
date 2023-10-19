const { getData } = require("../requsets");

const LinksHandler = async(bot,msg)=>{
    const links = await getData(`${process.env.API_URL}/link`)
    console.log(links)
    let keyboard = []
    for (let i = 0; i < links.length; i++) {
        keyboard.push([{
            text: links[i].region,
            callback_data: `Region:${links[i].region}`
        }])
        
    }
    const replyKeyboard = {
        inline_keyboard: keyboard,
    };
    await bot.sendMessage(msg.chat.id, `List of regions`, {reply_markup: replyKeyboard});
}

module.exports = {LinksHandler}