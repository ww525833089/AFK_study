"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const constants = require("../../lib/util/constants");
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
const child_process_1 = require("child_process");
function default_1(program) {
    program.command('start')
        .description('start the application')
        .option('-e, --env <env>', 'the used environment', constants_1.DEFAULT_ENV)
        .option('-D, --daemon', 'enable the daemon start')
        .option('-d, --directory, <directory>', 'the code directory', constants_1.DEFAULT_GAME_SERVER_DIR)
        .option('-t, --type <server-type>,', 'start server type')
        .option('-i, --id <server-id>', 'start server id')
        .action(function (opts) {
        start(opts);
    });
}
exports.default = default_1;
/**
 * Start application.
 *
 * @param {Object} opts options for `start` operation
 */
function start(opts) {
    let absScript = path.resolve(opts.directory, 'app.js');
    if (!fs.existsSync(absScript)) {
        utils_1.abort(constants_1.SCRIPT_NOT_FOUND);
    }
    let logDir = path.resolve(opts.directory, 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
    let ls;
    let type = opts.type || constants.RESERVED.ALL;
    let params = [absScript, 'env=' + opts.env, 'type=' + type];
    if (!!opts.id) {
        params.push('startId=' + opts.id);
    }
    if (opts.daemon) {
        ls = child_process_1.spawn(process.execPath, params, { detached: true, stdio: 'ignore' });
        ls.unref();
        console.log(constants_1.DAEMON_INFO);
        process.exit(0);
    }
    else {
        ls = child_process_1.spawn(process.execPath, params);
        ls.stdout.on('data', function (data) {
            console.log(data.toString());
        });
        ls.stderr.on('data', function (data) {
            console.log(data.toString());
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9iaW4vY29tbWFuZHMvc3RhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSx5QkFBeUI7QUFFekIsNkJBQTZCO0FBRzdCLHNEQUFzRDtBQUN0RCwwQ0FBd0Q7QUFFeEQsa0RBQThPO0FBQzlPLGlEQUE0QztBQUk1QyxtQkFBeUIsT0FBZ0M7SUFDckQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7U0FDdkIsV0FBVyxDQUFDLHVCQUF1QixDQUFDO1NBQ3BDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxzQkFBc0IsRUFBRSx1QkFBVyxDQUFDO1NBQzlELE1BQU0sQ0FBQyxjQUFjLEVBQUUseUJBQXlCLENBQUM7U0FDakQsTUFBTSxDQUFDLDhCQUE4QixFQUFFLG9CQUFvQixFQUFFLG1DQUF1QixDQUFDO1NBQ3JGLE1BQU0sQ0FBQywyQkFBMkIsRUFBRSxtQkFBbUIsQ0FBQztTQUN4RCxNQUFNLENBQUMsc0JBQXNCLEVBQUUsaUJBQWlCLENBQUM7U0FDakQsTUFBTSxDQUFDLFVBQVUsSUFBSTtRQUNsQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBWEQsNEJBV0M7QUFDRDs7OztHQUlHO0FBQ0gsU0FBUyxLQUFLLENBQUMsSUFBUztJQUNwQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdkQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDM0IsYUFBSyxDQUFDLDRCQUFnQixDQUFDLENBQUM7S0FDM0I7SUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDeEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4QjtJQUVELElBQUksRUFBRSxDQUFDO0lBQ1AsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztJQUMvQyxJQUFJLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtRQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNyQztJQUNELElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNiLEVBQUUsR0FBRyxxQkFBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMxRSxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUFXLENBQUMsQ0FBQztRQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25CO1NBQU07UUFDSCxFQUFFLEdBQUcscUJBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUk7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUk7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDLENBQUMsQ0FBQztLQUNOO0FBQ0wsQ0FBQyJ9