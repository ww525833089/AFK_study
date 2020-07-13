"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Pinus -- consoleModule watchServer
 * Copyright(c) 2013 fantasyni <fantasyni@163.com>
 * MIT Licensed
 */
const pinus_logger_1 = require("pinus-logger");
const countDownLatch = require("../util/countDownLatch");
const monitor = require("pinus-monitor");
const util = require("util");
const fs = require("fs");
const vm = require("vm");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
var HandleType;
(function (HandleType) {
    HandleType["client"] = "client";
    HandleType["monitor"] = "monitor";
})(HandleType || (HandleType = {}));
class WatchServerModule {
    constructor(opts) {
        opts = opts || {};
        this.app = opts.app;
    }
    monitorHandler(agent, msg, cb) {
        let comd = msg['comd'];
        let context = msg['context'];
        let param = msg['param'];
        let app = this.app;
        let handle = HandleType.monitor;
        switch (comd) {
            case 'servers':
                showServers(handle, agent, comd, context, cb);
                break;
            case 'connections':
                showConnections(handle, agent, app, comd, context, cb);
                break;
            case 'logins':
                showLogins(handle, agent, app, comd, context, cb);
                break;
            case 'modules':
                showModules(handle, agent, comd, context, cb);
                break;
            case 'status':
                showStatus(handle, agent, comd, context, cb);
                break;
            case 'config':
                showConfig(handle, agent, app, comd, context, param, cb);
                break;
            case 'proxy':
                showProxy(handle, agent, app, comd, context, param, cb);
                break;
            case 'handler':
                showHandler(handle, agent, app, comd, context, param, cb);
                break;
            case 'components':
                showComponents(handle, agent, app, comd, context, param, cb);
                break;
            case 'settings':
                showSettings(handle, agent, app, comd, context, param, cb);
                break;
            case 'cpu':
                dumpCPU(handle, agent, comd, context, param, cb);
                break;
            case 'memory':
                dumpMemory(handle, agent, comd, context, param, cb);
                break;
            case 'get':
                getApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'set':
                setApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'enable':
                enableApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'disable':
                disableApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'run':
                runScript(handle, agent, app, comd, context, param, cb);
                break;
            default:
                showError(handle, agent, comd, context, cb);
        }
    }
    clientHandler(agent, msg, cb) {
        let comd = msg['comd'];
        let context = msg['context'];
        let param = msg['param'];
        let app = this.app; // master app
        if (!comd || !context) {
            cb('lack of comd or context param');
            return;
        }
        let handle = HandleType.client;
        switch (comd) {
            case 'servers':
                showServers(handle, agent, comd, context, cb);
                break;
            case 'connections':
                showConnections(handle, agent, app, comd, context, cb);
                break;
            case 'logins':
                showLogins(handle, agent, app, comd, context, cb);
                break;
            case 'modules':
                showModules(handle, agent, comd, context, cb);
                break;
            case 'status':
                showStatus(handle, agent, comd, context, cb);
                break;
            case 'config':
                showConfig(handle, agent, app, comd, context, param, cb);
                break;
            case 'proxy':
                showProxy(handle, agent, app, comd, context, param, cb);
                break;
            case 'handler':
                showHandler(handle, agent, app, comd, context, param, cb);
                break;
            case 'components':
                showComponents(handle, agent, app, comd, context, param, cb);
                break;
            case 'settings':
                showSettings(handle, agent, app, comd, context, param, cb);
                break;
            case 'cpu':
                dumpCPU(handle, agent, comd, context, param, cb);
                break;
            case 'memory':
                dumpMemory(handle, agent, comd, context, param, cb);
                break;
            case 'get':
                getApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'set':
                setApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'enable':
                enableApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'disable':
                disableApp(handle, agent, app, comd, context, param, cb);
                break;
            case 'run':
                runScript(handle, agent, app, comd, context, param, cb);
                break;
            default:
                showError(handle, agent, comd, context, cb);
        }
    }
}
exports.WatchServerModule = WatchServerModule;
WatchServerModule.moduleId = 'watchServer';
function showServers(handle, agent_, comd, context, cb) {
    if (handle === 'client') {
        let agent = agent_;
        let sid, record;
        let serverInfo = {};
        let count = Object.keys(agent.idMap).length;
        let latch = countDownLatch.createCountDownLatch(count, function () {
            cb(null, {
                msg: serverInfo
            });
        });
        for (sid in agent.idMap) {
            record = agent.idMap[sid];
            agent.request(record.id, WatchServerModule.moduleId, {
                comd: comd,
                context: context
            }, function (err, msg) {
                serverInfo[msg.serverId] = msg.body;
                latch.done();
            });
        }
    }
    else if (handle === 'monitor') {
        let agent = agent_;
        let serverId = agent.id;
        let serverType = agent.type;
        let info = agent.info;
        let pid = process.pid;
        let heapUsed = (process.memoryUsage().heapUsed / (1000 * 1000)).toFixed(2);
        let uptime = (process.uptime() / 60).toFixed(2);
        cb(null, {
            serverId: serverId,
            body: {
                serverId: serverId,
                serverType: serverType,
                host: info['host'],
                port: info['port'],
                pid: pid,
                heapUsed: heapUsed,
                uptime: uptime
            }
        });
    }
}
function showConnections(handle, _agent, app, comd, context, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            let sid, record;
            let serverInfo = {};
            let count = 0;
            for (let key in agent.idMap) {
                if (agent.idMap[key].info.frontend) {
                    count++;
                }
            }
            let latch = countDownLatch.createCountDownLatch(count, function () {
                cb(null, {
                    msg: serverInfo
                });
            });
            for (sid in agent.idMap) {
                record = agent.idMap[sid];
                if (record.info.frontend) {
                    agent.request(record.id, WatchServerModule.moduleId, {
                        comd: comd,
                        context: context
                    }, function (err, msg) {
                        serverInfo[msg.serverId] = msg.body;
                        latch.done();
                    });
                }
            }
        }
        else {
            let record = agent.idMap[context];
            if (!record) {
                cb('the server ' + context + ' not exist');
            }
            if (record.info.frontend) {
                agent.request(record.id, WatchServerModule.moduleId, {
                    comd: comd,
                    context: context
                }, function (err, msg) {
                    let serverInfo = {};
                    serverInfo[msg.serverId] = msg.body;
                    cb(null, {
                        msg: serverInfo
                    });
                });
            }
            else {
                cb('\nthis command should be applied to frontend server\n');
            }
        }
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let connection = app.components.__connection__;
        if (!connection) {
            cb(null, {
                serverId: agent.id,
                body: 'error'
            });
            return;
        }
        cb(null, {
            serverId: agent.id,
            body: connection.getStatisticsInfo()
        });
    }
}
function showLogins(handle, _agent, app, comd, context, cb) {
    showConnections(handle, _agent, app, comd, context, cb);
}
function showModules(handle, _agent, comd, context, cb) {
    let modules = _agent.consoleService.modules;
    let result = [];
    for (let module in modules) {
        result.push(module);
    }
    cb(null, {
        msg: result
    });
}
function showStatus(handle, _agent, comd, context, cb) {
    if (handle === 'client') {
        let agent = _agent;
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            context: context
        }, function (err, msg) {
            cb(null, {
                msg: msg
            });
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let serverId = agent.id;
        let pid = process.pid;
        let params = {
            serverId: serverId,
            pid: String(pid)
        };
        monitor.psmonitor.getPsInfo(params, function (err, data) {
            cb(null, {
                serverId: agent.id,
                body: data
            });
        });
    }
}
function showConfig(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (param === 'master') {
            cb(null, {
                masterConfig: app.get('masterConfig') || 'no config to master in app.js',
                masterInfo: app.get('master')
            });
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, cb);
    }
    else if (handle === 'monitor') {
        let key = param + 'Config';
        cb(null, clone(param, app.get(key)));
    }
}
function showProxy(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        proxyCb(app, context, cb);
    }
}
function showHandler(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        handlerCb(app, context, cb);
    }
}
function showComponents(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let _components = app.components;
        let res = {};
        for (let key in _components) {
            let name = getComponentName(key);
            res[name] = clone(name, app.get(name + 'Config'));
        }
        cb(null, res);
    }
}
function showSettings(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let _settings = app.settings;
        let res = {};
        for (let key in _settings) {
            if (key.match(/^__\w+__$/) || key.match(/\w+Config$/)) {
                continue;
            }
            if (!checkJSON(_settings[key])) {
                res[key] = 'Object';
                continue;
            }
            res[key] = _settings[key];
        }
        cb(null, res);
    }
}
function dumpCPU(handle, _agent, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(err, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let times = param['times'];
        let filepath = param['filepath'];
        let force = param['force'];
        cb(null, 'cpu dump is unused in 1.0 of pinus');
        /**
        if (!/\.cpuprofile$/.test(filepath)) {
            filepath = filepath + '.cpuprofile';
        }
        if (!times || !/^[0-9]*[1-9][0-9]*$/.test(times)) {
            cb('no times or times invalid error');
            return;
        }
        checkFilePath(filepath, force, function(err) {
            if (err) {
                cb(err);
                return;
            }
            //ndump.cpu(filepath, times);
            cb(null, filepath + ' cpu dump ok');
        });
        */
    }
}
function dumpMemory(handle, _agent, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(err, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let filepath = param['filepath'];
        let force = param['force'];
        if (!/\.heapsnapshot$/.test(filepath)) {
            filepath = filepath + '.heapsnapshot';
        }
        checkFilePath(filepath, force, function (err) {
            if (err) {
                cb(err);
                return;
            }
            let heapdump = null;
            try {
                heapdump = require('heapdump');
                heapdump.writeSnapshot(filepath);
                cb(null, filepath + ' memory dump ok');
            }
            catch (e) {
                cb('pinus-admin require heapdump');
            }
        });
    }
}
function getApp(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let res = app.get(param);
        if (!checkJSON(res)) {
            res = 'object';
        }
        cb(null, res || null);
    }
}
function setApp(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let key = param['key'];
        let value = param['value'];
        app.set(key, value);
        cb(null, 'set ' + key + ':' + value + ' ok');
    }
}
function enableApp(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        app.enable(param);
        cb(null, 'enable ' + param + ' ok');
    }
}
function disableApp(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        app.disable(param);
        cb(null, 'disable ' + param + ' ok');
    }
}
function runScript(handle, _agent, app, comd, context, param, cb) {
    if (handle === 'client') {
        let agent = _agent;
        if (context === 'all') {
            cb('context error');
            return;
        }
        agent.request(context, WatchServerModule.moduleId, {
            comd: comd,
            param: param,
            context: context
        }, function (err, msg) {
            cb(null, msg);
        });
    }
    else if (handle === 'monitor') {
        let agent = _agent;
        let ctx = {
            app: app,
            result: null
        };
        try {
            vm.createContext(ctx);
            vm.runInNewContext('result = ' + param, ctx);
            cb(null, util.inspect(ctx.result));
        }
        catch (e) {
            cb(null, e.stack);
        }
    }
}
function showError(handle, _agent, comd, context, cb) {
}
function clone(param, obj) {
    let result = {};
    let flag = 1;
    for (let key in obj) {
        if (typeof obj[key] === 'function' || typeof obj[key] === 'object') {
            continue;
        }
        flag = 0;
        result[key] = obj[key];
    }
    if (flag) {
        // return 'no ' + param + 'Config info';
    }
    return result;
}
function checkFilePath(filepath, force, cb) {
    if (!force && fs.existsSync(filepath)) {
        cb('filepath file exist');
        return;
    }
    fs.writeFile(filepath, 'test', function (err) {
        if (err) {
            cb('filepath invalid error');
            return;
        }
        fs.unlinkSync(filepath);
        cb(null);
    });
}
function proxyCb(app, context, cb) {
    let msg = {};
    let __proxy__ = app.components.__proxy__;
    if (__proxy__ && __proxy__.client && __proxy__.client.proxies.user) {
        let proxies = __proxy__.client.proxies.user;
        let server = app.getServerById(context);
        if (!server) {
            cb('no server with this id ' + context);
        }
        else {
            let type = server['serverType'];
            let tmp = proxies[type];
            msg[type] = {};
            for (let _proxy in tmp) {
                let r = tmp[_proxy];
                msg[type][_proxy] = {};
                for (let _rpc in r) {
                    if (typeof r[_rpc] === 'function') {
                        msg[type][_proxy][_rpc] = 'function';
                    }
                }
            }
            cb(null, msg);
        }
    }
    else {
        cb('no proxy loaded');
    }
}
function handlerCb(app, context, cb) {
    let msg = {};
    let __server__ = app.components.__server__;
    if (__server__ && __server__.server && __server__.server.handlerService.handlerMap) {
        let handles = __server__.server.handlerService.handlerMap;
        let server = app.getServerById(context);
        if (!server) {
            cb('no server with this id ' + context);
        }
        else {
            let type = server['serverType'];
            let tmp = handles;
            msg[type] = {};
            for (let _p in tmp) {
                let r = tmp[_p];
                msg[type][_p] = {};
                for (let _r in r) {
                    if (typeof r[_r] === 'function') {
                        msg[type][_p][_r] = 'function';
                    }
                }
            }
            cb(null, msg);
        }
    }
    else {
        cb('no handler loaded');
    }
}
function getComponentName(c) {
    let t = c.match(/^__(\w+)__$/);
    if (t) {
        t = t[1];
    }
    return t;
}
function checkJSON(obj) {
    if (!obj) {
        return true;
    }
    try {
        JSON.stringify(obj);
    }
    catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2F0Y2hTZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9saWIvbW9kdWxlcy93YXRjaFNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7O0dBSUc7QUFDSCwrQ0FBeUM7QUFDekMseURBQXlEO0FBQ3pELHlDQUF5QztBQUV6Qyw2QkFBNkI7QUFDN0IseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUl6Qiw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRzNELElBQUssVUFHSjtBQUhELFdBQUssVUFBVTtJQUNYLCtCQUFpQixDQUFBO0lBQ2pCLGlDQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsTUFBYSxpQkFBaUI7SUFJMUIsWUFBWSxJQUE0QjtRQUNwQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDeEIsQ0FBQztJQUVELGNBQWMsQ0FBQyxLQUFtQixFQUFFLEdBQVEsRUFBRSxFQUFtQjtRQUM3RCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBRW5CLElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFFaEMsUUFBUSxJQUFJLEVBQUU7WUFDVixLQUFLLFNBQVM7Z0JBQ1YsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFF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