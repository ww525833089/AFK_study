"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { describe, it } from "mocha-typescript"
let toobusyFilter = require('../../../lib/filters/rpc/toobusy').RpcToobusyFilter;
toobusyFilter = new toobusyFilter();
let mockData = {
    serverId: 'connector-server-1',
    msg: 'hello',
    opts: {}
};
describe('#toobusyFilter', function () {
    it('should no callback for toobusy', function (done) {
        try {
            require('toobusy');
        }
        catch (e) {
            done();
            return;
        }
        function load() {
            let callbackInvoked = false;
            toobusyFilter.before(mockData.serverId, mockData.msg, mockData.opts, function (serverId, msg, opts) {
                callbackInvoked = true;
            });
            if (!callbackInvoked) {
                console.log(' logic of toobusy enterd, done!');
                return done();
            }
            let start = Date.now();
            while ((Date.now() - start) < 250) {
                for (let i = 0; i < 1e5;)
                    i++;
            }
            setTimeout(load, 0);
        }
        load();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vYnVzeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvZmlsdGVycy9ycGMvdG9vYnVzeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFrRDtBQUNsRCxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztBQUNqRixhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQTtBQUNuQyxJQUFJLFFBQVEsR0FBRztJQUNYLFFBQVEsRUFBRSxvQkFBb0I7SUFDOUIsR0FBRyxFQUFFLE9BQU87SUFDWixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFHRixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDdkIsRUFBRSxDQUFDLGdDQUFnQyxFQUFFLFVBQVUsSUFBZTtRQUMxRCxJQUFJO1lBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQTtZQUNOLE9BQU07U0FDVDtRQUVELFNBQVMsSUFBSTtZQUNULElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQztZQUM1QixhQUFhLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsUUFBZ0IsRUFBRSxHQUFXLEVBQUUsSUFBUztnQkFDbkgsZUFBZSxHQUFHLElBQUksQ0FBQztZQUMzQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUNBQWlDLENBQUMsQ0FBQztnQkFDL0MsT0FBTyxJQUFJLEVBQUUsQ0FBQzthQUNqQjtZQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEdBQUcsRUFBRTtnQkFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUc7b0JBQUcsQ0FBQyxFQUFFLENBQUM7YUFDakM7WUFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLENBQUM7UUFFRCxJQUFJLEVBQUUsQ0FBQztJQUNYLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==