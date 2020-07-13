"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let timeoutFilter = require('../../../lib/filters/handler/timeout').TimeoutFilter;
let FilterService = require('../../../lib/common/service/filterService').FilterService;
let util = require('util');
let mockSession = {
    key: '123'
};
let WAIT_TIME = 100;
describe('#timeoutFilter', function () {
    it('should do before filter ok', function (done) {
        let service = new FilterService();
        let filter = new timeoutFilter();
        service.before(filter);
        service.beforeFilter(null, {}, mockSession, function () {
            should.exist(mockSession);
            should.exist(mockSession.__timeout__);
            done();
        });
    });
    it('should do after filter by doing before filter ok', function (done) {
        let service = new FilterService();
        let filter = new timeoutFilter();
        let _session;
        service.before(filter);
        service.beforeFilter(null, {}, mockSession, function () {
            should.exist(mockSession);
            should.exist(mockSession.__timeout__);
            _session = mockSession;
        });
        service.after(filter);
        service.afterFilter(null, null, {}, mockSession, null, function () {
            should.exist(mockSession);
            should.strictEqual(mockSession, _session);
        });
        setTimeout(done, WAIT_TIME);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvZmlsdGVycy9oYW5kbGVyL3RpbWVvdXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQztBQUNsRixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDdkYsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksV0FBVyxHQUF1QztJQUNsRCxHQUFHLEVBQUUsS0FBSztDQUNiLENBQUM7QUFFRixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFDcEIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3ZCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxVQUFVLElBQWU7UUFDdEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRTtZQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBRTFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3RDLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRSxVQUFVLElBQWU7UUFDNUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2pDLElBQUksUUFBNEMsQ0FBQztRQUNqRCxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZCLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUU7WUFDeEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN0QyxRQUFRLEdBQUcsV0FBVyxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QixPQUFPLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUU7WUFDbkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQixNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUVILFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9