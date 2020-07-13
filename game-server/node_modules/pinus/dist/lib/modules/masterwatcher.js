"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_logger_1 = require("pinus-logger");
const utils = require("../util/utils");
const Constants = require("../util/constants");
const watchdog_1 = require("../master/watchdog");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class MasterWatcherModule {
    constructor(opts, consoleService) {
        this.app = opts.app;
        this.service = consoleService;
        this.id = this.app.getServerId();
        this.watchdog = new watchdog_1.Watchdog(this.app, this.service);
        this.service.on('register', this.onServerAdd.bind(this));
        this.service.on('disconnect', this.onServerLeave.bind(this));
        this.service.on('reconnect', this.onServerReconnect.bind(this));
    }
    // ----------------- bind methods -------------------------
    onServerAdd(record) {
        logger.debug('masterwatcher receive add server event, with server: %j', record);
        if (!record || record.type === 'client' || !record.serverType) {
            return;
        }
        this.watchdog.addServer(record);
    }
    onServerReconnect(record) {
        logger.debug('masterwatcher receive reconnect server event, with server: %j', record);
        if (!record || record.type === 'client' || !record.serverType) {
            logger.warn('onServerReconnect receive wrong message: %j', record);
            return;
        }
        this.watchdog.reconnectServer(record);
    }
    onServerLeave(id, type) {
        logger.debug('masterwatcher receive remove server event, with server: %s, type: %s', id, type);
        if (!id) {
            logger.warn('onServerLeave receive server id is empty.');
            return;
        }
        if (type !== 'client') {
            this.watchdog.removeServer(id);
        }
    }
    // ----------------- module methods -------------------------
    start(cb) {
        utils.invokeCallback(cb);
    }
    masterHandler(agent, msg, cb) {
        if (!msg) {
            logger.warn('masterwatcher receive empty message.');
            return;
        }
        let func = masterMethods[msg.action];
        if (!func) {
            logger.info('masterwatcher unknown action: %j', msg.action);
            return;
        }
        func(this, agent, msg, cb);
    }
}
exports.MasterWatcherModule = MasterWatcherModule;
MasterWatcherModule.moduleId = Constants.KEYWORDS.MASTER_WATCHER;
// ----------------- monitor request methods -------------------------
let subscribe = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher subscribe empty message.'));
        return;
    }
    module.watchdog.subscribe(msg.id);
    utils.invokeCallback(cb, null, module.watchdog.query());
};
let unsubscribe = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher unsubscribe empty message.'));
        return;
    }
    module.watchdog.unsubscribe(msg.id);
    utils.invokeCallback(cb);
};
let query = function (module, agent, msg, cb) {
    utils.invokeCallback(cb, null, module.watchdog.query());
};
let record = function (module, agent, msg, cb) {
    if (!msg) {
        utils.invokeCallback(cb, new Error('masterwatcher record empty message.'));
        return;
    }
    module.watchdog.record(msg.id);
};
let masterMethods = {
    'subscribe': subscribe,
    'unsubscribe': unsubscribe,
    'query': query,
    'record': record
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyd2F0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2R1bGVzL21hc3RlcndhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQ0FBeUM7QUFDekMsdUNBQXVDO0FBQ3ZDLCtDQUErQztBQUMvQyxpREFBNkM7QUFHN0MsNkJBQTZCO0FBQzdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUkzRCxNQUFhLG1CQUFtQjtJQVM1QixZQUFZLElBQXdCLEVBQUUsY0FBOEI7UUFDaEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDO1FBQzlCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVqQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCwyREFBMkQ7SUFFM0QsV0FBVyxDQUFDLE1BQVc7UUFDbkIsTUFBTSxDQUFDLEtBQUssQ0FBQyx5REFBeUQsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUMzRCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsTUFBVztRQUN6QixNQUFNLENBQUMsS0FBSyxDQUFDLCtEQUErRCxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkUsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELGFBQWEsQ0FBQyxFQUFVLEVBQUUsSUFBWTtRQUNsQyxNQUFNLENBQUMsS0FBSyxDQUFDLHNFQUFzRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1lBQ3pELE9BQU87U0FDVjtRQUNELElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNsQztJQUNMLENBQUM7SUFFRCw2REFBNkQ7SUFFN0QsS0FBSyxDQUFDLEVBQWM7UUFDaEIsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQWtCLEVBQUUsR0FBUSxFQUFFLEVBQWtCO1FBQzFELElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDcEQsT0FBTztTQUNWO1FBQ0QsSUFBSSxJQUFJLEdBQUksYUFBcUIsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzVELE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQixDQUFDOztBQW5FTCxrREFvRUM7QUE5RFUsNEJBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztBQWdFeEQsc0VBQXNFO0FBRXRFLElBQUksU0FBUyxHQUFHLFVBQVUsTUFBMkIsRUFBRSxLQUFrQixFQUFFLEdBQVEsRUFBRSxFQUFrQjtJQUNuRyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxDQUFDO1FBQzlFLE9BQU87S0FDVjtJQUVELE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNsQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQztBQUVGLElBQUksV0FBVyxHQUFHLFVBQVUsTUFBMkIsRUFBRSxLQUFrQixFQUFFLEdBQVEsRUFBRSxFQUFrQjtJQUNyRyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLE9BQU87S0FDVjtJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQyxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQztBQUVGLElBQUksS0FBSyxHQUFHLFVBQVUsTUFBMkIsRUFBRSxLQUFrQixFQUFFLEdBQVEsRUFBRSxFQUFrQjtJQUMvRixLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzVELENBQUMsQ0FBQztBQUVGLElBQUksTUFBTSxHQUFHLFVBQVUsTUFBMkIsRUFBRSxLQUFrQixFQUFFLEdBQVEsRUFBRSxFQUFrQjtJQUNoRyxJQUFJLENBQUMsR0FBRyxFQUFFO1FBQ04sS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsSUFBSSxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLE9BQU87S0FDVjtJQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNuQyxDQUFDLENBQUM7QUFFRixJQUFJLGFBQWEsR0FBRztJQUNoQixXQUFXLEVBQUUsU0FBUztJQUN0QixhQUFhLEVBQUUsV0FBVztJQUMxQixPQUFPLEVBQUUsS0FBSztJQUNkLFFBQVEsRUFBRSxNQUFNO0NBQ25CLENBQUMifQ==