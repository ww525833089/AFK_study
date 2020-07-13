"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../util/utils");
class DirectPushScheduler {
    constructor(app, opts) {
        opts = opts || {};
        this.app = app;
    }
    async start() {
    }
    async stop() {
    }
    schedule(reqId, route, msg, recvs, opts, cb) {
        opts = opts || {};
        if (opts.type === 'broadcast') {
            this.doBroadcast(msg, opts.userOptions);
        }
        else {
            this.doBatchPush(msg, recvs);
        }
        if (cb) {
            process.nextTick(function () {
                utils.invokeCallback(cb);
            });
        }
    }
    doBroadcast(msg, opts) {
        let channelService = this.app.get('channelService');
        let sessionService = this.app.get('sessionService');
        if (opts.binded) {
            sessionService.forEachBindedSession(function (session) {
                if (channelService.broadcastFilter &&
                    !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                    return;
                }
                sessionService.sendMessageByUid(session.uid, msg);
            });
        }
        else {
            sessionService.forEachSession(function (session) {
                if (channelService.broadcastFilter &&
                    !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                    return;
                }
                sessionService.sendMessage(session.id, msg);
            });
        }
    }
    doBatchPush(msg, recvs) {
        let sessionService = this.app.get('sessionService');
        for (let i = 0, l = recvs.length; i < l; i++) {
            sessionService.sendMessage(recvs[i], msg);
        }
    }
}
exports.DirectPushScheduler = DirectPushScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3B1c2hTY2hlZHVsZXJzL2RpcmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF1QztBQUt2QyxNQUFhLG1CQUFtQjtJQU01QixZQUFZLEdBQWdCLEVBQUUsSUFBVTtRQUNwQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBUkQsS0FBSyxDQUFDLEtBQUs7SUFDWCxDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUk7SUFDVixDQUFDO0lBUUQsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLEtBQVksRUFBRSxJQUFxQixFQUFFLEVBQXlCO1FBQzNHLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNoQztRQUVELElBQUksRUFBRSxFQUFFO1lBQ0osT0FBTyxDQUFDLFFBQVEsQ0FBQztnQkFDYixLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQVEsRUFBRSxJQUFzQjtRQUN4QyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3BELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2IsY0FBYyxDQUFDLG9CQUFvQixDQUFDLFVBQVUsT0FBTztnQkFDakQsSUFBSSxjQUFjLENBQUMsZUFBZTtvQkFDOUIsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNqRSxPQUFPO2lCQUNWO2dCQUVELGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1NBQ047YUFBTTtZQUNILGNBQWMsQ0FBQyxjQUFjLENBQUMsVUFBVSxPQUFPO2dCQUMzQyxJQUFJLGNBQWMsQ0FBQyxlQUFlO29CQUM5QixDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQ2pFLE9BQU87aUJBQ1Y7Z0JBRUQsY0FBYyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELENBQUMsQ0FBQyxDQUFDO1NBQ047SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLEdBQVEsRUFBRSxLQUFZO1FBQzlCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUM3QztJQUNMLENBQUM7Q0FFSjtBQTNERCxrREEyREMifQ==