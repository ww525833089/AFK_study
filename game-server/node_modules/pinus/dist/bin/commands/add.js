"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const console_1 = require("../../lib/modules/console");
const constants_1 = require("../utils/constants");
function default_1(program) {
    program.command('add')
        .description('add a new server')
        .option('-u, --username <username>', 'administration user name', constants_1.DEFAULT_USERNAME)
        .option('-p, --password <password>', 'administration password', constants_1.DEFAULT_PWD)
        .option('-h, --host <master-host>', 'master server host', constants_1.DEFAULT_MASTER_HOST)
        .option('-P, --port <master-port>', 'master server port', constants_1.DEFAULT_MASTER_PORT)
        .action(function () {
        let args = [].slice.call(arguments, 0);
        let opts = args[args.length - 1];
        opts.args = args.slice(0, -1);
        add(opts);
    });
}
exports.default = default_1;
/**
 * Add server to application.
 *
 * @param {Object} opts options for `add` operation
 */
function add(opts) {
    let id = 'pinus_add_' + Date.now();
    utils_1.connectToMaster(id, opts, function (client) {
        client.request(console_1.ConsoleModule.moduleId, { signal: 'add', args: opts.args }, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.info(constants_1.ADD_SERVER_INFO);
            }
            process.exit(0);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYmluL2NvbW1hbmRzL2FkZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDBDQUFpRDtBQUNqRCx1REFBZ0U7QUFDaEUsa0RBQThIO0FBRTlILG1CQUF5QixPQUFnQztJQUNyRCxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztTQUNqQixXQUFXLENBQUMsa0JBQWtCLENBQUM7U0FDL0IsTUFBTSxDQUFDLDJCQUEyQixFQUFFLDBCQUEwQixFQUFFLDRCQUFnQixDQUFDO1NBQ2pGLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSx5QkFBeUIsRUFBRSx1QkFBVyxDQUFDO1NBQzNFLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxvQkFBb0IsRUFBRSwrQkFBbUIsQ0FBQztTQUM3RSxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLEVBQUUsK0JBQW1CLENBQUM7U0FDN0UsTUFBTSxDQUFDO1FBQ0osSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDLENBQUMsQ0FBQztBQUNYLENBQUM7QUFiRCw0QkFhQztBQUdEOzs7O0dBSUc7QUFDSCxTQUFTLEdBQUcsQ0FBQyxJQUFTO0lBQ2xCLElBQUksRUFBRSxHQUFHLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDbkMsdUJBQWUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsTUFBTTtRQUN0QyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUFFLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLFVBQVUsR0FBVTtZQUNoRixJQUFJLEdBQUcsRUFBRTtnQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RCO2lCQUNJO2dCQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsMkJBQWUsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyJ9