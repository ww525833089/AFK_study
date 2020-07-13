"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sessionService_1 = require("../common/service/sessionService");
/**
 * Session component. Manage sessions.
 *
 * @param {Object} app  current application context
 * @param {Object} opts attach parameters
 */
class SessionComponent extends sessionService_1.SessionService {
    constructor(app, opts) {
        super(opts);
        this.name = '__session__';
        this.app = app;
        app.set('sessionService', this, true);
    }
}
exports.SessionComponent = SessionComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb21wb25lbnRzL3Nlc3Npb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxRUFBeUY7QUFLekY7Ozs7O0dBS0c7QUFDSCxNQUFhLGdCQUFpQixTQUFRLCtCQUFjO0lBRWhELFlBQVksR0FBZ0IsRUFBRSxJQUE2QjtRQUN2RCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFLaEIsU0FBSSxHQUFHLGFBQWEsQ0FBQztRQUpqQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzFDLENBQUM7Q0FJSjtBQVZELDRDQVVDIn0=