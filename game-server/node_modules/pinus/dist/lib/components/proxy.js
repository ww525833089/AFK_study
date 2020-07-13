"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for proxy.
 * Generate proxies for rpc client.
 */
const crc = require("crc");
const utils = require("../util/utils");
const events_1 = require("../util/events");
const pinus_rpc_1 = require("pinus-rpc");
const Constants = require("../util/constants");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Proxy component class
 *
 * @param {Object} app  current application context
 * @param {Object} opts construct parameters
 */
class ProxyComponent {
    constructor(app, opts) {
        this.name = '__proxy__';
        opts = opts || {};
        // proxy default config
        // cacheMsg is deprecated, just for compatibility here.
        opts.bufferMsg = opts.bufferMsg || opts.cacheMsg || false;
        opts.interval = opts.interval || 30;
        opts.router = genRouteFun();
        opts.context = app;
        opts.routeContext = app;
        if (app.enabled('rpcDebugLog')) {
            opts.rpcDebugLog = true;
            opts.rpcLogger = pinus_logger_1.getLogger('rpc-debug', path.basename(__filename));
        }
        this.app = app;
        this.opts = opts;
        this.client = genRpcClient(this.app, opts);
        this.app.event.on(events_1.default.ADD_SERVERS, this.addServers.bind(this));
        this.app.event.on(events_1.default.REMOVE_SERVERS, this.removeServers.bind(this));
        this.app.event.on(events_1.default.REPLACE_SERVERS, this.replaceServers.bind(this));
    }
    /**
     * Proxy component lifecycle function
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb) {
        if (this.opts.enableRpcLog) {
            logger.warn('enableRpcLog is deprecated in 0.8.0, please use app.rpcFilter(pinus.rpcFilters.rpcLog())');
        }
        let rpcBefores = this.app.get(Constants.KEYWORDS.RPC_BEFORE_FILTER);
        let rpcAfters = this.app.get(Constants.KEYWORDS.RPC_AFTER_FILTER);
        let rpcErrorHandler = this.app.get(Constants.RESERVED.RPC_ERROR_HANDLER);
        if (!!rpcBefores) {
            this.client.before(rpcBefores);
        }
        if (!!rpcAfters) {
            this.client.after(rpcAfters);
        }
        if (!!rpcErrorHandler) {
            this.client.setErrorHandler(rpcErrorHandler);
        }
        process.nextTick(cb);
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb) {
        let self = this;
        Object.defineProperty(this.app, 'rpc', {
            get: function () {
                return self.client.proxies.user;
            }
        });
        Object.defineProperty(this.app, 'sysrpc', {
            get: function () {
                return self.client.proxies.sys;
            }
        });
        this.app.rpcInvoke = this.client.rpcInvoke.bind(this.client);
        this.client.start(cb);
    }
    /**
     * Add remote server to the rpc client.
     *
     * @param {Array} servers server info list, {id, serverType, host, port}
     */
    addServers(servers) {
        if (!servers || !servers.length) {
            return;
        }
        genProxies(this.client, this.app, servers);
        this.client.addServers(servers);
    }
    manualReloadProxies() {
        let servers = [];
        for (let k in this.client._station.servers) {
            servers.push(this.client._station.servers[k]);
        }
        logger.warn('manualReloadProxies servers:', servers);
        genProxies(this.client, this.app, servers);
    }
    /**
     * Remove remote server from the rpc client.
     *
     * @param  {Array} ids server id list
     */
    removeServers(ids) {
        this.client.removeServers(ids);
    }
    /**
     * Replace remote servers from the rpc client.
     *
     * @param  {Array} ids server id list
     */
    replaceServers(servers) {
        if (!servers || !servers.length) {
            return;
        }
        // update proxies
        this.client.proxies = {};
        genProxies(this.client, this.app, servers);
        this.client.replaceServers(servers);
    }
    /**
     * Proxy for rpc client rpcInvoke.
     *
     * @param {String}   serverId remote server id
     * @param {Object}   msg      rpc message: {serverType: serverType, service: serviceName, method: methodName, args: arguments}
     * @param {Function} cb      callback function
     */
    rpcInvoke(serverId, msg, cb) {
        this.client.rpcInvoke(serverId, msg, cb);
    }
}
exports.ProxyComponent = ProxyComponent;
function manualReloadProxies(app) {
    if (!app.components.__proxy__) {
        return;
    }
    if (app.components.__proxy__.manualReloadProxies) {
        app.components.__proxy__.manualReloadProxies();
    }
    else {
        logger.warn('manualReloadProxies not method');
    }
}
exports.manualReloadProxies = manualReloadProxies;
/**
 * Generate rpc client
 *
 * @param {Object} app current application context
 * @param {Object} opts contructor parameters for rpc client
 * @return {Object} rpc client
 */
let genRpcClient = function (app, opts) {
    opts.context = app;
    opts.routeContext = app;
    if (!!opts.rpcClient) {
        return opts.rpcClient.create(opts);
    }
    else {
        return pinus_rpc_1.createClient(opts);
    }
};
/**
 * Generate proxy for the server infos.
 *
 * @param  {Object} client rpc client instance
 * @param  {Object} app    application context
 * @param  {Array} sinfos server info list
 */
let genProxies = function (client, app, sinfos) {
    let item;
    for (let i = 0, l = sinfos.length; i < l; i++) {
        item = sinfos[i];
        client.addProxies(getProxyRecords(app, item));
    }
};
/**
 * Check a server whether has generated proxy before
 *
 * @param  {Object}  client rpc client instance
 * @param  {Object}  sinfo  server info
 * @return {Boolean}        true or false
 */
let hasProxy = function (client, sinfo) {
    let proxy = client.proxies;
    return !!proxy.sys && !!proxy.sys[sinfo.serverType];
};
/**
 * Get proxy path for rpc client.
 * Iterate all the remote service path and create remote path record.
 *
 * @param {Object} app current application context
 * @param {Object} sinfo server info, format: {id, serverType, host, port}
 * @return {Array}     remote path record array
 */
let getProxyRecords = function (app, sinfo) {
    return sinfo.remoterPaths;
};
let genRouteFun = function () {
    return function (session, msg, app, cb) {
        let routes = app.get(Constants.KEYWORDS.ROUTE);
        if (!routes) {
            defaultRoute(session, msg, app, cb);
            return;
        }
        let type = msg.serverType, route = routes[type] || routes['default'];
        if (route) {
            route(session, msg, app, cb);
        }
        else {
            defaultRoute(session, msg, app, cb);
        }
    };
};
let defaultRoute = function (session, msg, app, cb) {
    let list = app.getServersByType(msg.serverType);
    if (!list || !list.length) {
        cb(new Error('can not find server info for type:' + msg.serverType));
        return;
    }
    let uid = session ? (session.uid || '') : '';
    let index = Math.abs(crc.crc32(uid.toString())) % list.length;
    utils.invokeCallback(cb, null, list[index].id);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvY29tcG9uZW50cy9wcm94eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILDJCQUEyQjtBQUMzQix1Q0FBdUM7QUFDdkMsMkNBQW1EO0FBQ25ELHlDQUFvRDtBQUVwRCwrQ0FBK0M7QUFDL0MsK0NBQXlDO0FBTXpDLDZCQUE2QjtBQUU3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFhM0Q7Ozs7O0dBS0c7QUFDSCxNQUFhLGNBQWM7SUFLdkIsWUFBWSxHQUFnQixFQUFFLElBQTJCO1FBc0J6RCxTQUFJLEdBQUcsV0FBVyxDQUFDO1FBckJmLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLHVCQUF1QjtRQUN2Qix1REFBdUQ7UUFDdkQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksS0FBSyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztRQUN4QixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyx3QkFBUyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDdEU7UUFFRCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcs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