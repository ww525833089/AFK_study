"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let pinus = require('../../lib/index').pinus;
let ChannelService = require('../../lib/common/service/channelService').ChannelService;
let channelName = 'test_channel';
let mockBase = process.cwd() + '/test';
let mockApp = { serverId: 'test-server-1' };
describe('channel manager test', function () {
    describe('#createChannel', function () {
        it('should create and return a channel with the specified name', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            channelName.should.equal(channel.name);
        });
        it('should return the same channel if the name has already existed', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            channelName.should.equal(channel.name);
            let channel2 = channelService.createChannel(channelName);
            channel.should.equal(channel2);
        });
    });
    describe('#destroyChannel', function () {
        it('should delete the channel instance', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            channelName.should.equal(channel.name);
            channelService.destroyChannel(channelName);
            let channel2 = channelService.createChannel(channelName);
            channel.should.not.equal(channel2);
        });
    });
    describe('#getChannel', function () {
        it('should return the channel with the specified name if it exists', function () {
            let channelService = new ChannelService(mockApp);
            channelService.createChannel(channelName);
            let channel = channelService.getChannel(channelName);
            should.exist(channel);
            channelName.should.equal(channel.name);
        });
        it('should return undefined if the channel dose not exist', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.getChannel(channelName);
            should.not.exist(channel);
        });
        it('should create and return a new channel if create parameter is set', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.getChannel(channelName, true);
            should.exist(channel);
            channelName.should.equal(channel.name);
        });
    });
    describe('#pushMessageByUids', function () {
        it('should push message to the right frontend server', function (done) {
            let sid1 = 'sid1', sid2 = 'sid2';
            let uid1 = 'uid1', uid2 = 'uid2', uid3 = 'uid3';
            let orgRoute = 'test.route.string';
            let mockUids = [
                { sid: sid1, uid: uid1 },
                { sid: sid2, uid: uid2 },
                { sid: sid2, uid: uid3 }
            ];
            let mockMsg = { key: 'some remote message' };
            let uidMap = {};
            for (let i in mockUids) {
                uidMap[mockUids[i].uid] = mockUids[i];
            }
            let invokeCount = 0;
            let mockRpcInvoke = function (sid, rmsg, cb) {
                invokeCount++;
                let args = rmsg.args;
                let route = args[0];
                let msg = args[1];
                let uids = args[2];
                mockMsg.should.eql(msg);
                for (let j = 0, l = uids.length; j < l; j++) {
                    let uid = uids[j];
                    let r2 = uidMap[uid];
                    r2.sid.should.equal(sid);
                }
                cb();
            };
            let app = pinus.createApp({ base: mockBase });
            app.rpcInvoke = mockRpcInvoke;
            let channelService = new ChannelService(app);
            channelService.pushMessageByUids(orgRoute, mockMsg, mockUids, function () {
                invokeCount.should.equal(2);
                done();
            });
        });
        it('should return an err if uids is empty', function (done) {
            let mockMsg = { key: 'some remote message' };
            let app = pinus.createApp({ base: mockBase });
            let channelService = new ChannelService(app);
            channelService.pushMessageByUids(mockMsg, null, function (err) {
                should.exist(err);
                err.message.should.equal('uids should not be empty');
                done();
            });
        });
        it('should return err if all message fail to push', function (done) {
            let sid1 = 'sid1', sid2 = 'sid2';
            let uid1 = 'uid1', uid2 = 'uid2', uid3 = 'uid3';
            let mockUids = [
                { sid: sid1, uid: uid1 },
                { sid: sid2, uid: uid2 },
                { sid: sid2, uid: uid3 }
            ];
            let mockMsg = { key: 'some remote message' };
            let uidMap = {};
            for (let i in mockUids) {
                uidMap[mockUids[i].uid] = mockUids[i];
            }
            let invokeCount = 0;
            let mockRpcInvoke = function (sid, rmsg, cb) {
                invokeCount++;
                cb(new Error('[TestMockError] mock rpc error'));
            };
            let app = pinus.createApp({ base: mockBase });
            app.rpcInvoke = mockRpcInvoke;
            let channelService = new ChannelService(app);
            channelService.pushMessageByUids(mockMsg, mockUids, function (err) {
                invokeCount.should.equal(2);
                should.exist(err);
                err.message.should.equal('all uids push message fail');
                done();
            });
        });
        it('should return fail uid list if fail to push messge to some of the uids', function (done) {
            let sid1 = 'sid1', sid2 = 'sid2';
            let uid1 = 'uid1', uid2 = 'uid2', uid3 = 'uid3';
            let mockUids = [{ sid: sid1, uid: uid1 }, { sid: sid2, uid: uid2 }, { sid: sid2, uid: uid3 }];
            let mockMsg = { key: 'some remote message' };
            let uidMap = {};
            for (let i in mockUids) {
                uidMap[mockUids[i].uid] = mockUids[i];
            }
            let invokeCount = 0;
            let mockRpcInvoke = function (sid, rmsg, cb) {
                invokeCount++;
                if (rmsg.args[2].indexOf(uid1) >= 0) {
                    cb(null, [uid1]);
                }
                else if (rmsg.args[2].indexOf(uid3) >= 0) {
                    cb(null, [uid3]);
                }
                else {
                    cb();
                }
            };
            let app = pinus.createApp({ base: mockBase });
            app.rpcInvoke = mockRpcInvoke;
            let channelService = new ChannelService(app);
            channelService.pushMessageByUids(mockMsg, mockUids, function (err, fails) {
                invokeCount.should.equal(2);
                should.not.exist(err);
                should.exist(fails);
                fails.length.should.equal(2);
                fails.should.containEql(uid1);
                fails.should.containEql(uid3);
                done();
            });
        });
    });
    describe('#broadcast', function () {
        it('should push message to all specified frontend servers', function (done) {
            let mockServers = [
                { id: 'connector-1', serverType: 'connector', other: 'xxx1' },
                { id: 'connector-2', serverType: 'connector', other: 'xxx2' },
                { id: 'area-1', serverType: 'area', other: 'yyy1' },
                { id: 'gate-1', serverType: 'gate', other: 'zzz1' },
                { id: 'gate-2', serverType: 'gate', other: 'xxx1' },
                { id: 'gate-3', serverType: 'gate', other: 'yyy1' }
            ];
            let connectorIds = ['connector-1', 'connector-2'];
            let mockSType = 'connector';
            let mockRoute = 'test.route.string';
            let mockBinded = true;
            let opts = { binded: mockBinded };
            let mockMsg = { key: 'some remote message' };
            let invokeCount = 0;
            let sids = [];
            let mockRpcInvoke = function (sid, rmsg, cb) {
                invokeCount++;
                let args = rmsg.args;
                let route = args[0];
                let msg = args[1];
                let opts = args[2];
                mockMsg.should.eql(msg);
                mockRoute.should.equal(route);
                should.exist(opts);
                mockBinded.should.equal(opts.userOptions.binded);
                sids.push(sid);
                cb();
            };
            let app = pinus.createApp({ base: mockBase });
            app.rpcInvoke = mockRpcInvoke;
            app.addServers(mockServers);
            let channelService = new ChannelService(app);
            channelService.broadcast(mockSType, mockRoute, mockMsg, opts, function () {
                invokeCount.should.equal(2);
                sids.length.should.equal(connectorIds.length);
                for (let i = 0, l = connectorIds.length; i < l; i++) {
                    sids.should.containEql(connectorIds[i]);
                }
                done();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3NlcnZpY2UvY2hhbm5lbFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUM3QyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMseUNBQXlDLENBQUMsQ0FBQyxjQUFjLENBQUM7QUFFdkYsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDO0FBQ2pDLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDdkMsSUFBSSxPQUFPLEdBQUcsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLENBQUM7QUFFNUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFO0lBQy9CLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixFQUFFLENBQUMsNERBQTRELEVBQUU7WUFDL0QsSUFBSSxjQUFjLEdBQUcsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakQsSUFBSSxPQUFPLEdBQUcsY0FBYyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN4RCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RCLFdBQVcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnRUFBZ0UsRUFBRTtZQUNuRSxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENB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