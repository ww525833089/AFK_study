"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let pinus = require('../../lib/index');
let consoleModule = require('../../lib/modules/console').ConsoleModule;
describe('console module test', function () {
    describe('#monitorHandler', function () {
        it('should execute the corresponding command with different signals', function () {
            let flag;
            let rs;
            let opts = {
                app: {
                    components: {
                        __connector__: {
                            blacklist: []
                        }
                    },
                    stop: function (value) {
                        flag = value;
                    },
                    addCrons: function (array) {
                        rs = array;
                    },
                    removeCrons: function (array) {
                        rs = array;
                    },
                    isFrontend: function () {
                        return true;
                    }
                }
            };
            let module = new consoleModule(opts);
            let agent1 = {
                type: 'area'
            };
            let msg1 = { signal: 'stop' };
            module.monitorHandler(agent1, msg1);
            flag.should.eql(true);
            let msg2 = { signal: 'list' };
            let agent2 = {
                type: 'chat',
                id: 'chat-server-1'
            };
            module.monitorHandler(agent2, msg2, function (obj) {
                obj.serverId.should.eql('chat-server-1');
                obj.body.serverType.should.eql('chat');
            });
            let msg3 = { signal: 'addCron' };
            module.monitorHandler(agent2, msg3, null);
            rs.length.should.eql(1);
            let msg4 = { signal: 'removeCron' };
            module.monitorHandler(agent2, msg4, null);
            rs.length.should.eql(1);
            let msg5 = { signal: 'blacklist', blacklist: ['127.0.0.1'] };
            module.monitorHandler(agent1, msg5, null);
            opts.app.components.__connector__.blacklist.length.should.eql(1);
        });
    });
    describe('#clientHandler', function () {
        let _exit;
        let _setTimeout;
        let __setTimeout;
        let exitCount = 0;
        before(function (done) {
            _exit = process.exit;
            _setTimeout = __setTimeout;
            done();
        });
        after(function (done) {
            process.exit = _exit;
            __setTimeout = _setTimeout;
            done();
        });
        let opts = {
            app: {
                clusterSeq: {},
                stop: function (value) {
                    return value;
                },
                getServerById: function () {
                    return {
                        host: '127.0.0.1'
                    };
                },
                getServers: function () {
                    return {
                        'chat-server-1': {}
                    };
                },
                get: function (value) {
                    switch (value) {
                        case 'main':
                            return __dirname + '/../../index.js';
                        case 'env':
                            return 'dev';
                    }
                },
                set: function (value) {
                    return value;
                },
                getServersByType: function () {
                    return [{ id: 'chat-server-1' }];
                }
            }
        };
        let module = new consoleModule(opts);
        it('should execute kill command', function (done) {
            if (done) {
                done();
                return;
            }
            let msg = { signal: 'kill' };
            process.exit = function () {
                exitCount++;
            };
            let orgtimeout = setTimeout;
            global['setTimeout'] = function (cb, timeout) {
                if (timeout > 50) {
                    timeout = 50;
                }
                orgtimeout(cb, timeout);
            };
            let agent1 = {
                request: function (recordId, moduleId, msg, cb) {
                    cb('chat-server-1');
                },
                idMap: {
                    'chat-server-1': {
                        type: 'chat',
                        id: 'chat-server-1'
                    }
                }
            };
            module.clientHandler(agent1, msg, function (err, result) {
                console.log('!! error chat 1');
                should.not.exist(err);
                should.exist(result.code);
            });
            let agent2 = {
                request: function (recordId, moduleId, msg, cb) {
                    cb(null);
                },
                idMap: {
                    'chat-server-1': {
                        type: 'chat',
                        id: 'chat-server-1'
                    }
                }
            };
            module.clientHandler(agent2, msg, function (err, result) {
                console.log('!! null chat 1');
                should.not.exist(err);
                should.exist(result.code);
                result.code.should.eql('remained');
                global['setTimeout'] = orgtimeout;
                done();
            });
        });
        it('should execute stop command', function (done) {
            this.timeout(5555);
            let msg1 = { signal: 'stop', ids: ['chat-server-1'] };
            let msg2 = { signal: 'stop', ids: [] };
            let agent = {
                notifyById: function (serverId, moduleId, msg) {
                },
                notifyAll: function (moduleId, msg) {
                }
            };
            module.clientHandler(agent, msg1, function (err, result) {
                result.status.should.eql('part');
            });
            module.clientHandler(agent, msg2, function (err, result) {
                result.status.should.eql('all');
                done();
            });
        });
        it('should execute list command', function () {
            let msg = { signal: 'list' };
            let agent = {
                request: function (recordId, moduleId, msg, cb) {
                    cb({ serverId: 'chat-server-1', body: { 'server': {} } });
                },
                idMap: {
                    'chat-server-1': {
                        type: 'chat',
                        id: 'chat-server-1'
                    }
                }
            };
            module.clientHandler(agent, msg, function (err, result) {
                should.exist(result.msg);
            });
        });
        it('should execute add command', function () {
            let msg1 = { signal: 'add', args: ['host=127.0.0.1', 'port=88888', 'clusterCount=2'] };
            let msg2 = { signal: 'add', args: ['host=127.0.0.1', 'port=88888', 'id=chat-server-1', 'serverType=chat'] };
            let agent = {};
            module.clientHandler(agent, msg1, function (err, result) {
                should.not.exist(err);
                result.length.should.eql(0);
            });
            module.clientHandler(agent, msg2, function (err, result) {
                result.status.should.eql('ok');
            });
        });
        it('should execute blacklist command', function () {
            let msg1 = { signal: 'blacklist', args: ['127.0.0.1'] };
            let msg2 = { signal: 'blacklist', args: ['abc'] };
            let agent = {
                notifyAll: function (moduleId, msg) {
                }
            };
            module.clientHandler(agent, msg1, function (err, result) {
                result.status.should.eql('ok');
            });
            module.clientHandler(agent, msg2, function (err, result) {
                should.exist(err);
            });
        });
        it('should execute restart command', function () {
            this.timeout(8555);
            let msg1 = { signal: 'restart', ids: ['chat-server-1'] };
            let msg2 = { signal: 'restart', type: 'chat', ids: [] };
            let agent = {
                request: function (recordId, moduleId, msg, cb) {
                    cb(null);
                }
            };
            module.clientHandler(agent, msg1, function (err, result) {
                should.exist(err);
            });
            module.clientHandler(agent, msg2, function (err, result) {
                should.exist(err);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvbW9kdWxlcy9jb25zb2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBQ2pDLGtEQUFrRDtBQUNsRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN2QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxhQUFhLENBQUM7QUFHdkUsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzVCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUN4QixFQUFFLENBQUMsaUVBQWlFLEVBQUU7WUFDbEUsSUFBSSxJQUFhLENBQUM7WUFDbEIsSUFBSSxFQUFjLENBQUM7WUFDbkIsSUFBSSxJQUFJLEdBQVE7Z0JBQ1osR0FBRyxFQUFFO29CQUNELFVBQVUsRUFBRTt3QkFDUixhQUFhLEVBQUU7NEJBQ1gsU0FBUyxFQUFFLEVBQUU7eUJBQ2hCO3FCQUNKO29CQUNELElBQUksRUFBRSxVQUFVLEtBQWM7d0JBQzFCLElBQUksR0FBRyxLQUFLLENBQUM7b0JBQ2pCLENBQUM7b0JBQ0QsUUFBUSxFQUFFLFVBQVUsS0FBaUI7d0JBQ2pDLEVBQUUsR0FBRyxLQUFLLENBQUM7b0JBQ2YsQ0FBQztvQkFDRCxXQUFXLEVBQUUsVUFBVSxLQUFpQjt3QkFDcEMsRUFBRSxHQUFHLEtBQUssQ0FBQztvQkFDZixDQUFDO29CQUNELFVBQVUsRUFBRTt3QkFDUixPQUFPLElBQUksQ0FBQztvQkFDaEIsQ0FBQztpQkFDSjthQUNKLENBQUM7WUFDRixJQUFJLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxJQUFJLE1BQU0sR0FBRztnQkFDVCxJQUFJLEVBQUUsTUFBTTthQUNmLENBQUM7WUFDRixJQUFJLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQztZQUM5QixN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