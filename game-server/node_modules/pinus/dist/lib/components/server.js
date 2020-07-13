"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for server starup.
 */
const server_1 = require("../server/server");
/**
 * Server component class
 *
 * @param {Object} app  current application context
 */
class ServerComponent {
    constructor(app, opts) {
        this.name = '__server__';
        this.server = server_1.create(app, opts);
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    start(cb) {
        this.server.start();
        process.nextTick(cb);
    }
    /**
     * Component lifecycle callback
     *
     * @param {Function} cb
     * @return {Void}
     */
    afterStart(cb) {
        this.server.afterStart();
        process.nextTick(cb);
    }
    /**
     * Component lifecycle function
     *
     * @param {Boolean}  force whether stop the component immediately
     * @param {Function}  cb
     * @return {Void}
     */
    stop(force, cb) {
        this.server.stop();
        process.nextTick(cb);
    }
    /**
     * Proxy server handle
     */
    handle(msg, session, cb) {
        this.server.handle(msg, session, cb);
    }
    /**
     * Proxy server global handle
     */
    globalHandle(msg, session, cb) {
        this.server.globalHandle(msg, session, cb);
    }
}
exports.ServerComponent = ServerComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2NvbXBvbmVudHMvc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCw2Q0FBNEc7QUFPNUc7Ozs7R0FJRztBQUNILE1BQWEsZUFBZTtJQUV4QixZQUFZLEdBQWdCLEVBQUUsSUFBbUI7UUFHakQsU0FBSSxHQUFHLFlBQVksQ0FBQztRQUZoQixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUdEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEVBQWM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwQixPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxFQUFjO1FBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDekIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBR0Q7Ozs7OztPQU1HO0lBQ0gsSUFBSSxDQUFDLEtBQWMsRUFBRSxFQUFjO1FBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxNQUFNLENBQUMsR0FBUSxFQUFFLE9BQWlDLEVBQUUsRUFBbUI7UUFDbkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCxZQUFZLENBQUMsR0FBUSxFQUFFLE9BQWlDLEVBQUUsRUFBbUI7UUFDekUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0o7QUF2REQsMENBdURDIn0=