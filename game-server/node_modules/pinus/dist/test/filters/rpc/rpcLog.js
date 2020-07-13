"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let rpcLogFilter = require('../../../lib/filters/rpc/rpcLog').RpcLogFilter;
rpcLogFilter = new rpcLogFilter();
let mockData = {
    serverId: 'connector-server-1',
    msg: 'hello',
    opts: {}
};
describe('#rpcLogFilter', function () {
    it('should do after filter by before filter', function (done) {
        rpcLogFilter.before(mockData.serverId, mockData.msg, mockData.opts, function () {
            rpcLogFilter.after(mockData.serverId, mockData.msg, mockData.opts, function (serverId, msg, opts) {
                should.exist(mockData.opts['__start_time__']);
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnBjTG9nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9maWx0ZXJzL3JwYy9ycGNMb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUMzRSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQTtBQUNqQyxJQUFJLFFBQVEsR0FBRztJQUNYLFFBQVEsRUFBRSxvQkFBb0I7SUFDOUIsR0FBRyxFQUFFLE9BQU87SUFDWixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFFRixRQUFRLENBQUMsZUFBZSxFQUFFO0lBQ3RCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxVQUFVLElBQWU7UUFDbkUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRTtZQUNoRSxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsUUFBZ0IsRUFBRSxHQUFXLEVBQUUsSUFBUztnQkFDakgsTUFBTSxDQUFDLEtBQUssQ0FBRSxRQUFRLENBQUMsSUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9