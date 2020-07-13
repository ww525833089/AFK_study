"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let ConnectionService = require('../../lib/common/service/connectionService').ConnectionService;
let mockApp = {
    settings: {
        serverId: 'connector-server-1'
    },
    get: function (key) {
        return this.settings[key];
    },
    getServerId: function () {
        return this.get('serverId');
    }
};
describe('connection service test', function () {
    describe('#addLoginedUser', function () {
        it('should add logined user and could fetch it later', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.loginedCount.should.equal(0);
            let uid = 'uid1';
            let info = { msg: 'some other message' };
            service.addLoginedUser(uid, info);
            service.loginedCount.should.equal(1);
            let record = service.logined[uid];
            should.exist(record);
            record.should.eql(info);
        });
    });
    describe('#increaseConnectionCount', function () {
        it('should increate connection count and could fetch it later', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.connCount.should.equal(0);
            service.increaseConnectionCount();
            service.connCount.should.equal(1);
        });
    });
    describe('#removeLoginedUser', function () {
        it('should remove logined user info with the uid', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.loginedCount.should.equal(0);
            let uid = 'uid1';
            let info = { msg: 'some other message' };
            service.addLoginedUser(uid, info);
            service.loginedCount.should.equal(1);
            let record = service.logined[uid];
            should.exist(record);
            let uid2 = 'uid2';
            service.removeLoginedUser(uid2);
            service.loginedCount.should.equal(1);
            record = service.logined[uid];
            should.exist(record);
            service.removeLoginedUser(uid);
            service.loginedCount.should.equal(0);
            record = service.logined[uid];
            should.not.exist(record);
        });
    });
    describe('#decreaseConnectionCount', function () {
        it('should decrease connection count only if uid is empty', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.increaseConnectionCount();
            service.connCount.should.equal(1);
            service.decreaseConnectionCount();
            service.connCount.should.equal(0);
        });
        it('should keep zero if connection count become zero', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.connCount.should.equal(0);
            service.decreaseConnectionCount();
            service.connCount.should.equal(0);
        });
        it('should remove the logined info if uid is specified', function () {
            let service = new ConnectionService(mockApp);
            should.exist(service);
            service.increaseConnectionCount();
            let uid = 'uid1';
            let info = { msg: 'some other message' };
            service.addLoginedUser(uid, info);
            service.connCount.should.equal(1);
            service.logined[uid].should.eql(info);
            service.decreaseConnectionCount(uid);
            service.connCount.should.equal(0);
            should.not.exist(service.logined[uid]);
        });
    });
    it('should getStatisticsInfo', function (done) {
        let service = new ConnectionService(mockApp);
        let uid1 = 'uid1', uid2 = 'uid2';
        let info1 = { msg: 'msg1' }, info2 = { msg: 'msg2' };
        service.increaseConnectionCount();
        service.increaseConnectionCount();
        service.increaseConnectionCount();
        service.addLoginedUser(uid1, info1);
        service.addLoginedUser(uid2, info2);
        let sinfo = service.getStatisticsInfo();
        sinfo.should.have.property('serverId', 'connector-server-1');
        sinfo.should.have.property('totalConnCount', 3);
        sinfo.should.have.property('loginedCount', 2);
        let infos = sinfo.loginedList;
        should.exist(infos);
        infos.length.should.equal(2);
        infos.should.include(info1);
        infos.should.include(info2);
        done();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3NlcnZpY2UvY29ubmVjdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsaUJBQWlCLENBQUM7QUFFaEcsSUFBSSxPQUFPLEdBQUc7SUFDVixRQUFRLEVBQUU7UUFDTixRQUFRLEVBQUUsb0JBQW9CO0tBQ2pDO0lBRUQsR0FBRyxFQUFFLFVBQVUsR0FBZTtRQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVcsRUFBRTtRQUNULE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0osQ0FBQztBQUVGLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNoQyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDeEIsRUFBRSxDQUFDLGtEQUFrRCxFQUFFO1lBQ25ELElBQUksT0FBTyxHQUFHLElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDN0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QixPQUFPLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFckMsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ2pCLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLG9CQUFvQixFQUFFLENBQUM7WUFDekMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFbEMsT0FBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUks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