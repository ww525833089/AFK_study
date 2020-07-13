"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Pomelo -- consoleModule onlineUser
 * Copyright(c) 2012 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
const pinus_logger_1 = require("pinus-logger");
const utils = require("../util/utils");
const pinus_admin_1 = require("pinus-admin");
const pinus_1 = require("../pinus");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class OnlineUserModule {
    constructor(opts) {
        opts = opts || {};
        this.app = pinus_1.pinus.app;
        this.type = opts.type || pinus_admin_1.ModuleType.pull;
        this.interval = opts.interval || 5;
    }
    /**
    * collect monitor data from monitor
    *
    * @param {Object} agent monitorAgent object
    * @param {Object} msg client message
    * @param {Function} cb callback function
    * @api public
    */
    monitorHandler(agent, msg, cb) {
        let connectionService = this.app.components.__connection__;
        if (!connectionService) {
            logger.error('not support connection: %j', agent.id);
            return;
        }
        agent.notify(OnlineUserModule.moduleId, connectionService.getStatisticsInfo());
    }
    masterHandler(agent, msg) {
        if (!msg) {
            // pull interval callback
            let list = agent.typeMap['connector'];
            if (!list || list.length === 0) {
                return;
            }
            agent.notifyByType('connector', OnlineUserModule.moduleId, msg);
            return;
        }
        let data = agent.get(OnlineUserModule.moduleId);
        if (!data) {
            data = {};
            agent.set(OnlineUserModule.moduleId, data);
        }
        data[msg.serverId] = msg;
    }
    /**
     * Handle client request
     *
     * @param {Object} agent masterAgent object
     * @param {Object} msg client message
     * @param {Function} cb callback function
     * @api public
     */
    clientHandler(agent, msg, cb) {
        utils.invokeCallback(cb, null, agent.get(OnlineUserModule.moduleId));
    }
}
exports.OnlineUserModule = OnlineUserModule;
OnlineUserModule.moduleId = 'onlineUser';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25saW5lVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2R1bGVzL29ubGluZVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsK0NBQXlDO0FBQ3pDLHVDQUF1QztBQUN2Qyw2Q0FBZ0g7QUFFaEgsb0NBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0QsTUFBYSxnQkFBZ0I7SUFRekIsWUFBWSxJQUErQztRQUN2RCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQUssQ0FBQyxHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLHdCQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVEOzs7Ozs7O01BT0U7SUFDRixjQUFjLENBQUMsS0FBbUIsRUFBRSxHQUFRLEVBQUUsRUFBbUI7UUFDN0QsSUFBSSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7UUFDM0QsSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3JELE9BQU87U0FDVjtRQUNELEtBQUssQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLGlCQUFpQixDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsYUFBYSxDQUFDLEtBQWtCLEVBQUUsR0FBUTtRQUN0QyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ04seUJBQXlCO1lBQ3pCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDNUIsT0FBTzthQUNWO1lBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2hFLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLElBQUksR0FBRyxFQUFFLENBQUM7WUFDVixLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM5QztRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzdCLENBQUM7SUFDRDs7Ozs7OztPQU9HO0lBQ0gsYUFBYSxDQUFDLEtBQWtCLEVBQUUsR0FBUSxFQUFFLEVBQWtCO1FBQzFELEtBQUssQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQzs7QUE3REwsNENBK0RDO0FBN0RVLHlCQUFRLEdBQUcsWUFBWSxDQUFDIn0=