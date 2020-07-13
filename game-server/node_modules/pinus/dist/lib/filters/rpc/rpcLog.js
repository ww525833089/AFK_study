"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for rpc log.
 * Record used time for remote process call.
 */
const pinus_logger_1 = require("pinus-logger");
let rpcLogger = pinus_logger_1.getLogger('rpc-log', __filename);
const utils = require("../../util/utils");
class RpcLogFilter {
    constructor() {
        this.name = 'rpcLog';
    }
    /**
     * Before filter for rpc
     */
    before(serverId, msg, opts, next) {
        opts = opts || {};
        opts.__start_time__ = Date.now();
        next();
    }
    /**
     * After filter for rpc
     */
    after(serverId, msg, opts, next) {
        if (!!opts && !!opts.__start_time__) {
            let start = opts.__start_time__;
            let end = Date.now();
            let timeUsed = end - start;
            let log = {
                route: msg.service,
                args: msg.args,
                time: utils.format(new Date(start)),
                timeUsed: timeUsed
            };
            rpcLogger.info(JSON.stringify(log));
        }
        next();
    }
}
exports.RpcLogFilter = RpcLogFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjTG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2ZpbHRlcnMvcnBjL3JwY0xvZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILCtDQUF1QztBQUV2QyxJQUFJLFNBQVMsR0FBRyx3QkFBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUVqRCwwQ0FBMEM7QUFHMUMsTUFBYSxZQUFZO0lBQXpCO1FBQ0ksU0FBSSxHQUFHLFFBQVEsQ0FBQztJQTZCcEIsQ0FBQztJQTNCRzs7T0FFRztJQUNILE1BQU0sQ0FBQyxRQUFnQixFQUFFLEdBQVEsRUFBRSxJQUFTLEVBQUUsSUFBcUU7UUFDL0csSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDakMsSUFBSSxFQUFFLENBQUM7SUFDWCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxLQUFLLENBQUMsUUFBZ0IsRUFBRSxHQUFRLEVBQUUsSUFBUyxFQUFFLElBQXFFO1FBQzlHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBQ2hDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNyQixJQUFJLFFBQVEsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHO2dCQUNOLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTztnQkFDbEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNkLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUM7Q0FDSjtBQTlCRCxvQ0E4QkMifQ==