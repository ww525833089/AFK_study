"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../lib/index");
const should = require("should");
const mockPlugin_1 = require("./mock-plugin/components/mockPlugin");
const mockEvent_1 = require("./mock-plugin/events/mockEvent");
let WAIT_TIME = 1000;
let mockBase = process.cwd() + '/test';
let app = new index_1.Application();
describe('application test', function () {
    afterEach(function () {
        app.state = 0;
        app.settings = {};
    });
    describe('#init', function () {
        it('should init the app instance', function () {
            app.init({ base: mockBase });
            app.state.should.equal(1); // magic number from application.js
        });
    });
    describe('#set and get', function () {
        it('should play the role of normal set and get', function () {
            should.not.exist(app.get('some undefined key'));
            let key = 'some defined key', value = 'some value';
            app.set(key, value);
            value.should.equal(app.get(key));
        });
        it('should return the value if pass just one parameter to the set method', function () {
            let key = 'some defined key', value = 'some value';
            should.not.exist(app.get(key));
            app.set(key, value);
            value.should.equal(app.get(key));
        });
    });
    describe('#enable and disable', function () {
        it('should play the role of enable and disable', function () {
            let key = 'some enable key';
            app.enabled(key).should.be.false;
            app.disabled(key).should.be.true;
            app.enable(key);
            app.enabled(key).should.be.true;
            app.disabled(key).should.be.false;
            app.disable(key);
            app.enabled(key).should.be.false;
            app.disabled(key).should.be.true;
        });
    });
    describe('#compoent', function () {
        it('should load the component and fire their lifecircle callback by app.start, app.afterStart, app.stop', function (done) {
            let startCount = 0, afterStartCount = 0, stopCount = 0;
            this.timeout(8000);
            let mockComponent = {
                name: 'mockComponent',
                start: function (cb) {
                    console.log('start invoked');
                    startCount++;
                    cb();
                },
                afterStart: function (cb) {
                    console.log('afterStart invoked');
                    afterStartCount++;
                    cb();
                },
                stop: function (force, cb) {
                    console.log('stop invoked');
                    stopCount++;
                    cb();
                }
            };
            app.init({ base: mockBase });
            app.load(mockComponent);
            app.start(function (err) {
                should.not.exist(err);
            });
            setTimeout(function () {
                // wait for after start
                app.stop(false);
                setTimeout(function () {
                    // wait for stop
                    startCount.should.equal(1);
                    afterStartCount.should.equal(1);
                    stopCount.should.equal(1);
                    done();
                }, WAIT_TIME);
            }, WAIT_TIME);
        });
        it('should access the component with a name by app.components.name after loaded', function () {
            let key1 = 'key1', comp1 = new class {
            };
            let comp2 = { name: 'key2', content: 'some thing in comp2' };
            let key3 = 'key3';
            let comp3 = function () {
                return { content: 'some thing in comp3', name: key3 };
            };
            app.init({ base: mockBase });
            app.load(key1, comp1);
            app.load(comp2);
            app.load(comp3);
            app.components.key1.should.eql(comp1);
            app.components.key2.should.eql(comp2);
            app.components.key3.should.eql(comp3());
        });
        it('should ignore duplicated components', function () {
            let key = 'key';
            let comp1 = new class {
            };
            let comp2 = new class {
            };
            app.init({ base: mockBase });
            app.load(key, comp1);
            app.load(key, comp2);
            app.components[key].should.equal(comp1);
            app.components[key].should.not.equal(comp2);
        });
    });
    describe('#filter', function () {
        it('should add before filter and could fetch it later', function () {
            let filters = [
                function () { console.error('filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.before(filters[i]);
            }
            let filters2 = app.get('__befores__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
        it('should add after filter and could fetch it later', function () {
            let filters = [
                function () { console.error('filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.after(filters[i]);
            }
            let filters2 = app.get('__afters__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
        it('should add filter and could fetch it from before and after filter later', function () {
            let filters = [
                function () { console.error('filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.before(filters[i]);
                app.after(filters[i]);
            }
            let filters2 = app.get('__befores__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
            let filters3 = app.get('__afters__');
            should.exist(filters3);
            filters3.length.should.equal(filters.length);
            for (i = 0, l = filters3.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
    });
    describe('#globalFilter', function () {
        it('should add before global filter and could fetch it later', function () {
            let filters = [
                function () { console.error('global filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.globalBefore(filters[i]);
            }
            let filters2 = app.get('__globalBefores__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
        it('should add after global filter and could fetch it later', function () {
            let filters = [
                function () { console.error('filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.globalAfter(filters[i]);
            }
            let filters2 = app.get('__globalAfters__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
        it('should add filter and could fetch it from before and after filter later', function () {
            let filters = [
                function () { console.error('filter1'); },
                function () { }
            ];
            app.init({ base: mockBase });
            let i, l;
            for (i = 0, l = filters.length; i < l; i++) {
                app.globalBefore(filters[i]);
                app.globalAfter(filters[i]);
            }
            let filters2 = app.get('__globalBefores__');
            should.exist(filters2);
            filters2.length.should.equal(filters.length);
            for (i = 0, l = filters2.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
            let filters3 = app.get('__globalAfters__');
            should.exist(filters3);
            filters3.length.should.equal(filters.length);
            for (i = 0, l = filters3.length; i < l; i++) {
                filters2[i].should.equal(filters[i]);
            }
        });
    });
    describe('#configure', function () {
        it('should execute the code block wtih the right environment', function () {
            let proCount = 0, devCount = 0;
            let proEnv = 'production', devEnv = 'development', serverType = 'server';
            app.init({ base: mockBase });
            app.set('serverType', serverType);
            app.set('env', proEnv);
            app.configure(proEnv, serverType, function () {
                proCount++;
            });
            app.configure(devEnv, serverType, function () {
                devCount++;
            });
            app.set('env', devEnv);
            app.configure(proEnv, serverType, function () {
                proCount++;
            });
            app.configure(devEnv, serverType, function () {
                devCount++;
            });
            proCount.should.equal(1);
            devCount.should.equal(1);
        });
        it('should execute the code block wtih the right server', function () {
            let server1Count = 0, server2Count = 0;
            let proEnv = 'production', serverType1 = 'server1', serverType2 = 'server2';
            app.init({ base: mockBase });
            app.set('serverType', serverType1);
            app.set('env', proEnv);
            app.configure(proEnv, serverType1, function () {
                server1Count++;
            });
            app.configure(proEnv, serverType2, function () {
                server2Count++;
            });
            app.set('serverType', serverType2);
            app.configure(proEnv, serverType1, function () {
                server1Count++;
            });
            app.configure(proEnv, serverType2, function () {
                server2Count++;
            });
            server1Count.should.equal(1);
            server2Count.should.equal(1);
        });
    });
    describe('#route', function () {
        it('should add route record and could fetch it later', function () {
            let type1 = 'area', type2 = 'connector';
            let func1 = function () { console.log('func1'); };
            let func2 = function () { console.log('func2'); };
            app.init({ base: mockBase });
            app.route(type1, func1);
            app.route(type2, func2);
            let routes = app.get('__routes__');
            should.exist(routes);
            func1.should.equal(routes[type1]);
            func2.should.equal(routes[type2]);
        });
    });
    describe('#transaction', function () {
        it('should execute all conditions and handlers', function () {
            let conditions = {
                test1: function (cb) {
                    console.log('condition1');
                    cb();
                },
                test2: function (cb) {
                    console.log('condition2');
                    cb();
                }
            };
            let flag = 1;
            let handlers = {
                do1: function (cb) {
                    console.log('handler1');
                    cb();
                },
                do2: function (cb) {
                    console.log('handler2');
                    if (flag < 3) {
                        flag++;
                        cb(new Error('error'));
                    }
                    else {
                        cb();
                    }
                }
            };
            app.transaction('test', conditions, handlers, 5);
        });
        it('shoud execute conditions with error and do not execute handlers', function () {
            let conditions = {
                test1: function (cb) {
                    console.log('condition1');
                    cb();
                },
                test2: function (cb) {
                    console.log('condition2');
                    cb(new Error('error'));
                },
                test3: function (cb) {
                    console.log('condition3');
                    cb();
                }
            };
            let handlers = {
                do1: function (cb) {
                    console.log('handler1');
                    cb();
                },
                do2: function (cb) {
                    console.log('handler2');
                    cb();
                }
            };
            app.transaction('test', conditions, handlers);
        });
    });
    describe('#add and remove servers', function () {
        it('should add servers and emit event and fetch the new server info by get methods', function (done) {
            let newServers = [
                { id: 'connector-server-1', serverType: 'connecctor', host: '127.0.0.1', port: 1234, clientPort: 3000, frontend: true },
                { id: 'area-server-1', serverType: 'area', host: '127.0.0.1', port: 2234 }
            ];
            app.init({ base: mockBase });
            app.event.on(index_1.events.ADD_SERVERS, function (servers) {
                // check event args
                newServers.should.eql(servers);
                // check servers
                let curServers = app.getServers();
                should.exist(curServers);
                let item, i, l;
                for (i = 0, l = newServers.length; i < l; i++) {
                    item = newServers[i];
                    item.should.eql(curServers[item.id]);
                }
                // check get server by id
                for (i = 0, l = newServers.length; i < l; i++) {
                    item = newServers[i];
                    item.should.eql(app.getServerById(item.id));
                }
                // check server types
                let types = [];
                for (i = 0, l = newServers.length; i < l; i++) {
                    item = newServers[i];
                    if (types.indexOf(item.serverType) < 0) {
                        types.push(item.serverType);
                    }
                }
                let types2 = app.getServerTypes();
                types.length.should.equal(types2.length);
                for (i = 0, l = types.length; i < l; i++) {
                    types2.should.containEql(types[i]);
                }
                // check server type list
                let slist;
                for (i = 0, l = newServers.length; i < l; i++) {
                    item = newServers[i];
                    slist = app.getServersByType(item.serverType);
                    should.exist(slist);
                    contains(slist, item).should.be.true;
                }
                done();
            });
            app.addServers(newServers);
            app.event.removeAllListeners();
        });
        it('should remove server info and emit event', function (done) {
            let newServers = [
                { id: 'connector-server-1', serverType: 'connecctor', host: '127.0.0.1', port: 1234, clientPort: 3000, frontend: true },
                { id: 'area-server-1', serverType: 'area', host: '127.0.0.1', port: 2234 },
                { id: 'path-server-1', serverType: 'path', host: '127.0.0.1', port: 2235 }
            ];
            let destServers = [
                { id: 'connector-server-1', serverType: 'connecctor', host: '127.0.0.1', port: 1234, clientPort: 3000, frontend: true },
                { id: 'path-server-1', serverType: 'path', host: '127.0.0.1', port: 2235 }
            ];
            let delIds = ['area-server-1'];
            let addCount = 0;
            let delCount = 0;
            app.init({ base: mockBase });
            app.event.on(index_1.events.ADD_SERVERS, function (servers) {
                // check event args
                newServers.should.eql(servers);
                addCount++;
            });
            app.event.on(index_1.events.REMOVE_SERVERS, function (ids) {
                delIds.should.eql(ids);
                // check servers
                let curServers = app.getServers();
                should.exist(curServers);
                let item, i, l;
                for (i = 0, l = destServers.length; i < l; i++) {
                    item = destServers[i];
                    item.should.eql(curServers[item.id]);
                }
                // check get server by id
                for (i = 0, l = destServers.length; i < l; i++) {
                    item = destServers[i];
                    item.should.eql(app.getServerById(item.id));
                }
                // check server types
                // NOTICE: server types would not clear when remove server from app
                let types = [];
                for (i = 0, l = newServers.length; i < l; i++) {
                    item = newServers[i];
                    if (types.indexOf(item.serverType) < 0) {
                        types.push(item.serverType);
                    }
                }
                let types2 = app.getServerTypes();
                types.length.should.equal(types2.length);
                for (i = 0, l = types.length; i < l; i++) {
                    types2.should.containEql(types[i]);
                }
                // check server type list
                let slist;
                for (i = 0, l = destServers.length; i < l; i++) {
                    item = destServers[i];
                    slist = app.getServersByType(item.serverType);
                    should.exist(slist);
                    contains(slist, item).should.be.true;
                }
                app.event.removeAllListeners();
                done();
            });
            app.addServers(newServers);
            app.removeServers(delIds);
        });
    });
    describe('#beforeStopHook', function () {
        it('should be called before application stopped.', function (done) {
            let count = 0;
            this.timeout(8888);
            app.init({ base: mockBase });
            app.beforeStopHook(function () {
                count++;
            });
            app.start(function (err) {
                should.not.exist(err);
            });
            setTimeout(function () {
                // wait for after start
                app.stop(false);
                setTimeout(function () {
                    // wait for stop
                    count.should.equal(1);
                    done();
                }, WAIT_TIME);
            }, WAIT_TIME);
        });
    });
    describe('#use', function () {
        it('should exist plugin component and event', function (done) {
            let plugin = {
                name: 'mock-plugin',
                components: [mockPlugin_1.MockPlugin],
                events: [mockEvent_1.MockEvent]
            };
            let opts = {};
            app.use(plugin, opts);
            should.exist(app.event.listeners('bind_session'));
            should.exist(app.components.mockPlugin);
            done();
        });
    });
});
let contains = function (slist, sinfo) {
    for (let i = 0, l = slist.length; i < l; i++) {
        if (slist[i].id === sinfo.id) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi90ZXN0L2FwcGxpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQStEO0FBQy9ELGlDQUFpQztBQUNqQyxvRUFBaUU7QUFDakUsOERBQTJEO0FBSTNELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO0FBRXZDLElBQUksR0FBRyxHQUFHLElBQUksbUJBQVcsRUFBRSxDQUFDO0FBRTVCLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtJQUMzQixTQUFTLENBQUM7UUFDUixHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUNoQixFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLG1DQUFtQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGNBQWMsRUFBRTtRQUN2QixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7WUFFaEQsSUFBSSxHQUFHLEdBQUcsa0JBQWtCLEVBQUUsS0FBSyxHQUFHLFlBQVksQ0FBQztZQUNuRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsSUFBSSxHQUFHLEdBQUcsa0JBQWtCLEVBQUUsS0FBSyxHQUFHLFlBQVksQ0FBQztZQUNuRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDcEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQUksR0FBRyxHQUFHLGlCQUFpQixDQUFDO1lBQzVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDakMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztZQUVqQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7WUFDaEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUVsQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDakMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMscUdBQXFHLEVBQUUsVUFBVSxJQUFlO1lBQ2pJLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRSxlQUFlLEdBQUcsQ0FBQyxFQUFFLFNBQVMsR0FBRyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNsQixJQUFJLGFBQWEsR0FBRztnQkFDbEIsSUFBSSxFQUFHLGVBQWU7Z0JBQ3RCLEtBQUssRUFBRSxVQUFVLEVBQVk7b0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7b0JBQzdCLFVBQVUsRUFBRSxDQUFDO29CQUNiLEVBQUUsRUFBRSxDQUFDO2dCQUNQLENBQUM7Z0JBRUQsVUFBVSxFQUFFLFVBQVUsRUFBWTtvQkFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO29CQUNsQyxlQUFlLEVBQUUsQ0FBQztvQkFDbEIsRUFBRSxFQUFFLENBQUM7Z0JBQ1AsQ0FBQztnQkFFRCxJQUFJLEVBQUUsVUFBVSxLQUFVLEVBQUUsRUFBWTtvQkFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztvQkFDNUIsU0FBUyxFQUFFLENBQUM7b0JBQ1osRUFBRSxFQUFFLENBQUM7Z0JBQ1AsQ0FBQzthQUNGLENBQUM7WUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDN0IsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBVTtnQkFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxVQUFVLENBQUM7Z0JBQ1QsdUJBQXVCO2dCQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUVoQixVQUFVLENBQUM7b0JBQ1QsZ0JBQWdCO29CQUNoQixVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDM0IsZUFBZSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxQixJQUFJLEVBQUUsQ0FBQztnQkFDVCxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDaEIsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO1lBQ2hGLElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxLQUFLLEdBQUcsSUFBSTthQUE4RSxDQUFDO1lBQzlHLElBQUksS0FBSyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsQ0FBQztZQUM3RCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUM7WUFDbEIsSUFBSSxLQUFLLEdBQUc7Z0JBQ1YsT0FBTyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7WUFDeEQsQ0FBQyxDQUFDO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVoQixHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDdEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztZQUNoQixJQUFJLEtBQUssR0FBRyxJQUFJO2FBQStFLENBQUM7WUFDaEcsSUFBSSxLQUFLLEdBQUcsSUFBSTthQUErRSxDQUFDO1lBRWhHLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM3QixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNyQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVyQixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsbURBQW1ELEVBQUU7WUFDdEQsSUFBSSxPQUFPLEdBQUc7Z0JBQ1osY0FBYyxPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekMsY0FBYyxDQUFDO2FBQ2hCLENBQUM7WUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEI7WUFFRCxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFJLE9BQU8sR0FBRztnQkFDWixjQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxjQUFjLENBQUM7YUFDaEIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN2QjtZQUVELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlFQUF5RSxFQUFFO1lBQzVFLElBQUksT0FBTyxHQUFHO2dCQUNaLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLGNBQWMsQ0FBQzthQUNoQixDQUFDO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNULEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3ZCO1lBRUQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzdELElBQUksT0FBTyxHQUFHO2dCQUNaLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEQsY0FBYyxDQUFDO2FBQ2hCLENBQUM7WUFFRixHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ1QsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUI7WUFFRCxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QixRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMzQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0QztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1lBQzVELElBQUksT0FBTyxHQUFHO2dCQUNaLGNBQWMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLGNBQWMsQ0FBQzthQUNoQixDQUFDO1lBRUYsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBRTdCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNULEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxQyxHQUFHLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdCO1lBRUQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtZQUM1RSxJQUFJLE9BQU8sR0FBRztnQkFDWixjQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxjQUFjLENBQUM7YUFDaEIsQ0FBQztZQUVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUU3QixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDVCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDN0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM3QjtZQUVELElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzNDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBRUQsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDM0MsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsMERBQTBELEVBQUU7WUFDN0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQUcsWUFBWSxFQUFFLE1BQU0sR0FBRyxhQUFhLEVBQUUsVUFBVSxHQUFHLFFBQVEsQ0FBQztZQUV6RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUNoQyxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUNoQyxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUNoQyxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUNoQyxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDdkMsSUFBSSxNQUFNLEdBQUcsWUFBWSxFQUFFLFdBQVcsR0FBRyxTQUFTLEVBQUUsV0FBVyxHQUFHLFNBQVMsQ0FBQztZQUU1RSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDN0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDbkMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFdkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO2dCQUNqQyxZQUFZLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUVILEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRTtnQkFDakMsWUFBWSxFQUFFLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFFSCxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztZQUVuQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUU7Z0JBQ2pDLFlBQVksRUFBRSxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFO2dCQUNqQyxZQUFZLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUVILFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLFlBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyxrREFBa0QsRUFBRTtZQUNyRCxJQUFJLEtBQUssR0FBRyxNQUFNLEVBQUUsS0FBSyxHQUFHLFdBQVcsQ0FBQztZQUN4QyxJQUFJLEtBQUssR0FBRyxjQUFjLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxLQUFLLEdBQUcsY0FBYyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRWxELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUU3QixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV4QixJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsRUFBRSxDQUFDLDRDQUE0QyxFQUFFO1lBQy9DLElBQUksVUFBVSxHQUFHO2dCQUNmLEtBQUssRUFBRSxVQUFVLEVBQVk7b0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzFCLEVBQUUsRUFBRSxDQUFDO2dCQUNQLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLFVBQVUsRUFBWTtvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxFQUFFLENBQUM7Z0JBQ1AsQ0FBQzthQUNGLENBQUM7WUFDRixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7WUFDYixJQUFJLFFBQVEsR0FBRztnQkFDYixHQUFHLEVBQUUsVUFBVSxFQUFZO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN4QixFQUFFLEVBQUUsQ0FBQztnQkFDUCxDQUFDO2dCQUNELEdBQUcsRUFBRSxVQUFVLEVBQVk7b0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3hCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTt3QkFDWixJQUFJLEVBQUUsQ0FBQzt3QkFDUCxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztxQkFDeEI7eUJBQU07d0JBQ0wsRUFBRSxFQUFFLENBQUM7cUJBQ047Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlFQUFpRSxFQUFFO1lBQ3BFLElBQUksVUFBVSxHQUFHO2dCQUNmLEtBQUssRUFBRSxVQUFVLEVBQVk7b0JBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7b0JBQzFCLEVBQUUsRUFBRSxDQUFDO2dCQUNQLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLFVBQVUsRUFBWTtvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLFVBQVUsRUFBWTtvQkFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztvQkFDMUIsRUFBRSxFQUFFLENBQUM7Z0JBQ1AsQ0FBQzthQUNGLENBQUM7WUFDRixJQUFJLFFBQVEsR0FBRztnQkFDYixHQUFHLEVBQUUsVUFBVSxFQUFZO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN4QixFQUFFLEVBQUUsQ0FBQztnQkFDUCxDQUFDO2dCQUNELEdBQUcsRUFBRSxVQUFVLEVBQVk7b0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3hCLEVBQUUsRUFBRSxDQUFDO2dCQUNQLENBQUM7YUFDRixDQUFDO1lBQ0YsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsRUFBRSxDQUFDLGdGQUFnRixFQUFFLFVBQVUsSUFBZTtZQUM1RyxJQUFJLFVBQVUsR0FBRztnQkFDZixFQUFFLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQ3ZILEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTthQUMzRSxDQUFDO1lBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQzdCLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGNBQU0sQ0FBQyxXQUFXLEVBQUUsVUFBVSxPQUFzQztnQkFDL0UsbUJBQW1CO2dCQUNuQixVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFL0IsZ0JBQWdCO2dCQUNoQixJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEM7Z0JBRUQseUJBQXlCO2dCQUN6QixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDN0MsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0M7Z0JBRUQscUJBQXFCO2dCQUNyQixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7Z0JBQ2YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO3dCQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDN0I7aUJBQ0Y7Z0JBQ0QsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO2dCQUNsQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN6QyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDeEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BDO2dCQUVELHlCQUF5QjtnQkFDekIsSUFBSSxLQUFLLENBQUM7Z0JBQ1YsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzdDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEtBQUssR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNwQixRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2lCQUN0QztnQkFFRCxJQUFJLEVBQUUsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsVUFBVSxJQUFlO1lBQ3RFLElBQUksVUFBVSxHQUFHO2dCQUNmLEVBQUUsRUFBRSxFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDdkgsRUFBRSxFQUFFLEVBQUUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO2dCQUMxRSxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7YUFDM0UsQ0FBQztZQUNGLElBQUksV0FBVyxHQUFHO2dCQUNoQixFQUFFLEVBQUUsRUFBRSxvQkFBb0IsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Z0JBQ3ZILEVBQUUsRUFBRSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTthQUMzRSxDQUFDO1lBQ0YsSUFBSSxNQUFNLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMvQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7WUFDakIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO1lBRWpCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM3QixHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFNLENBQUMsV0FBVyxFQUFFLFVBQVUsT0FBc0M7Z0JBQy9FLG1CQUFtQjtnQkFDbkIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9CLFFBQVEsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7WUFFSCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxjQUFNLENBQUMsY0FBYyxFQUFFLFVBQVUsR0FBa0I7Z0JBQzlELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUV2QixnQkFBZ0I7Z0JBQ2hCLElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDekIsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDZixLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDOUMsSUFBSSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUN0QztnQkFFRCx5QkFBeUI7Z0JBQ3pCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5QyxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUM3QztnQkFFRCxxQkFBcUI7Z0JBQ3JCLG1FQUFtRTtnQkFDbkUsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM3QyxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTt3QkFDdEMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7cUJBQzdCO2lCQUNGO2dCQUNELElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDekMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQztnQkFFRCx5QkFBeUI7Z0JBQ3pCLElBQUksS0FBSyxDQUFDO2dCQUNWLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUM5QyxJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0QixLQUFLLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDOUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDcEIsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQztpQkFDdEM7Z0JBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxDQUFBO2dCQUM5QixJQUFJLEVBQUUsQ0FBQztZQUNULENBQUMsQ0FBQyxDQUFDO1lBRUgsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQixHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsRUFBRSxDQUFDLDhDQUE4QyxFQUFFLFVBQVUsSUFBZTtZQUMxRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7WUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ2xCLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUM3QixHQUFHLENBQUMsY0FBYyxDQUFDO2dCQUNqQixLQUFLLEVBQUUsQ0FBQztZQUNWLENBQUMsQ0FBQyxDQUFDO1lBQ0gsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQVU7Z0JBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1lBRUgsVUFBVSxDQUFDO2dCQUNULHVCQUF1QjtnQkFDdkIsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFFaEIsVUFBVSxDQUFDO29CQUNULGdCQUFnQjtvQkFDaEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RCLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNoQixDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFDZixFQUFFLENBQUMseUNBQXlDLEVBQUUsVUFBVSxJQUFlO1lBQ3JFLElBQUksTUFBTSxHQUFHO2dCQUNYLElBQUksRUFBRSxhQUFhO2dCQUNuQixVQUFVLEVBQUUsQ0FBQyx1QkFBVSxDQUFDO2dCQUN4QixNQUFNLEVBQUUsQ0FBQyxxQkFBUyxDQUFDO2FBQ3BCLENBQUM7WUFDRixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbEQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hDLElBQUksRUFBRSxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxRQUFRLEdBQUcsVUFBVSxLQUFvQyxFQUFFLEtBQTZCO0lBQzFGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUMifQ==