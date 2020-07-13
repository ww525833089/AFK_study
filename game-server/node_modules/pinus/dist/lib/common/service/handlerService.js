"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const utils = require("../../util/utils");
const Loader = require("pinus-loader");
const pathUtil = require("../../util/pathUtil");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
const pinus_loader_1 = require("pinus-loader");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let forwardLogger = pinus_logger_1.getLogger('forward-log', path.basename(__filename));
/**
 * Handler service.
 * Dispatch request to the relactive handler.
 *
 * @param {Object} app      current application context
 */
class HandlerService {
    constructor(app, opts) {
        this.handlerMap = {};
        this.handlerPaths = {};
        this.name = 'handler';
        this.app = app;
        if (!!opts.reloadHandlers) {
            watchHandlers(app, this.handlerMap);
        }
        this.enableForwardLog = opts.enableForwardLog || false;
        // 添加默认路径到ServerInfo中
        let info = app.getCurrentServer();
        let handlerPath = info.serverType ? pathUtil.getHandlerPath(app.getBase(), info.serverType) : undefined;
        info.handlerPaths = [];
        if (handlerPath) {
            info.handlerPaths.push(handlerPath);
        }
        // 添加插件中的handler到ServerInfo中
        for (let plugin of app.usedPlugins) {
            if (plugin.handlerPath) {
                info.handlerPaths.push(plugin.handlerPath);
            }
        }
        // 添加一台服务器
        this.addServer(info);
    }
    /**
     * Handler the request.
     */
    handle(routeRecord, msg, session, cb) {
        // the request should be processed by current server
        let handler = this.getHandler(routeRecord);
        if (!handler) {
            logger.error('[handleManager]: fail to find handler for %j', routeRecord.route);
            utils.invokeCallback(cb, new Error('fail to find handler for ' + routeRecord.route));
            return;
        }
        let start = Date.now();
        let self = this;
        let callback = function (err, resp, opts) {
            if (self.enableForwardLog) {
                let log = {
                    route: routeRecord.route,
                    args: msg,
                    time: utils.format(new Date(start)),
                    timeUsed: Date.now() - start
                };
                forwardLogger.info(JSON.stringify(log));
            }
            // resp = getResp(arguments);
            utils.invokeCallback(cb, err, resp, opts);
        };
        let method = routeRecord.method;
        if (!Array.isArray(msg)) {
            handler[method](msg, session).then((resp) => {
                callback(null, resp);
            }, (reason) => {
                callback(reason);
            });
        }
        else {
            msg.push(session);
            handler[method].apply(handler, msg).then((resp) => {
                callback(null, resp);
            }, (reason) => {
                callback(reason);
            });
        }
        return;
    }
    /**
     * Get handler instance by routeRecord.
     *
     * @param  {Object} handlers    handler map
     * @param  {Object} routeRecord route record parsed from route string
     * @return {Object}             handler instance if any matchs or null for match fail
     */
    getHandler(routeRecord) {
        let serverType = routeRecord.serverType;
        if (!this.handlerMap[serverType]) {
            this.loadHandlers(serverType);
        }
        let handlers = this.handlerMap[serverType] || {};
        let handler = handlers[routeRecord.handler];
        if (!handler) {
            logger.warn('could not find handler for routeRecord: %j', routeRecord);
            return null;
        }
        if (typeof handler[routeRecord.method] !== 'function') {
            logger.warn('could not find the method %s in handler: %s', routeRecord.method, routeRecord.handler);
            return null;
        }
        return handler;
    }
    parseHandler(serverType, handlerPath) {
        let modules = Loader.load(handlerPath, this.app, false, true, pinus_loader_1.LoaderPathType.PINUS_HANDLER);
        for (let name in modules) {
            let targetHandlers = this.handlerMap[serverType];
            if (!targetHandlers) {
                targetHandlers = {};
                this.handlerMap[serverType] = targetHandlers;
            }
            targetHandlers[name] = modules[name];
        }
    }
    addServer(serverInfo) {
        let targetPaths = this.handlerPaths[serverInfo.serverType];
        if (!targetPaths) {
            targetPaths = new Set();
            this.handlerPaths[serverInfo.serverType] = targetPaths;
        }
        for (let path of serverInfo.handlerPaths) {
            targetPaths.add(path);
        }
    }
    /**
     * Load handlers from current application
     */
    loadHandlers(serverType) {
        let paths = this.handlerPaths[serverType];
        for (let path of paths) {
            this.parseHandler(serverType, path);
        }
    }
}
exports.HandlerService = HandlerService;
function manualReloadHandlers(app) {
    if (!app.components.__server__) {
        return;
    }
    let p = pathUtil.getHandlerPath(app.getBase(), app.serverType);
    if (!p) {
        return;
    }
    const handlerMap = app.components.__server__.server.handlerService.handlerMap;
    handlerMap[app.serverType] = Loader.load(p, app, true, true, pinus_loader_1.LoaderPathType.PINUS_HANDLER);
}
exports.manualReloadHandlers = manualReloadHandlers;
let watchHandlers = function (app, handlerMap) {
    let p = pathUtil.getHandlerPath(app.getBase(), app.serverType);
    if (!!p) {
        fs.watch(p, function (event, name) {
            if (event === 'change') {
                handlerMap[app.serverType] = Loader.load(p, app, true, true, pinus_loader_1.LoaderPathType.PINUS_HANDLER);
            }
        });
    }
};
let getResp = function (args) {
    let len = args.length;
    if (len === 1) {
        return [];
    }
    if (len === 2) {
        return [args[1]];
    }
    if (len === 3) {
        return [args[1], args[2]];
    }
    if (len === 4) {
        return [args[1], args[2], args[3]];
    }
    let r = new Array(len);
    for (let i = 1; i < len; i++) {
        r[i] = args[i];
    }
    return r;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29tbW9uL3NlcnZpY2UvaGFuZGxlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIsMENBQTBDO0FBQzFDLHVDQUF1QztBQUN2QyxnREFBZ0Q7QUFDaEQsK0NBQXlDO0FBS3pDLDZCQUE2QjtBQUM3QiwrQ0FBOEM7QUFFOUMsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzNELElBQUksYUFBYSxHQUFHLHdCQUFTLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQWN4RTs7Ozs7R0FLRztBQUNILE1BQWEsY0FBYztJQU12QixZQUFZLEdBQWdCLEVBQUUsSUFBMkI7UUFKekQsZUFBVSxHQUFlLEVBQUUsQ0FBQztRQUM1QixpQkFBWSxHQUEwQyxFQUFFLENBQUM7UUE4QnpELFNBQUksR0FBRyxTQUFTLENBQUM7UUExQmIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLGFBQWEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLENBQUM7UUFFdkQscUJBQXFCO1FBQ3JCLElBQUksSUFBSSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2xDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFV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