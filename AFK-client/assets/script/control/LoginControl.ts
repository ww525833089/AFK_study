import PinusHelp from "../pinus/PinusHelp";

export default class LoginControl{

    queryEntry(msg:any,callback:Function){
        const route = "connector.entryHandler.entry";

        return PinusHelp.request(route,msg,callback);
    }
}