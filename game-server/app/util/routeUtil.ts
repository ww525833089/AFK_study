import { Application, Session } from "pinus";
import { dispatch } from "./dispatcher";

export function chat(session:Session,mag:any,app:Application,cb:(err:Error,serverId?:string)=>void){
    let chatServers = app.getServersByType('chat');
    if(!chatServers||chatServers.length===0){
        cb(new Error('找不到chat服务器'));
        return ;
    }

    let chatServer = dispatch(session.get('rid'), chatServers);
    cb(null,chatServer.id);
}