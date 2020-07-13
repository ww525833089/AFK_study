"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let serialFilter = require('../../../lib/filters/handler/time').TimeFilter;
let FilterService = require('../../../lib/common/service/filterService').FilterService;
let util = require('util');
let mockSession = {
    key: '123'
};
let WAIT_TIME = 100;
describe('#timeFilter', function () {
    it('should do before filter ok', function (done) {
        let service = new FilterService();
        let filter = new serialFilter();
        service.before(filter);
        service.beforeFilter(null, mockSession, mockSession, function () {
            should.exist(mockSession);
            should.exist(mockSession.__startTime__);
            done();
        });
    });
    it('should do after filter by doing before filter ok', function (done) {
        let service = new FilterService();
        let filter = new serialFilter();
        let _session;
        service.before(filter);
        service.afterFilter(null, {}, {}, mockSession, {}, function () {
            should.exist(mockSession);
            should.exist(mockSession.__startTime__);
            _session = mockSession;
        });
        service.after(filter);
        service.afterFilter(null, { route: 'hello' }, {}, mockSession, {}, function () {
            should.exist(mockSession);
            should.strictEqual(mockSession, _session);
        });
        setTimeout(done, WAIT_TIME);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvZmlsdGVycy9oYW5kbGVyL3RpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztBQUMzRSxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDdkYsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksV0FBVyxHQUF5QztJQUNwRCxHQUFHLEVBQUUsS0FBSztDQUNiLENBQUM7QUFFRixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsUUFBUSxDQUFDLGFBQWEsRUFBRTtJQUNwQixFQUFFLENBQUMsNEJBQTRCLEVBQUUsVUFBVSxJQUFlO1FBQ3RELElBQUksT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBR3ZCLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUU7WUFDakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUUxQixNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QyxJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0RBQWtELEVBQUUsVUFBVSxJQUFlO1FBQzVFLElBQUksT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNoQyxJQUFJLFFBQThDLENBQUM7UUFDbkQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUU7WUFDL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtZQUMvRCxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLENBQUMsQ0FBQyxDQUFDO1FBRUgsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=