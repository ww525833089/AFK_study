"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for statistics.
 * Record used time for each request.
 */
const pinus_logger_1 = require("pinus-logger");
let conLogger = pinus_logger_1.getLogger('con-log', __filename);
const utils = require("../../util/utils");
class TimeFilter {
    before(routeRecord, msg, session, next) {
        session.__startTime__ = Date.now();
        next(null);
    }
    after(err, routeRecord, msg, session, resp, next) {
        let start = session.__startTime__;
        if (typeof start === 'number') {
            let timeUsed = Date.now() - start;
            let log = {
                route: routeRecord.route,
                args: msg,
                time: utils.format(new Date(start)),
                timeUsed: timeUsed
            };
            conLogger.info(JSON.stringify(log));
        }
        next(err);
    }
}
exports.TimeFilter = TimeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9maWx0ZXJzL2hhbmRsZXIvdGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILCtDQUF1QztBQUV2QyxJQUFJLFNBQVMsR0FBRyx3QkFBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNqRCwwQ0FBMEM7QUFPMUMsTUFBYSxVQUFVO0lBQ25CLE1BQU0sQ0FBQyxXQUF3QixFQUFFLEdBQVEsRUFBRSxPQUFpQyxFQUFFLElBQXFCO1FBQzlGLE9BQWUsQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVSxFQUFFLFdBQXdCLEVBQUUsR0FBUSxFQUFFLE9BQWlDLEVBQUUsSUFBUyxFQUFFLElBQXFCO1FBQ3JILElBQUksS0FBSyxHQUFJLE9BQWUsQ0FBQyxhQUFhLENBQUM7UUFDM0MsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDM0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUNsQyxJQUFJLEdBQUcsR0FBRztnQkFDTixLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7Z0JBQ3hCLElBQUksRUFBRSxHQUFHO2dCQUNULElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQyxRQUFRLEVBQUUsUUFBUTthQUNyQixDQUFDO1lBQ0YsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUFwQkQsZ0NBb0JDIn0=