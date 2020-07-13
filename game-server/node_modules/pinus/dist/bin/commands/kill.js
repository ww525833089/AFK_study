"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
function default_1(program) {
    program.command('kill')
        .description('kill the application')
        .option('-u, --username <username>', 'administration user name', constants_1.DEFAULT_USERNAME)
        .option('-p, --password <password>', 'administration password', constants_1.DEFAULT_PWD)
        .option('-h, --host <master-host>', 'master server host', constants_1.DEFAULT_MASTER_HOST)
        .option('-P, --port <master-port>', 'master server port', constants_1.DEFAULT_MASTER_PORT)
        .option('-f, --force', 'using this option would kill all the node processes')
        .action(function () {
        let args = [].slice.call(arguments, 0);
        let opts = args[args.length - 1];
        opts.serverIds = args.slice(0, -1);
        utils_1.terminal('kill', opts);
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2lsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jpbi9jb21tYW5kcy9raWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsMENBQTJEO0FBRTNELGtEQUE4SDtBQUU5SCxtQkFBeUIsT0FBZ0M7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7U0FDdEIsV0FBVyxDQUFDLHNCQUFzQixDQUFDO1NBQ25DLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSwwQkFBMEIsRUFBRSw0QkFBZ0IsQ0FBQztTQUNqRixNQUFNLENBQUMsMkJBQTJCLEVBQUUseUJBQXlCLEVBQUUsdUJBQVcsQ0FBQztTQUMzRSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsK0JBQW1CLENBQUM7U0FDN0UsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixFQUFFLCtCQUFtQixDQUFDO1NBQzdFLE1BQU0sQ0FBQyxhQUFhLEVBQUUscURBQXFELENBQUM7U0FDNUUsTUFBTSxDQUFDO1FBQ0osSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxnQkFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFkRCw0QkFjQyJ9