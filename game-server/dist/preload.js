"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
// 支持注解
require("reflect-metadata");
const pinus_1 = require("pinus");
/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
function preload() {
    // 使用bluebird输出完整的promise调用链
    global.Promise = bluebird_1.Promise;
    // 开启长堆栈
    bluebird_1.Promise.config({
        // Enable warnings
        warnings: true,
        // Enable long stack traces
        longStackTraces: true,
        // Enable cancellation
        cancellation: true,
        // Enable monitoring
        monitoring: true
    });
    // 自动解析ts的sourcemap
    require('source-map-support').install({
        handleUncaughtExceptions: false
    });
    // 捕获普通异常
    process.on('uncaughtException', function (err) {
        console.error(pinus_1.pinus.app.getServerId(), 'uncaughtException Caught exception: ', err);
    });
    // 捕获async异常
    process.on('unhandledRejection', (reason, p) => {
        console.error(pinus_1.pinus.app.getServerId(), 'Caught Unhandled Rejection at:', p, 'reason:', reason);
    });
}
exports.preload = preload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlbG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3ByZWxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBbUM7QUFDbkMsT0FBTztBQUNQLDRCQUEwQjtBQUMxQixpQ0FBOEI7QUFFOUI7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU87SUFDbkIsNEJBQTRCO0lBQzVCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsa0JBQU8sQ0FBQztJQUN6QixRQUFRO0lBQ1Isa0JBQU8sQ0FBQyxNQUFNLENBQUM7UUFDWCxrQkFBa0I7UUFDbEIsUUFBUSxFQUFFLElBQUk7UUFDZCwyQkFBMkI7UUFDM0IsZUFBZSxFQUFFLElBQUk7UUFDckIsc0JBQXNCO1FBQ3RCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLG9CQUFvQjtRQUNwQixVQUFVLEVBQUUsSUFBSTtLQUNuQixDQUFDLENBQUM7SUFFSCxtQkFBbUI7SUFDbkIsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xDLHdCQUF3QixFQUFFLEtBQUs7S0FDbEMsQ0FBQyxDQUFDO0lBRUgsU0FBUztJQUNULE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxHQUFHO1FBQ3pDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxzQ0FBc0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN4RixDQUFDLENBQUMsQ0FBQztJQUVILFlBQVk7SUFDWixPQUFPLENBQUMsRUFBRSxDQUFDLG9CQUFvQixFQUFFLENBQUMsTUFBVyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hELE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsRUFBRSxnQ0FBZ0MsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTdCRCwwQkE2QkMifQ==