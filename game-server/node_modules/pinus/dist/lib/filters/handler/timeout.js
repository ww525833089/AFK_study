"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter for timeout.
 * Print a warn information when request timeout.
 */
const pinus_logger_1 = require("pinus-logger");
let logger = pinus_logger_1.getLogger('pinus', __filename);
let DEFAULT_TIMEOUT = 3000;
let DEFAULT_SIZE = 500;
class TimeoutFilter {
    constructor(timeout = DEFAULT_TIMEOUT, maxSize = DEFAULT_SIZE) {
        this.timeout = timeout;
        this.maxSize = maxSize;
        this.timeouts = {};
        this.curId = 0;
        this.timeOutCount = 0;
    }
    before(routeRecord, msg, session, next) {
        if (this.timeOutCount > this.maxSize) {
            logger.warn('timeout filter is out of range, current size is %s, max size is %s', this.timeOutCount, this.maxSize);
            next(null);
            return;
        }
        this.curId++;
        this.timeOutCount++;
        this.timeouts[this.curId] = setTimeout(function () {
            logger.error('request %j timeout.', routeRecord.route);
        }, this.timeout);
        session.__timeout__ = this.curId;
        next(null);
    }
    after(err, routeRecord, msg, session, resp, next) {
        let timeout = this.timeouts[session.__timeout__];
        if (timeout) {
            clearTimeout(timeout);
            this.timeOutCount--;
            this.timeouts[session.__timeout__] = undefined;
        }
        next(err);
    }
}
exports.TimeoutFilter = TimeoutFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9maWx0ZXJzL2hhbmRsZXIvdGltZW91dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7R0FHRztBQUNILCtDQUF1QztBQUV2QyxJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztBQU81QyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFDM0IsSUFBSSxZQUFZLEdBQUcsR0FBRyxDQUFDO0FBRXZCLE1BQWEsYUFBYTtJQUt0QixZQUFvQixVQUFVLGVBQWUsRUFBVSxVQUFVLFlBQVk7UUFBekQsWUFBTyxHQUFQLE9BQU8sQ0FBa0I7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFlO1FBSjdFLGFBQVEsR0FBbUMsRUFBRSxDQUFDO1FBQzlDLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDRixpQkFBWSxHQUFHLENBQUMsQ0FBQztJQUd6QixDQUFDO0lBRUQsTUFBTSxDQUFDLFdBQXdCLEVBQUUsR0FBUSxFQUFFLE9BQWlDLEVBQUUsSUFBcUI7UUFDL0YsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxvRUFBb0UsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuSCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDWCxPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEIsT0FBZSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVSxFQUFFLFdBQXdCLEVBQUUsR0FBUSxFQUFFLE9BQWlDLEVBQUUsSUFBUyxFQUFFLElBQXFCO1FBQ3JILElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUUsT0FBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzFELElBQUksT0FBTyxFQUFFO1lBQ1QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsUUFBUSxDQUFFLE9BQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxTQUFTLENBQUM7U0FDM0Q7UUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxDQUFDO0NBRUo7QUFqQ0Qsc0NBaUNDIn0=