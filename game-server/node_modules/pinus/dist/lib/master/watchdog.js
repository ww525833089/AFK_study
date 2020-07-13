"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_logger_1 = require("pinus-logger");
const Constants = require("../util/constants");
const countDownLatch = require("../util/countDownLatch");
const events_1 = require("events");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class Watchdog extends events_1.EventEmitter {
    constructor(app, service) {
        super();
        this.app = app;
        this.service = service;
        this.isStarted = false;
        this.servers = {};
        this._listeners = {};
        this.count = Object.keys(app.getServersFromConfig()).length;
    }
    addServer(server) {
        if (!server) {
            return;
        }
        this.servers[server.id] = server;
        this.notify({ action: 'addServer', server: server });
    }
    removeServer(id) {
        if (!id) {
            return;
        }
        this.unsubscribe(id);
        delete this.servers[id];
        this.notify({ action: 'removeServer', id: id });
    }
    reconnectServer(server) {
        let self = this;
        if (!server) {
            return;
        }
        if (!this.servers[server.id]) {
            this.servers[server.id] = server;
        }
        // replace server in reconnect server
        this.notifyById(server.id, { action: 'replaceServer', servers: self.servers });
        // notify other server to add server
        this.notify({ action: 'addServer', server: server });
        // add server in listener
        this.subscribe(server.id);
    }
    subscribe(id) {
        this._listeners[id] = 1;
    }
    unsubscribe(id) {
        delete this._listeners[id];
    }
    query() {
        return this.servers;
    }
    record(id) {
        if (!this.isStarted && --this.count < 0) {
            let usedTime = Date.now() - this.app.startTime;
            this.notify({ action: 'startOver' });
            this.isStarted = true;
            logger.warn('all servers startup in %s ms', usedTime);
        }
    }
    notifyById(id, msg) {
        this.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal) {
            if (signal !== Constants.SIGNAL.OK) {
                logger.error('master watchdog fail to notify to monitor, id: %s, msg: %j', id, msg);
            }
            else {
                logger.debug('master watchdog notify to monitor success, id: %s, msg: %j', id, msg);
            }
        });
    }
    notify(msg) {
        let _listeners = this._listeners;
        let success = true;
        let fails = [];
        let timeouts = [];
        let requests = {};
        let count = Object.keys(_listeners).length;
        if (count === 0) {
            logger.warn('master watchdog _listeners is none, msg: %j', msg);
            return;
        }
        let latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_COUNTDOWN }, function (isTimeout) {
            if (!!isTimeout) {
                for (let key in requests) {
                    if (!requests[key]) {
                        timeouts.push(key);
                    }
                }
                logger.error('master watchdog request timeout message: %j, timeouts: %j, fails: %j', msg, timeouts, fails);
            }
            if (!success) {
                logger.error('master watchdog request fail message: %j, fails: %j', msg, fails);
            }
        });
        let moduleRequest = function (self, id) {
            return (function () {
                self.service.agent.request(id, Constants.KEYWORDS.MONITOR_WATCHER, msg, function (signal) {
                    if (signal !== Constants.SIGNAL.OK) {
                        fails.push(id);
                        success = false;
                    }
                    requests[id] = 1;
                    latch.done();
                });
            })();
        };
        for (let id in _listeners) {
            requests[id] = 0;
            moduleRequest(this, id);
        }
    }
}
exports.Watchdog = Watchdog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hkb2cuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbWFzdGVyL3dhdGNoZG9nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQXlDO0FBRXpDLCtDQUErQztBQUMvQyx5REFBeUQ7QUFDekQsbUNBQXNDO0FBS3RDLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0QsTUFBYSxRQUFTLFNBQVEscUJBQVk7SUFNdEMsWUFBb0IsR0FBZ0IsRUFBVSxPQUF1QjtRQUNqRSxLQUFLLEVBQUUsQ0FBQztRQURRLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQUpyRSxjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLFlBQU8sR0FBcUMsRUFBRSxDQUFDO1FBQy9DLGVBQVUsR0FBaUMsRUFBRSxDQUFDO1FBSzFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUVoRSxDQUFDO0lBR0QsU0FBUyxDQUFDLE1BQWtCO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDVCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDakMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFlBQVksQ0FBQyxFQUFVO1FBQ25CLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDTCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3JCLE9BQU8s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