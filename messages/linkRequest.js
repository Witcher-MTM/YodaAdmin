const { registerNextStep } = require("../RegisterNextStep")
const { addData } = require("../requsets")
const data = {}

const saveRegion = async(bot,msg)=>{
    data['region'] = msg.text
    await bot.sendMessage(msg.chat.id,"Enter new link")
    await registerNextStep(msg.chat.id.toString(), saveLink)
}
const saveLink = async(bot,msg)=>{
    data['link'] = msg.text 
    const date = new Date()
    const formattedDate = date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\./g, '-');
    data['datetime'] = formattedDate
    result = await addData(`${process.env.API_URL}/link/add`,data)
    console.log(result)
    bot.sendMessage(msg.chat.id, `created\nLink:${result.link}\nRegion:${result.region}`)
}
const LinkRequset = async(bot,msg)=>{
    await bot.sendMessage(msg.chat.id,"Enter new region")
    await registerNextStep(msg.chat.id.toString(), saveRegion)
}

module.exports = {LinkRequset}
