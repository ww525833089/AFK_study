"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Filter service.
 * Register and fire before and after filters.
 */
class FilterService {
    constructor() {
        this.befores = []; // before filters
        this.afters = []; // after filters
        this.name = 'filter';
    }
    removeBefore(filter) {
        let index = this.befores.findIndex(v => v === filter);
        if (index >= 0) {
            this.befores.splice(index);
        }
    }
    removeAfter(filter) {
        let index = this.afters.findIndex(v => v === filter);
        if (index >= 0) {
            this.afters.splice(index);
        }
    }
    /**
     * Add before filter into the filter chain.
     *
     * @param filter {Object|Function} filter instance or filter function.
     */
    before(filter) {
        this.befores.push(filter);
    }
    /**
     * Add after filter into the filter chain.
     *
     * @param filter {Object|Function} filter instance or filter function.
     */
    after(filter) {
        this.afters.unshift(filter);
    }
    /**
     * TODO: other insert method for filter? such as unshift
     */
    /**
     * Do the before filter.
     * Fail over if any filter pass err parameter to the next function.
     *
     * @param msg {Object} clienet request msg
     * @param session {Object} a session object for current request
     * @param cb {Function} cb(err) callback function to invoke next chain node
     */
    beforeFilter(routeRecord, msg, session, cb) {
        let index = 0, self = this;
        let next = function (err, resp) {
            if (err || index >= self.befores.length) {
                cb(err, resp);
                return;
            }
            let handler = self.befores[index++];
            if (typeof handler === 'function') {
                handler(routeRecord, msg, session, next);
            }
            else if (typeof handler.before === 'function') {
                handler.before(routeRecord, msg, session, next);
            }
            else {
                logger.error('meet invalid before filter, handler or handler.before should be function.');
                next(new Error('invalid before filter.'));
            }
        }; // end of next
        next();
    }
    /**
     * Do after filter chain.
     * Give server a chance to do clean up jobs after request responsed.
     * After filter can not change the request flow before.
     * After filter should call the next callback to let the request pass to next after filter.
     *
     * @param err {Object} error object
     * @param session {Object} session object for current request
     * @param {Object} resp response object send to client
     * @param cb {Function} cb(err) callback function to invoke next chain node
     */
    afterFilter(err, routeRecord, msg, session, resp, cb) {
        let index = 0, self = this;
        function next(err) {
            // if done
            if (index >= self.afters.length) {
                cb(err);
                return;
            }
            let handler = self.afters[index++];
            if (typeof handler === 'function') {
                handler(err, routeRecord, msg, session, resp, next);
            }
            else if (typeof handler.after === 'function') {
                handler.after(err, routeRecord, msg, session, resp, next);
            }
            else {
                logger.error('meet invalid after filter, handler or handler.after should be function.');
                next(new Error('invalid after filter.'));
            }
        } // end of next
        next(err);
    }
}
exports.FilterService = FilterService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb21tb24vc2VydmljZS9maWx0ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQXlDO0FBSXpDLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFFM0Q7OztHQUdHO0FBQ0gsTUFBYSxhQUFhO0lBQTFCO1FBRUksWUFBTyxHQUEwQixFQUFFLENBQUMsQ0FBSSxpQkFBaUI7UUFDekQsV0FBTSxHQUF5QixFQUFFLENBQUMsQ0FBSyxnQkFBZ0I7UUFFdkQsU0FBSSxHQUFHLFFBQVEsQ0FBQztJQXFHcEIsQ0FBQztJQW5HRyxZQUFZLENBQUMsTUFBMkI7UUFDcEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBRUQsV0FBVyxDQUFDLE1BQTBCO1FBQ2xDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO0lBQ0wsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsTUFBMkI7UUFDOUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsTUFBMEI7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOztPQUVHO0lBRUg7Ozs7Ozs7T0FPRztJQUNILFlBQVksQ0FBQyxXQUF3QixFQUFHLEdBQVEsRUFBRSxPQUFpQyxFQUFFLEVBQW1CO1FBQ3BHLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksSUFBSSxHQUFHLFVBQVUsR0FBUyxFQUFFLElBQVU7WUFDdEMsSUFBSSxHQUFHLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUNyQyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNkLE9BQU87YUFDVjtZQUVELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwQyxJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRTtnQkFDL0IsT0FBTyxDQUFDLFdBQVcsRUFBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdDO2lCQUFNLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDN0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUcsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNwRDtpQkFBTTtnQkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLDJFQUEyRSxDQUFDLENBQUM7Z0JBQzFGLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7YUFDN0M7UUFDTCxDQUFDLENBQUMsQ0FBQyxjQUFjO1FBRWpCLElBQUksRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSCxXQUFXLENBQUMsR0FBVSxFQUFFLFdBQXdCLEVBQUcsR0FBUSxFQUFFLE9BQWlDLEVBQUUsSUFBUyxFQUFFLEVBQW1CO1FBQzFILElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQzNCLFNBQVMsSUFBSSxDQUFDLEdBQVU7WUFDcEIsVUFBVTtZQUNWLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUM3QixFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ1IsT0FBTzthQUNWO1lBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1lBQ25DLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO2dCQUMvQixPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN4RDtpQkFBTSxJQUFJLE9BQU8sT0FBTyxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7Z0JBQzVDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsRUFBRyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUM5RDtpQkFBTTtnQkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7Z0JBQ3hGLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7YUFDNUM7UUFDTCxDQUFDLENBQUMsY0FBYztRQUVoQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUExR0Qsc0NBMEdDIn0=