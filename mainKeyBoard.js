const getMainKeyboard = async()=>{
    let keyboard = []
    keyboard.push(["Add new link","All links"])
    return {
        "keyboard": keyboard,
        is_persistent: true,
        resize_keyboard: true
    }
}


module.exports={getMainKeyboard}