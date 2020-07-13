"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Component for monitor.
 * Load and start monitor client.
 */
const monitor_1 = require("../monitor/monitor");
class MonitorComponent {
    constructor(app, opts) {
        this.name = '__monitor__';
        this.monitor = new monitor_1.Monitor(app, opts);
    }
    start(cb) {
        this.monitor.start(cb);
    }
    stop(force, cb) {
        this.monitor.stop(cb);
    }
    reconnect(masterInfo) {
        this.monitor.reconnect(masterInfo);
    }
}
exports.MonitorComponent = MonitorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb21wb25lbnRzL21vbml0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7O0dBR0c7QUFDSCxnREFBNkQ7QUFPN0QsTUFBYSxnQkFBZ0I7SUFFekIsWUFBWSxHQUFnQixFQUFFLElBQXNCO1FBSXBELFNBQUksR0FBRyxhQUFhLENBQUM7UUFIakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFHRCxLQUFLLENBQUMsRUFBYztRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQWMsRUFBRSxFQUFjO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxTQUFTLENBQUMsVUFBc0I7UUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNKO0FBbEJELDRDQWtCQyJ9