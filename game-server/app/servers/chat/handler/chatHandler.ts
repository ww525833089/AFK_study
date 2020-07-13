import { Application, BackendSession, Channel } from "pinus";

export default function(app:Application){
    return new ChatHandler(app);
}

export class ChatHandler{
    constructor(private app:Application){

    }

    async send(msg:{content:string,target:string},session:BackendSession){
        let rid = session.get('rid');
        let username = session.uid.split('*')[0];
        let channelService = this.app.get("channelService");
        let param = {
            msg:msg.content,
            from:username,
            target:msg.target
        };

        let channel = channelService.getChannel(rid,false);
        if(msg.target=="*"){
            channel.pushMessage('onChat',param);
        }
        else{
            let tuid = msg.target+'*'+rid;
            let tsid = channel.getMember(tuid)['sid'];
            channelService.pushMessageByUids('onChat',param,[{
                uid:tuid,
                sid:tsid
            }]);
        }

    }


}