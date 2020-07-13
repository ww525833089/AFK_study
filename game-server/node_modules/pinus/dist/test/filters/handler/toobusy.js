"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let toobusyFilter = require('../../../lib/filters/handler/toobusy').ToobusyFilter;
let FilterService = require('../../../lib/common/service/filterService').FilterService;
let util = require('util');
let mockSession = {
    key: '123'
};
describe('#toobusyFilter', function () {
    it('should do before filter ok', function (done) {
        let service = new FilterService();
        let filter = new toobusyFilter();
        service.before(filter);
        service.beforeFilter(null, {}, mockSession, function (err) {
            should.not.exist(err);
            should.exist(mockSession);
            done();
        });
    });
    it('should do before filter error because of too busy', function (done) {
        let service = new FilterService();
        let filter = new toobusyFilter(3);
        service.before(filter);
        this.timeout(8888);
        let exit = false;
        try {
            require('toobusy');
        }
        catch (e) {
            done();
            return;
        }
        function load() {
            service.beforeFilter(null, {}, mockSession, function (err, resp) {
                should.exist(mockSession);
                console.log('err: ' + err);
                if (!!err) {
                    exit = true;
                }
            });
            console.log('exit: ' + exit);
            if (exit) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vYnVzeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvZmlsdGVycy9oYW5kbGVyL3Rvb2J1c3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQztBQUNsRixJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsMkNBQTJDLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFDdkYsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksV0FBVyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEtBQUs7Q0FDYixDQUFDO0FBRUYsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3ZCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxVQUFVLElBQWU7UUFDdEQsSUFBSSxPQUFPLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUNsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFdkIsT0FBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxVQUFVLEdBQVU7WUFDNUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbURBQW1ELEVBQUUsVUFBVSxJQUFlO1FBQzdFLElBQUksT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDbEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2xCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNqQixJQUFJO1lBQ0EsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3RCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixJQUFJLEVBQUUsQ0FBQTtZQUNOLE9BQU07U0FDVDtRQUVELFNBQVMsSUFBSTtZQUNULE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsVUFBVSxHQUFVLEVBQUUsSUFBUztnQkFDdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtvQkFDUCxJQUFJLEdBQUcsSUFBSSxDQUFDO2lCQUNmO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLElBQUksRUFBRTtnQkFDTixPQUFPLElBQUksRUFBRSxDQUFDO2FBQ2pCO1lBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsR0FBRyxFQUFFO2dCQUMvQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRztvQkFBRyxDQUFDLEVBQUUsQ0FBQzthQUNqQztZQUNELFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELElBQUksRUFBRSxDQUFDO0lBRVgsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9