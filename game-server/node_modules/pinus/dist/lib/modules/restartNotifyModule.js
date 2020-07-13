"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const pinus_logger_1 = require("pinus-logger");
const constants_1 = require("../util/constants");
const index_1 = require("../index");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
// 单个进程重启通知 afterStartAll 生命周期事件。
class RestartNotifyModule {
    constructor(opts, consoleService) {
        this.removedServers = {};
        this._addEvent = this.onAddServers.bind(this);
        this._removeEvent = this.onRemoveServers.bind(this);
        this.afterStartCallBack = null;
        this.afterStartCalled = false;
        this.app = opts.app;
        this.service = consoleService;
    }
    // ----------------- bind methods -------------------------
    onAddServers(servers) {
        if (!servers || !servers.length) {
            return;
        }
        servers.forEach(val => this.onServerAdd(val));
    }
    onRemoveServers(ids) {
        if (ids && ids.length) {
            // 避免有重复通知的问题。
            this._masterWatcherModule.watchdog.isStarted = true;
            this._masterWatcherModule.watchdog.count = -1;
            ids.forEach(val => this.onServerLeave(val));
        }
    }
    onServerAdd(record) {
        if (this.removedServers[record.id]) {
            this.removedServers[record.id] = false;
            // TOxDO notify afterStartAll
            const masterAgent = this.service.agent;
            logger.warn('notify afterStartAll ', record.id);
            process.nextTick(() => {
                masterAgent.request(record.id, 'RestartNotifyModule', { action: 'afterStartCallback' }, (err, body) => {
                    logger.warn('RestartNotifyModule notify RestartNotifyModule afterStart:', record.id, err, body);
                    // 通知startOver
                    masterAgent.request(record.id, constants_1.KEYWORDS.MONITOR_WATCHER, { action: 'startOver' }, (err, body) => {
                        logger.warn('RestartNotifyModule notify MONITOR_WATCHER start over:', record.id, err, body);
                    });
                });
            });
        }
    }
    onServerLeave(id) {
        logger.debug('RestartNotifyModule onServerLeave: %s', id);
        if (!id) {
            logger.warn('onServerLeave receive server id is empty.');
            return;
        }
        this.removedServers[id] = true;
    }
    afterStart() {
        logger.debug('~~ RestartNotifyModule afterStart', this.id);
        this.afterStartCalled = true;
        if (this.afterStartCallBack) {
            this.afterStartCallBack(1);
            this.afterStartCallBack = null;
        }
    }
    // ----------------- module methods -------------------------
    start(cb) {
        //    subscribeRequest(this, this.service.agent, this.id, cb);
        this.id = this.app.getServerId();
        if (this.app.getServerType() === 'master') {
            if (this.service.master) {
                this.app.event.on(index_1.events.ADD_SERVERS, this._addEvent);
                this.app.event.on(index_1.events.REMOVE_SERVERS, this._removeEvent);
                this._masterWatcherModule = this.service.modules[constants_1.KEYWORDS.MASTER_WATCHER].module;
            }
        }
        else {
            this.app.event.on(index_1.events.START_SERVER, this.afterStart.bind(this));
        }
        cb();
    }
    monitorHandler(agent, msg, cb) {
        if (!msg || !msg.action) {
            return;
        }
        switch (msg.action) {
            case 'afterStartCallback': {
                logger.warn('RestartNotifyModule afterStart notify ', this.id, msg);
                if (this.afterStartCalled) {
                    cb(1);
                    break;
                }
                this.afterStartCallBack = cb;
                break;
            }
            default: {
                logger.error('RestartNotifyModule unknown action: %j', msg.action);
                return;
            }
        }
    }
}
exports.RestartNotifyModule = RestartNotifyModule;
RestartNotifyModule.moduleId = 'RestartNotifyModule';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFydE5vdGlmeU1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2R1bGVzL3Jlc3RhcnROb3RpZnlNb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsK0NBQXlDO0FBR3pDLGlEQUF5RDtBQUN6RCxvQ0FBa0M7QUFHbEMsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRTNELGlDQUFpQztBQUNqQyxNQUFhLG1CQUFtQjtJQVk1QixZQUFZLElBQTBCLEVBQUUsY0FBOEI7UUFOckQsbUJBQWMsR0FBK0IsRUFBRSxDQUFDO1FBRXpELGNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxpQkFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBeUQvQyx1QkFBa0IsR0FBUSxJQUFJLENBQUM7UUFDL0IscUJBQWdCLEdBQUcsS0FBSyxDQUFDO1FBdEQ3QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7SUFFbEMsQ0FBQztJQUdELDJEQUEyRDtJQUVuRCxZQUFZLENBQUMsT0FBcUI7UUFDdEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDN0IsT0FBTztTQUNWO1FBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU8sZUFBZSxDQUFDLEdBQWE7UUFDakMsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtZQUNu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