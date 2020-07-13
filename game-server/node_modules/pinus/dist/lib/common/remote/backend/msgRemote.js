"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('forward-log', path.basename(__filename));
/**
 * Remote service for backend servers.
 * Receive and handle request message forwarded from frontend server.
 */
function default_1(app) {
    return new MsgRemote(app);
}
exports.default = default_1;
class MsgRemote {
    constructor(app) {
        this.app = app;
    }
    /**
     * Forward message from frontend server to other server's handlers
     *
     * @param msg {Object} request message
     * @param session {Object} session object for current request
     * @param cb {Function} callback function
     */
    forwardMessage(msg, session) {
        return new Promise((resolve, reject) => {
            let server = this.app.components.__server__;
            let sessionService = this.app.components.__backendSession__;
            if (!server) {
                logger.error('server component not enable on %s', this.app.serverId);
                reject(new Error('server component not enable'));
                return;
            }
            if (!sessionService) {
                logger.error('backend session component not enable on %s', this.app.serverId);
                reject(new Error('backend sesssion component not enable'));
                return;
            }
            // generate backend session for current request
            let backendSession = sessionService.create(session);
            // handle the request
            logger.debug('session:[%s,%s,%s], handle message: %j', session.id, session.uid, session.frontendId, msg);
            server.handle(msg, backendSession, function (err, resp) {
                logger.debug('session:[%s,%s,%s], handle message result,err:%j,msg:%j,resp:%j', session.id, session.uid, session.frontendId, err, msg, resp);
                // 如果有给response 那就不给connector错误。给response.
                // 因为promise，所以与pomelo有点不一致，pomelo把err与resp一起传回connector了
                if (err) {
                    if (resp) {
                        logger.error('session:[%s,%s,%s], handle message %j, error:%j', session.id, session.uid, session.frontendId, msg, err);
                        return resolve(resp);
                    }
                    reject(err);
                }
                else {
                    resolve(resp);
                }
            });
        });
    }
}
exports.MsgRemote = MsgRemote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXNnUmVtb3RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vbGliL2NvbW1vbi9yZW1vdGUvYmFja2VuZC9tc2dSZW1vdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwrQ0FBeUM7QUFHekMsNkJBQTZCO0FBRzdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNqRTs7O0dBR0c7QUFDSCxtQkFBeUIsR0FBZ0I7SUFDckMsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUM5QixDQUFDO0FBRkQsNEJBRUM7QUFFRCxNQUFhLFNBQVM7SUFHbEIsWUFBWSxHQUFnQjtRQUN4QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsY0FBYyxDQUFDLEdBQVEsRUFBRSxPQUFpQjtRQUN0QyxPQUFPLElBQUksT0FBTyxDQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUM1QyxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQztZQUU1RCxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDckUsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQztnQkFDakQsT0FBTzthQUNWO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyw0Q0FBNEMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM5RSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxPQUFPO2FBQ1Y7WUFFRCwrQ0FBK0M7WUFDL0MsSUFBSSxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUVwRCxxQkFBcUI7WUFFckIsTUFBTSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUV6RyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsVUFBVSxHQUFHLEVBQUUsSUFBSTtnQkFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxpRUFBaUUsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM3SSwwQ0FBMEM7Z0JBQzFDLHlEQUF5RDtnQkFDekQsSUFBSSxHQUFHLEVBQUU7b0JBQ0wsSUFBSSxJQUFJLEVBQUU7d0JBQ04sTUFBTSxDQUFDLEtBQUssQ0FBQyxpREFBaUQsRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7d0JBQ3ZILE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN4QjtvQkFDRCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ2Y7cUJBQ0k7b0JBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQjtZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBK0RKO0FBckhELDhCQXFIQyJ9