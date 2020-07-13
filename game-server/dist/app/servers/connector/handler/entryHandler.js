"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    return new EntryHandler(app);
}
exports.default = default_1;
class EntryHandler {
    constructor(app) {
        this.app = app;
    }
    /**
     * 用户登入处理
     * @param msg
     * @param session
     */
    async entry(msg, session) {
        let self = this;
        let rid = msg.rid;
        let uid = msg.username + '*' + rid;
        let sessionService = self.app.get("sessionService");
        if (!!sessionService.getByUid(uid)) {
            console.error('duplicate log in');
            return {
                code: 500,
                error: true
            };
        }
        await session.abind(uid);
        session.set('rid', rid);
        session.push('rid', function (err) {
            if (err) {
                console.error('保存rid到session时失败，原因：%j', err.stack);
            }
        });
        //注册用户登出时间
        session.on("closed", this.onUserLeave.bind(this));
        let users = await self.app.rpc.chat.chatRemote.add.route(session)(uid, self.app.get('serverId'), rid, true);
        return {
            users: users
        };
    }
    /**
     * 用户登出处理
     * @param session
     */
    onUserLeave(session) {
        if (!session || !session.uid) {
            return;
        }
        this.app.rpc.chat.chatRemote.kick.route(session, true)(session.uid, this.app.get('serverId'), session.get('rid'));
    }
}
exports.EntryHandler = EntryHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vYXBwL3NlcnZlcnMvY29ubmVjdG9yL2hhbmRsZXIvZW50cnlIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsbUJBQXlCLEdBQWdCO0lBQ3JDLE9BQU8sSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUZELDRCQUVDO0FBRUQsTUFBYSxZQUFZO0lBQ3JCLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFFcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQW9DLEVBQUUsT0FBd0I7UUFFdEUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7UUFDbEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsR0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDO1FBQy9CLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEQsSUFBRyxDQUFDLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBQztZQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDbEMsT0FBTTtnQkFDRixJQUFJLEVBQUMsR0FBRztnQkFDUixLQUFLLEVBQUMsSUFBSTthQUNiLENBQUM7U0FDTDtRQUVELE1BQU0sT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6QixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxVQUFTLEdBQUc7WUFDM0IsSUFBRyxHQUFHLEVBQUM7Z0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckQ7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFVBQVU7UUFDVixPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWpELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUcsT0FBTztZQUNILEtBQUssRUFBQyxLQUFLO1NBQ2QsQ0FBQTtJQUVMLENBQUM7SUFFRDs7O09BR0c7SUFDSCxXQUFXLENBQUMsT0FBdUI7UUFDL0IsSUFBRyxDQUFDLE9BQU8sSUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUM7WUFDdEIsT0FBTztTQUNWO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuSCxDQUFDO0NBQ0o7QUF2REQsb0NBdURDIn0=