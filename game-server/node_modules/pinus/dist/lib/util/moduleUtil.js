"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const admin = require("pinus-admin");
const utils = require("./utils");
const Constants = require("./constants");
const pathUtil = require("./pathUtil");
const starter = require("../master/starter");
const pinus_logger_1 = require("pinus-logger");
const masterwatcher_1 = require("../modules/masterwatcher");
const monitorwatcher_1 = require("../modules/monitorwatcher");
const watchServer_1 = require("../modules/watchServer");
const onlineUser_1 = require("../modules/onlineUser");
const console_1 = require("../modules/console");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Load admin modules
 */
function loadModules(self, consoleService) {
    // load app register modules
    let _modules = self.app.get(Constants.KEYWORDS.MODULE);
    if (!_modules) {
        return;
    }
    let modules = [];
    for (let m in _modules) {
        modules.push(_modules[m]);
    }
    let record, moduleId, module;
    for (let i = 0, l = modules.length; i < l; i++) {
        record = modules[i];
        if (typeof record.module === 'function') {
            module = new record.module(record.opts, consoleService);
        }
        else {
            module = record.module;
        }
        moduleId = record.moduleId || module.moduleId;
        if (!moduleId) {
            logger.warn('ignore an unknown module.');
            continue;
        }
        consoleService.register(moduleId, module);
        self.modules.push(module);
    }
}
exports.loadModules = loadModules;
function startModules(modules, cb) {
    // invoke the start lifecycle method of modules
    if (!modules) {
        return;
    }
    startModule(null, modules, 0, cb);
}
exports.startModules = startModules;
/**
 * Append the default system admin modules
 */
function registerDefaultModules(isMaster, app, closeWatcher) {
    if (!closeWatcher) {
        if (isMaster) {
            app.registerAdmin(masterwatcher_1.MasterWatcherModule, { app: app });
        }
        else {
            app.registerAdmin(monitorwatcher_1.MonitorWatcherModule, { app: app });
        }
    }
    app.registerAdmin(watchServer_1.WatchServerModule, { app: app });
    app.registerAdmin(console_1.ConsoleModule, { app: app, starter: starter });
    if (app.enabled('systemMonitor')) {
        if (os.platform() !== Constants.PLATFORM.WIN) {
            app.registerAdmin(admin.modules.systemInfo);
            app.registerAdmin(admin.modules.nodeInfo);
        }
        app.registerAdmin(onlineUser_1.OnlineUserModule);
        app.registerAdmin(admin.modules.monitorLog, { path: pathUtil.getLogPath(app.getBase()) });
        app.registerAdmin(admin.modules.scripts, { app: app, path: pathUtil.getScriptPath(app.getBase()) });
        if (os.platform() !== Constants.PLATFORM.WIN) {
            app.registerAdmin(admin.modules.profiler);
        }
    }
}
exports.registerDefaultModules = registerDefaultModules;
let startModule = function (err, modules, index, cb) {
    if (err || index >= modules.length) {
        utils.invokeCallback(cb, err);
        return;
    }
    let module = modules[index];
    if (module && typeof module.start === 'function') {
        module.start((err) => {
            startModule(err, modules, index + 1, cb);
        });
    }
    else {
        startModule(err, modules, index + 1, cb);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlVXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi91dGlsL21vZHVsZVV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5QkFBeUI7QUFDekIscUNBQXFDO0FBQ3JDLGlDQUFpQztBQUNqQyx5Q0FBeUM7QUFDekMsdUNBQXVDO0FBQ3ZDLDZDQUE2QztBQUM3QywrQ0FBeUM7QUFFekMsNERBQStEO0FBQy9ELDhEQUFpRTtBQUNqRSx3REFBMkQ7QUFDM0Qsc0RBQXlEO0FBQ3pELGdEQUFtRDtBQUNuRCw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBUTNEOztHQUVHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLElBQWtELEVBQUUsY0FBOEI7SUFDMUcsNEJBQTRCO0lBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFdkQsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUNYLE9BQU87S0FDVjtJQUVELElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixLQUFLLElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzdCO0lBRUQsSUFBSSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztJQUM3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVDLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssVUFBVSxFQUFFO1lBQ3JDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztTQUMzRDthQUFNO1lBQ0gsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDMUI7UUFFRCxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDO1FBRTlDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDWCxNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDekMsU0FBUztTQUNaO1FBRUQsY0FBYyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0I7QUFDTCxDQUFDO0FBaENELGtDQWdDQztBQUVELFNBQWdCLFlBQVksQ0FBQyxPQUFrQixFQUFFLEVBQXlCO0lBQ3RFLCtDQUErQztJQUUvQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTztLQUNWO0lBQ0QsV0FBVyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFQRCxvQ0FPQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isc0JBQXNCLENBQUMsUUFBaUIsRUFBRSxHQUFnQixFQUFFLFlBQXFCO0lBQzdGLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDZixJQUFJLFFBQVEsRUFBRTtZQUNWLEdBQUcsQ0FBQyxhQUFhLENBQUMsbUNBQW1CLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUN4RDthQUFNO1lBQ0gsR0FBRyxDQUFDLGFBQWEsQ0FBQyxxQ0FBb0IsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ3pEO0tBQ0o7SUFDRCxHQUFHLENBQUMsYUFBYSxDQUFDLCtCQUFpQixFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbkQsR0FBRyxDQUFDLGFBQWEsQ0FBQyx1QkFBYSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNqRSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDMUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVDLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3QztRQUNELEdBQUcsQ0FBQyxhQUFhLENBQUMsNkJBQWdCLENBQUMsQ0FBQztRQUNwQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzFGLEdBQUcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUMxQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDN0M7S0FDSjtBQUNMLENBQUM7QUF0QkQsd0RBc0JDO0FBRUQsSUFBSSxXQUFXLEdBQUcsVUFBVSxHQUFVLEVBQUUsT0FBa0IsRUFBRSxLQUFhLEVBQUUsRUFBeUI7SUFDaEcsSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDaEMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsT0FBTztLQUNWO0lBRUQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7UUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2pCLFdBQVcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7S0FDTjtTQUFNO1FBQ0gsV0FBVyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM1QztBQUNMLENBQUMsQ0FBQyJ9