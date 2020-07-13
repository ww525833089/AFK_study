"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const should = require("should");
// import { describe, it } from "mocha-typescript"
let pomelo = require('../../lib/index');
const sessionService_1 = require("../../lib/common/service/sessionService");
describe('session service test', function () {
    describe('#bind', function () {
        it('should get session by uid after binded', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'changchang';
            let eventCount = 0;
            let session = service.create(sid, fid, socket);
            should.exist(session);
            session.should.eql(service.get(sid));
            session.on('bind', function (euid) {
                eventCount++;
                uid.should.equal(euid);
            });
            service.bind(sid, uid, function (err) {
                should.not.exist(err);
                let sessions = service.getByUid(uid);
                should.exist(sessions);
                sessions.length.should.equal(1);
                session.should.eql(sessions[0]);
                eventCount.should.equal(1);
                service.bind(sid, uid, function (err) {
                    should.not.exist(err);
                    done();
                });
            });
        });
        it('should fail if already binded uid', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py', test_uid = 'test';
            let session = service.create(sid, fid, socket);
            service.bind(sid, uid, null);
            service.bind(sid, test_uid, function (err) {
                should.exist(err);
                done();
            });
        });
        it('should fail if try to bind a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, uid = 'changchang';
            service.bind(sid, uid, function (err) {
                should.exist(err);
                done();
            });
        });
    });
    describe('#unbind', function () {
        it('should fail unbind session if session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1;
            let uid = 'py';
            service.unbind(sid, uid, function (err) {
                should.exist(err);
                done();
            });
        });
        it('should fail unbind session if session not binded', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py';
            let session = service.create(sid, fid, socket);
            service.unbind(sid, uid, function (err) {
                should.exist(err);
                done();
            });
        });
        it('should fail to get session after session unbinded', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py';
            let session = service.create(sid, fid, socket);
            service.bind(sid, uid, null);
            service.unbind(sid, uid, function (err) {
                should.not.exist(err);
                let sessions = service.getByUid(uid);
                should.not.exist(sessions);
                done();
            });
        });
    });
    describe('#remove', function () {
        it('should not get the session after remove', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'changchang';
            let session = service.create(sid, fid, socket);
            service.bind(sid, uid, function (err) {
                service.remove(sid);
                should.not.exist(service.get(sid));
                should.not.exist(service.getByUid(uid));
                done();
            });
        });
    });
    describe('#import', function () {
        it('should update the session with the key/value pair', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let key = 'key-1', value = 'value-1';
            let session = service.create(sid, fid, socket);
            service.import(sid, key, value, function (err) {
                should.not.exist(err);
                value.should.eql(session.get(key));
                done();
            });
        });
        it('should fail if try to update a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1;
            let key = 'key-1', value = 'value-1';
            service.import(sid, key, value, function (err) {
                should.exist(err);
                done();
            });
        });
        it('should update the session with the key/value pairs', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let key = 'key-1', value = 'value-1', key2 = 'key-2', value2 = {};
            let settings = {};
            settings[key] = value;
            settings[key2] = value2;
            let session = service.create(sid, fid, socket);
            service.importAll(sid, settings, function (err) {
                should.not.exist(err);
                value.should.eql(session.get(key));
                value2.should.eql(session.get(key2));
                done();
            });
        });
        it('should fail if try to update a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1;
            let key = 'key-1', value = 'value-1';
            service.import(sid, key, value, function (err) {
                should.exist(err);
                done();
            });
        });
        it('should fail if try to update a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1;
            let key = 'key-1', value = 'value-1', key2 = 'key-2', value2 = {};
            let settings = {};
            settings[key] = value;
            settings[key2] = value2;
            service.importAll(sid, settings, function (err) {
                should.exist(err);
                done();
            });
        });
    });
    describe('#kick', function () {
        it('should kick the sessions', function (done) {
            let service = new sessionService_1.SessionService();
            let sid1 = 1, fid1 = 'frontend-server-1';
            let sid2 = 2, fid2 = 'frontend-server-1';
            let socket = {
                emit: function () { },
                disconnect: function () { }
            };
            let uid = 'changchang';
            let eventCount = 0;
            let session1 = service.create(sid1, fid1, socket);
            let session2 = service.create(sid2, fid2, socket);
            session1.on('closed', function () {
                eventCount++;
            });
            session2.on('closed', function () {
                eventCount++;
            });
            service.bind(sid1, uid, function (err) {
                service.bind(sid2, uid, function (err) {
                    service.kick(uid, null, function (err) {
                        should.not.exist(err);
                        should.not.exist(service.get(sid1));
                        should.not.exist(service.get(sid2));
                        should.not.exist(service.getByUid(uid));
                        eventCount.should.equal(2);
                        done();
                    });
                });
            });
        });
        it('should kick the session by sessionId', function (done) {
            let service = new sessionService_1.SessionService();
            let sid1 = 1, fid1 = 'frontend-server-1';
            let sid2 = 2, fid2 = 'frontend-server-1';
            let socket = {
                emit: function () { },
                disconnect: function () { }
            };
            let uid = 'changchang';
            let eventCount = 0;
            let session1 = service.create(sid1, fid1, socket);
            let session2 = service.create(sid2, fid2, socket);
            session1.on('closed', function () {
                eventCount++;
            });
            session2.on('closed', function () {
                eventCount++;
            });
            service.bind(sid1, uid, function (err) {
                service.bind(sid2, uid, function (err) {
                    service.kickBySessionId(sid1, null, function (err) {
                        should.not.exist(err);
                        should.not.exist(service.get(sid1));
                        should.exist(service.get(sid2));
                        should.exist(service.getByUid(uid));
                        eventCount.should.equal(1);
                        done();
                    });
                });
            });
        });
        it('should ok if kick a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let uid = 'changchang';
            service.kick(uid, null, function (err) {
                should.not.exist(err);
                done();
            });
        });
        it('should kick session by sid', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1';
            let socket = {
                emit: function () { },
                disconnect: function () { }
            };
            let eventCount = 0;
            let session = service.create(sid, fid, socket);
            session.on('closed', function () {
                eventCount++;
            });
            service.kickBySessionId(sid, null, function (err) {
                should.not.exist(err);
                should.not.exist(service.get(sid));
                eventCount.should.equal(1);
                done();
            });
        });
        it('should ok if kick a session not exist', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1;
            service.kickBySessionId(sid, null, function (err) {
                should.not.exist(err);
                done();
            });
        });
    });
    describe('#forEachSession', function () {
        it('should iterate all created sessions', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let eventCount = 0;
            let outter_session = service.create(sid, fid, socket);
            service.forEachSession(function (session) {
                should.exist(session);
                outter_session.id.should.eql(session.id);
                done();
            });
        });
    });
    describe('#forEachBindedSession', function () {
        it('should iterate all binded sessions', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py';
            let outter_session = service.create(sid, fid, socket);
            service.bind(sid, uid, null);
            service.forEachBindedSession(function (session) {
                should.exist(session);
                outter_session.id.should.eql(session.id);
                outter_session.uid.should.eql(session.uid);
                done();
            });
        });
    });
});
describe('frontend session test', function () {
    describe('#bind', function () {
        it('should get session by uid after binded', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'changchang';
            let eventCount = 0;
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            should.exist(fsession);
            fsession.on('bind', function (euid) {
                eventCount++;
                uid.should.equal(euid);
            });
            fsession.bind(uid, function (err) {
                should.not.exist(err);
                let sessions = service.getByUid(uid);
                should.exist(sessions);
                sessions.length.should.equal(1);
                session.should.eql(sessions[0]);
                eventCount.should.equal(1);
                done();
            });
        });
    });
    describe('#unbind', function () {
        it('should fail to get session after session unbinded', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py';
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            fsession.bind(uid, null);
            fsession.unbind(uid, function (err) {
                should.not.exist(err);
                let sessions = service.getByUid(uid);
                should.not.exist(sessions);
                done();
            });
        });
    });
    describe('#set/get', function () {
        it('should update the key/value pair in frontend session but not session', function () {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let key = 'key-1', value = 'value-1';
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            fsession.set(key, value);
            should.not.exist(session.get(key));
            value.should.eql(fsession.get(key));
        });
    });
    describe('#push', function () {
        it('should push the specified key/value pair to session', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let key = 'key-1', value = 'value-1', key2 = 'key-2', value2 = {};
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            fsession.set(key, value);
            fsession.set(key2, value2);
            fsession.push(key, function (err) {
                should.not.exist(err);
                value.should.eql(session.get(key));
                should.not.exist(session.get(key2));
                done();
            });
        });
        it('should push all the key/value pairs to session', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let key = 'key-1', value = 'value-1', key2 = 'key-2', value2 = {};
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            fsession.set(key, value);
            fsession.set(key2, value2);
            fsession.pushAll(function (err) {
                should.not.exist(err);
                value.should.eql(session.get(key));
                value2.should.eql(session.get(key2));
                done();
            });
        });
    });
    describe('#export', function () {
        it('should equal frontend session after export', function (done) {
            let service = new sessionService_1.SessionService();
            let sid = 1, fid = 'frontend-server-1', socket = {};
            let uid = 'py';
            let session = service.create(sid, fid, socket);
            let fsession = session.toFrontendSession();
            let esession = fsession.export();
            esession.id.should.eql(fsession.id);
            esession.frontendId.should.eql(fsession.frontendId);
            done();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3NlcnZpY2Uvc2Vzc2lvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3hDLDRFQUFtRztBQUluRyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7SUFDL0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsd0NBQXdDLEVBQUUsVUFBVSxJQUFlO1lBQ3BFLElBQUksT0FBTyxHQUFHLElBQUksK0JBQWMsRUFBRSxDQUFDO1lBQ25DLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsbUJBQW1CLEVBQUUsTUFBTSxHQUFpQixFQUFFLENBQUM7WUFDbEUsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDO1lBQ3ZCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztZQUVuQixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFL0MsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV0QixPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFckMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBVSxJQUFZO2dCQUN2QyxVQUFVLEVBQUUsQ0FBQztnQkFDYixHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxVQUFVLEdBQVU7Z0JBQ3pDLE1BQU0sQ0FBQyxHQUFH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