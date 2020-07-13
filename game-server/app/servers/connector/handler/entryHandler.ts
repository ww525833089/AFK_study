import { Application, FrontendSession } from 'pinus';

export default function (app: Application) {
    return new EntryHandler(app);
}

export class EntryHandler {
    constructor(private app: Application) {

    }

    /**
     * 用户登入处理
     * @param msg 
     * @param session 
     */
    async entry(msg:{ rid: string, username: string}, session: FrontendSession) {
        
        let self = this;
        let rid = msg.rid;
        let uid = msg.username+'*'+rid;
        let sessionService = self.app.get("sessionService");

        if(!!sessionService.getByUid(uid)){
            console.error('duplicate log in');
            return{
                code:500,
                error:true
            };
        }

        await session.abind(uid);

        session.set('rid',rid);
        session.push('rid',function(err){
            if(err){
                console.error('保存rid到session时失败，原因：%j',err.stack);
            }
        });

        //注册用户登出时间
        session.on("closed",this.onUserLeave.bind(this));

        let users = await self.app.rpc.chat.chatRemote.add.route(session)(uid, self.app.get('serverId'), rid, true);
        return {
            users:users
        }

    }

    /**
     * 用户登出处理
     * @param session 
     */
    onUserLeave(session:FrontendSession){
        if(!session||!session.uid){
            return;
        }

        this.app.rpc.chat.chatRemote.kick.route(session,true)(session.uid,this.app.get('serverId'),session.get('rid'));
    }
}