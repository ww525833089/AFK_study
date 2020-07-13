"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for rpc log.
 * Reject rpc request when toobusy
 */
const pinus_logger_1 = require("pinus-logger");
let rpcLogger = pinus_logger_1.getLogger('rpc-log', __filename);
let toobusy = null;
let DEFAULT_MAXLAG = 70;
class RpcToobusyFilter {
    constructor(maxLag = DEFAULT_MAXLAG) {
        this.name = 'toobusy';
        try {
            toobusy = require('toobusy');
        }
        catch (e) {
        }
        if (!!toobusy) {
            toobusy.maxLag(maxLag);
        }
    }
    /**
     * Before filter for rpc
     */
    before(serverId, msg, opts, next) {
        opts = opts || {};
        if (!!toobusy && toobusy()) {
            rpcLogger.warn('Server too busy for rpc request, serverId:' + serverId + ' msg: ' + msg);
            let err = new Error('Backend server ' + serverId + ' is too busy now!');
            err.code = 500;
            next(err);
        }
        else {
            next();
        }
    }
}
exports.RpcToobusyFilter = RpcToobusyFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vYnVzeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9maWx0ZXJzL3JwYy90b29idXN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7OztHQUdHO0FBQ0gsK0NBQXVDO0FBR3ZDLElBQUksU0FBUyxHQUFHLHdCQUFTLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pELElBQUksT0FBTyxHQUFRLElBQUksQ0FBQztBQUV4QixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7QUFHeEIsTUFBYSxnQkFBZ0I7SUFDekIsWUFBWSxNQUFNLEdBQUcsY0FBYztRQVVuQyxTQUFJLEdBQUcsU0FBUyxDQUFDO1FBVGIsSUFBSTtZQUNBLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDaEM7UUFBQyxPQUFPLENBQUMsRUFBRTtTQUNYO1FBQ0QsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO1lBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxQjtJQUNMLENBQUM7SUFJRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxRQUFnQixFQUFFLEdBQVEsRUFBRSxJQUFTLEVBQUUsSUFBcUU7UUFDL0csSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRSxFQUFFO1lBQ3hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsNENBQTRDLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUN6RixJQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxRQUFRLEdBQUcsbUJBQW1CLENBQUMsQ0FBQztZQUN2RSxHQUFXLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYjthQUFNO1lBQ0gsSUFBSSxFQUFFLENBQUM7U0FDVjtJQUNMLENBQUM7Q0FDSjtBQTNCRCw0Q0EyQkMifQ==