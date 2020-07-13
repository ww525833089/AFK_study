"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('cliff');
/**
 *  Constant Variables
 */
exports.TIME_INIT = 5 * 1000;
exports.TIME_KILL_WAIT = 5 * 1000;
exports.KILL_CMD_LUX = 'kill -9 `ps -ef|grep node|awk \'{print $2}\'`';
exports.KILL_CMD_WIN = 'taskkill /im node.exe /f';
exports.CUR_DIR = process.cwd();
exports.DEFAULT_GAME_SERVER_DIR = exports.CUR_DIR;
exports.DEFAULT_USERNAME = 'admin';
exports.DEFAULT_PWD = 'admin';
exports.DEFAULT_ENV = 'development';
exports.DEFAULT_MASTER_HOST = '127.0.0.1';
exports.DEFAULT_MASTER_PORT = 3005;
exports.CONNECT_ERROR = 'Fail to connect to admin console server.';
exports.FILEREAD_ERROR = 'Fail to read the file, please check if the application is started legally.';
exports.CLOSEAPP_INFO = 'Closing the application......\nPlease wait......';
exports.ADD_SERVER_INFO = 'Successfully add server.';
exports.RESTART_SERVER_INFO = 'Successfully restart server.';
exports.INIT_PROJ_NOTICE = ('\nThe default admin user is: \n\n' + '  username').green + ': admin\n  ' + 'password'.green + ': admin\n\nYou can configure admin users by editing adminUser.json later.\n ';
exports.SCRIPT_NOT_FOUND = 'Fail to find an appropriate script to run,\nplease check the current work directory or the directory specified by option `--directory`.\n'.red;
exports.MASTER_HA_NOT_FOUND = 'Fail to find an appropriate masterha config file, \nplease check the current work directory or the arguments passed to.\n'.red;
exports.COMMAND_ERROR = 'Illegal command format. Use `pinus --help` to get more info.\n'.red;
exports.DAEMON_INFO = 'The application is running in the background now.\n';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYmluL3V0aWxzL2NvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNqQjs7R0FFRztBQUNRLFFBQUEsU0FBUyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDckIsUUFBQSxjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFBLFlBQVksR0FBRywrQ0FBK0MsQ0FBQztBQUMvRCxRQUFBLFlBQVksR0FBRywwQkFBMEIsQ0FBQztBQUUxQyxRQUFBLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDeEIsUUFBQSx1QkFBdUIsR0FBRyxlQUFPLENBQUM7QUFDbEMsUUFBQSxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7QUFDM0IsUUFBQSxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQ3RCLFFBQUEsV0FBVyxHQUFHLGFBQWEsQ0FBQztBQUM1QixRQUFBLG1CQUFtQixHQUFHLFdBQVcsQ0FBQztBQUNsQyxRQUFBLG1CQUFtQixHQUFHLElBQUksQ0FBQztBQUUzQixRQUFBLGFBQWEsR0FBRywwQ0FBMEMsQ0FBQztBQUMzRCxRQUFBLGNBQWMsR0FBRyw0RUFBNEUsQ0FBQztBQUM5RixRQUFBLGFBQWEsR0FBRyxrREFBa0QsQ0FBQztBQUNuRSxRQUFBLGVBQWUsR0FBRywwQkFBMEIsQ0FBQztBQUM3QyxRQUFBLG1CQUFtQixHQUFHLDhCQUE4QixDQUFDO0FBQ3JELFFBQUEsZ0JBQWdCLEdBQUcsQ0FBQyxtQ0FBbUMsR0FBRyxZQUFvQixDQUFBLENBQUMsS0FBSyxHQUFHLGFBQWEsR0FBSSxVQUFrQixDQUFDLEtBQUssR0FBRyw4RUFBOEUsQ0FBQztBQUNsTixRQUFBLGdCQUFnQixHQUFJLDJJQUFtSixDQUFDLEdBQUcsQ0FBQztBQUM1SyxRQUFBLG1CQUFtQixHQUFJLDJIQUFtSSxDQUFDLEdBQUcsQ0FBQztBQUMvSixRQUFBLGFBQWEsR0FBSSxnRUFBd0UsQ0FBQyxHQUFHLENBQUM7QUFDOUYsUUFBQSxXQUFXLEdBQUcscURBQXFELENBQUMifQ==