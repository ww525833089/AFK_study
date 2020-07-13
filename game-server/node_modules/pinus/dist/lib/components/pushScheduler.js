"use strict";
/**
 * Scheduler component to schedule message sending.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const direct_1 = require("../pushSchedulers/direct");
const pinus_logger_1 = require("pinus-logger");
const multi_1 = require("../pushSchedulers/multi");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class PushSchedulerComponent {
    constructor(app, opts) {
        this.app = app;
        this.name = '__pushScheduler__';
        opts = opts || {};
        this.scheduler = getScheduler(this, app, opts);
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb) {
        this.scheduler.start().then(cb);
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    stop(force, cb) {
        this.scheduler.stop().then(cb);
    }
    /**
     * Schedule how the message to send.
     *
     * @param  {Number}   reqId request id
     * @param  {String}   route route string of the message
     * @param  {Object}   msg   message content after encoded
     * @param  {Array}    recvs array of receiver's session id
     * @param  {Object}   opts  options
     * @param  {Function} cb
     */
    schedule(reqId, route, msg, recvs, opts, cb) {
        this.scheduler.schedule(reqId, route, msg, recvs, opts, cb);
    }
}
exports.PushSchedulerComponent = PushSchedulerComponent;
let getScheduler = function (pushSchedulerComp, app, opts) {
    let scheduler = opts.scheduler || direct_1.DirectPushScheduler;
    if (typeof scheduler === 'function') {
        return new scheduler(app, opts);
    }
    if (Array.isArray(scheduler)) {
        return new multi_1.MultiPushScheduler(app, opts);
    }
    return scheduler;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaFNjaGVkdWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb21wb25lbnRzL3B1c2hTY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUVILHFEQUFpRjtBQUNqRiwrQ0FBeUM7QUFJekMsbURBQTZEO0FBRTdELDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0QsTUFBYSxzQkFBc0I7SUFFL0IsWUFBb0IsR0FBZ0IsRUFBRSxJQUE2QjtRQUEvQyxRQUFHLEdBQUgsR0FBRyxDQUFhO1FBS3BDLFNBQUksR0FBRyxtQkFBbUIsQ0FBQztRQUp2QixJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFJRDs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxFQUFjO1FBQ3JCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxLQUFjLEVBQUUsRUFBYztRQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsUUFBUSxDQUFDLEtBQWEsRUFBRSxLQUFhLEVBQUUsR0FBUSxFQUFFLEtBQVksRUFBRSxJQUFxQixFQUFFLEVBQXlCO1FBQzNHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztDQUNKO0FBMUNELHdEQTBDQztBQUNELElBQUksWUFBWSxHQUFHLFVBQVUsaUJBQXlDLEVBQUUsR0FBZ0IsRUFBRSxJQUEyQjtJQUNqSCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxJQUFJLDRCQUFnQixDQUFDO0lBQ25ELElBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxFQUFFO1FBQ2pDLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ25DO0lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzFCLE9BQU8sSUFBSSwwQkFBa0IsQ0FBQyxHQUFHLEVBQUcsSUFBaUMsQ0FBQyxDQUFDO0tBQzFFO0lBRUQsT0FBTyxTQUEyQixDQUFDO0FBQ3ZDLENBQUMsQ0FBQyJ9