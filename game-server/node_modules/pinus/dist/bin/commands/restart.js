"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const console_1 = require("../../lib/modules/console");
const constants_1 = require("../utils/constants");
function default_1(program) {
    program.command('restart')
        .description('restart the servers, for multiple servers, use `pinus restart server-id-1 server-id-2`')
        .option('-u, --username <username>', 'administration user name', constants_1.DEFAULT_USERNAME)
        .option('-p, --password <password>', 'administration password', constants_1.DEFAULT_PWD)
        .option('-h, --host <master-host>', 'master server host', constants_1.DEFAULT_MASTER_HOST)
        .option('-P, --port <master-port>', 'master server port', constants_1.DEFAULT_MASTER_PORT)
        .option('-t, --type <server-type>,', 'start server type')
        .option('-i, --id <server-id>', 'start server id')
        .action(function (opts) {
        restart(opts);
    });
}
exports.default = default_1;
function restart(opts) {
    let id = 'pinus_restart_' + Date.now();
    let serverIds = [];
    let type = null;
    if (!!opts.id) {
        serverIds.push(opts.id);
    }
    if (!!opts.type) {
        type = opts.type;
    }
    utils_1.connectToMaster(id, opts, function (client) {
        client.request(console_1.ConsoleModule.moduleId, { signal: 'restart', ids: serverIds, type: type }, function (err, fails) {
            if (!!err) {
                console.error(err);
            }
            else if (!!fails.length) {
                console.info('restart fails server ids: %j', fails);
            }
            else {
                console.info(constants_1.RESTART_SERVER_INFO);
            }
            process.exit(0);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdGFydC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jpbi9jb21tYW5kcy9yZXN0YXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsMENBQWlEO0FBQ2pELHVEQUFnRTtBQUNoRSxrREFBbUo7QUFFbkosbUJBQXlCLE9BQWdDO0lBQ3JELE9BQU8sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO1NBQ3pCLFdBQVcsQ0FBQyx3RkFBd0YsQ0FBQztTQUNyRyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsMEJBQTBCLEVBQUUsNEJBQWdCLENBQUM7U0FDakYsTUFBTSxDQUFDLDJCQUEyQixFQUFFLHlCQUF5QixFQUFFLHVCQUFXLENBQUM7U0FDM0UsTUFBTSxDQUFDLDBCQUEwQixFQUFFLG9CQUFvQixFQUFFLCtCQUFtQixDQUFDO1NBQzdFLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxvQkFBb0IsRUFBRSwrQkFBbUIsQ0FBQztTQUM3RSxNQUFNLENBQUMsMkJBQTJCLEVBQUUsbUJBQW1CLENBQUM7U0FDeEQsTUFBTSxDQUFDLHNCQUFzQixFQUFFLGlCQUFpQixDQUFDO1NBQ2pELE1BQU0sQ0FBQyxVQUFVLElBQUk7UUFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVpELDRCQVlDO0FBR0QsU0FBUyxPQUFPLENBQUMsSUFBUztJQUN0QixJQUFJLEVBQUUsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdkMsSUFBSSxTQUFTLEdBQWEsRUFBRSxDQUFDO0lBQzdCLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQztJQUN4QixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1FBQ1gsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDM0I7SUFDRCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBQ2IsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDcEI7SUFDRCx1QkFBZSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxNQUFNO1FBQ3RDLE1BQU0sQ0FBQyxPQUFPLENBQUMsdUJBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLFVBQVUsR0FBVSxFQUFFLEtBQWU7WUFDaEgsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7aUJBQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUN2RDtpQkFBTTtnQkFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUFtQixDQUFDLENBQUM7YUFDckM7WUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDIn0=