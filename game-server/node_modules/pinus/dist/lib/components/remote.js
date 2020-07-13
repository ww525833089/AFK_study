"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for remote service.
 * Load remote service and add to global context.
 */
const fs = require("fs");
const pathUtil = require("../util/pathUtil");
const pinus_rpc_1 = require("pinus-rpc");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
/**
 * Remote component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
class RemoteComponent {
    constructor(app, opts) {
        this.app = app;
        this.name = '__remote__';
        opts = opts || {};
        this.opts = opts;
        // cacheMsg is deprecated, just for compatibility here.
        opts.bufferMsg = opts.bufferMsg || opts.cacheMsg || false;
        opts.interval = opts.interval || 30;
        if (app.enabled('rpcDebugLog')) {
            opts.rpcDebugLog = true;
            opts.rpcLogger = pinus_logger_1.getLogger('rpc-debug', path.basename(__filename));
        }
        opts.paths = this.getRemotePaths();
        opts.context = this.app;
        let remoters = {};
        opts.services = {};
        opts.services['user'] = remoters;
        let info = this.app.getCurrentServer();
        // 添加插件中的remoter到ServerInfo中
        for (let plugin of this.app.usedPlugins) {
            if (plugin.remoterPath) {
                opts.paths.push({
                    namespace: 'user',
                    serverType: info.serverType,
                    path: plugin.remoterPath
                });
            }
        }
        // 添加路径到ServerInfo中
        info.remoterPaths = opts.paths;
    }
    /**
     * Remote component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb) {
        this.opts.port = this.app.getCurServer().port;
        this.remote = this.genRemote(this.opts);
        this.remote.start();
        process.nextTick(cb);
    }
    /**
     * Remote component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop(force, cb) {
        this.remote.stop(force);
        process.nextTick(cb);
    }
    /**
     * Get remote paths from application
     *
     * @param {Object} app current application context
     * @return {Array} paths
     *
     */
    getRemotePaths() {
        let paths = [];
        let role;
        // master server should not come here
        if (this.app.isFrontend()) {
            role = 'frontend';
        }
        else {
            role = 'backend';
        }
        let sysPath = pathUtil.getSysRemotePath(role), serverType = this.app.getServerType();
        if (fs.existsSync(sysPath)) {
            paths.push(pathUtil.remotePathRecord('sys', serverType, sysPath));
        }
        let userPath = pathUtil.getUserRemotePath(this.app.getBase(), serverType);
        if (fs.existsSync(userPath)) {
            paths.push(pathUtil.remotePathRecord('user', serverType, userPath));
        }
        return paths;
    }
    /**
     * Generate remote server instance
     *
     * @param {Object} app current application context
     * @param {Object} opts contructor parameters for rpc Server
     * @return {Object} remote server instance
     */
    genRemote(opts) {
        if (!!opts.rpcServer) {
            return opts.rpcServer.create(opts);
        }
        else {
            return pinus_rpc_1.createServer(opts);
        }
    }
}
exports.RemoteComponent = RemoteComponent;
function manualReloadRemoters(app) {
    if (!app.components.__remote__) {
        return;
    }
    const remote = app.components.__remote__.remote;
    if (remote['manualReloadRemoters']) {
        remote['manualReloadRemoters']();
    }
    else {
        console.warn('manualReloadRemoters  no method');
    }
}
exports.manualReloadRemoters = manualReloadRemoters;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2NvbXBvbmVudHMvcmVtb3RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7OztHQUdHO0FBQ0gseUJBQXlCO0FBQ3pCLDZDQUE2QztBQUM3Qyx5Q0FBc0c7QUFHdEcsK0NBQWlEO0FBRWpELDZCQUE2QjtBQWE3Qjs7Ozs7R0FLRztBQUNILE1BQWEsZUFBZTtJQUd4QixZQUFvQixHQUFnQixFQUFFLElBQTZCO1FBQS9DLFFBQUcsR0FBSCxHQUFHLENBQWE7UUFzQ3BDLFNBQUksR0FBRyxZQUFZLENBQUM7UUFyQ2hCLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWpCLHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUM7UUFDMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUNwQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDdEU7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFFeEIsSUFBSSxRQUFRLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFD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