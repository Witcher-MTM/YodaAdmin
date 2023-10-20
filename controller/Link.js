const { registerNextStep } = require("../RegisterNextStep")
const { getMainKeyboard } = require("../mainKeyBoard")
const { addData, getData, updateData, removeData } = require("../requsets")
const data = {}
var link_id
const saveRegion = async (bot, msg) => {
    data['region'] = msg.text
    await bot.sendMessage(msg.chat.id, "Enter new link")
    await registerNextStep(msg.chat.id.toString(), saveLink)
}
const saveLink = async (bot, msg) => {
    data['link'] = msg.text
    const date = new Date()
    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '-');
    data['datetime'] = formattedDate
    result = await addData(`${process.env.API_URL}/link/add`, data)
    console.log(result)
    const mainKeyboard = await getMainKeyboard();    
    const options = {
        reply_markup: JSON.stringify(mainKeyboard)
    };
    bot.sendMessage(msg.chat.id, `created\nLink:${result.link}\nRegion:${result.region}`,options)
}
const updateLink = async (bot, msg) => {
    data['link'] = msg.text
    const date = new Date()
    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '-');
    data['datetime'] = formattedDate
    console.log('upd\n', data, link_id)
    result = await updateData(`${process.env.API_URL}/link/${link_id}`, data)
    const mainKeyboard = await getMainKeyboard();    
    const options = {
        reply_markup: JSON.stringify(mainKeyboard)
    };
    bot.sendMessage(msg.chat.id, `changed\nRegion:${result.region}\nLink:${result.link}`,options)
}
const removeLink = async(bot,msg)=>{
    answer = msg.text
    if(answer.toLowerCase() == 'y' || answer.toLowerCase() == 'yes'){
        await removeData(`${process.env.API_URL}/link/${link_id}`)
        const mainKeyboard = await getMainKeyboard();    
        const options = {
            reply_markup: JSON.stringify(mainKeyboard)
        };
        bot.sendMessage(msg.chat.id, 'You deleted this link',options)
    }else{
        const mainKeyboard = await getMainKeyboard();    
        const options = {
            reply_markup: JSON.stringify(mainKeyboard)
        };
        bot.sendMessage(msg.chat.id, 'You have discard this action',options)
    }
}
const linkRequest = async (bot, msg) => {
    await bot.sendMessage(msg.chat.id, "Enter new region")
    await registerNextStep(msg.chat.id.toString(), saveRegion)
}
const LinksHandler = async (bot, msg) => {
    const links = await getData(`${process.env.API_URL}/link`)
    console.log(links)
    let keyboard = []
    for (let i = 0; i < links.length; i++) {
        keyboard.push([{
            text: `${links[i].region} - ${links[i].link}`,
            callback_data: `${links[i].region}`
        }])

    }
    const replyKeyboard = {
        inline_keyboard: keyboard,
    };
    await bot.sendMessage(msg.chat.id, `All links: `, { reply_markup: replyKeyboard }).then((message)=>{
        const messageId = message.message_id;
        bot.on('callback_query', (callbackQuery) => {
            bot.deleteMessage(msg.chat.id, messageId);
        });
    });
}
const LinkRequestDivider = async (bot, chatId, link) => {
    let keyboard = []
    keyboard.push([{ text: 'Update', callback_data: `upd:${link._id}` }], [{ text: 'Remove', callback_data: `rem:${link._id}` }],)
    const replyKeyboard = {
        inline_keyboard: keyboard,
    };
    await bot.sendMessage(chatId, `${link.region}-${link.link}`, { reply_markup: replyKeyboard }).then((message)=>{
        const messageId = message.message_id;
        bot.on('callback_query', (callbackQuery) => {
            bot.deleteMessage(chatId, messageId);
        });
    })
}
const LinkRegionUpdate = async (bot, chatId, linkId) => {    
    link_id=linkId
    await bot.sendMessage(chatId, `Enter new link for id-${link_id}`)
    await registerNextStep(chatId.toString(), updateLink)
}
const LinkRegionRemove = async (bot, chatId, linkId) => {    
    link_id=linkId
    const result = await getData(`${process.env.API_URL}/link/${link_id}`)
    await bot.sendMessage(chatId, `Press [Y] if you sure to delete |${result.region} - ${result.link}|, press anything else for discard`)
    await registerNextStep(chatId.toString(), removeLink)
}
module.exports = { linkRequest, LinksHandler, LinkRegionUpdate, LinkRequestDivider, LinkRegionRemove }
