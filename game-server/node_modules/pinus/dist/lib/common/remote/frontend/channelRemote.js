"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
function default_1(app) {
    return new ChannelRemote(app);
}
exports.default = default_1;
class ChannelRemote {
    constructor(app) {
        this.app = app;
    }
    /**
     * Push message to client by uids.
     *
     * @param  {String}   route route string of message
     * @param  {Object}   msg   message
     * @param  {Array}    uids  user ids that would receive the message
     * @param  {Object}   opts  push options
     * @param  {Function} cb    callback function
     */
    pushMessage(route, msg, uids, opts) {
        return new Promise((resolve, reject) => {
            if (!msg) {
                logger.error('Can not send empty message! route : %j, compressed msg : %j', route, msg);
                return reject(new Error('can not send empty message.'));
            }
            let connector = this.app.components.__connector__;
            let sessionService = this.app.get('sessionService');
            let fails = [], sids = [], sessions, j, k;
            for (let i = 0, l = uids.length; i < l; i++) {
                sessions = sessionService.getByUid(uids[i]);
                if (!sessions) {
                    fails.push(uids[i]);
                }
                else {
                    for (j = 0, k = sessions.length; j < k; j++) {
                        sids.push(sessions[j].id);
                    }
                }
            }
            logger.debug('[%s] pushMessage uids: %j, msg: %j, sids: %j', this.app.serverId, uids, msg, sids);
            connector.send(null, route, msg, sids, opts, function (err) {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(fails);
                }
            });
        });
    }
    /**
     * Broadcast to all the client connectd with current frontend server.
     *
     * @param  {String}    route  route string
     * @param  {Object}    msg    message
     * @param  {Boolean}   opts   broadcast options.
     * @param  {Function}  cb     callback function
     */
    broadcast(route, msg, opts) {
        return new Promise((resolve, reject) => {
            let connector = this.app.components.__connector__;
            connector.send(null, route, msg, null, opts, function (err, resp) {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(resp);
                }
            });
        });
    }
}
exports.ChannelRemote = ChannelRemote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbFJlbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi9jb21tb24vcmVtb3RlL2Zyb250ZW5kL2NoYW5uZWxSZW1vdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSwrQ0FBdUM7QUFLdkMsNkJBQTZCO0FBRTdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUUzRCxtQkFBeUIsR0FBZ0I7SUFDckMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsNEJBRUM7QUFFRCxNQUFhLGFBQWE7SUFHdEIsWUFBWSxHQUFnQjtRQUN4QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxXQUFXLENBQUMsS0FBYSxFQUFFLEdBQVEsRUFBRSxJQUFXLEVBQUUsSUFBcUI7UUFDbkUsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN4QyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNOLE1BQU0sQ0FBQyxLQUFLLENBQUMsNkRBQTZELEVBQ3RFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDaEIsT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO2FBQzNEO1lBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO1lBRWxELElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDcEQsSUFBSSxLQUFLLEdBQVUsRUFBRSxFQUFFLElBQUksR0FBVSxFQUFFLEVBQUUsUUFBbUIsRUFBRSxDQUFTLEVBQUUsQ0FBUyxDQUFDO1lBQ25GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLFFBQVEsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QyxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNYLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZCO3FCQUFNO29CQUNILEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0o7YUFDSjtZQUNELE1BQU0sQ0FBQyxLQUFLLENBQUMsOENBQThDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxHQUFHO2dCQUN0RCxJQUFJLEdBQUcsRUFBRTtvQkFDTCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7cUJBQ0k7b0JBQ0QsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ3pCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsU0FBUyxDQUFDLEtBQWEsRUFBRSxHQUFRLEVBQUUsSUFBcUI7UUFDcEQsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN4QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7WUFFbEQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFLElBQUk7Z0JBQzVELElBQUksR0FBRyxFQUFFO29CQUNMLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUN0QjtxQkFDSTtvQkFDRCxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDeEI7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBeEVELHNDQXdFQyJ9