"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for monitor.
 * Load and start monitor client.
 */
const pinus_logger_1 = require("pinus-logger");
const admin = require("pinus-admin");
const moduleUtil = require("../util/moduleUtil");
const utils = require("../util/utils");
const Constants = require("../util/constants");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class Monitor {
    constructor(app, opts) {
        this.modules = [];
        opts = opts || {};
        this.app = app;
        this.serverInfo = app.getCurServer();
        this.masterInfo = app.getMaster();
        this.closeWatcher = opts.closeWatcher;
        this.monitorConsole = admin.createMonitorConsole({
            id: this.serverInfo.id,
            type: this.app.getServerType(),
            host: this.masterInfo.host,
            port: this.masterInfo.port,
            info: this.serverInfo,
            env: this.app.get(Constants.RESERVED.ENV),
            authServer: app.get('adminAuthServerMonitor') // auth server function
        });
    }
    start(cb) {
        moduleUtil.registerDefaultModules(false, this.app, this.closeWatcher);
        this.startConsole(cb);
    }
    startConsole(cb) {
        moduleUtil.loadModules(this, this.monitorConsole);
        let self = this;
        this.monitorConsole.start(function (err) {
            if (err) {
                utils.invokeCallback(cb, err);
                return;
            }
            moduleUtil.startModules(self.modules, function (err) {
                utils.invokeCallback(cb, err);
                return;
            });
        });
        this.monitorConsole.on('error', function (err) {
            if (!!err) {
                logger.error('monitorConsole encounters with error: %j', err.stack);
                return;
            }
        });
    }
    stop(cb) {
        this.monitorConsole.stop();
        this.modules = [];
        process.nextTick(function () {
            utils.invokeCallback(cb);
        });
    }
    // monitor reconnect to master
    reconnect(masterInfo) {
        let self = this;
        this.stop(function () {
            self.monitorConsole = admin.createMonitorConsole({
                id: self.serverInfo.id,
                type: self.app.getServerType(),
                host: masterInfo.host,
                port: masterInfo.port,
                info: self.serverInfo,
                env: self.app.get(Constants.RESERVED.ENV)
            });
            self.startConsole(function () {
                logger.info('restart modules for server : %j finish.', self.app.serverId);
            });
        });
    }
}
exports.Monitor = Monitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb25pdG9yL21vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7O0dBR0c7QUFDSCwrQ0FBeUM7QUFDekMscUNBQXFDO0FBQ3JDLGlEQUFpRDtBQUNqRCx1Q0FBdUM7QUFDdkMsK0NBQStDO0FBTS9DLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFLM0QsTUFBYSxPQUFPO0lBUWhCLFlBQVksR0FBZ0IsRUFBRSxJQUFzQjtRQUpwRCxZQUFPLEdBQWMsRUFBRSxDQUFDO1FBS3BCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBRXRDLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDO1lBQzdDLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFO1lBQzlCLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUk7WUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSTtZQUMxQixJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7WUFDckIsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxD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