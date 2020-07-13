"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for toobusy.
 * if the process is toobusy, just skip the new request
 */
const pinus_logger_1 = require("pinus-logger");
let conLogger = pinus_logger_1.getLogger('con-log', __filename);
let toobusy = null;
let DEFAULT_MAXLAG = 70;
class ToobusyFilter {
    constructor(maxLag = DEFAULT_MAXLAG) {
        try {
            toobusy = require('toobusy');
        }
        catch (e) {
        }
        if (!!toobusy) {
            toobusy.maxLag(maxLag);
        }
    }
    before(routeRecord, msg, session, next) {
        if (!!toobusy && toobusy()) {
            conLogger.warn('[toobusy] reject request msg: ' + msg);
            let err = new Error('Server toobusy!');
            err.code = 500;
            next(err);
        }
        else {
            next(null);
        }
    }
}
exports.ToobusyFilter = ToobusyFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vYnVzeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9maWx0ZXJzL2hhbmRsZXIvdG9vYnVzeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILCtDQUF1QztBQU12QyxJQUFJLFNBQVMsR0FBRyx3QkFBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqRCxJQUFJLE9BQU8sR0FBUSxJQUFJLENBQUM7QUFDeEIsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBR3hCLE1BQWEsYUFBYTtJQUN0QixZQUFZLE1BQU0sR0FBRyxjQUFjO1FBQy9CLElBQUk7WUFDQSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2hDO1FBQUMsT0FBTyxDQUFDLEVBQUU7U0FDWDtRQUNELElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUI7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQXdCLEVBQUUsR0FBUSxFQUFFLE9BQWlDLEVBQUUsSUFBcUI7UUFDL0YsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRSxFQUFFO1lBQ3hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN0QyxHQUFXLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDYjthQUFNO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2Q7SUFDTCxDQUFDO0NBQ0o7QUFyQkQsc0NBcUJDIn0=