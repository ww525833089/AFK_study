import PinusHelp from "../pinus/PinusHelp";

export default class ChatControl{
    sendChatMessage(rid, msg:any,callback:Function){
        const route = "chat.chatHandler.send";

        return PinusHelp.sendData(route, rid, msg,callback);
    }
}