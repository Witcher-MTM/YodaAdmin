const getMainKeyboard = async()=>{
    let keyboard = []
    keyboard.push(["Add new link","All links"],["Remove link","Update link"])
    return {
        "keyboard": keyboard,
        is_persistent: true,
        resize_keyboard: true
    }
}


module.exports={getMainKeyboard}