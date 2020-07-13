"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const path = require("path");
const util = require("util");
const constants_1 = require("./constants");
const utils = require("../../lib/util/utils");
const starter = require("../../lib/master/starter");
const constants = require("../../lib/util/constants");
const pinus_admin_1 = require("pinus-admin");
const child_process_1 = require("child_process");
const console_1 = require("../../lib/modules/console");
exports.version = require('../../../package.json').version;
function connectToMaster(id, opts, cb) {
    let client = new pinus_admin_1.AdminClient({ username: opts.username, password: opts.password, md5: true });
    client.connect(id, opts.host, opts.port, function (err) {
        if (err) {
            abort(constants_1.CONNECT_ERROR + err.red);
        }
        if (typeof cb === 'function') {
            cb(client);
        }
    });
}
exports.connectToMaster = connectToMaster;
/**
 * Prompt confirmation with the given `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */
function confirm(msg, fn) {
    prompt(msg, function (val) {
        fn(/^ *y(es)?/i.test(val));
    });
}
exports.confirm = confirm;
/**
 * Prompt input with the given `msg` and callback `fn`.
 *
 * @param {String} msg
 * @param {Function} fn
 */
function prompt(msg, fn) {
    if (' ' === msg[msg.length - 1]) {
        process.stdout.write(msg);
    }
    else {
        console.log(msg);
    }
    process.stdin.setEncoding('ascii');
    process.stdin.once('data', function (data) {
        fn(data);
    }).resume();
}
exports.prompt = prompt;
/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */
function abort(str) {
    console.error(str);
    process.exit(1);
}
exports.abort = abort;
/**
 * Run server.
 *
 * @param {Object} server server information
 */
function runServer(server) {
    let cmd, key;
    let main = path.resolve(server.home, 'app.js');
    if (utils.isLocal(server.host)) {
        let options = [];
        options.push(main);
        for (key in server) {
            options.push(util.format('%s=%s', key, server[key]));
        }
        starter.localrun(process.execPath, null, options);
    }
    else {
        cmd = util.format('cd "%s" && "%s"', server.home, process.execPath);
        cmd += util.format(' "%s" ', main);
        for (key in server) {
            cmd += util.format(' %s=%s ', key, server[key]);
        }
        starter.sshrun(cmd, server.host);
    }
}
exports.runServer = runServer;
/**
 * Terminal application.
 *
 * @param {String} signal stop/kill
 * @param {Object} opts options for `stop/kill` operation
 */
function terminal(signal, opts) {
    console.info(constants_1.CLOSEAPP_INFO);
    // option force just for `kill`
    if (opts.force) {
        if (os.platform() === constants.PLATFORM.WIN) {
            child_process_1.exec(constants_1.KILL_CMD_WIN);
        }
        else {
            child_process_1.exec(constants_1.KILL_CMD_LUX);
        }
        process.exit(1);
        return;
    }
    let id = 'pinus_terminal_' + Date.now();
    connectToMaster(id, opts, function (client) {
        client.request(console_1.ConsoleModule.moduleId, {
            signal: signal, ids: opts.serverIds
        }, function (err, msg) {
            if (err) {
                console.error(err);
            }
            if (signal === 'kill') {
                if (msg.code === 'ok') {
                    console.log('All the servers have been terminated!');
                }
                else {
                    console.log('There may be some servers remained:', msg.serverIds);
                }
            }
            process.exit(0);
        });
    });
}
exports.terminal = terminal;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9iaW4vdXRpbHMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUc3QiwyQ0FBNEg7QUFDNUgsOENBQThDO0FBQzlDLG9EQUFvRDtBQUNwRCxzREFBc0Q7QUFDdEQsNkNBQTBDO0FBQzFDLGlEQUFxQztBQUNyQyx1REFBZ0U7QUFFckQsUUFBQSxPQUFPLEdBQUcsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsT0FBTyxDQUFDO0FBRTlELFNBQWdCLGVBQWUsQ0FBQyxFQUFVLEVBQUUsSUFBUyxFQUFFLEVBQWlDO0lBQ3BGLElBQUksTUFBTSxHQUFHLElBQUkseUJBQVcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQzlGLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUc7UUFDbEQsSUFBSSxHQUFHLEVBQUU7WUFDTCxLQUFLLENBQUMseUJBQWEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEM7UUFDRCxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRTtZQUMxQixFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDZDtJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQVZELDBDQVVDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixPQUFPLENBQUMsR0FBVyxFQUFFLEVBQVk7SUFDN0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLEdBQVc7UUFDN0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJ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