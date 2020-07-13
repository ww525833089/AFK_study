"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const countDownLatch = require("../../util/countDownLatch");
const utils = require("../../util/utils");
const channelRemote_1 = require("../remote/frontend/channelRemote");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * constant
 */
let ST_INITED = 0;
let ST_DESTROYED = 1;
/**
 * Create and maintain channels for server local.
 *
 * ChannelService is created by channel component which is a default loaded
 * component of pinus and channel service would be accessed by `app.get('channelService')`.
 *
 * @class
 * @constructor
 */
class ChannelService {
    constructor(app, opts) {
        this.apushMessageByUids = utils.promisify(this.pushMessageByUids);
        this.abroadcast = utils.promisify(this.broadcast);
        opts = opts || {};
        this.app = app;
        this.channels = {};
        this.prefix = opts.prefix;
        this.store = opts.store;
        this.broadcastFilter = opts.broadcastFilter;
        this.channelRemote = new channelRemote_1.ChannelRemote(app);
    }
    start(cb) {
        restoreChannel(this, cb);
    }
    /**
     * Create channel with name.
     *
     * @param {String} name channel's name
     * @memberOf ChannelService
     */
    createChannel(name) {
        if (this.channels[name]) {
            return this.channels[name];
        }
        let c = new Channel(name, this);
        addToStore(this, genKey(this), genKey(this, name));
        this.channels[name] = c;
        return c;
    }
    /**
     * Get channel by name.
     *
     * @param {String} name channel's name
     * @param {Boolean} create if true, create channel
     * @return {Channel}
     * @memberOf ChannelService
     */
    getChannel(name, create) {
        let channel = this.channels[name];
        if (!channel && !!create) {
            channel = this.channels[name] = new Channel(name, this);
            addToStore(this, genKey(this), genKey(this, name));
        }
        return channel;
    }
    /**
     * Destroy channel by name.
     *
     * @param {String} name channel name
     * @memberOf ChannelService
     */
    destroyChannel(name) {
        delete this.channels[name];
        removeFromStore(this, genKey(this), genKey(this, name));
        removeAllFromStore(this, genKey(this, name));
    }
    pushMessageByUids(route, msg, uids, opts, cb) {
        if (typeof route !== 'string') {
            cb = opts;
            opts = uids;
            uids = msg;
            msg = route;
            route = msg.route;
        }
        if (!cb && typeof opts === 'function') {
            cb = opts;
            opts = {};
        }
        if (!uids || uids.length === 0) {
            utils.invokeCallback(cb, new Error('uids should not be empty'));
            return;
        }
        let groups = {}, record;
        for (let i = 0, l = uids.length; i < l; i++) {
            record = uids[i];
            add(record.uid, record.sid, groups);
        }
        sendMessageByGroup(this, route, msg, groups, opts, cb);
    }
    broadcast(stype, route, msg, opts, cb) {
        let app = this.app;
        let namespace = 'sys';
        let service = 'channelRemote';
        let method = 'broadcast';
        let servers = app.getServersByType(stype);
        if (!servers || servers.length === 0) {
            // server list is empty
            utils.invokeCallback(cb);
            return;
        }
        if (!cb && typeof opts === 'function') {
            cb = opts;
            opts = undefined;
        }
        let count = servers.length;
        let successFlag = false;
        let latch = countDownLatch.createCountDownLatch(count, function () {
            if (!successFlag) {
                utils.invokeCallback(cb, new Error('broadcast fails'));
                return;
            }
            utils.invokeCallback(cb, null);
        });
        let genCB = function (serverId) {
            return function (err) {
                if (err) {
                    logger.error('[broadcast] fail to push message to serverId: ' + serverId + ', err:' + err.stack);
                    latch.done();
                    return;
                }
                successFlag = true;
                latch.done();
            };
        };
        opts = { type: 'broadcast', userOptions: opts || {} };
        // for compatiblity
        opts.isBroadcast = true;
        if (opts.userOptions) {
            opts.binded = opts.userOptions.binded;
            opts.filterParam = opts.userOptions.filterParam;
        }
        let self = this;
        let sendMessage = function (serverId) {
            return (function () {
                if (serverId === app.serverId) {
                    self.channelRemote[method](route, msg, opts).then(() => genCB(serverId)(null)).catch((err) => genCB(serverId)(err));
                }
                else {
                    app.rpcInvoke(serverId, {
                        namespace: namespace, service: service,
                        method: method, args: [route, msg, opts]
                    }, genCB(serverId));
                }
            }());
        };
        for (let i = 0, l = count; i < l; i++) {
            sendMessage(servers[i].id);
        }
    }
}
exports.ChannelService = ChannelService;
/**
 * Channel maintains the receiver collection for a subject. You can
 * add users into a channel and then broadcast message to them by channel.
 *
 * @class channel
 * @constructor
 */
class Channel {
    constructor(name, service) {
        this.apushMessage = utils.promisify(this.pushMessage);
        this.name = name;
        this.groups = {}; // group map for uids. key: sid, value: [uid]
        this.records = {}; // member records. key: uid
        this.__channelService__ = service;
        this.state = ST_INITED;
        this.userAmount = 0;
    }
    /**
     * Add user to channel.
     *
     * @param {Number} uid user id
     * @param {String} sid frontend server id which user has connected to
     */
    add(uid, sid) {
        if (this.state > ST_INITED) {
            return false;
        }
        else {
            let res = add(uid, sid, this.groups);
            if (res) {
                this.records[uid] = { sid: sid, uid: uid };
                this.userAmount = this.userAmount + 1;
                addToStore(this.__channelService__, genKey(this.__channelService__, this.name), genValue(sid, uid));
            }
            return res;
        }
    }
    /**
     * Remove user from channel.
     *
     * @param {Number} uid user id
     * @param {String} sid frontend server id which user has connected to.
     * @return [Boolean] true if success or false if fail
     */
    leave(uid, sid) {
        if (!uid || !sid) {
            return false;
        }
        let res = deleteFrom(uid, sid, this.groups[sid]);
        if (res) {
            delete this.records[uid];
            this.userAmount = this.userAmount - 1;
            removeFromStore(this.__channelService__, genKey(this.__channelService__, this.name), genValue(sid, uid));
        }
        if (this.userAmount < 0)
            this.userAmount = 0; // robust
        if (this.groups[sid] && this.groups[sid].length === 0) {
            delete this.groups[sid];
        }
        return res;
    }
    /**
     * Get channel UserAmount in a channel.
     *
     * @return {number } channel member amount
     */
    getUserAmount() {
        return this.userAmount;
    }
    /**
     * Get channel members.
     *
     * <b>Notice:</b> Heavy operation.
     *
     * @return {Array} channel member uid list
     */
    getMembers() {
        let res = [], groups = this.groups;
        let group, i, l;
        for (let sid in groups) {
            group = groups[sid];
            for (i = 0, l = group.length; i < l; i++) {
                res.push(group[i]);
            }
        }
        return res;
    }
    /**
     * Get Member info.
     *
     * @param  {String} uid user id
     * @return {Object} member info
     */
    getMember(uid) {
        return this.records[uid];
    }
    /**
     * Remove member by uid
     * @param uid member to removed
     */
    removeMember(uid) {
        let member = this.getMember(uid);
        if (member)
            return this.leave(member.uid, member.sid);
        else
            return false;
    }
    /**
     * Destroy channel.
     */
    destroy() {
        this.state = ST_DESTROYED;
        this.__channelService__.destroyChannel(this.name);
    }
    /**
     * Push message to all the members in the channel
     *
     * @param {String} route message route
     * @param {Object} msg message that would be sent to client
     * @param {Object} opts user-defined push options, optional
     * @param {Function} cb callback function
     */
    pushMessage(route, msg, opts, cb) {
        if (this.state !== ST_INITED) {
            utils.invokeCallback(cb, new Error('channel is not running now'));
            return;
        }
        if (typeof route !== 'string') {
            cb = opts;
            opts = msg;
            msg = route;
            route = msg.route;
        }
        if (!cb && typeof opts === 'function') {
            cb = opts;
            opts = {};
        }
        sendMessageByGroup(this.__channelService__, route, msg, this.groups, opts, cb);
    }
}
exports.Channel = Channel;
/**
 * add uid and sid into group. ignore any uid that uid not specified.
 *
 * @param uid user id
 * @param sid server id
 * @param groups {Object} grouped uids, , key: sid, value: [uid]
 */
let add = function (uid, sid, groups) {
    if (!sid) {
        logger.warn('ignore uid %j for sid not specified.', uid);
        return false;
    }
    let group = groups[sid];
    if (!group) {
        group = [];
        groups[sid] = group;
    }
    group.push(uid);
    return true;
};
/**
 * delete element from array
 */
let deleteFrom = function (uid, sid, group) {
    if (!uid || !sid || !group) {
        return false;
    }
    for (let i = 0, l = group.length; i < l; i++) {
        if (group[i] === uid) {
            group.splice(i, 1);
            return true;
        }
    }
    return false;
};
/**
 * push message by group
 *
 * @param route {String} route route message
 * @param msg {Object} message that would be sent to client
 * @param groups {Object} grouped uids, , key: sid, value: [uid]
 * @param opts {Object} push options
 * @param cb {Function} cb(err)
 *
 * @api private
 */
let sendMessageByGroup = function (channelService, route, msg, groups, opts, cb) {
    let app = channelService.app;
    let namespace = 'sys';
    let service = 'channelRemote';
    let method = 'pushMessage';
    let count = Object.keys(groups).length;
    let successFlag = false;
    let failIds = [];
    logger.debug('[%s] channelService sendMessageByGroup route: %s, msg: %j, groups: %j, opts: %j', app.serverId, route, msg, groups, opts);
    if (count === 0) {
        // group is empty
        utils.invokeCallback(cb);
        return;
    }
    let latch = countDownLatch.createCountDownLatch(count, function () {
        if (!successFlag) {
            utils.invokeCallback(cb, new Error('all uids push message fail'));
            return;
        }
        utils.invokeCallback(cb, null, failIds);
    });
    let rpcCB = function (serverId) {
        return function (err, fails) {
            if (err) {
                logger.error('[pushMessage] fail to dispatch msg to serverId: ' + serverId + ', err:' + err.stack);
                latch.done();
                return;
            }
            if (fails) {
                failIds = failIds.concat(fails);
            }
            successFlag = true;
            latch.done();
        };
    };
    opts = { type: 'push', userOptions: opts || {} };
    // for compatiblity
    opts.isPush = true;
    let sendMessage = function (sid) {
        return (function () {
            if (sid === app.serverId) {
                channelService.channelRemote[method](route, msg, groups[sid], opts).then((fails) => {
                    rpcCB(sid)(null, fails);
                }, (err) => {
                    rpcCB(sid)(err, null);
                });
            }
            else {
                app.rpcInvoke(sid, {
                    namespace: namespace, service: service,
                    method: method, args: [route, msg, groups[sid], opts]
                }, rpcCB(sid));
            }
        })();
    };
    let group;
    for (let sid in groups) {
        group = groups[sid];
        if (group && group.length > 0) {
            sendMessage(sid);
        }
        else {
            // empty group
            process.nextTick(rpcCB(sid));
        }
    }
};
let restoreChannel = function (self, cb) {
    if (!self.store) {
        utils.invokeCallback(cb);
        return;
    }
    else {
        loadAllFromStore(self, genKey(self), function (err, list) {
            if (!!err) {
                utils.invokeCallback(cb, err);
                return;
            }
            else {
                if (!list.length || !Array.isArray(list)) {
                    utils.invokeCallback(cb);
                    return;
                }
                let load = function (key, name) {
                    return (function () {
                        let channelName = name;
                        loadAllFromStore(self, key, function (err, items) {
                            for (let j = 0; j < items.length; j++) {
                                let array = items[j].split(':');
                                let sid = array[0];
                                let uid = array[1];
                                let channel = self.channels[channelName];
                                let res = add(uid, sid, channel.groups);
                                if (res) {
                                    channel.records[uid] = { sid: sid, uid: uid };
                                }
                            }
                        });
                    })();
                };
                for (let i = 0; i < list.length; i++) {
                    let name = list[i].slice(genKey(self).length + 1);
                    self.channels[name] = new Channel(name, self);
                    load(list[i], name);
                }
                utils.invokeCallback(cb);
            }
        });
    }
};
let addToStore = function (self, key, value) {
    if (!!self.store) {
        self.store.add(key, value, function (err) {
            if (!!err) {
                logger.error('add key: %s value: %s to store, with err: %j', key, value, err);
            }
        });
    }
};
let removeFromStore = function (self, key, value) {
    if (!!self.store) {
        self.store.remove(key, value, function (err) {
            if (!!err) {
                logger.error('remove key: %s value: %s from store, with err: %j', key, value, err);
            }
        });
    }
};
let loadAllFromStore = function (self, key, cb) {
    if (!!self.store) {
        self.store.load(key, function (err, list) {
            if (!!err) {
                logger.error('load key: %s from store, with err: %j', key, err);
                utils.invokeCallback(cb, err);
            }
            else {
                utils.invokeCallback(cb, null, list);
            }
        });
    }
};
let removeAllFromStore = function (self, key) {
    if (!!self.store) {
        self.store.removeAll(key, function (err) {
            if (!!err) {
                logger.error('remove key: %s all members from store, with err: %j', key, err);
            }
        });
    }
};
let genKey = function (self, name) {
    if (!!name) {
        return self.prefix + ':' + self.app.serverId + ':' + name;
    }
    else {
        return self.prefix + ':' + self.app.serverId;
    }
};
let genValue = function (sid, uid) {
    return sid + ':' + uid;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29tbW9uL3NlcnZpY2UvY2hhbm5lbFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBNEQ7QUFDNUQsMENBQTBDO0FBQzFDLG9FQUFpRTtBQUNqRSwrQ0FBeUM7QUFNekMsNkJBQTZCO0FBRTdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUUzRDs7R0FFRztBQUNILElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7QUFRckI7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLGNBQWM7SUFTdkIsWUFBWSxHQUFnQixFQUFFLElBQTZCO1FBdUwzRCx1QkFBa0IsR0FBb0csS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM5SixlQUFVLEdBQTBFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBdkxoSCxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDeEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSw2QkFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFHRCxLQUFLLENBQUMsRUFBeUI7UUFDM0IsY0FBYyxD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