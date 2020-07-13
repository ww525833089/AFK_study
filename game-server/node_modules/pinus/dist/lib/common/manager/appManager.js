"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require("async");
const utils = require("../../util/utils");
const pinus_logger_1 = require("pinus-logger");
let logger = pinus_logger_1.getLogger('pinus', __filename);
let transactionLogger = pinus_logger_1.getLogger('transaction-log', __filename);
let transactionErrorLogger = pinus_logger_1.getLogger('transaction-error-log', __filename);
function transaction(name, conditions, handlers, retry) {
    if (!retry) {
        retry = 1;
    }
    if (typeof name !== 'string') {
        logger.error('transaction name is error format, name: %s.', name);
        return;
    }
    if (typeof conditions !== 'object' || typeof handlers !== 'object') {
        logger.error('transaction conditions parameter is error format, conditions: %j, handlers: %j.', conditions, handlers);
        return;
    }
    let cmethods = [];
    let dmethods = [];
    let cnames = [];
    let dnames = [];
    for (let key in conditions) {
        if (typeof key !== 'string' || typeof conditions[key] !== 'function') {
            logger.error('transaction conditions parameter is error format, condition name: %s, condition function: %j.', key, conditions[key]);
            return;
        }
        cnames.push(key);
        cmethods.push(conditions[key]);
    }
    let i = 0;
    // execute conditions
    async.forEachSeries(cmethods, function (method, cb) {
        method(cb);
        transactionLogger.info('[%s]:[%s] condition is executed.', name, cnames[i]);
        i++;
    }, function (err) {
        if (err) {
            process.nextTick(function () {
                transactionLogger.error('[%s]:[%s] condition is executed with err: %j.', name, cnames[--i], err.stack);
                let log = {
                    name: name,
                    method: cnames[i],
                    time: Date.now(),
                    type: 'condition',
                    description: err.stack
                };
                transactionErrorLogger.error(JSON.stringify(log));
            });
            return;
        }
        else {
            // execute handlers
            process.nextTick(function () {
                for (let key in handlers) {
                    if (typeof key !== 'string' || typeof handlers[key] !== 'function') {
                        logger.error('transcation handlers parameter is error format, handler name: %s, handler function: %j.', key, handlers[key]);
                        return;
                    }
                    dnames.push(key);
                    dmethods.push(handlers[key]);
                }
                let flag = true;
                let times = retry;
                // do retry if failed util retry times
                async.whilst(function () {
                    return retry > 0 && flag;
                }, function (callback) {
                    let j = 0;
                    retry--;
                    async.forEachSeries(dmethods, function (method, cb) {
                        method(cb);
                        transactionLogger.info('[%s]:[%s] handler is executed.', name, dnames[j]);
                        j++;
                    }, function (err) {
                        if (err) {
                            process.nextTick(function () {
                                transactionLogger.error('[%s]:[%s]:[%s] handler is executed with err: %j.', name, dnames[--j], times - retry, err.stack);
                                let log = {
                                    name: name,
                                    method: dnames[j],
                                    retry: times - retry,
                                    time: Date.now(),
                                    type: 'handler',
                                    description: err.stack
                                };
                                transactionErrorLogger.error(JSON.stringify(log));
                                utils.invokeCallback(callback);
                            });
                            return;
                        }
                        flag = false;
                        utils.invokeCallback(callback);
                        process.nextTick(function () {
                            transactionLogger.info('[%s] all conditions and handlers are executed successfully.', name);
                        });
                    });
                }, function (err) {
                    if (err) {
                        logger.error('transaction process is executed with error: %j', err);
                    }
                    // callback will not pass error
                });
            });
        }
    });
}
exports.transaction = transaction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb21tb24vbWFuYWdlci9hcHBNYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQStCO0FBQy9CLDBDQUEwQztBQUMxQywrQ0FBeUM7QUFDekMsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUMsSUFBSSxpQkFBaUIsR0FBRyx3QkFBUyxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2pFLElBQUksc0JBQXNCLEdBQUcsd0JBQVMsQ0FBQyx1QkFBdUIsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUs1RSxTQUFnQixXQUFXLENBQUMsSUFBWSxFQUFFLFVBQTRELEVBQUUsUUFBdUQsRUFBRSxLQUFjO0lBQzNLLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDUixLQUFLLEdBQUcsQ0FBQyxDQUFDO0tBQ2I7SUFDRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLDZDQUE2QyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2xFLE9BQU87S0FDVjtJQUNELElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUNoRSxNQUFNLENBQUMsS0FBSyxDQUFDLGlGQUFpRixFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN0SCxPQUFPO0tBQ1Y7SUFFRCxJQUFJLFFBQVEsR0FBb0MsRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFpQyxFQUFFLENBQUM7SUFDaEQsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzFCLElBQUksTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUMxQixLQUFLLElBQUksR0FBRyxJQUFJLFVBQVUsRUFBRTtRQUN4QixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsSUFBSSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFDbEUsTUFBTSxDQUFDLEtBQUssQ0FBQywrRkFBK0YsRUFBRSxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDcEksT0FBTztTQUNWO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2xDO0lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ1YscUJBQXFCO0lBQ3JCLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFVBQVUsTUFBTSxFQUFFLEVBQUU7UUFDOUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLEVBQUUsQ0FBQztJQUNSLENBQUMsRUFBRSxVQUFVLEdBQVU7UUFDbkIsSUFBSSxHQUFHLEVBQUU7WUFDTCxPQUFPLENBQUMsUUFBUSxDQUFDO2dCQUNiLGlCQUFpQixDQUFDLEtBQUssQ0FBQywrQ0FBK0MsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2RyxJQUFJLEdBQUcsR0FBRztvQkFDTixJQUFJLEVBQUUsSUFBSTtvQkFDVixNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxXQUFXO29CQUNqQixXQUFXLEVBQUUsR0FBRyxDQUFDLEtBQUs7aUJBQ3pCLENBQUM7Z0JBQ0Ysc0JBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDLENBQUMsQ0FBQztZQUNILE9BQU87U0FDVjthQUFNO1lBQ0gsbUJBQW1CO1lBQ25CLE9BQU8sQ0FBQyxRQUFRLENBQUM7Z0JBQ2IsS0FBSyxJQUFJLEdBQUcsSUFBSSxRQUFRLEVBQUU7b0JBQ3RCLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFVBQVUsRUFBRTt3QkFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQyx5RkFBeUYsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQzVILE9BQU87cUJBQ1Y7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDaEM7Z0JBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNoQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBRWxCLHNDQUFzQztnQkFDdEMsS0FBSyxDQUFDLE1BQU0sQ0FDUjtvQkFDSSxPQUFPLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO2dCQUM3QixDQUFDLEVBQ0QsVUFBVSxRQUFRO29CQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDVixLQUFLLEVBQUUsQ0FBQztvQkFDUixLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxVQUFVLE1BQU0sRUFBRSxFQUFFO3dCQUM5QyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQ1gsaUJBQWlCLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUUsQ0FBQyxFQUFFLENBQUM7b0JBQ1IsQ0FBQyxFQUFFLFVBQVUsR0FBVTt3QkFDbkIsSUFBSSxHQUFHLEVBQUU7NEJBQ0wsT0FBTyxDQUFDLFFBQVEsQ0FBQztnQ0FDYixpQkFBaUIsQ0FBQyxLQUFLLENBQUMsa0RBQWtELEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUN6SCxJQUFJLEdBQUcsR0FBRztvQ0FDTixJQUFJLEVBQUUsSUFBSTtvQ0FDVixNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztvQ0FDakIsS0FBSyxFQUFFLEtBQUssR0FBRyxLQUFLO29DQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQ0FDaEIsSUFBSSxFQUFFLFNBQVM7b0NBQ2YsV0FBVyxFQUFFLEdBQUcsQ0FBQyxLQUFLO2lDQUN6QixDQUFDO2dDQUNGLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0NBQ2xELEtBQUssQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ25DLENBQUMsQ0FBQyxDQUFDOzRCQUNILE9BQU87eUJBQ1Y7d0JBQ0QsSUFBSSxHQUFHLEtBQUssQ0FBQzt3QkFDYixLQUFLLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvQixPQUFPLENBQUMsUUFBUSxDQUFDOzRCQUNiLGlCQUFpQixDQUFDLElBQUksQ0FBQyw2REFBNkQsRUFBRSxJQUFJLENBQUMsQ0FBQzt3QkFDaEcsQ0FBQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxFQUNELFVBQVUsR0FBRztvQkFDVCxJQUFJLEdBQUcsRUFBRTt3QkFDTCxNQUFNLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsQ0FBQyxDQUFDO3FCQUN2RTtvQkFDRCwrQkFBK0I7Z0JBQ25DLENBQUMsQ0FDSixDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQTNHRCxrQ0EyR0MifQ==