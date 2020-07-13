"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let taskManager = require('../../lib/common/manager/taskManager');
// set timeout for test
taskManager.timeout = 100;
let WAIT_TIME = 200;
describe('#taskManager', function () {
    it('should add task and execute it', function (done) {
        let key = 'key-1';
        let fn = function (task) {
            taskCount++;
            task.done();
        };
        let onTimeout = function () {
            should.fail('should not timeout.', null);
        };
        let taskCount = 0;
        taskManager.addTask(key, fn, onTimeout);
        setTimeout(function () {
            taskCount.should.equal(1);
            done();
        }, WAIT_TIME);
    });
    it('should fire timeout callback if task timeout', function (done) {
        let key = 'key-1';
        let fn = function (task) {
            taskCount++;
        };
        let onTimeout = function () {
            timeoutCount++;
        };
        let taskCount = 0;
        let timeoutCount = 0;
        taskManager.addTask(key, fn, onTimeout);
        setTimeout(function () {
            taskCount.should.equal(1);
            timeoutCount.should.equal(1);
            done();
        }, WAIT_TIME);
    });
    it('should not fire timeout after close the task', function (done) {
        let key = 'key-1';
        let fn = function (task) {
            taskCount++;
        };
        let onTimeout = function () {
            timeoutCount++;
        };
        let taskCount = 0;
        let timeoutCount = 0;
        taskManager.addTask(key, fn, onTimeout);
        process.nextTick(function () {
            taskManager.closeQueue(key, true);
            setTimeout(function () {
                taskCount.should.equal(1);
                timeoutCount.should.equal(0);
                done();
            }, WAIT_TIME);
        });
    });
    it('should be ok to remove a queue not exist', function () {
        let key = 'key-n';
        taskManager.closeQueue(key, true);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFza01hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L21hbmFnZXIvdGFza01hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO0FBRWxFLHVCQUF1QjtBQUN2QixXQUFXLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUUxQixJQUFJLFNBQVMsR0FBRyxHQUFHLENBQUM7QUFFcEIsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUN2QixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsVUFBVSxJQUFlO1FBQzVELElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNsQixJQUFJLEVBQUUsR0FBRyxVQUFVLElBQVM7WUFDMUIsU0FBUyxFQUFFLENBQUM7WUFDWixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUM7UUFDRixJQUFJLFNBQVMsR0FBRztZQUNkLE1BQU0sQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV4QyxVQUFVLENBQUM7WUFDVCxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQUUsQ0FBQztRQUNULENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxVQUFVLElBQWU7UUFDMUUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2xCLElBQUksRUFBRSxHQUFHLFVBQVUsSUFBUztZQUMxQixTQUFTLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQztRQUNGLElBQUksU0FBUyxHQUFHO1lBQ2QsWUFBWSxFQUFFLENBQUM7UUFDakIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUVyQixXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFeEMsVUFBVSxDQUFDO1lBQ1QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxFQUFFLENBQUM7UUFDVCxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUUsVUFBVSxJQUFlO1FBQzFFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNsQixJQUFJLEVBQUUsR0FBRyxVQUFVLElBQVM7WUFDMUIsU0FBUyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUM7UUFDRixJQUFJLFNBQVMsR0FBRztZQUNkLFlBQVksRUFBRSxDQUFDO1FBQ2pCLENBQUMsQ0FBQztRQUNGLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7UUFFckIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDZixXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUVsQyxVQUFVLENBQUM7Z0JBQ1QsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixJQUFJLEVBQUUsQ0FBQztZQUNULENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1FBQzdDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUNsQixXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=