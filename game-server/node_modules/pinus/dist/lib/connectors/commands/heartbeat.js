"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Process heartbeat request.
 *
 * @param {Object} opts option request
 *                      opts.heartbeat heartbeat interval
 */
class HeartbeatCommand {
    constructor(opts) {
        this.timeouts = {};
        this.clients = {};
        opts = opts || {};
        this.disconnectOnTimeout = opts.disconnectOnTimeout;
        if (opts.heartbeat) {
            this.heartbeat = opts.heartbeat * 1000; // heartbeat interval
            this.timeout = opts.timeout * 1000 || this.heartbeat * 2; // max heartbeat message timeout
            this.disconnectOnTimeout = true;
        }
    }
    handle(socket) {
        if (!this.heartbeat) {
            // no heartbeat setting
            return;
        }
        let self = this;
        if (!this.clients[socket.id]) {
            // clear timers when socket disconnect or error
            this.clients[socket.id] = 1;
            socket.once('disconnect', this.clearTimers.bind(this, socket.id));
            socket.once('error', this.clearTimers.bind(this, socket.id));
        }
        // clear timeout timer
        if (self.disconnectOnTimeout) {
            this.clear(socket.id);
        }
        socket.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_HEARTBEAT));
        if (self.disconnectOnTimeout) {
            self.timeouts[socket.id] = setTimeout(function () {
                logger.info('client %j heartbeat timeout.', socket.id);
                socket.disconnect();
            }, self.timeout);
        }
    }
    clear(id) {
        let tid = this.timeouts[id];
        if (tid) {
            clearTimeout(tid);
            delete this.timeouts[id];
        }
    }
    clearTimers(id) {
        delete this.clients[id];
        let tid = this.timeouts[id];
        if (tid) {
            clearTimeout(tid);
            delete this.timeouts[id];
        }
    }
}
exports.HeartbeatCommand = HeartbeatCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhcnRiZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvY29tbWFuZHMvaGVhcnRiZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQXlDO0FBQ3pDLCtDQUF5QztBQUV6Qyw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBUzNEOzs7OztHQUtHO0FBQ0gsTUFBYSxnQkFBZ0I7SUFNekIsWUFBWSxJQUE4QjtRQUYxQyxhQUFRLEdBQXlDLEVBQUUsQ0FBQztRQUNwRCxZQUFPLEdBQW1DLEVBQUUsQ0FBQztRQUV6QyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBRXBELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMscUJBQXFCO1lBQzdELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBTSxnQ0FBZ0M7WUFDL0YsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztTQUNuQztJQUVMLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBZTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNqQix1QkFBdUI7WUFDdkIsT0FBTztTQUNWO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBRWhCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUMxQiwrQ0FBK0M7WUFDL0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDaEU7UUFFRCxzQkFBc0I7UUFDdEIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDMUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDekI7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLHdCQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtZQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDeEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwQjtJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsRUFBVTtRQUNaLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDNUIsSUFBSSxHQUFHLEVBQUU7WUFDTCxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzVCO0lBQ0wsQ0FBQztJQUNELFdBQVcsQ0FBQyxFQUFVO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVCLElBQUksR0FBRyxFQUFFO1lBQ0wsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QjtJQUNMLENBQUM7Q0FDSjtBQS9ERCw0Q0ErREMifQ==