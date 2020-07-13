"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const log = require("./log");
const utils = require("./utils");
const path = require("path");
const Constants = require("./constants");
const starter = require("../master/starter");
const pinus_logger_1 = require("pinus-logger");
const pinus_1 = require("../pinus");
const util_1 = require("util");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Initialize application configuration.
 */
function defaultConfiguration(app) {
    let args = parseArgs(process.argv);
    setupEnv(app, args);
    loadMaster(app);
    loadServers(app);
    processArgs(app, args);
    configLogger(app);
    loadLifecycle(app);
}
exports.defaultConfiguration = defaultConfiguration;
/**
 * Start servers by type.
 */
function startByType(app, cb) {
    if (!!app.startId) {
        if (app.startId === Constants.RESERVED.MASTER) {
            utils.invokeCallback(cb);
        }
        else {
            starter.runServers(app);
        }
    }
    else {
        if (!!app.type && app.type !== Constants.RESERVED.ALL && app.type !== Constants.RESERVED.MASTER) {
            starter.runServers(app);
        }
        else {
            utils.invokeCallback(cb);
        }
    }
}
exports.startByType = startByType;
/**
 * Load default components for application.
 */
function loadDefaultComponents(app) {
    // load system default components
    if (app.serverType === Constants.RESERVED.MASTER) {
        app.load(pinus_1.pinus.components.master, app.get('masterConfig'));
    }
    else {
        app.load(pinus_1.pinus.components.proxy, app.get('proxyConfig'));
        if (app.getCurServer().port) {
            app.load(pinus_1.pinus.components.remote, app.get('remoteConfig'));
        }
        if (app.isFrontend()) {
            app.load(pinus_1.pinus.components.connection, app.get('connectionConfig'));
            app.load(pinus_1.pinus.components.connector, app.get('connectorConfig'));
            app.load(pinus_1.pinus.components.session, app.get('sessionConfig'));
            // compatible for schedulerConfig
            if (app.get('schedulerConfig')) {
                app.load(pinus_1.pinus.components.pushScheduler, app.get('schedulerConfig'));
            }
            else {
                app.load(pinus_1.pinus.components.pushScheduler, app.get('pushSchedulerConfig'));
            }
        }
        app.load(pinus_1.pinus.components.backendSession, app.get('backendSessionConfig'));
        app.load(pinus_1.pinus.components.channel, app.get('channelConfig'));
        app.load(pinus_1.pinus.components.server, app.get('serverConfig'));
    }
    app.load(pinus_1.pinus.components.monitor, app.get('monitorConfig'));
}
exports.loadDefaultComponents = loadDefaultComponents;
/**
 * Stop components.
 *
 * @param  {Array}  comps component list
 * @param  {Number}   index current component index
 * @param  {Boolean}  force whether stop component immediately
 * @param  {Function} cb
 */
function stopComps(comps, index, force, cb) {
    if (index >= comps.length) {
        utils.invokeCallback(cb);
        return;
    }
    let comp = comps[index];
    if (typeof comp.stop === 'function') {
        comp.stop(force, function () {
            // ignore any error
            stopComps(comps, index + 1, force, cb);
        });
    }
    else {
        stopComps(comps, index + 1, force, cb);
    }
}
exports.stopComps = stopComps;
/**
 * Apply command to loaded components.
 * This method would invoke the component {method} in series.
 * Any component {method} return err, it would return err directly.
 *
 * @param {Array} comps loaded component list
 * @param {String} method component lifecycle method name, such as: start, stop
 * @param {Function} cb
 */
function optComponents(comps, method, cb) {
    let i = 0;
    async.forEachSeries(comps, function (comp, done) {
        i++;
        if (typeof comp[method] === 'function') {
            comp[method](done);
        }
        else {
            done();
        }
    }, function (err) {
        if (err) {
            if (typeof err === 'string') {
                logger.error('fail to operate component, method: %s, err: %j', method, err);
            }
            else {
                logger.error('fail to operate component, method: %s, err: %j', method, err.stack);
            }
        }
        utils.invokeCallback(cb, err);
    });
}
exports.optComponents = optComponents;
function optLifecycles(comps, method, app, cb, arg2) {
    let i = 0;
    async.forEachSeries(comps, function (comp, done) {
        i++;
        if (typeof comp[method] === 'function') {
            comp[method](app, done, arg2);
        }
        else {
            done();
        }
    }, function (err) {
        if (err) {
            if (typeof err === 'string') {
                logger.error('fail to operate lifecycle, method: %s, err: %j', method, err);
            }
            else {
                logger.error('fail to operate lifecycle, method: %s, err: %j', method, err.stack);
            }
        }
        utils.invokeCallback(cb, err);
    });
}
exports.optLifecycles = optLifecycles;
/**
 * Load server info from config/servers.json.
 */
let loadServers = function (app) {
    app.loadConfigBaseApp(Constants.RESERVED.SERVERS, Constants.FILEPATH.SERVER);
    let servers = app.get(Constants.RESERVED.SERVERS);
    let serverMap = {}, slist, i, l, server;
    for (let serverType in servers) {
        slist = servers[serverType];
        for (i = 0, l = slist.length; i < l; i++) {
            server = slist[i];
            server.serverType = serverType;
            if (server[Constants.RESERVED.CLUSTER_COUNT]) {
                utils.loadCluster(app, server, serverMap);
                continue;
            }
            serverMap[server.id] = server;
            if (server.wsPort) {
                logger.warn('wsPort is deprecated, use clientPort in frontend server instead, server: %j', server);
            }
        }
    }
    app.set(Constants.KEYWORDS.SERVER_MAP, serverMap);
};
/**
 * Load master info from config/master.json.
 */
let loadMaster = function (app) {
    app.loadConfigBaseApp(Constants.RESERVED.MASTER, Constants.FILEPATH.MASTER);
    app.master = app.get(Constants.RESERVED.MASTER);
};
/**
 * Process server start command
 */
let processArgs = function (app, args) {
    let serverType = args.serverType || Constants.RESERVED.MASTER;
    let serverId = args.id || app.getMaster().id;
    let mode = args.mode || Constants.RESERVED.CLUSTER;
    let masterha = args.masterha || 'false';
    let type = args.type || Constants.RESERVED.ALL;
    let startId = args.startId;
    app.set(Constants.RESERVED.MAIN, args.main, true);
    app.set(Constants.RESERVED.SERVER_TYPE, serverType, true);
    app.set(Constants.RESERVED.SERVER_ID, serverId, true);
    app.set(Constants.RESERVED.MODE, mode, true);
    app.set(Constants.RESERVED.TYPE, type, true);
    if (!!startId) {
        app.set(Constants.RESERVED.STARTID, startId, true);
    }
    if (masterha === 'true') {
        app.master = args;
        app.set(Constants.RESERVED.CURRENT_SERVER, args, true);
    }
    else if (serverType !== Constants.RESERVED.MASTER) {
        app.set(Constants.RESERVED.CURRENT_SERVER, args, true);
    }
    else {
        app.set(Constants.RESERVED.CURRENT_SERVER, app.getMaster(), true);
    }
};
/**
 * Setup enviroment.
 */
let setupEnv = function (app, args) {
    app.set(Constants.RESERVED.ENV, args.env || process.env.NODE_ENV || Constants.RESERVED.ENV_DEV, true);
};
let _checkCanRequire = (path) => {
    try {
        path = require.resolve(path);
    }
    catch (err) {
        return null;
    }
    return path;
};
/**
 * Configure custom logger.
 */
let configLogger = function (app) {
    if (process.env.POMELO_LOGGER !== 'off') {
        let env = app.get(Constants.RESERVED.ENV);
        let originPath = path.join(app.getBase(), Constants.FILEPATH.LOG);
        let presentPath = path.join(app.getBase(), Constants.FILEPATH.CONFIG_DIR, env, path.basename(Constants.FILEPATH.LOG));
        if (_checkCanRequire(originPath)) {
            log.configure(app, originPath);
        }
        else if (_checkCanRequire(presentPath)) {
            log.configure(app, presentPath);
        }
        else {
            logger.error('logger file path configuration is error.');
        }
    }
};
/**
 * Parse command line arguments.
 *
 * @param args command line arguments
 *
 * @return Object argsMap map of arguments
 */
let parseArgs = function (args) {
    let argsMap = {};
    let mainPos = 1;
    while (args[mainPos].indexOf('--') > 0) {
        mainPos++;
    }
    argsMap.main = args[mainPos];
    for (let i = (mainPos + 1); i < args.length; i++) {
        let arg = args[i];
        let sep = arg.indexOf('=');
        let key = arg.slice(0, sep);
        let value = arg.slice(sep + 1);
        if (!isNaN(Number(value)) && (value.indexOf('.') < 0)) {
            value = Number(value);
        }
        argsMap[key] = value;
    }
    return argsMap;
};
/**
 * Load lifecycle file.
 *
 */
let loadLifecycle = function (app) {
    let filePath = path.join(app.getBase(), Constants.FILEPATH.SERVER_DIR, app.serverType, Constants.FILEPATH.LIFECYCLE);
    try {
        filePath = require.resolve(filePath);
    }
    catch (err) {
        return;
    }
    let lifecycle = require(filePath);
    if (!filePath) {
        logger.error('lifecycle.js in %s is error format.', filePath);
        return;
    }
    if (util_1.isFunction(lifecycle.default)) {
        lifecycle = lifecycle.default(app);
    }
    else {
        logger.error('lifecycle.js in %s is error format.', filePath);
        return;
    }
    app.usedPlugins.push(lifecycle);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL2FwcFV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBK0I7QUFDL0IsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQyw2QkFBNkI7QUFFN0IseUNBQXlDO0FBQ3pDLDZDQUE2QztBQUU3QywrQ0FBeUM7QUFDekMsb0NBQWlDO0FBR2pDLCtCQUFrQztBQUNsQyxJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0Q7O0dBRUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxHQUFnQjtJQUNqRCxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqQixXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQVJELG9EQVFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixXQUFXLENBQUMsR0FBZ0IsRUFBRSxFQUF5QjtJQUNuRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFO1FBQ2YsSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQzNDLEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUI7YUFBTTtZQUNILE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7S0FDSjtTQUFNO1FBQ0gsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDN0YsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0gsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QjtLQUNKO0FBQ0wsQ0FBQztBQWRELGtDQWNDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxHQUFnQjtJQUNsRCxpQ0FBaUM7SUFDakMsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQzlDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0tBQzlEO1NBQU07UUFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxJQUFJLEVBQUU7WUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7U0FDOUQ7UUFDRCxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNsQixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBQ25FLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDakUsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDN0QsaUNBQWlDO1lBQ2pDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2FBQ3hFO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7YUFDNUU7U0FDSjtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLENBQUM7UUFDM0UsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7S0FDOUQ7SUFDRCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBekJELHNEQXlCQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixTQUFTLENBQUMsS0FBbUIsRUFBRSxLQUFhLEVBQUUsS0FBYyxFQUFFLEVBQWM7SUFDeEYsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUN2QixLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87S0FDVjtJQUNELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7UUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDYixtQkFBbUI7WUFDbkIsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztLQUNOO1NBQU07UUFDSCxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQzFDO0FBQ0wsQ0FBQztBQWRELDhCQWNDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixhQUFhLENBQUMsS0FBbUIsRUFBRSxNQUFjLEVBQUUsRUFBeUI7SUFDeEYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxJQUFJLEVBQUUsSUFBSTtRQUMzQyxDQUFDLEVBQUUsQ0FBQztRQUNKLElBQUksT0FBUSxJQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQzVDLElBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjthQUFNO1lBQ0gsSUFBSSxFQUFFLENBQUM7U0FDVjtJQUNMLENBQUMsRUFBRSxVQUFVLEdBQVU7UUFDbkIsSUFBSSxHQUFHLEVBQUU7WUFDTCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtnQkFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDL0U7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JGO1NBQ0o7UUFDRCxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFuQkQsc0NBbUJDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLEtBQW1CLEVBQUUsTUFBYyxFQUFFLEdBQWdCLEVBQUUsRUFBeUIsRUFBRSxJQUFXO0lBQ3ZILElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNWLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLFVBQVUsSUFBSSxFQUFFLElBQUk7UUFDM0MsQ0FBQyxFQUFFLENBQUM7UUFDSixJQUFJLE9BQVEsSUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFVBQVUsRUFBRTtZQUM1QyxJQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFHLElBQUksRUFBRyxJQUFJLENBQUMsQ0FBQztTQUM1QzthQUFNO1lBQ0gsSUFBSSxFQUFFLENBQUM7U0FDVjtJQUNMLENBQUMsRUFBRSxVQUFVLEdBQVU7UUFDbkIsSUFBSSxHQUFHLEVBQUU7WUFDTCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtnQkFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDL0U7aUJBQU07Z0JBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3JGO1NBQ0o7UUFDRCxLQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFuQkQsc0NBbUJDO0FBR0Q7O0dBRUc7QUFDSCxJQUFJLFdBQVcsR0FBRyxVQUFVLEdBQWdCO0lBQ3hDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzdFLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNsRCxJQUFJLFNBQVMsR0FBcUMsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQztJQUMxRSxLQUFLLElBQUksVUFBVSxJQUFJLE9BQU8sRUFBRTtRQUM1QixLQUFLLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDL0IsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDMUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2dCQUMxQyxTQUFTO2FBQ1o7WUFDRCxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUM5QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyw2RUFBNkUsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUN0RztTQUNKO0tBQ0o7SUFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsSUFBSSxVQUFVLEdBQUcsVUFBVSxHQUFnQjtJQUN2QyxHQUFHLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxDQUFDLENBQUM7QUFVRjs7R0FFRztBQUNILElBQUksV0FBVyxHQUFHLFVBQVUsR0FBZ0IsRUFBRSxJQUFxQjtJQUMvRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQzlELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUM3QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDO0lBQ3hDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7SUFDL0MsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUUzQixHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDN0MsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO1FBQ1gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDdEQ7SUFFRCxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7UUFDckIsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDMUQ7U0FBTSxJQUFJLFVBQVUsS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNqRCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxRDtTQUFNO1FBQ0gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDckU7QUFDTCxDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNILElBQUksUUFBUSxHQUFHLFVBQVUsR0FBZ0IsRUFBRSxJQUFtQjtJQUMxRCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUcsQ0FBQyxDQUFDO0FBQ0YsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ3BDLElBQUk7UUFDQSxJQUFJLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNoQztJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUVGOztHQUVHO0FBQ0gsSUFBSSxZQUFZLEdBQUcsVUFBVSxHQUFnQjtJQUN6QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxLQUFLLEtBQUssRUFBRTtRQUNyQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFdEgsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM5QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztTQUNsQzthQUFNLElBQUksZ0JBQWdCLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDdEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDbkM7YUFBTTtZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztTQUM1RDtLQUNKO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7Ozs7OztHQU1HO0FBQ0gsSUFBSSxTQUFTLEdBQUcsVUFBVSxJQUFjO0lBQ3BDLElBQUksT0FBTyxHQUFRLEVBQUUsQ0FBQztJQUN0QixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQyxPQUFPLEVBQUUsQ0FBQztLQUNiO0lBQ0QsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5QyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNuRCxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBUSxDQUFDO1NBQ2hDO1FBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUN4QjtJQUVELE9BQU8sT0FBTyxDQUFDO0FBQ25CLENBQUMsQ0FBQztBQUVGOzs7R0FHRztBQUNILElBQUksYUFBYSxHQUFHLFVBQVUsR0FBZ0I7SUFDMUMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JILElBQUk7UUFDQSxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN4QztJQUFDLE9BQU0sR0FBRyxFQUFFO1FBQ1QsT0FBTztLQUNWO0lBRUQsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlELE9BQU87S0FDVjtJQUNELElBQUksaUJBQVUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDL0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDdEM7U0FBTTtRQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTztLQUNWO0lBQ0QsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDIn0=