"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const pinus_logger_1 = require("pinus-logger");
const utils = require("../../util/utils");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let FRONTEND_SESSION_FIELDS = ['id', 'frontendId', 'uid', '__sessionService__'];
let EXPORTED_SESSION_FIELDS = ['id', 'frontendId', 'uid', 'settings'];
let ST_INITED = 0;
let ST_CLOSED = 1;
/**
 * Session service maintains the internal session for each client connection.
 *
 * Session service is created by session component and is only
 * <b>available</b> in frontend servers. You can access the service by
 * `app.get('sessionService')` or `app.sessionService` in frontend servers.
 *
 * @param {Object} opts constructor parameters
 * @class
 * @constructor
 */
class SessionService {
    constructor(opts) {
        this.akick = utils.promisify(this.kick.bind(this));
        this.akickBySessionId = utils.promisify(this.kickBySessionId.bind(this));
        this.abind = utils.promisify(this.bind.bind(this));
        this.aunbind = utils.promisify(this.unbind.bind(this));
        this.aimport = utils.promisify(this.import.bind(this));
        this.aimportAll = utils.promisify(this.importAll.bind(this));
        opts = opts || {};
        this.singleSession = opts.singleSession;
        this.sessions = {}; // sid -> session
        this.uidMap = {}; // uid -> sessions
    }
    /**
     * Create and return internal session.
     *
     * @param {Integer} sid uniqe id for the internal session
     * @param {String} frontendId frontend server in which the internal session is created
     * @param {Object} socket the underlying socket would be held by the internal session
     *
     * @return {Session}
     *
     * @memberOf SessionService
     * @api private
     */
    create(sid, frontendId, socket) {
        let session = new Session(sid, frontendId, socket, this);
        this.sessions[session.id] = session;
        return session;
    }
    /**
     * Bind the session with a user id.
     *
     * @memberOf SessionService
     * @api private
     */
    bind(sid, uid, cb) {
        let session = this.sessions[sid];
        if (!session) {
            process.nextTick(function () {
                cb(new Error('session does not exist, sid: ' + sid));
            });
            return;
        }
        if (session.uid) {
            if (session.uid === uid) {
                // already bound with the same uid
                cb(null);
                return;
            }
            // already bound with other uid
            process.nextTick(function () {
                cb(new Error('session has already bound with ' + session.uid));
            });
            return;
        }
        let sessions = this.uidMap[uid];
        if (!!this.singleSession && !!sessions) {
            process.nextTick(function () {
                cb(new Error('singleSession is enabled, and session has already bound with uid: ' + uid));
            });
            return;
        }
        if (!sessions) {
            sessions = this.uidMap[uid] = [];
        }
        for (let i = 0, l = sessions.length; i < l; i++) {
            // session has binded with the uid
            if (sessions[i].id === session.id) {
                process.nextTick(cb);
                return;
            }
        }
        sessions.push(session);
        session.bind(uid);
        if (cb) {
            process.nextTick(cb);
        }
    }
    /**
     * Unbind a session with the user id.
     *
     * @memberOf SessionService
     * @api private
     */
    unbind(sid, uid, cb) {
        let session = this.sessions[sid];
        if (!session) {
            process.nextTick(function () {
                cb(new Error('session does not exist, sid: ' + sid));
            });
            return;
        }
        if (!session.uid || session.uid !== uid) {
            process.nextTick(function () {
                cb(new Error('session has not bind with ' + session.uid));
            });
            return;
        }
        let sessions = this.uidMap[uid], sess;
        if (sessions) {
            for (let i = 0, l = sessions.length; i < l; i++) {
                sess = sessions[i];
                if (sess.id === sid) {
                    sessions.splice(i, 1);
                    break;
                }
            }
            if (sessions.length === 0) {
                delete this.uidMap[uid];
            }
        }
        session.unbind(uid);
        if (cb) {
            process.nextTick(cb);
        }
    }
    /**
     * Get session by id.
     *
     * @param {Number} id The session id
     * @return {Session}
     *
     * @memberOf SessionService
     * @api private
     */
    get(sid) {
        return this.sessions[sid];
    }
    /**
     * Get sessions by userId.
     *
     * @param {Number} uid User id associated with the session
     * @return {Array} list of session binded with the uid
     *
     * @memberOf SessionService
     * @api private
     */
    getByUid(uid) {
        return this.uidMap[uid];
    }
    /**
     * Remove session by key.
     *
     * @param {Number} sid The session id
     *
     * @memberOf SessionService
     * @api private
     */
    remove(sid) {
        let session = this.sessions[sid];
        if (session) {
            let uid = session.uid;
            delete this.sessions[session.id];
            let sessions = this.uidMap[uid];
            if (!sessions) {
                return;
            }
            for (let i = 0, l = sessions.length; i < l; i++) {
                if (sessions[i].id === sid) {
                    sessions.splice(i, 1);
                    if (sessions.length === 0) {
                        delete this.uidMap[uid];
                    }
                    break;
                }
            }
        }
    }
    /**
     * Import the key/value into session.
     *
     * @api private
     */
    import(sid, key, value, cb) {
        let session = this.sessions[sid];
        if (!session) {
            utils.invokeCallback(cb, new Error('session does not exist, sid: ' + sid));
            return;
        }
        session.set(key, value);
        utils.invokeCallback(cb);
    }
    /**
     * Import new value for the existed session.
     *
     * @memberOf SessionService
     * @api private
     */
    importAll(sid, settings, cb) {
        let session = this.sessions[sid];
        if (!session) {
            utils.invokeCallback(cb, new Error('session does not exist, sid: ' + sid));
            return;
        }
        for (let f in settings) {
            session.set(f, settings[f]);
        }
        utils.invokeCallback(cb);
    }
    /**
     * Kick all the session offline under the user id.
     *
     * @param {Number}   uid user id asscociated with the session
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kick(uid, reason, cb) {
        // compatible for old kick(uid, cb);
        if (typeof reason === 'function') {
            cb = reason;
            reason = 'kick';
        }
        let sessions = this.getByUid(uid);
        if (sessions) {
            // notify client
            let sids = [];
            let self = this;
            sessions.forEach(function (session) {
                sids.push(session.id);
            });
            sids.forEach(function (sid) {
                self.sessions[sid].closed(reason);
            });
            process.nextTick(function () {
                utils.invokeCallback(cb);
            });
        }
        else {
            process.nextTick(function () {
                utils.invokeCallback(cb);
            });
        }
    }
    /**
     * Kick a user offline by session id.
     *
     * @param {Number}   sid session id
     * @param {Function} cb  callback function
     *
     * @memberOf SessionService
     */
    kickBySessionId(sid, reason, cb) {
        if (typeof reason === 'function') {
            cb = reason;
            reason = 'kick';
        }
        let session = this.get(sid);
        if (session) {
            // notify client
            session.closed(reason);
            process.nextTick(function () {
                utils.invokeCallback(cb);
            });
        }
        else {
            process.nextTick(function () {
                utils.invokeCallback(cb);
            });
        }
    }
    /**
     * Get client remote address by session id.
     *
     * @param {Number}   sid session id
     * @return {Object} remote address of client
     *
     * @memberOf SessionService
     */
    getClientAddressBySessionId(sid) {
        let session = this.get(sid);
        if (session) {
            let socket = session.__socket__;
            return socket.remoteAddress;
        }
        else {
            return null;
        }
    }
    /**
     * Send message to the client by session id.
     *
     * @param {String} sid session id
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessage(sid, msg) {
        let session = this.sessions[sid];
        if (!session) {
            logger.debug('Fail to send message for non-existing session, sid: ' + sid + ' msg: ' + msg);
            return false;
        }
        return send(this, session, msg);
    }
    /**
     * Send message to the client by user id.
     *
     * @param {String} uid userId
     * @param {Object} msg message to send
     *
     * @memberOf SessionService
     * @api private
     */
    sendMessageByUid(uid, msg) {
        let sessions = this.uidMap[uid];
        if (!sessions) {
            logger.debug('fail to send message by uid for non-existing session. uid: %j', uid);
            return false;
        }
        for (let i = 0, l = sessions.length; i < l; i++) {
            send(this, sessions[i], msg);
        }
    }
    /**
     * Iterate all the session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachSession(cb) {
        for (let sid in this.sessions) {
            cb(this.sessions[sid]);
        }
    }
    /**
     * Iterate all the binded session in the session service.
     *
     * @param  {Function} cb callback function to fetch session
     * @api private
     */
    forEachBindedSession(cb) {
        let i, l, sessions;
        for (let uid in this.uidMap) {
            sessions = this.uidMap[uid];
            for (i = 0, l = sessions.length; i < l; i++) {
                cb(sessions[i]);
            }
        }
    }
    /**
     * Get sessions' quantity in specified server.
     *
     */
    getSessionsCount() {
        return Object.keys(this.sessions).length;
    }
}
exports.SessionService = SessionService;
/**
 * Send message to the client that associated with the session.
 *
 * @api private
 */
let send = function (service, session, msg) {
    session.send(msg);
    return true;
};
/**
 * Session maintains the relationship between client connection and user information.
 * There is a session associated with each client connection. And it should bind to a
 * user id after the client passes the identification.
 *
 * Session is created in frontend server and should not be accessed in handler.
 * There is a proxy class called BackendSession in backend servers and FrontendSession
 * in frontend servers.
 */
class Session extends events_1.EventEmitter {
    constructor(sid, frontendId, socket, service) {
        super();
        this.id = sid; // r
        this.frontendId = frontendId; // r
        this.uid = null; // r
        this.settings = {};
        // private
        this.__socket__ = socket;
        this.__sessionService__ = service;
        this.__state__ = ST_INITED;
    }
    /*
     * Export current session as frontend session.
     */
    toFrontendSession() {
        return new FrontendSession(this);
    }
    /**
     * Bind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api public
     */
    bind(uid) {
        this.uid = uid;
        this.emit('bind', uid);
    }
    /**
     * Unbind the session with the the uid.
     *
     * @param {Number} uid User id
     * @api private
     */
    unbind(uid) {
        this.uid = null;
        this.emit('unbind', uid);
    }
    set(keyOrValues, value) {
        if (utils.isObject(keyOrValues)) {
            let values = keyOrValues;
            for (let i in values) {
                this.settings[i] = values[i];
            }
        }
        else {
            this.settings[keyOrValues] = value;
        }
    }
    /**
     * Remove value from the session.
     *
     * @param {String} key session key
     * @api public
     */
    remove(key) {
        delete this.settings[key];
    }
    /**
     * Get value from the session.
     *
     * @param {String} key session key
     * @return {Object} value associated with session key
     * @api public
     */
    get(key) {
        return this.settings[key];
    }
    /**
     * Send message to the session.
     *
     * @param  {Object} msg final message sent to client
     */
    send(msg) {
        this.__socket__.send(msg);
    }
    /**
     * Send message to the session in batch.
     *
     * @param  {Array} msgs list of message
     */
    sendBatch(msgs) {
        this.__socket__.sendBatch(msgs);
    }
    /**
     * Closed callback for the session which would disconnect client in next tick.
     *
     * @api public
     */
    closed(reason) {
        if (this.__state__ === ST_CLOSED) {
            return;
        }
        logger.debug('session on [%s] is closed with session id: %s,uid:%s,reason:%j', this.frontendId, this.id, this.uid, reason);
        this.__state__ = ST_CLOSED;
        this.__sessionService__.remove(this.id);
        this.emit('closed', this.toFrontendSession(), reason);
        this.__socket__.emit('closing', reason);
        let self = this;
        // give a chance to send disconnect message to client
        process.nextTick(function () {
            self.__socket__.disconnect();
        });
    }
    /**
     * 是否在线
     */
    get isOnline() {
        return this.__state__ !== ST_CLOSED;
    }
    /**
     * 获取客户端的地址
     */
    get remoteAddress() {
        return this.__socket__.remoteAddress;
    }
}
exports.Session = Session;
/**
 * Frontend session for frontend server.
 */
class FrontendSession extends events_1.EventEmitter {
    constructor(session) {
        super();
        clone(session, this, FRONTEND_SESSION_FIELDS);
        // deep copy for settings
        this.settings = dclone(session.settings);
        this.__session__ = session;
    }
    bind(uid, cb) {
        let self = this;
        this.__sessionService__.bind(this.id, uid, function (err) {
            if (!err) {
                self.uid = uid;
            }
            utils.invokeCallback(cb, err);
        });
    }
    unbind(uid, cb) {
        let self = this;
        this.__sessionService__.unbind(this.id, uid, function (err) {
            if (!err) {
                self.uid = null;
            }
            utils.invokeCallback(cb, err);
        });
    }
    set(key, value) {
        this.settings[key] = value;
    }
    get(key) {
        return this.settings[key];
    }
    push(key, cb) {
        this.__sessionService__.import(this.id, key, this.get(key), cb);
    }
    pushAll(cb) {
        this.__sessionService__.importAll(this.id, this.settings, cb);
    }
    on(event, listener) {
        this.__session__.on(event, listener);
        return super.on(event, listener);
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
        clone(this, res, EXPORTED_SESSION_FIELDS);
        return res;
    }
    /**
     * 是否在线
     */
    get isOnline() {
        return this.__session__.isOnline;
    }
    /**
     * 获取客户端的地址
     */
    get remoteAddress() {
        return this.__session__.remoteAddress;
    }
}
exports.FrontendSession = FrontendSession;
let clone = function (src, dest, includes) {
    let f;
    for (let i = 0, l = includes.length; i < l; i++) {
        f = includes[i];
        dest[f] = src[f];
    }
};
let dclone = function (src) {
    let res = {};
    for (let f in src) {
        res[f] = src[f];
    }
    return res;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29tbW9uL3NlcnZpY2Uvc2Vzc2lvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBb0M7QUFFcEMsK0NBQXVDO0FBQ3ZDLDBDQUEwQztBQUcxQyw2QkFBNkI7QUFFN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRTNELElBQUksdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ2hGLElBQUksdUJBQXVCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUV0RSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBTWxCOzs7Ozs7Ozs7O0dBVUc7QUFDSCxNQUFhLGNBQWM7SUFLdkIsWUFBWSxJQUE2QjtRQWlZekMsVUFBSyxHQUFrRCxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDN0YscUJBQWdCLEdBQWtELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuSCxVQUFLLEdBQTBDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNyRixZQUFPLEdBQTBDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN6RixZQUFP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