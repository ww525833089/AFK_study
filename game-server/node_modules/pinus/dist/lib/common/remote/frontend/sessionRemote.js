"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    return new SessionRemote(app);
}
exports.default = default_1;
class SessionRemote {
    constructor(app) {
        this.app = app;
    }
    bind(sid, uid) {
        return this.app.sessionService.abind(sid, uid);
    }
    unbind(sid, uid) {
        return this.app.sessionService.aunbind(sid, uid);
    }
    push(sid, key, value) {
        return this.app.sessionService.aimport(sid, key, value);
    }
    pushAll(sid, settings) {
        return this.app.sessionService.aimportAll(sid, settings);
    }
    /**
     * Get session informations with session id.
     *
     * @param  {String}   sid session id binded with the session
     * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session not exist.
     */
    getBackendSessionBySid(sid) {
        let session = this.app.sessionService.get(sid);
        if (!session) {
            return;
        }
        return session.toFrontendSession().export();
    }
    /**
     * Get all the session informations with the specified user id.
     *
     * @param  {String}   uid user id binded with the session
     * @param  {Function} cb(err, sinfo)  callback funtion, sinfo would be null if the session does not exist.
     */
    getBackendSessionsByUid(uid) {
        let sessions = this.app.sessionService.getByUid(uid);
        if (!sessions) {
            return;
        }
        let res = [];
        for (let i = 0, l = sessions.length; i < l; i++) {
            res.push(sessions[i].toFrontendSession().export());
        }
        return res;
    }
    /**
     * Kick a session by session id.
     *
     * @param  {Number}   sid session id
     * @param  {String}   reason  kick reason
     * @param  {Function} cb  callback function
     */
    kickBySid(sid, reason) {
        return this.app.sessionService.akickBySessionId(sid, reason);
    }
    /**
     * Kick sessions by user id.
     *
     * @param  {Number|String}   uid user id
     * @param  {String}          reason     kick reason
     * @param  {Function} cb     callback function
     */
    kickByUid(uid, reason) {
        return this.app.sessionService.akick(uid, reason);
    }
}
exports.SessionRemote = SessionRemote;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Vzc2lvblJlbW90ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYi9jb21tb24vcmVtb3RlL2Zyb250ZW5kL3Nlc3Npb25SZW1vdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxtQkFBeUIsR0FBZ0I7SUFDckMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRkQsNEJBRUM7QUFHRCxNQUFhLGFBQWE7SUFHdEIsWUFBWSxHQUFnQjtRQUN4QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNuQixDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVEsRUFBRSxHQUFRO1FBQ25CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsTUFBTSxDQUFDLEdBQVEsRUFBRSxHQUFRO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsSUFBSSxDQUFDLEdBQVEsRUFBRSxHQUFXLEVBQUUsS0FBVTtRQUNsQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFRCxPQUFPLENBQUMsR0FBUSxFQUFFLFFBQWdDO1FBQzlDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxzQkFBc0IsQ0FBQyxHQUFRO1FBQzNCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1YsT0FBTztTQUNWO1FBQ0QsT0FBTyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCx1QkFBdUIsQ0FBQyxHQUFRO1FBQzVCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyRCxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1gsT0FBTztTQUNWO1FBRUQsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM3QyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxTQUFTLENBQUMsR0FBUSxFQUFFLE1BQWM7UUFDOUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQVMsQ0FBQyxHQUFRLEVBQUUsTUFBYztRQUM5QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEQsQ0FBQztDQUNKO0FBN0VELHNDQTZFQyJ9