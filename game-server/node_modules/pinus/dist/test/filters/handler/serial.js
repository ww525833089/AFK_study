"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let serialFilter = require('../../../lib/filters/handler/serial').SerialFilter;
let FilterService = require('../../../lib/common/service/filterService').FilterService;
let util = require('util');
let mockSession = {
    key: '123'
};
let WAIT_TIME = 100;
describe('#serialFilter', function () {
    it('should do before filter ok', function (done) {
        let service = new FilterService();
        let filter = new serialFilter();
        service.before(filter);
        service.beforeFilter(null, {}, mockSession, function () {
            should.exist(mockSession);
            should.exist(mockSession.__serialTask__);
            done();
        });
    });
    it('should do after filter by doing before filter ok', function (done) {
        let service = new FilterService();
        let filter = new serialFilter();
        let _session;
        service.before(filter);
        service.afterFilter(null, null, {}, mockSession, {}, function () {
            should.exist(mockSession);
            should.exist(mockSession.__serialTask__);
            _session = mockSession;
        });
        service.after(filter);
        service.afterFilter(null, null, {}, mockSession, {}, function () {
            should.exist(mockSession);
            should.strictEqual(mockSession, _session);
        });
        setTimeout(done, WAIT_TIME);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9maWx0ZXJzL2hhbmRsZXIvc2VyaWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBQ2pDLGtEQUFrRDtBQUNsRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMscUNBQXFDLENBQUMsQ0FBQyxZQUFZLENBQUM7QUFDL0UsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsYUFBYSxDQUFDO0FBQ3ZGLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUUzQixJQUFJLFdBQVcsR0FBMEM7SUFDckQsR0FBRyxFQUFFLEtBQUs7Q0FDYixDQUFDO0FBRUYsSUFBSSxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3BCLFFBQVEsQ0FBQyxlQUFlLEVBQUU7SUFDdEIsRUFBRSxDQUFDLDRCQUE0QixFQUFFLFVBQVUsSUFBZTtRQUN0RCxJQUFJLE9BQU8sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV2QixPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFO1lBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFFMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekMsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtEQUFrRCxFQUFFLFVBQVUsSUFBZTtRQUM1RSxJQUFJLE9BQU8sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDaEMsSUFBSSxRQUErQyxDQUFDO1FBQ3BELE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDekMsUUFBUSxHQUFHLFdBQVcsQ0FBQztRQUMzQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFO1lBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDMUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFFSCxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ2hDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==