"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class MultiPushScheduler {
    constructor(app, opts) {
        opts = opts || {};
        let scheduler = opts.scheduler;
        if (Array.isArray(scheduler)) {
            this.scheduler = {};
            for (let sch of scheduler) {
                if (typeof sch.scheduler === 'function') {
                    this.scheduler[sch.id] = new sch.scheduler(app, sch.options);
                }
                else {
                    this.scheduler[sch.id] = sch.scheduler;
                }
            }
            if (!util_1.isFunction(opts.selector)) {
                throw new Error('MultiPushScheduler必须提供selector参数');
            }
            this.selector = opts.selector;
        }
        else {
            throw new Error('MultiPushScheduler必须提供scheduler参数');
        }
        this.app = app;
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    async start() {
        for (let k in this.scheduler) {
            let sch = this.scheduler[k];
            if (typeof sch.start === 'function') {
                await sch.start();
            }
        }
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    async stop() {
        for (let k in this.scheduler) {
            let sch = this.scheduler[k];
            if (typeof sch.stop === 'function') {
                await sch.stop();
            }
        }
    }
    /**
     * Schedule how the message to send.
     *
     * @param  {Number}   reqId request id
     * @param  {String}   route route string of the message
     * @param  {Object}   msg   message content after encoded
     * @param  {Array}    recvs array of receiver's session id
     * @param  {Object}   opts  options
     */
    schedule(reqId, route, msg, recvs, opts, cb) {
        let self = this;
        let id = self.selector(reqId, route, msg, recvs, opts);
        if (self.scheduler[id]) {
            self.scheduler[id].schedule(reqId, route, msg, recvs, opts, cb);
        }
        else {
            logger.error('invalid pushScheduler id, id: %j', id);
        }
    }
}
exports.MultiPushScheduler = MultiPushScheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvcHVzaFNjaGVkdWxlcnMvbXVsdGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrQkFBa0M7QUFDbEMsK0NBQXlDO0FBRXpDLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFJM0QsTUFBYSxrQkFBa0I7SUFPM0IsWUFBWSxHQUFnQixFQUFFLElBQStCO1FBQ3pELElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDL0IsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLEtBQUksSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFO2dCQUN0QixJQUFJLE9BQU8sR0FBRyxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7b0JBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2lCQUNoRTtxQkFBTTtvQkFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO2lCQUMxQzthQUNKO1lBRUQsSUFBRyxDQUFDLGlCQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO2dCQUMzQixNQUFNLElBQUksS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7YUFDdkQ7WUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDakM7YUFDSTtZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztTQUN4RDtRQUVELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFJRDs7Ozs7T0FLRztJQUNILEtBQUssQ0FBQyxLQUFLO1FBQ1AsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO2dCQUNqQyxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNyQjtTQUNKO0lBQ0wsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLElBQUk7UUFDTixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDMUIsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7Z0JBQ2hDLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ3BCO1NBQ0o7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxRQUFRLENBQUMsS0FBYSxFQUFFLEtBQWEsRUFBRSxHQUFRLEVBQUUsS0FBWSxFQUFFLElBQXFCLEVBQUUsRUFBeUI7UUFDM0csSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXZELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ25FO2FBQU07WUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ3hEO0lBQ0wsQ0FBQztDQUNKO0FBcEZELGdEQW9GQyJ9