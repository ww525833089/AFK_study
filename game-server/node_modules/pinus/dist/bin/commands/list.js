"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const utils_1 = require("../utils/utils");
const cliff = require("cliff");
const console_1 = require("../../lib/modules/console");
function default_1(program) {
    program.command('list')
        .description('list the servers')
        .option('-u, --username <username>', 'administration user name', constants_1.DEFAULT_USERNAME)
        .option('-p, --password <password>', 'administration password', constants_1.DEFAULT_PWD)
        .option('-h, --host <master-host>', 'master server host', constants_1.DEFAULT_MASTER_HOST)
        .option('-P, --port <master-port>', 'master server port', constants_1.DEFAULT_MASTER_PORT)
        .action(function (opts) {
        list(opts);
    });
}
exports.default = default_1;
/**
 * List pinus processes.
 *
 * @param {Object} opts options for `list` operation
 */
function list(opts) {
    let id = 'pinus_list_' + Date.now();
    utils_1.connectToMaster(id, opts, function (client) {
        client.request(console_1.ConsoleModule.moduleId, { signal: 'list' }, function (err, data) {
            if (err) {
                console.error(err);
            }
            let servers = [];
            for (let key in data.msg) {
                servers.push(data.msg[key]);
            }
            let comparer = function (a, b) {
                if (a.serverType < b.serverType) {
                    return -1;
                }
                else if (a.serverType > b.serverType) {
                    return 1;
                }
                else if (a.serverId < b.serverId) {
                    return -1;
                }
                else if (a.serverId > b.serverId) {
                    return 1;
                }
                else {
                    return 0;
                }
            };
            servers.sort(comparer);
            let rows = [];
            rows.push(['serverId', 'serverType', 'pid', 'rss(M)', 'heapTotal(M)', 'heapUsed(M)', 'uptime(m)']);
            servers.forEach(function (server) {
                rows.push([server.serverId, server.serverType, server.pid, server.rss, server.heapTotal, server.heapUsed, server.uptime]);
            });
            console.log(cliff.stringifyRows(rows, ['red', 'blue', 'green', 'cyan', 'magenta', 'white', 'yellow']));
            process.exit(0);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2Jpbi9jb21tYW5kcy9saXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTZHO0FBQzdHLDBDQUFpRDtBQUVqRCwrQkFBK0I7QUFDL0IsdURBQWdFO0FBRWhFLG1CQUF5QixPQUFnQztJQUNyRCxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztTQUN0QixXQUFXLENBQUMsa0JBQWtCLENBQUM7U0FDL0IsTUFBTSxDQUFDLDJCQUEyQixFQUFFLDBCQUEwQixFQUFFLDRCQUFnQixDQUFDO1NBQ2pGLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSx5QkFBeUIsRUFBRSx1QkFBVyxDQUFDO1NBQzNFLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxvQkFBb0IsRUFBRSwrQkFBbUIsQ0FBQztTQUM3RSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsK0JBQW1CLENBQUM7U0FDN0UsTUFBTSxDQUFDLFVBQVUsSUFBSTtRQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUM7QUFWRCw0QkFVQztBQUNEOzs7O0dBSUc7QUFDSCxTQUFTLElBQUksQ0FBQyxJQUFTO0lBQ25CLElBQUksRUFBRSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDcEMsdUJBQWUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsTUFBbUI7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyx1QkFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxVQUFVLEdBQVUsRUFBRSxJQUFTO1lBQzNFLElBQUksR0FBRyxFQUFFO2dCQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDdEI7WUFDRCxJQUFJLE9BQU8sR0FBVSxFQUFFLENBQUM7WUFDeEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUMvQjtZQUNELElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBTSxFQUFFLENBQU07Z0JBQ25DLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFO29CQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNiO3FCQUFNLElBQUksQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxFQUFFO29CQUNwQyxPQUFPLENBQUMsQ0FBQztpQkFDWjtxQkFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDaEMsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDYjtxQkFBTSxJQUFJLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtvQkFDaEMsT0FBTyxDQUFDLENBQUM7aUJBQ1o7cUJBQU07b0JBQ0gsT0FBTyxDQUFDLENBQUM7aUJBQ1o7WUFDTCxDQUFDLENBQUM7WUFDRixPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFlLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNuRyxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsTUFBTTtnQkFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzlILENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDIn0=