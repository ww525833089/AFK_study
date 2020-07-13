"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
function default_1(program) {
    program.command('stop')
        .description('stop the servers, for multiple servers, use `pinus stop server-id-1 server-id-2`')
        .option('-u, --username <username>', 'administration user name', constants_1.DEFAULT_USERNAME)
        .option('-p, --password <password>', 'administration password', constants_1.DEFAULT_PWD)
        .option('-h, --host <master-host>', 'master server host', constants_1.DEFAULT_MASTER_HOST)
        .option('-P, --port <master-port>', 'master server port', constants_1.DEFAULT_MASTER_PORT)
        .action(function () {
        let args = [].slice.call(arguments, 0);
        let opts = args[args.length - 1];
        opts.serverIds = args.slice(0, -1);
        utils_1.terminal('stop', opts);
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jpbi9jb21tYW5kcy9zdG9wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsMENBQTJEO0FBRTNELGtEQUF5SztBQUl6SyxtQkFBeUIsT0FBZ0M7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDdEIsV0FBVyxDQUFDLGtGQUFrRixDQUFDO1NBQy9GLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSwwQkFBMEIsRUFBRSw0QkFBZ0IsQ0FBQztTQUNqRixNQUFNLENBQUMsMkJBQTJCLEVBQUUseUJBQXlCLEVBQUUsdUJBQVcsQ0FBQztTQUMzRSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsK0JBQW1CLENBQUM7U0FDN0UsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixFQUFFLCtCQUFtQixDQUFDO1NBQzdFLE1BQU0sQ0FBQztRQUNKLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN2QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsZ0JBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBYkQsNEJBYUMifQ==