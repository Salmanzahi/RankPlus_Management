import { world } from "@minecraft/server";


function success(target, message_content){
    target.playSound('random.toast')
    target.sendMessage(message_content)
}


function error(target, message_content){
    target.playSound('block.anvil.land')
    target.sendMessage(message_content)
}


function broadcast(message_content){
    world.sendMessage(message_content)
}


export  {
    success,
    error,
    broadcast,
} 