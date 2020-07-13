"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let pinus = require('../lib/index').pinus;
const should = require("should");
let mockBase = process.cwd() + '/test';
// import { describe, it } from "mocha-typescript"
describe('pinus', function () {
    describe('#createApp', function () {
        it('should create and get app, be the same instance', function (done) {
            let app = pinus.createApp({ base: mockBase });
            should.exist(app);
            let app2 = pinus.app;
            should.exist(app2);
            should.strictEqual(app, app2);
            done();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9tZWxvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9wb21lbG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzFDLGlDQUFpQztBQUNqQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQ3ZDLGtEQUFrRDtBQUVsRCxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLGlEQUFpRCxFQUFFLFVBQVUsSUFBZTtZQUM3RSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVsQixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUIsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==