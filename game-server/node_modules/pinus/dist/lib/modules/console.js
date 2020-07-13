"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Pinus -- consoleModule serverStop stop/kill
 * Copyright(c) 2012 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
const pinus_logger_1 = require("pinus-logger");
const countDownLatch = require("../util/countDownLatch");
const utils = require("../util/utils");
const Constants = require("../util/constants");
const starter = require("../master/starter");
const child_process_1 = require("child_process");
const path = require("path");
const os = require("os");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
class ConsoleModule {
    constructor(opts) {
        opts = opts || {};
        this.app = opts.app;
    }
    monitorHandler(agent, msg, cb) {
        let serverId = agent.id;
        switch (msg.signal) {
            case 'stop':
                if (agent.type === Constants.RESERVED.MASTER) {
                    return;
                }
                this.app.stop(true);
                break;
            case 'list':
                let serverType = agent.type;
                let pid = process.pid;
                let heapUsed = (process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2);
                let rss = (process.memoryUsage().rss / (1024 * 1024)).toFixed(2);
                let heapTotal = (process.memoryUsage().heapTotal / (1024 * 1024)).toFixed(2);
                let uptime = (process.uptime() / 60).toFixed(2);
                utils.invokeCallback(cb, {
                    serverId: serverId,
                    body: {
                        serverId: serverId,
                        serverType: serverType,
                        pid: pid,
                        rss: rss,
                        heapTotal: heapTotal,
                        heapUsed: heapUsed,
                        uptime: uptime
                    }
                });
                break;
            case 'kill':
                utils.invokeCallback(cb, serverId);
                if (agent.type !== 'master') {
                    setTimeout(function () {
                        process.exit(-1);
                    }, Constants.TIME.TIME_WAIT_MONITOR_KILL);
                }
                break;
            case 'addCron':
                this.app.addCrons([msg.cron]);
                break;
            case 'removeCron':
                this.app.removeCrons([msg.cron]);
                break;
            case 'blacklist':
                if (this.app.isFrontend()) {
                    let connector = this.app.components.__connector__;
                    connector.blacklist = connector.blacklist.concat(msg.blacklist);
                }
                break;
            case 'restart':
                if (agent.type === Constants.RESERVED.MASTER) {
                    return;
                }
                let self = this;
                let server = this.app.get(Constants.RESERVED.CURRENT_SERVER);
                utils.invokeCallback(cb, server);
                process.nextTick(function () {
                    self.app.stop(true);
                });
                break;
            default:
                logger.error('receive error signal: %j', msg);
                break;
        }
    }
    clientHandler(agent, msg, cb) {
        let app = this.app;
        switch (msg.signal) {
            case 'kill':
                kill(app, agent, msg, cb);
                break;
            case 'stop':
                stop(app, agent, msg, cb);
                break;
            case 'list':
                list(app, agent, msg, cb);
                break;
            case 'add':
                add(app, agent, msg, cb);
                break;
            case 'addCron':
                addCron(app, agent, msg, cb);
                break;
            case 'removeCron':
                removeCron(app, agent, msg, cb);
                break;
            case 'blacklist':
                blacklist(app, agent, msg, cb);
                break;
            case 'restart':
                restart(app, agent, msg, cb);
                break;
            default:
                utils.invokeCallback(cb, new Error('The command cannot be recognized, please check.'), null);
                break;
        }
    }
}
exports.ConsoleModule = ConsoleModule;
ConsoleModule.moduleId = '__console__';
let kill = function (app, agent, msg, cb) {
    let sid, record;
    let serverIds = [];
    let count = Object.keys(agent.idMap).length;
    let latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_MASTER_KILL }, function (isTimeout) {
        if (!isTimeout) {
            utils.invokeCallback(cb, null, { code: 'ok' });
        }
        else {
            utils.invokeCallback(cb, null, { code: 'remained', serverIds: serverIds });
        }
        setTimeout(function () {
            process.exit(-1);
        }, Constants.TIME.TIME_WAIT_MONITOR_KILL);
    });
    let agentRequestCallback = function (msg) {
        for (let i = 0; i < serverIds.length; ++i) {
            if (serverIds[i] === msg) {
                serverIds.splice(i, 1);
                latch.done();
                break;
            }
        }
    };
    for (sid in agent.idMap) {
        record = agent.idMap[sid];
        serverIds.push(record.id);
        agent.request(record.id, ConsoleModule.moduleId, { signal: msg.signal }, agentRequestCallback);
    }
};
let stop = function (app, agent, msg, cb) {
    let serverIds = msg.ids;
    if (!!serverIds.length) {
        let servers = app.getServers();
        app.set(Constants.RESERVED.STOP_SERVERS, serverIds);
        for (let i = 0; i < serverIds.length; i++) {
            let serverId = serverIds[i];
            if (!servers[serverId]) {
                utils.invokeCallback(cb, new Error('Cannot find the server to stop.'), null);
            }
            else {
                agent.notifyById(serverId, ConsoleModule.moduleId, { signal: msg.signal });
            }
        }
        utils.invokeCallback(cb, null, { status: 'part' });
    }
    else {
        let servers = app.getServers();
        let serverIds = [];
        for (let key in servers) {
            serverIds.push(key);
        }
        app.set(Constants.RESERVED.STOP_SERVERS, serverIds);
        agent.notifyAll(ConsoleModule.moduleId, { signal: msg.signal });
        setTimeout(function () {
            app.stop(true);
            utils.invokeCallback(cb, null, { status: 'all' });
        }, Constants.TIME.TIME_WAIT_STOP);
    }
};
let restart = function (app, agent, msg, cb) {
    let successFlag;
    let successIds = [];
    let serverIds = msg.ids;
    let type = msg.type;
    let servers;
    if (!serverIds.length && !!type) {
        servers = app.getServersByType(type);
        if (!servers) {
            utils.invokeCallback(cb, new Error('restart servers with unknown server type: ' + type));
            return;
        }
        for (let i = 0; i < servers.length; i++) {
            serverIds.push(servers[i].id);
        }
    }
    else if (!serverIds.length) {
        servers = app.getServers();
        for (let key in servers) {
            serverIds.push(key);
        }
    }
    let count = serverIds.length;
    let latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_COUNTDOWN }, function () {
        if (!successFlag) {
            utils.invokeCallback(cb, new Error('all servers start failed.'));
            return;
        }
        utils.invokeCallback(cb, null, utils.arrayDiff(serverIds, successIds));
    });
    let request = function (id) {
        return (function () {
            agent.request(id, ConsoleModule.moduleId, { signal: msg.signal }, function (msg) {
                if (msg && !Object.keys(msg).length) {
                    latch.done();
                    return;
                }
                setTimeout(function () {
                    runServer(app, msg, function (err, status) {
                        if (!!err) {
                            logger.error('restart ' + id + ' failed.', err.message, 'status:', status);
                        }
                        else {
                            successIds.push(id);
                            successFlag = true;
                        }
                        latch.done();
                    });
                }, Constants.TIME.TIME_WAIT_RESTART);
            });
        })();
    };
    for (let j = 0; j < serverIds.length; j++) {
        request(serverIds[j]);
    }
};
let list = function (app, agent, msg, cb) {
    let sid, record;
    let serverInfo = {};
    let count = Object.keys(agent.idMap).length;
    let latch = countDownLatch.createCountDownLatch(count, { timeout: Constants.TIME.TIME_WAIT_COUNTDOWN }, function () {
        utils.invokeCallback(cb, null, { msg: serverInfo });
    });
    let callback = function (msg) {
        serverInfo[msg.serverId] = msg.body;
        latch.done();
    };
    for (sid in agent.idMap) {
        record = agent.idMap[sid];
        agent.request(record.id, ConsoleModule.moduleId, { signal: msg.signal }, callback);
    }
};
let add = function (app, agent, msg, cb) {
    if (checkCluster(msg)) {
        startCluster(app, msg, cb);
    }
    else {
        startServer(app, msg, cb);
    }
    reset(ServerInfo);
};
let addCron = function (app, agent, msg, cb) {
    let cron = parseArgs(msg, CronInfo, cb);
    sendCronInfo(cron, agent, msg, CronInfo, cb);
};
let removeCron = function (app, agent, msg, cb) {
    let cron = parseArgs(msg, RemoveCron, cb);
    sendCronInfo(cron, agent, msg, RemoveCron, cb);
};
let blacklist = function (app, agent, msg, cb) {
    let ips = msg.args;
    for (let i = 0; i < ips.length; i++) {
        if (!(new RegExp(/(\d+)\.(\d+)\.(\d+)\.(\d+)/g).test(ips[i]))) {
            utils.invokeCallback(cb, new Error('blacklist ip: ' + ips[i] + ' is error format.'), null);
            return;
        }
    }
    agent.notifyAll(ConsoleModule.moduleId, { signal: msg.signal, blacklist: msg.args });
    process.nextTick(function () {
        cb(null, { status: 'ok' });
    });
};
let checkPort = function (server, cb) {
    if (!server.port && !server.clientPort) {
        utils.invokeCallback(cb, 'leisure');
        return;
    }
    let p = server.port || server.clientPort;
    let host = server.host;
    //   let cmd = 'netstat -tln | grep ';
    let cmd = os.type() === 'Windows_NT' ?
        `netstat -ano | %windir%\\system32\\find.exe ` : `netstat -tln | grep `;
    if (!utils.isLocal(host)) {
        cmd = 'ssh ' + host + ' ' + cmd;
    }
    p = os.type() === 'Windows_NT' ? `"${p}"` : p;
    child_process_1.exec(cmd + p, function (err, stdout, stderr) {
        if (stdout || stderr) {
            logger.debug('checkport has error?', cmd + p, 'stdout:', stdout, 'stderr', stderr);
            utils.invokeCallback(cb, 'busy');
        }
        else {
            p = server.clientPort;
            p = os.type() === 'Windows_NT' ? `"${p}"` : p;
            child_process_1.exec(cmd + p, function (err, stdout, stderr) {
                if (stdout || stderr) {
                    utils.invokeCallback(cb, 'busy');
                }
                else {
                    utils.invokeCallback(cb, 'leisure');
                }
            });
        }
    });
};
let parseArgs = function (msg, info, cb) {
    let rs = {};
    let args = msg.args;
    for (let i = 0; i < args.length; i++) {
        if (args[i].indexOf('=') < 0) {
            cb(new Error('Error server parameters format.'), null);
            return;
        }
        let pairs = args[i].split('=');
        let key = pairs[0];
        if (!!info[key]) {
            info[key] = 1;
        }
        rs[pairs[0]] = pairs[1];
    }
    return rs;
};
let sendCronInfo = function (cron, agent, msg, info, cb) {
    if (isReady(info) && (cron.serverId || cron.serverType)) {
        if (!!cron.serverId) {
            agent.notifyById(cron.serverId, ConsoleModule.moduleId, { signal: msg.signal, cron: cron });
        }
        else {
            agent.notifyByType(cron.serverType, ConsoleModule.moduleId, { signal: msg.signal, cron: cron });
        }
        process.nextTick(function () {
            cb(null, { status: 'ok' });
        });
    }
    else {
        cb(new Error('Miss necessary server parameters.'), null);
    }
    reset(info);
};
let startServer = function (app, msg, cb) {
    let server = parseArgs(msg, ServerInfo, cb);
    if (isReady(ServerInfo)) {
        runServer(app, server, cb);
    }
    else {
        cb(new Error('Miss necessary server parameters.'), null);
    }
};
let runServer = function (app, server, cb) {
    checkPort(server, function (status) {
        if (status === 'busy') {
            utils.invokeCallback(cb, new Error('Port occupied already, check your server to add.'));
        }
        else {
            starter.run(app, server, function (err) {
                if (err) {
                    err = String(err);
                    const checkErrCorrect = 'https://nodejs.org/en/docs/inspector';
                    const idx = err.indexOf(checkErrCorrect);
                    if (idx === -1 || idx + checkErrCorrect.length + 10 < err.length) {
                        utils.invokeCallback(cb, new Error(err), null);
                        return;
                    }
                }
            });
            process.nextTick(function () {
                utils.invokeCallback(cb, null, { status: 'ok' });
            });
        }
    });
};
let startCluster = function (app, msg, cb) {
    let serverMap = {};
    let fails = [];
    let successFlag;
    let serverInfo = parseArgs(msg, ClusterInfo, cb);
    utils.loadCluster(app, serverInfo, serverMap);
    let count = Object.keys(serverMap).length;
    let latch = countDownLatch.createCountDownLatch(count, () => {
        if (!successFlag) {
            utils.invokeCallback(cb, new Error('all servers start failed.'));
            return;
        }
        utils.invokeCallback(cb, null, fails);
    });
    let start = function (server) {
        return (function () {
            checkPort(server, function (status) {
                if (status === 'busy') {
                    fails.push(server);
                    latch.done();
                }
                else {
                    starter.run(app, server, function (err) {
                        if (err) {
                            fails.push(server);
                            latch.done();
                        }
                    });
                    process.nextTick(function () {
                        successFlag = true;
                        latch.done();
                    });
                }
            });
        })();
    };
    for (let key in serverMap) {
        let server = serverMap[key];
        start(server);
    }
};
let checkCluster = function (msg) {
    let flag = false;
    let args = msg.args;
    for (let i = 0; i < args.length; i++) {
        if (utils.startsWith(args[i], Constants.RESERVED.CLUSTER_COUNT)) {
            flag = true;
        }
    }
    return flag;
};
let isReady = function (info) {
    for (let key in info) {
        if (info[key]) {
            return false;
        }
    }
    return true;
};
let reset = function (info) {
    for (let key in info) {
        info[key] = 0;
    }
};
let ServerInfo = {
    host: 0,
    port: 0,
    id: 0,
    serverType: 0
};
let CronInfo = {
    id: 0,
    action: 0,
    time: 0
};
let RemoveCron = {
    id: 0
};
let ClusterInfo = {
    host: 0,
    port: 0,
    clusterCount: 0
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tb2R1bGVzL2NvbnNvbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7OztHQUlHO0FBQ0gsK0NBQXlDO0FBQ3pDLHlEQUF5RDtBQUN6RCx1Q0FBdUM7QUFDdkMsK0NBQStDO0FBQy9DLDZDQUE2QztBQUM3QyxpREFBcUM7QUFLckMsNkJBQTZCO0FBQzdCLHlCQUF5QjtBQUV6QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFRM0QsTUFBYSxhQUFhO0lBS3RCLFlBQVksSUFBMEI7UUFDbEMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBbUIsRUFBRSxHQUFRLEVBQUUsRUFBbUI7UUFDN0QsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUN4QixRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUU7WUFDaEIsS0FBSyxNQUFNO2dCQUNQLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsT0FBTztpQkFDVjtnQkFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEIsTUFBTTtZQUNWLEtBQUssTUFBTTtnQkFDUCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUM1QixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO2dCQUN0QixJQUFJLFFBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFD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