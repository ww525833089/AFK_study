"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let pathUtil = require('../../lib/util/pathUtil');
let utils = require('../../lib/util/utils');
const should = require("should");
// import { describe, it } from "mocha-typescript"
let fs = require('fs');
let mockBase = process.cwd() + '/test/mock-base';
describe('path util test', function () {
    it('ok', () => {
    });
    if (process.platform === 'win32') {
        return;
    }
    describe('#getSysRemotePath', function () {
        it('should return the system remote service path for frontend server', function () {
            let role = 'frontend';
            let expectSuffix = '/common/remote/frontend';
            let p = pathUtil.getSysRemotePath(role);
            should.exist(p);
            fs.existsSync(p).should.be.true;
            utils.endsWith(p, expectSuffix).should.be.true;
        });
        it('should return the system remote service path for backend server', function () {
            let role = 'backend';
            let expectSuffix = '/common/remote/backend';
            let p = pathUtil.getSysRemotePath(role);
            should.exist(p);
            fs.existsSync(p).should.be.true;
            utils.endsWith(p, expectSuffix).should.be.true;
        });
    });
    describe('#getUserRemotePath', function () {
        it('should return user remote service path for the associated server type', function () {
            let serverType = 'connector';
            let expectSuffix = '/app/servers/connector/remote';
            let p = pathUtil.getUserRemotePath(mockBase, serverType);
            should.exist(p);
            fs.existsSync(p).should.be.true;
            utils.endsWith(p, expectSuffix).should.be.true;
        });
        it('should return null if the directory not exist', function () {
            let serverType = 'area';
            let p = pathUtil.getUserRemotePath(mockBase, serverType);
            should.not.exist(p);
            serverType = 'some-dir-not-exist';
            p = pathUtil.getUserRemotePath(mockBase, serverType);
            should.not.exist(p);
        });
    });
    describe('#listUserRemoteDir', function () {
        it('should return sub-direcotry name list of servers/ directory', function () {
            let expectNames = ['connector', 'area'];
            let p = pathUtil.listUserRemoteDir(mockBase);
            should.exist(p);
            expectNames.length.should.equal(p.length);
            for (let i = 0, l = expectNames.length; i < l; i++) {
                p.should.include(expectNames[i]);
            }
        });
        it('should throw err if the servers/ illegal', function () {
            (function () {
                pathUtil.listUserRemoteDir('some illegal base');
            }).should.throw();
        });
    });
    describe('#remotePathRecord', function () {
        let namespace = 'user';
        let serverType = 'connector';
        let path = '/some/path/to/remote';
        let r = pathUtil.remotePathRecord(namespace, serverType, path);
        should.exist(r);
        namespace.should.equal(r.namespace);
        serverType.should.equal(r.serverType);
        path.should.equal(r.path);
    });
    describe('#getHandlerPath', function () {
        it('should return user handler path for the associated server type', function () {
            let serverType = 'connector';
            let expectSuffix = '/app/servers/connector/handler';
            let p = pathUtil.getHandlerPath(mockBase, serverType);
            should.exist(p);
            fs.existsSync(p).should.be.true;
            utils.endsWith(p, expectSuffix).should.be.true;
        });
        it('should return null if the directory not exist', function () {
            let serverType = 'area';
            let p = pathUtil.getHandlerPath(mockBase, serverType);
            should.not.exist(p);
            serverType = 'some-dir-not-exist';
            p = pathUtil.getHandlerPath(mockBase, serverType);
            should.not.exist(p);
        });
    });
    describe('#getScriptPath', function () {
        let p = pathUtil.getScriptPath(mockBase);
        let expectSuffix = '/scripts';
        should.exist(p);
        utils.endsWith(p, expectSuffix).should.be.true;
    });
    describe('#getLogPath', function () {
        let p = pathUtil.getLogPath(mockBase);
        let expectSuffix = '/logs';
        should.exist(p);
        utils.endsWith(p, expectSuffix).should.be.true;
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aFV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3V0aWwvcGF0aFV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQztBQUNsRCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM1QyxpQ0FBaUM7QUFDakMsa0RBQWtEO0FBQ2xELElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV2QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7QUFFakQsUUFBUSxDQUFDLGdCQUFnQixFQUFFO0lBQ3ZCLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBRWQsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFFO1FBQzlCLE9BQU07S0FDVDtJQUNELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtRQUMxQixFQUFFLENBQUMsa0VBQWtFLEVBQUU7WUFDbkUsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDO1lBQ3RCLElBQUksWUFBWSxHQUFHLHlCQUF5QixDQUFDO1lBQzdDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDaEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaUVBQWlFLEVB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