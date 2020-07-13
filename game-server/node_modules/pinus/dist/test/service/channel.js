"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let pinus = require('../../lib/index').pinus;
let ChannelService = require('../../lib/common/service/channelService').ChannelService;
let mockBase = process.cwd() + '/test';
let channelName = 'test_channel';
let mockApp = { serverId: 'test-server-1' };
describe('channel test', function () {
    describe('#add', function () {
        it('should add a member into channel and could fetch it later', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            let uid = 'uid1', sid = 'sid1';
            channel.add(uid, sid).should.be.true;
            let member = channel.getMember(uid);
            should.exist(member);
            uid.should.equal(member.uid);
            sid.should.equal(member.sid);
        });
        it('should fail if the sid not specified', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            let uid = 'uid1';
            channel.add(uid, null).should.be.false;
        });
        it('should fail after the channel has been destroied', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            channel.destroy();
            let uid = 'uid1', sid = 'sid1';
            channel.add(uid, sid).should.be.false;
        });
    });
    describe('#leave', function () {
        it('should remove the member from channel when leave', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            let uid = 'uid1', sid = 'sid1';
            channel.add(uid, sid).should.be.true;
            let member = channel.getMember(uid);
            should.exist(member);
            channel.leave(uid, sid);
            member = channel.getMember(uid);
            should.not.exist(member);
        });
        it('should fail if uid or sid not specified', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            let uid = 'uid1', sid = 'sid1';
            channel.add(uid, sid).should.be.true;
            channel.leave(uid, null).should.be.false;
            channel.leave(null, sid).should.be.false;
        });
    });
    describe('#getMembers', function () {
        it('should return all the members of channel', function () {
            let uinfos = [
                { uid: 'uid1', sid: 'sid1' },
                { uid: 'uid2', sid: 'sid2' },
                { uid: 'uid3', sid: 'sid3' }
            ];
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            let i, l, item;
            for (i = 0, l = uinfos.length; i < l; i++) {
                item = uinfos[i];
                channel.add(item.uid, item.sid);
            }
            let members = channel.getMembers();
            should.exist(members);
            members.length.should.equal(uinfos.length);
            for (i = 0, l = uinfos.length; i < l; i++) {
                item = uinfos[i];
                members.should.include(item.uid);
            }
        });
    });
    describe('#pushMessage', function () {
        it('should push message to the right frontend server by sid', function (done) {
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
            let channel = channelService.createChannel(channelName);
            for (let i = 0, l = mockUids.length; i < l; i++) {
                channel.add(mockUids[i].uid, mockUids[i].sid);
            }
            channel.pushMessage(mockMsg, function () {
                invokeCount.should.equal(2);
                done();
            });
        });
        it('should fail if channel has destroied', function () {
            let channelService = new ChannelService(mockApp);
            let channel = channelService.createChannel(channelName);
            should.exist(channel);
            channel.destroy();
            channel.pushMessage({}, function (err) {
                should.exist(err);
                err.message.should.equal('channel is not running now');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Rlc3Qvc2VydmljZS9jaGFubmVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQWlDO0FBQ2pDLGtEQUFrRDtBQUNsRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDN0MsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLHlDQUF5QyxDQUFDLENBQUMsY0FBYyxDQUFDO0FBRXZGLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDdkMsSUFBSSxXQUFXLEdBQUcsY0FBYyxDQUFDO0FBQ2pDLElBQUksT0FBTyxHQUFHLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxDQUFDO0FBRTVDLFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkIsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLEVBQUUsQ0FBQywyREFBMkQsRUFBRTtZQUM5RCxJQUFJLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxJQUFJLE9BQU8sR0FBRyxjQUFjLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFdEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFLEdBQUcsR0FBRyxNQUFNLENBQUM7WUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFFckMsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JCLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FB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