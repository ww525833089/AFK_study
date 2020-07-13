"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let FilterService = require('../../lib/common/service/filterService').FilterService;
let WAIT_TIME = 50;
let mockFilter1 = {
    before: function (record, msg, session, cb) {
        session.beforeCount1++;
        cb();
    },
    after: function (err, record, msg, session, resp, cb) {
        session.afterCount1++;
        cb();
    }
};
let mockFilter2 = {
    before: function (record, msg, session, cb) {
        session.beforeCount2++;
        cb();
    },
    after: function (err, record, msg, session, resp, cb) {
        session.afterCount2++;
        cb();
    }
};
let blackholdFilter = {
    before: function () {
    },
    after: function () {
    }
};
class MockSession {
    constructor() {
        this.beforeCount1 = 0;
        this.afterCount1 = 0;
        this.beforeCount2 = 0;
        this.afterCount2 = 0;
    }
}
describe('filter service test', function () {
    describe('#filter', function () {
        it('should register before filter by calling before method and fire filter chain by calling beforeFilter', function (done) {
            let session = new MockSession();
            let service = new FilterService();
            service.before(mockFilter1);
            service.before(mockFilter2);
            service.beforeFilter(null, {}, session, function () {
                should.exist(session);
                session.beforeCount1.should.equal(1);
                session.beforeCount2.should.equal(1);
                session.afterCount1.should.equal(0);
                session.afterCount2.should.equal(0);
                done();
            });
        });
        it('should register after filter by calling after method and fire filter chain by calling afterFilter', function (done) {
            let session = new MockSession();
            let service = new FilterService();
            service.after(mockFilter1);
            service.after(mockFilter2);
            service.afterFilter(null, null, {}, session, null, function () {
                should.exist(session);
                session.beforeCount1.should.equal(0);
                session.beforeCount2.should.equal(0);
                session.afterCount1.should.equal(1);
                session.afterCount2.should.equal(1);
                done();
            });
        });
        it('should be ok if filter is a function', function (done) {
            let session = { beforeCount: 0, afterCount: 0 };
            let service = new FilterService();
            let beforeCount = 0, afterCount = 0;
            service.before(function (record, msg, session, cb) {
                session.beforeCount++;
                cb();
            });
            service.after(function (err, record, msg, session, resp, cb) {
                session.afterCount++;
                cb();
            });
            service.beforeFilter(null, {}, session, function () {
                beforeCount++;
            });
            service.afterFilter(null, null, {}, session, null, function () {
                afterCount++;
            });
            session.beforeCount.should.equal(1);
            session.afterCount.should.equal(1);
            beforeCount.should.equal(1);
            afterCount.should.equal(1);
            done();
        });
        it('should not invoke the callback if filter not invoke callback', function (done) {
            let session = new MockSession();
            let service = new FilterService();
            let beforeCount = 0, afterCount = 0;
            service.before(blackholdFilter);
            service.after(blackholdFilter);
            service.beforeFilter(null, {}, session, function () {
                beforeCount++;
            });
            service.afterFilter(null, null, {}, session, null, function () {
                afterCount++;
            });
            setTimeout(function () {
                session.beforeCount1.should.equal(0);
                session.beforeCount2.should.equal(0);
                session.afterCount1.should.equal(0);
                session.afterCount2.should.equal(0);
                beforeCount.should.equal(0);
                afterCount.should.equal(0);
                done();
            }, WAIT_TIME);
        });
        it('should pass the err and resp parameters to callback and ignore the filters behind if them specified in before filter', function (done) {
            let session = new MockSession();
            let service = new FilterService();
            let error = 'some error message';
            let response = { key: 'some value' };
            let respFilter = {
                before: function (record, msg, session, cb) {
                    cb(error, response);
                }
            };
            service.before(mockFilter1);
            service.before(respFilter);
            service.before(mockFilter2);
            service.beforeFilter(null, {}, session, function (err, resp) {
                should.exist(err);
                err.should.equal(error);
                should.exist(resp);
                resp.should.equal(response);
                session.beforeCount1.should.equal(1);
                session.beforeCount2.should.equal(0);
                session.afterCount1.should.equal(0);
                session.afterCount2.should.equal(0);
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qvc2VydmljZS9maWx0ZXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBQ2pDLGtEQUFrRDtBQUNsRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFHcEYsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBRW5CLElBQUksV0FBVyxHQUFHO0lBQ2QsTUFBTSxFQUFFLFVBQVUsTUFBVyxFQUFFLEdBQVEsRUFBRSxPQUE0RCxFQUFFLEVBQVk7UUFDL0csT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLEVBQUUsRUFBRSxDQUFDO0lBQ1QsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFVLEdBQVUsRUFBRSxNQUFXLEVBQUUsR0FBUSxFQUFFLE9BQTJELEVBQUUsSUFBUyxFQUFFLEVBQVk7UUFDcEksT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3RCLEVBQUUsRUFBRSxDQUFDO0lBQ1QsQ0FBQztDQUNKLENBQUM7QUFFRixJQUFJLFdBQVcsR0FBRztJQUNkLE1BQU0sRUFBRSxVQUFVLE1BQVcsRUFBRSxHQUFRLEVBQUUsT0FBNEQsRUFBRSxFQUFZO1FBQy9HLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN2QixFQUFFLEVBQUUsQ0FBQztJQUNULENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBVSxHQUFVLEVBQUUsTUFBVyxFQUFFLEdBQVEsRUFBRSxPQUEyRCxFQUFFLElBQVMsRUFBRSxFQUFZO1FBQ3BJLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN0QixFQUFFLEVBQUUsQ0FBQztJQUNULENBQUM7Q0FDSixDQUFDO0FBRUYsSUFBSSxlQUFlLEdBQUc7SUFDbEIsTUFBTSxFQUFFO0lBQ1IsQ0FBQztJQUNELEtBQUssRUFBRTtJQUNQLENBQUM7Q0FDSixDQUFD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