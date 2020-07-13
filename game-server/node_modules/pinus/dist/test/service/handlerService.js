"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let HandlerService = require('../../lib/common/service/handlerService').HandlerService;
class MockApp {
    constructor() {
        this.serverType = 'connector';
        this.usedPlugins = [];
    }
    get(key) {
        return this[key];
    }
    getCurrentServer() {
        return {};
    }
}
let mockApp = new MockApp();
let mockSession = {
    exportSession: function () {
        return this;
    }
};
let mockMsg = { key: 'some request message' };
let mockRouteRecord = { serverType: 'connector', handler: 'testHandler', method: 'testMethod' };
describe('handler service test', function () {
    describe('handle', function () {
        it('should dispatch the request to the handler if the route match current server type', function (done) {
            let invoke1Count = 0, invoke2Count = 0;
            // mock datas
            let mockHandlers = {
                testHandler: {
                    testMethod: async function (msg, session, next) {
                        invoke1Count++;
                        msg.should.eql(mockMsg);
                    }
                },
                test2Handler: {
                    testMethod: async function (msg, session, next) {
                        invoke2Count++;
                    }
                }
            };
            let mockOpts = {};
            let service = new HandlerService(mockApp, mockOpts);
            service.handlerMap = { connector: mockHandlers };
            service.handle(mockRouteRecord, mockMsg, mockSession, function () {
                invoke1Count.should.equal(1);
                invoke2Count.should.equal(0);
                done();
            });
        });
        it('should return an error if can not find the appropriate handler locally', function (done) {
            let mockHandlers = {};
            let mockOpts = {};
            let service = new HandlerService(mockApp, mockOpts);
            service.handlerMap = { connector: mockHandlers };
            service.handle(mockRouteRecord, mockMsg, mockSession, function (err) {
                should.exist(err);
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3NlcnZpY2UvaGFuZGxlclNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQztBQUd2RixNQUFNLE9BQU87SUFHVDtRQUZBLGVBQVUsR0FBVyxXQUFXLENBQUM7UUFLakMsZ0JBQVcsR0FBUSxFQUFFLENBQUM7SUFGdEIsQ0FBQztJQUlELEdBQUcsQ0FBWSxHQUFXO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPLEVBQUUsQ0FBQTtJQUNiLENBQUM7Q0FDSjtBQUVELElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFNUIsSUFBSSxXQUFXLEdBQUc7SUFDZCxhQUFhLEVBQUU7UUFDWCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0osQ0FBQztBQUVGLElBQUksT0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLHNCQUFzQixFQUFFLENBQUM7QUFDOUMsSUFBSSxlQUFlLEdBQUcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxDQUFDO0FBRWhHLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtJQUM3QixRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2YsRUFBRSxDQUFDLG1GQUFtRixFQUFFLFVBQVUsSUFBZTtZQUM3RyxJQUFJLFlBQVksR0FBRyxDQUFDLEVBQUUsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUN2QyxhQUFhO1lBQ2IsSUFBSSxZQUFZLEdBQUc7Z0JBQ2YsV0FBVyxFQUFFO29CQUNULFVBQVUsRUFBRSxLQUFLLFdBQVcsR0FBUSxFQUFFLE9BQWdCLEVBQUUsSUFBYzt3QkFDbEUsWUFBWSxFQUFFLENBQUM7d0JBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQzVCLENBQUM7aUJBQ0o7Z0JBQ0QsWUFBWSxFQUFFO29CQUNWLFVBQVUsRUFBRSxLQUFLLFdBQVcsR0FBUSxFQUFFLE9BQWdCLEVBQUUsSUFBYzt3QkFDbEUsWUFBWSxFQUFFLENBQUM7b0JBQ25CLENBQUM7aUJBQ0o7YUFDSixDQUFDO1lBRUYsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBRWxCLElBQUksT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBRWpELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7Z0JBQ2xELFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdFQUF3RSxFQUFFLFVBQVUsSUFBZTtZQUNsRyxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7WUFDdEIsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1lBQ2xCLElBQUksT0FBTyxHQUFHLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNwRCxPQUFPLENBQUMsVUFBVSxHQUFHLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDO1lBRWpELE9BQU8sQ0FBQyxNQUFNLENBQUMsZUFBZSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxHQUFVO2dCQUN0RSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=