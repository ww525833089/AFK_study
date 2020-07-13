"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const starter = require("./starter");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let crashLogger = pinus_logger_1.getLogger('crash-log', path.basename(__filename));
let adminLogger = pinus_logger_1.getLogger('admin-log', path.basename(__filename));
const admin = require("pinus-admin");
const util = require("util");
const utils = require("../util/utils");
const moduleUtil = require("../util/moduleUtil");
const Constants = require("../util/constants");
class MasterServer {
    constructor(app, opts) {
        this.registered = {};
        this.modules = [];
        this.app = app;
        this.masterInfo = app.getMaster();
        opts = opts || {};
        opts.port = this.masterInfo.port;
        opts.env = this.app.get(Constants.RESERVED.ENV);
        this.closeWatcher = opts.closeWatcher || false;
        this.masterConsole = admin.createMasterConsole(opts);
    }
    start(cb) {
        moduleUtil.registerDefaultModules(true, this.app, this.closeWatcher);
        moduleUtil.loadModules(this, this.masterConsole);
        let self = this;
        // start master console
        this.masterConsole.start(function (err) {
            if (err) {
                process.exit(0);
            }
            moduleUtil.startModules(self.modules, function (err) {
                if (err) {
                    utils.invokeCallback(cb, err);
                    return;
                }
                if (self.app.get(Constants.RESERVED.MODE) !== Constants.RESERVED.STAND_ALONE) {
                    starter.runServers(self.app);
                }
                utils.invokeCallback(cb);
            });
        });
        this.masterConsole.on('error', function (err) {
            if (!!err) {
                logger.error('masterConsole encounters with error: ' + err.stack);
                return;
            }
        });
        this.masterConsole.on('reconnect', function (info) {
            self.app.addServers([info]);
        });
        // monitor servers disconnect event
        this.masterConsole.on('disconnect', function (id, type, info, reason) {
            crashLogger.info(util.format('[%s],[%s],[%s],[%s]', type, id, Date.now(), reason || 'disconnect'));
            let count = 0;
            let time = 0;
            let pingTimer = null;
            let server = self.app.getServerById(id);
            let stopFlags = self.app.get(Constants.RESERVED.STOP_SERVERS) || [];
            if (!!server && (server[Constants.RESERVED.AUTO_RESTART] === true || server[Constants.RESERVED.RESTART_FORCE] === true) && stopFlags.indexOf(id) < 0) {
                let handle = function () {
                    clearTimeout(pingTimer);
                    utils.checkPort(server, function (status) {
                        if (status === 'error') {
                            utils.invokeCallback(cb, new Error('Check port command executed with error.'));
                            return;
                        }
                        else if (status === 'busy') {
                            if (!!server[Constants.RESERVED.RESTART_FORCE]) {
                                starter.kill([info.pid], [server]);
                            }
                            else {
                                utils.invokeCallback(cb, new Error('Port occupied already, check your server to add.'));
                                return;
                            }
                        }
                        setTimeout(function () {
                            starter.run(self.app, server, null);
                        }, Constants.TIME.TIME_WAIT_STOP);
                    });
                };
                let setTimer = function (time) {
                    pingTimer = setTimeout(function () {
                        utils.ping(server.host, function (flag) {
                            if (flag) {
                                handle();
                            }
                            else {
                                count++;
                                if (count > 3) {
                                    time = Constants.TIME.TIME_WAIT_MAX_PING;
                                }
                                else {
                                    time = Constants.TIME.TIME_WAIT_PING * count;
                                }
                                setTimer(time);
                            }
                        });
                    }, time);
                };
                setTimer(time);
            }
        });
        // monitor servers register event
        this.masterConsole.on('register', function (record) {
            starter.bindCpu(record.id, record.pid, record.host);
        });
        this.masterConsole.on('admin-log', function (log, error) {
            if (error) {
                adminLogger.error(JSON.stringify(log));
            }
            else {
                adminLogger.info(JSON.stringify(log));
            }
        });
    }
    stop(cb) {
        this.masterConsole.stop();
        process.nextTick(cb);
    }
}
exports.MasterServer = MasterServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL21hc3Rlci9tYXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsK0NBQXVDO0FBQ3ZDLDZCQUE2QjtBQUU3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDM0QsSUFBSSxXQUFXLEdBQUcsd0JBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQ3BFLElBQUksV0FBVyxHQUFHLHdCQUFTLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNwRSxxQ0FBcUM7QUFDckMsNkJBQTZCO0FBQzdCLHVDQUF1QztBQUN2QyxpREFBaUQ7QUFDakQsK0NBQStDO0FBYS9DLE1BQWEsWUFBWTtJQVFyQixZQUFZLEdBQWdCLEVBQUUsSUFBMkI7UUFMekQsZUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNoQixZQUFPLEdBQWMsRUFBRSxDQUFDO1FBS3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFFbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLEtBQUssQ0FBQztRQUMvQyxJQUFJLENB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