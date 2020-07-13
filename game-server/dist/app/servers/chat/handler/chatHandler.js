"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    return new ChatHandler(app);
}
exports.default = default_1;
class ChatHandler {
    constructor(app) {
        this.app = app;
    }
    async send(msg, session) {
        let rid = session.get('rid');
        let username = session.uid.split('*')[0];
        let channelService = this.app.get("channelService");
        let param = {
            msg: msg.content,
            from: username,
            target: msg.target
        };
        let channel = channelService.getChannel(rid, false);
        console.log(msg);
        console.info(msg.target);
        console.info(msg.content);
        if (msg.target == "*") {
            channel.pushMessage('onChat', param);
        }
        else {
            let tuid = msg.target + '*' + rid;
            let tsid = channel.getMember(tuid)['sid'];
            channelService.pushMessageByUids('onChat', param, [{
                    uid: tuid,
                    sid: tsid
                }]);
        }
    }
}
exports.ChatHandler = ChatHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcHAvc2VydmVycy9jaGF0L2hhbmRsZXIvY2hhdEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtQkFBd0IsR0FBZTtJQUNuQyxPQUFPLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFGRCw0QkFFQztBQUVELE1BQWEsV0FBVztJQUNwQixZQUFvQixHQUFlO1FBQWYsUUFBRyxHQUFILEdBQUcsQ0FBWTtJQUVuQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFrQyxFQUFDLE9BQXNCO1FBQ2hFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRztZQUNSLEdBQUcsRUFBQyxHQUFHLENBQUMsT0FBTztZQUNmLElBQUksRUFBQyxRQUFRO1lBQ2IsTUFBTSxFQUFDLEdBQUcsQ0FBQyxNQUFNO1NBQ3BCLENBQUM7UUFFRixJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBQyxLQUFLLENBQUMsQ0FBQztRQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzFCLElBQUcsR0FBRyxDQUFDLE1BQU0sSUFBRSxHQUFHLEVBQUM7WUFDZixPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBQyxLQUFLLENBQUMsQ0FBQztTQUN2QzthQUNHO1lBQ0EsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBQyxHQUFHLEdBQUMsR0FBRyxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUMsQ0FBQztvQkFDN0MsR0FBRyxFQUFDLElBQUk7b0JBQ1IsR0FBRyxFQUFDLElBQUk7aUJBQ1gsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUVMLENBQUM7Q0FHSjtBQWxDRCxrQ0FrQ0MifQ==