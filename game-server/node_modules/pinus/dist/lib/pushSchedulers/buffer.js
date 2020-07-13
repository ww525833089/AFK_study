"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../util/utils");
let DEFAULT_FLUSH_INTERVAL = 20;
class BufferPushScheduler {
    constructor(app, opts) {
        this.sessions = {}; // sid -> msg queue
        this.tid = null;
        opts = opts || {};
        this.app = app;
        this.flushInterval = opts.flushInterval || DEFAULT_FLUSH_INTERVAL;
    }
    async start() {
        this.tid = setInterval(this.flush.bind(this), this.flushInterval);
    }
    async stop() {
        if (this.tid) {
            clearInterval(this.tid);
            this.tid = null;
        }
    }
    schedule(reqId, route, msg, recvs, opts, cb) {
        opts = opts || {};
        if (opts.type === 'broadcast') {
            this.doBroadcast(msg, opts.userOptions);
        }
        else {
            this.doBatchPush(msg, recvs);
        }
        process.nextTick(function () {
            utils.invokeCallback(cb);
        });
    }
    flush() {
        let sessionService = this.app.get('sessionService');
        let queue, session;
        for (let sid in this.sessions) {
            session = sessionService.get(Number(sid));
            if (!session) {
                continue;
            }
            queue = this.sessions[sid];
            if (!queue || queue.length === 0) {
                continue;
            }
            session.sendBatch(queue);
            this.sessions[sid] = [];
        }
    }
    doBroadcast(msg, opts) {
        let channelService = this.app.get('channelService');
        let sessionService = this.app.get('sessionService');
        if (opts.binded) {
            sessionService.forEachBindedSession((session) => {
                if (channelService.broadcastFilter &&
                    !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                    return;
                }
                this.enqueue(session, msg);
            });
        }
        else {
            sessionService.forEachSession((session) => {
                if (channelService.broadcastFilter &&
                    !channelService.broadcastFilter(session, msg, opts.filterParam)) {
                    return;
                }
                this.enqueue(session, msg);
            });
        }
    }
    doBatchPush(msg, recvs) {
        let sessionService = this.app.get('sessionService');
        let session;
        for (let i = 0, l = recvs.length; i < l; i++) {
            session = sessionService.get(recvs[i]);
            if (session) {
                this.enqueue(session, msg);
            }
        }
    }
    enqueue(session, msg) {
        let queue = this.sessions[session.id];
        if (!queue) {
            queue = this.sessions[session.id] = [];
            session.once('closed', this.onClose.bind(this));
        }
        queue.push(msg);
    }
    onClose(session) {
        delete this.sessions[session.id];
    }
}
exports.BufferPushScheduler = BufferPushScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3B1c2hTY2hlZHVsZXJzL2J1ZmZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF1QztBQUt2QyxJQUFJLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQU1oQyxNQUFhLG1CQUFtQjtJQU01QixZQUFZLEdBQWdCLEVBQUUsSUFBaUM7UUFIL0QsYUFBUSxHQUFpQyxFQUFFLENBQUMsQ0FBRyxtQkFBbUI7UUFDbEUsUUFBRyxHQUFpQixJQUFJLENBQUM7UUFJckIsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksc0JBQXNCLENBQUM7SUFDdEUsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLO1FBQ1AsSUFBSSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNOLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNWLGFBQWEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDbkI7SUFDTCxDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLEtBQVksRUFBRSxJQUFxQixFQUFFLEVBQWM7UUFDaEcsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUMzQixJQUFJLENBQUMsV0FBVyxDQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxD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