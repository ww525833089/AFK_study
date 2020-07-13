"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for master.
 */
const master_1 = require("../master/master");
/**
* Master component class
*
* @param {Object} app current application context
*/
class MasterComponent {
    constructor(app, opts) {
        this.name = '__master__';
        this.master = new master_1.MasterServer(app, opts);
    }
    /**
     * Component lifecycle function
     *
     * @param  {Function} cb
     * @return {Void}
     */
    start(cb) {
        this.master.start(cb);
    }
    /**
     * Component lifecycle function
     *
     * @param  {Boolean}   force whether stop the component immediately
     * @param  {Function}  cb
     * @return {Void}
     */
    stop(force, cb) {
        this.master.stop(cb);
    }
}
exports.MasterComponent = MasterComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2NvbXBvbmVudHMvbWFzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0dBRUc7QUFDSCw2Q0FBcUU7QUFJckU7Ozs7RUFJRTtBQUNGLE1BQWEsZUFBZTtJQUd4QixZQUFZLEdBQWdCLEVBQUUsSUFBeUI7UUFGdkQsU0FBSSxHQUFHLFlBQVksQ0FBQztRQUdoQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUkscUJBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLEVBQXlCO1FBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFJLENBQUMsS0FBYyxFQUFFLEVBQXlCO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7Q0FFSjtBQTVCRCwwQ0E0QkMifQ==