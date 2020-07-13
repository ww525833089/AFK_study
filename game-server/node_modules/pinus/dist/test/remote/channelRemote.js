"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
let pinus = require('../../lib/index').pinus;
let remote = require('../../lib/common/remote/frontend/channelRemote').default;
let SessionService = require('../../lib/common/service/sessionService').SessionService;
let ChannelService = require('../../lib/common/service/channelService').ChannelService;
let countDownLatch = require('../../lib/util/countDownLatch').CountDownLatch;
let MockChannelManager = require('../manager/mockChannelManager').MockManager;
let mockBase = process.cwd() + '/test';
let WAIT_TIME = 200;
describe('channel remote test', function () {
    describe('#pushMessage', function () {
        it('should push message the the specified clients', function (done) {
            this.timeout(5555);
            let sids = [1, 2, 3, 4, 5, 6];
            let uids = [11, 12, 13];
            let frontendId = 'frontend-server-id';
            let mockRoute = 'mock-route-string';
            let mockMsg = { msg: 'some test msg' };
            let invokeCount = 0;
            let invokeUids = [];
            let sessionService = new SessionService();
            sessionService.sendMessageByUid = function (uid, msg) {
                mockMsg.should.eql(msg);
                invokeCount++;
                invokeUids.push(uid);
            };
            let session;
            for (let i = 0, l = sids.length, j = 0; i < l; i++) {
                session = sessionService.create(sids[i], frontendId);
                if (i % 2) {
                    sessionService.bind(session.id, uids[j]);
                    j++;
                }
            }
            let app = pinus.createApp({ base: mockBase });
            app.components.__connector__ = {
                send: function (reqId, route, msg, recvs, opts, cb) {
                    app.components.__pushScheduler__.schedule(reqId, route, msg, recvs, opts, cb);
                }
            };
            app.components.__connector__.connector = {};
            app.components.__pushScheduler__ = {
                schedule: function (reqId, route, msg, recvs, opts, cb) {
                    mockMsg.should.eql(msg);
                    invokeCount += recvs.length;
                    let sess;
                    for (let i = 0; i < recvs.length; i++) {
                        sess = sessionService.get(recvs[i]);
                        if (sess) {
                            invokeUids.push(sess.uid);
                        }
                    }
                    cb();
                }
            };
            app.set('sessionService', sessionService);
            let channelRemote = remote(app);
            channelRemote.pushMessage(mockRoute, mockMsg, uids, { isPush: true }).then(() => {
                invokeCount.should.equal(uids.length);
                invokeUids.length.should.equal(uids.length);
                for (let i = 0, l = uids.length; i < l; i++) {
                    invokeUids.should.containEql(uids[i]);
                }
                done();
            });
        });
    });
    describe('#broadcast', function () {
        it('should broadcast to all the client connected', function (done) {
            let sids = [1, 2, 3, 4, 5];
            let uids = [11, 12, 13, 14, 15];
            let frontendId = 'frontend-server-id';
            let mockRoute = 'mock-route-string';
            let mockMsg = { msg: 'some test msg' };
            let invokeCount = 0;
            let sessionService = new SessionService();
            let channelService = new ChannelService();
            let session;
            for (let i = 0, l = sids.length; i < l; i++) {
                session = sessionService.create(sids[i], frontendId);
                if (i % 2) {
                    session.bind(uids[i]);
                }
            }
            let app = pinus.createApp({ base: mockBase });
            app.components.__connector__ = {
                send: function (reqId, route, msg, recvs, opts, cb) {
                    app.components.__pushScheduler__.schedule(reqId, route, msg, recvs, opts, cb);
                }
            };
            app.components.__connector__.connector = {};
            app.components.__pushScheduler__ = {
                schedule: function (reqId, route, msg, recvs, opts, cb) {
                    invokeCount++;
                    mockMsg.should.eql(msg);
                    should.exist(opts);
                    should.equal(opts.type, 'broadcast');
                    cb();
                }
            };
            app.set('sessionService', sessionService);
            app.set('channelService', channelService);
            let channelRemote = remote(app);
            channelRemote.broadcast(mockRoute, mockMsg, { type: 'broadcast' }).then(() => {
                invokeCount.should.equal(1);
                done();
            });
        });
        it('should broadcast to all the binded client connected', function (done) {
            let sids = [1, 2, 3, 4, 5, 6];
            let uids = [11, 12, 13];
            let frontendId = 'frontend-server-id';
            let mockRoute = 'mock-route-string';
            let mockMsg = { msg: 'some test msg' };
            let invokeCount = 0;
            let invokeUids = [];
            let sessionService = new SessionService();
            let channelService = new ChannelService();
            let session;
            for (let i = 0, l = sids.length, j = 0; i < l; i++) {
                session = sessionService.create(sids[i], frontendId);
                if (i % 2) {
                    session.bind(uids[j]);
                    j++;
                }
            }
            let app = pinus.createApp({ base: mockBase });
            app.components.__connector__ = {
                send: function (reqId, route, msg, recvs, opts, cb) {
                    app.components.__pushScheduler__.schedule(reqId, route, msg, recvs, opts, cb);
                }
            };
            app.components.__connector__.connector = {};
            app.components.__pushScheduler__ = {
                schedule: function (reqId, route, msg, recvs, opts, cb) {
                    invokeCount++;
                    mockMsg.should.eql(msg);
                    should.exist(opts);
                    should.equal(opts.type, 'broadcast');
                    true.should.equal(opts.userOptions.binded);
                    cb();
                }
            };
            app.set('sessionService', sessionService);
            app.set('channelService', channelService);
            let channelRemote = remote(app);
            channelRemote.broadcast(mockRoute, mockMsg, {
                type: 'broadcast',
                userOptions: { binded: true }
            }).then(() => {
                invokeCount.should.equal(1);
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbFJlbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3QvcmVtb3RlL2NoYW5uZWxSZW1vdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFLakMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDO0FBQzdDLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMvRSxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQyxjQUFjLENBQUM7QUFDdkYsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUMsY0FBYyxDQUFDO0FBQ3ZGLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQztBQUM3RSxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUc5RSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBRXZDLElBQUksU0FBUyxHQUFHLEdBQUcsQ0FBQztBQUVwQixRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDNUIsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUNyQixFQUFFLENBQUMsK0NBQStDLEVBQUUsVUFBVSxJQUFlO1lBQ3pFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBRyxvQkFBb0IsQ0FBQztZ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