"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const constants = require("../../lib/util/constants");
const utils_1 = require("../utils/utils");
const constants_1 = require("../utils/constants");
function default_1(program) {
    program.command('masterha')
        .description('start all the slaves of the master')
        .option('-d, --directory <directory>', 'the code directory', constants_1.DEFAULT_GAME_SERVER_DIR)
        .action(function (opts) {
        startMasterha(opts);
    });
}
exports.default = default_1;
/**
 * Start master slaves.
 *
 * @param {String} option for `startMasterha` operation
 */
function startMasterha(opts) {
    let configFile = path.join(opts.directory, constants.FILEPATH.MASTER_HA);
    if (!fs.existsSync(configFile)) {
        utils_1.abort(constants_1.MASTER_HA_NOT_FOUND);
    }
    let masterha = require(configFile).masterha;
    for (let i = 0; i < masterha.length; i++) {
        let server = masterha[i];
        server.mode = constants.RESERVED.STAND_ALONE;
        server.masterha = 'true';
        server.home = opts.directory;
        utils_1.runServer(server);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyaGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9iaW4vY29tbWFuZHMvbWFzdGVyaGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSx5QkFBeUI7QUFFekIsNkJBQTZCO0FBRTdCLHNEQUFzRDtBQUN0RCwwQ0FBbUU7QUFFbkUsa0RBQTRLO0FBRTVLLG1CQUF5QixPQUFnQztJQUNyRCxPQUFPLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztTQUMxQixXQUFXLENBQUMsb0NBQW9DLENBQUM7U0FDakQsTUFBTSxDQUFDLDZCQUE2QixFQUFFLG9CQUFvQixFQUFFLG1DQUF1QixDQUFDO1NBQ3BGLE1BQU0sQ0FBQyxVQUFVLElBQUk7UUFDbEIsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVBELDRCQU9DO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsYUFBYSxDQUFDLElBQVM7SUFDNUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDNUIsYUFBSyxDQUFDLCtCQUFtQixDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDO0lBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3RDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixpQkFBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCO0FBQ0wsQ0FBQyJ9