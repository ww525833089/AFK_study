"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Filter to keep request sequence.
 */
const pinus_logger_1 = require("pinus-logger");
const taskManager = require("../../common/manager/taskManager");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class SerialFilter {
    constructor(timeout, timeOutResponse) {
        this.timeout = timeout;
        this.timeOutResponse = timeOutResponse;
    }
    /**
     * request serialization after filter
     */
    before(routeRecord, msg, session, next) {
        taskManager.addTask(session.id, function (task) {
            session.__serialTask__ = task;
            next(null);
        }, () => {
            logger.error('[serial filter] msg timeout, msg:' + JSON.stringify(msg) + ' routeRecord:' + JSON.stringify(routeRecord));
            if (this.timeOutResponse) {
                next(new Error('msg timeout:' + session.id + ' uid:' + (session.uid ? session.uid : '')), this.timeOutResponse);
            }
        }, this.timeout);
    }
    /**
     * request serialization after filter
     */
    after(err, routeRecord, msg, session, resp, next) {
        let task = session.__serialTask__;
        if (task) {
            if (!task.done() && !err) {
                err = new Error('task time out. msg:' + JSON.stringify(msg));
            }
        }
        next(err);
    }
}
exports.SerialFilter = SerialFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2ZpbHRlcnMvaGFuZGxlci9zZXJpYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILCtDQUF1QztBQUN2QyxnRUFBZ0U7QUFLaEUsNkJBQTZCO0FBRTdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUczRCxNQUFhLFlBQVk7SUFDckIsWUFBb0IsT0FBZSxFQUFVLGVBQXFCO1FBQTlDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBVSxvQkFBZSxHQUFmLGVBQWUsQ0FBTTtJQUNsRSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsV0FBd0IsRUFBRSxHQUFRLEVBQUUsT0FBaUMsRUFBRSxJQUFxQjtRQUMvRixXQUFXLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsVUFBVSxJQUFJO1lBQ3pDLE9BQWUsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNmLENBQUMsRUFBRSxHQUFHLEVBQUU7WUFDSixNQUFNLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUN4SCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLEVBQUUsR0FBRyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNuSDtRQUNMLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsS0FBSyxDQUFDLEdBQVUsRUFBRSxXQUF3QixFQUFFLEdBQVEsRUFBRSxPQUFpQyxFQUFFLElBQVMsRUFBRSxJQUFxQjtRQUNySCxJQUFJLElBQUksR0FBSSxPQUFlLENBQUMsY0FBYyxDQUFDO1FBQzNDLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdEIsR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNoRTtTQUNKO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBL0JELG9DQStCQyJ9