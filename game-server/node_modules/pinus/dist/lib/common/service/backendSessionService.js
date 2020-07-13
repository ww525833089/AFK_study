"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * backend session service for backend session
 */
const utils = require("../../util/utils");
let EXPORTED_FIELDS = ['id', 'frontendId', 'uid', 'settings'];
/**
 * Service that maintains backend sessions and the communication with frontend
 * servers.
 *
 * BackendSessionService would be created in each server process and maintains
 * backend sessions for current process and communicates with the relative
 * frontend servers.
 *
 * BackendSessionService instance could be accessed by
 * `app.get('backendSessionService')` or app.backendSessionService.
 *
 * @class
 * @constructor
 */
class BackendSessionService {
    constructor(app) {
        this.aget = utils.promisify(this.get.bind(this));
        this.agetByUid = utils.promisify(this.getByUid.bind(this));
        this.akickBySid = utils.promisify(this.kickBySid.bind(this));
        this.akickByUid = utils.promisify(this.kickByUid.bind(this));
        this.abind = utils.promisify(this.bind.bind(this));
        this.aunbind = utils.promisify(this.unbind.bind(this));
        this.apush = utils.promisify(this.push.bind(this));
        this.apushAll = utils.promisify(this.pushAll.bind(this));
        this.app = app;
    }
    create(opts) {
        if (!opts) {
            throw new Error('opts should not be empty.');
        }
        return new BackendSession(opts, this);
    }
    /**
     * Get backend session by frontend server id and session id.
     *
     * @param  {String}   frontendId frontend server id that session attached
     * @param  {String}   sid        session id
     * @param  {Function} cb         callback function. args: cb(err, BackendSession)
     *
     * @memberOf BackendSessionService
     */
    get(frontendId, sid, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'getBackendSessionBySid';
        let args = [sid];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, BackendSessionCB.bind(null, this, cb));
    }
    /**
     * Get backend sessions by frontend server id and user id.
     *
     * @param  {String}   frontendId frontend server id that session attached
     * @param  {String}   uid        user id binded with the session
     * @param  {Function} cb         callback function. args: cb(err, BackendSessions)
     *
     * @memberOf BackendSessionService
     */
    getByUid(frontendId, uid, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'getBackendSessionsByUid';
        let args = [uid];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, BackendSessionCB.bind(null, this, cb));
    }
    kickBySid(frontendId, sid, reason, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'kickBySid';
        let args = [sid];
        if (typeof reason === 'function') {
            cb = reason;
        }
        else {
            args.push(reason);
        }
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
    /**
     * Kick sessions by user id.
     *
     * @param  {String}          frontendId cooperating frontend server id
     * @param  {Number|String}   uid        user id
     * @param  {String}          reason     kick reason
     * @param  {Function}        cb         callback function
     *
     * @memberOf BackendSessionService
     */
    kickByUid(frontendId, uid, reason, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'kickByUid';
        let args = [uid];
        if (typeof reason === 'function') {
            cb = reason;
        }
        else {
            args.push(reason);
        }
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
    /**
     * Bind the session with the specified user id. It would finally invoke the
     * the sessionService.bind in the cooperating frontend server.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   uid        user id
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    bind(frontendId, sid, uid, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'bind';
        let args = [sid, uid];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
    /**
     * Unbind the session with the specified user id. It would finally invoke the
     * the sessionService.unbind in the cooperating frontend server.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   uid        user id
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    unbind(frontendId, sid, uid, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'unbind';
        let args = [sid, uid];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
    /**
     * Push the specified customized change to the frontend internal session.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {String}   key        key in session that should be push
     * @param  {Object}   value      value in session, primitive js object
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    push(frontendId, sid, key, value, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'push';
        let args = [sid, key, value];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
    /**
     * Push all the customized changes to the frontend internal session.
     *
     * @param  {String}   frontendId cooperating frontend server id
     * @param  {Number}   sid        session id
     * @param  {Object}   settings   key/values in session that should be push
     * @param  {Function} cb         callback function
     *
     * @memberOf BackendSessionService
     * @api private
     */
    pushAll(frontendId, sid, settings, cb) {
        let namespace = 'sys';
        let service = 'sessionRemote';
        let method = 'pushAll';
        let args = [sid, settings];
        rpcInvoke(this.app, frontendId, namespace, service, method, args, cb);
    }
}
exports.BackendSessionService = BackendSessionService;
let rpcInvoke = function (app, sid, namespace, service, method, args, cb) {
    app.rpcInvoke(sid, { namespace: namespace, service: service, method: method, args: args }, cb);
};
/**
 * BackendSession is the proxy for the frontend internal session passed to handlers and
 * it helps to keep the key/value pairs for the server locally.
 * Internal session locates in frontend server and should not be accessed directly.
 *
 * The mainly operation on backend session should be read and any changes happen in backend
 * session is local and would be discarded in next request. You have to push the
 * changes to the frontend manually if necessary. Any push would overwrite the last push
 * of the same key silently and the changes would be saw in next request.
 * And you have to make sure the transaction outside if you would push the session
 * concurrently in different processes.
 *
 * See the api below for more details.
 *
 * @class
 * @constructor
 */
class BackendSession {
    constructor(opts, service) {
        for (let f in opts) {
            this[f] = opts[f];
        }
        this.__sessionService__ = service;
    }
    /**
     * Bind current session with the user id. It would push the uid to frontend
     * server and bind  uid to the frontend internal session.
     *
     * @param  {Number|String}   uid user id
     * @param  {Function} cb  callback function
     *
     * @memberOf BackendSession
     */
    bind(uid, cb) {
        let self = this;
        this.__sessionService__.bind(this.frontendId, this.id, uid, function (err) {
            if (!err) {
                self.uid = uid;
            }
            utils.invokeCallback(cb, err);
        });
    }
    /**
     * Unbind current session with the user id. It would push the uid to frontend
     * server and unbind uid from the frontend internal session.
     *
     * @param  {Number|String}   uid user id
     * @param  {Function} cb  callback function
     *
     * @memberOf BackendSession
     */
    unbind(uid, cb) {
        let self = this;
        this.__sessionService__.unbind(this.frontendId, this.id, uid, function (err) {
            if (!err) {
                self.uid = null;
            }
            utils.invokeCallback(cb, err);
        });
    }
    /**
     * Set the key/value into backend session.
     *
     * @param {String} key   key
     * @param {Object} value value
     */
    set(key, value) {
        this.settings[key] = value;
    }
    /**
     * Get the value from backend session by key.
     *
     * @param  {String} key key
     * @return {Object}     value
     */
    get(key) {
        return this.settings[key];
    }
    /**
     * Push the key/value in backend session to the front internal session.
     *
     * @param  {String}   key key
     * @param  {Function} cb  callback function
     */
    push(key, cb) {
        this.__sessionService__.push(this.frontendId, this.id, key, this.get(key), cb);
    }
    /**
     * Push all the key/values in backend session to the frontend internal session.
     *
     * @param  {Function} cb callback function
     */
    pushAll(cb) {
        this.__sessionService__.pushAll(this.frontendId, this.id, this.settings, cb);
    }
    abind(uid) {
        return new Promise((resolve, reject) => this.bind(uid, (err, ret) => err ? reject(err) : resolve(ret)));
    }
    aunbind(uid) {
        return new Promise((resolve, reject) => this.unbind(uid, (err, ret) => err ? reject(err) : resolve(ret)));
    }
    apush(key) {
        return new Promise((resolve, reject) => this.push(key, (err, ret) => err ? reject(err) : resolve(ret)));
    }
    apushAll() {
        return new Promise((resolve, reject) => this.pushAll((err, ret) => err ? reject(err) : resolve(ret)));
    }
    // abind = utils.promisify(this.bind.bind(this));
    // aunbind = utils.promisify(this.unbind.bind(this));
    // apush = utils.promisify(this.push.bind(this));
    // apushAll = utils.promisify(this.pushAll.bind(this));
    /**
     * Export the key/values for serialization.
     *
     * @api private
     */
    export() {
        let res = {};
        EXPORTED_FIELDS.forEach((field) => {
            res[field] = this[field];
        });
        return res;
    }
}
exports.BackendSession = BackendSession;
let BackendSessionCB = function (service, cb, err, sinfo) {
    if (err) {
        utils.invokeCallback(cb, err);
        return;
    }
    if (!sinfo) {
        utils.invokeCallback(cb);
        return;
    }
    let sessions = [];
    if (Array.isArray(sinfo)) {
        // #getByUid
        for (let i = 0, k = sinfo.length; i < k; i++) {
            sessions.push(service.create(sinfo[i]));
        }
        utils.invokeCallback(cb, null, sessions);
    }
    else {
        // #get
        let session = service.create(sinfo);
        utils.invokeCallback(cb, null, session);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZFNlc3Npb25TZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2NvbW1vbi9zZXJ2aWNlL2JhY2tlbmRTZXNzaW9uU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOztHQUVHO0FBQ0gsMENBQTBDO0FBTTFDLElBQUksZUFBZSxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFOUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILE1BQWEscUJBQXFCO0lBSTlCLFlBQVksR0FBZ0I7UUE0SzVCLFNBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUMsY0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RCxlQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3hELGVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDeEQsVUFBSyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM5QyxZQUFPLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xELFVBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FB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