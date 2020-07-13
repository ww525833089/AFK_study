"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let CountDownLatch = require('../../lib/util/countDownLatch');
require("should");
// import { describe, it } from "mocha-typescript"
let cbCreator = (function () {
    let count = 0;
    return {
        callback: function () {
            count++;
        },
        getCount: function () {
            return count;
        },
        count: count
    };
})();
describe('countdown latch test', function () {
    let countDownLatch1;
    let countDownLatch2;
    describe('#count down', function () {
        it('should invoke the callback after the done method was invoked the specified times', function (done) {
            let n = 3, doneCount = 0;
            let cdl = CountDownLatch.createCountDownLatch(n, function () {
                doneCount.should.equal(n);
                done();
            });
            for (let i = 0; i < n; i++) {
                doneCount++;
                cdl.done();
            }
        });
        it('should throw exception if pass a negative or zero to the create method', function () {
            (function () {
                CountDownLatch.createCountDownLatch(-1, function () {
                });
            }).should.throw();
            (function () {
                CountDownLatch.createCountDownLatch(0, function () {
                });
            }).should.throw();
        });
        it('should throw exception if pass illegal cb to the create method', function () {
            (function () {
                CountDownLatch.createCountDownLatch(1, null);
            }).should.throw();
        });
        it('should throw exception if try to invoke done metho of a latch that has fired cb', function () {
            let n = 3;
            let cdl = CountDownLatch.createCountDownLatch(n, function () {
            });
            for (let i = 0; i < n; i++) {
                cdl.done();
            }
            (function () {
                cdl.done();
            }).should.throw();
        });
        it('should invoke the callback if timeout', function () {
            let n = 3;
            let cdl = CountDownLatch.createCountDownLatch(n, { timeout: 3000 }, function (isTimeout) {
                isTimeout.should.equal(true);
            });
            for (let i = 0; i < n - 1; i++) {
                cdl.done();
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnREb3duTGF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3V0aWwvY291bnREb3duTGF0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUM5RCxrQkFBZ0I7QUFDaEIsa0RBQWtEO0FBRWxELElBQUksU0FBUyxHQUFHLENBQUM7SUFDYixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFFZCxPQUFPO1FBQ0gsUUFBUSxFQUFFO1lBQ04sS0FBSyxFQUFFLENBQUM7UUFDWixDQUFDO1FBQ0QsUUFBUSxFQUFFO1lBQ04sT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELEtBQUssRUFBRSxLQUFLO0tBQ2YsQ0FBQztBQUNOLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFFTCxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDN0IsSUFBSSxlQUFlLENBQUM7SUFDcEIsSUFBSSxlQUFlLENBQUM7SUFFcEIsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUNwQixFQUFFLENBQUMsa0ZBQWtGLEVBQUUsVUFBVSxJQUFlO1lBQzVHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUU7Z0JBQzdDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1lBRUgsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDeEIsU0FBUyxFQUFFLENBQUM7Z0JBQ1osR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2Q7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3RUFBd0UsRUFBRTtZQUN6RSxDQUFDO2dCQUNHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEMsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFbEIsQ0FBQztnQkFDRyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFO2dCQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNqRSxDQUFDO2dCQUNHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDakQsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlGQUFpRixFQUFFO1lBQ2xGLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUU7WUFDakQsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN4QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDZDtZQUVELENBQUM7Z0JBQ0csR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVDQUF1QyxFQUFFO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLElBQUksR0FBRyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsVUFBVSxTQUFrQjtnQkFDNUYsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDNUIsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2Q7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==