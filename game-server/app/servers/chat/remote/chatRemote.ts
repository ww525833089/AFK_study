import { Application, ChannelService, RemoterClass, FrontendSession } from "pinus";

export default function (app:Application){
    return new ChatRemote(app);
}

//UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        chat: {
            chatRemote: RemoterClass<FrontendSession, ChatRemote>;
        };
    }
}

export class ChatRemote{
    constructor(private app:Application){
        this.app = app;
        this.channelService = app.get('channelService');
    }

    private channelService:ChannelService;


    public async add(uid:string, sid:string, name:string,flag:boolean){
        let channel = this.channelService.getChannel(name,flag);
        let username = uid.split('*')[0];
        let param = {
            user:username
        };
        channel.pushMessage('onAdd',param);
        if(!!channel){
            channel.add(uid,sid);
        }

        return this.get(name, flag);
    }

    private get(name:string,flag:boolean){
        let users :string[] = [];
        let channel = this.channelService.getChannel(name,flag);
        if(!!channel){
            users = channel.getMembers();
        }
        for (let i = 0; i < users.length; i++) {
            users[i] = users[i].split('*')[0];            
        }
        return users;
    }

    public async kick(uid:string , sid:string , name:string){
        let channel = this.channelService.getChannel(name,false);

        if(!!channel){
            channel.leave(uid,sid);
        }
        let username = uid.split('*')[0];

        let param = {
            user:username
        };
        channel.pushMessage('onLeave',param);

    }

}