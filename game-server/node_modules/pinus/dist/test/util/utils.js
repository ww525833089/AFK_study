"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let utils = require('../../lib/util/utils');
require("should");
// import { describe, it } from "mocha-typescript"
describe('utils test', function () {
    describe('#invokeCallback', function () {
        it('should invoke the function with the parameters', function () {
            let p1 = 1, p2 = 'str';
            let func = function (arg1, arg2) {
                p1.should.equal(arg1);
                p2.should.equal(arg2);
            };
            utils.invokeCallback(func, p1, p2);
        });
        it('should ok if cb is null', function () {
            let p1 = 1, p2 = 'str';
            (function () {
                utils.invokeCallback(null, p1, p2);
            }).should.not.throw();
        });
    });
    describe('#size', function () {
        it('should return the own property count of the object', function () {
            let obj = {
                p1: 'str',
                p2: 1,
                m1: function () { }
            };
            utils.size(obj).should.equal(2);
        });
    });
    describe('#startsWith', function () {
        it('should return true if the string do start with the prefix', function () {
            let src = 'prefix with a string';
            let prefix = 'prefix';
            utils.startsWith(src, prefix).should.be.true;
        });
        it('should return false if the string not start with the prefix', function () {
            let src = 'prefix with a string';
            let prefix = 'prefix222';
            utils.startsWith(src, prefix).should.be.false;
            prefix = 'with';
            utils.startsWith(src, prefix).should.be.false;
        });
        it('should return false if the src not a string', function () {
            utils.startsWith(1, 'str').should.be.false;
        });
    });
    describe('#endsWith', function () {
        it('should return true if the string do end with the prefix', function () {
            let src = 'string with a suffix';
            let suffix = 'suffix';
            utils.endsWith(src, suffix).should.be.true;
        });
        it('should return false if the string not end with the prefix', function () {
            let src = 'string with a suffix';
            let suffix = 'suffix222';
            utils.endsWith(src, suffix).should.be.false;
            suffix = 'with';
            utils.endsWith(src, suffix).should.be.false;
        });
        it('should return false if the src not a string', function () {
            utils.endsWith(1, 'str').should.be.false;
        });
    });
    describe('#hasChineseChar', function () {
        it('should return false if the string does not have any Chinese characters', function () {
            let src = 'string without Chinese characters';
            utils.hasChineseChar(src).should.be.false;
        });
        it('should return true if the string has Chinese characters', function () {
            let src = 'string with Chinese characters 你好';
            utils.hasChineseChar(src).should.be.true;
        });
    });
    describe('#unicodeToUtf8', function () {
        it('should return the origin string if the string does not have any Chinese characters', function () {
            let src = 'string without Chinese characters';
            utils.unicodeToUtf8(src).should.equal(src);
        });
        it('should not return the origin string if the string has Chinese characters', function () {
            let src = 'string with Chinese characters 你好';
            utils.unicodeToUtf8(src).should.not.equal(src);
        });
    });
    describe('#isLocal', function () {
        it('should return true if the ip is local', function () {
            let ip = '127.0.0.1';
            let host = 'localhost';
            let other = '192.168.1.1';
            utils.isLocal(ip).should.be.true;
            utils.isLocal(host).should.be.true;
            utils.isLocal(other).should.be.false;
        });
    });
    describe('#loadCluster', function () {
        it('should produce cluster servers', function () {
            let clusterServer = { host: '127.0.0.1', port: '3010++', serverType: 'chat', cluster: true, clusterCount: 2 };
            let serverMap = {};
            let app = { clusterSeq: {} };
            utils.loadCluster(app, clusterServer, serverMap);
            utils.size(serverMap).should.equal(2);
        });
    });
    describe('#arrayDiff', function () {
        it('should return the difference of two arrays', function () {
            let array1 = [1, 2, 3, 4, 5];
            let array2 = [1, 2, 3];
            let array = utils.arrayDiff(array1, array2);
            array.should.eql([4, 5]);
        });
    });
    describe('#extends', function () {
        it('should extends opts', function () {
            let opts = {
                test: 123
            };
            let add = {
                aaa: 555
            };
            let result = utils.extendsObject(opts, add);
            result.should.eql({
                test: 123,
                aaa: 555
            });
        });
    });
    describe('#ping', function () {
        it('should ping server', function () {
            utils.ping('127.0.0.1', function (flag) {
                flag.should.be.true;
            });
            utils.ping('111.111.111.111', function (flag) {
                flag.should.be.false;
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi90ZXN0L3V0aWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUM1QyxrQkFBaUI7QUFDakIsa0RBQWtEO0FBRWxELFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFDckIsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1FBQzFCLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUV2QixJQUFJLElBQUksR0FBRyxVQUFVLElBQVksRUFBRSxJQUFZO2dCQUM3QyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDO1lBRUYsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLENBQUM7Z0JBQ0MsS0FBSyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDaEIsRUFBRSxDQUFDLG9EQUFvRCxFQUFFO1lBQ3ZELElBQUksR0FBRyxHQUFHO2dCQUNSLEVBQUUsRUFBRSxL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