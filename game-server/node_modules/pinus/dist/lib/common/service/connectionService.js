"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * connection statistics service
 * record connection, login count and list
 */
class ConnectionService {
    constructor(app) {
        this.connCount = 0;
        this.loginedCount = 0;
        this.logined = {};
        this.serverId = app.getServerId();
    }
    /**
     * Add logined user.
     *
     * @param uid {String} user id
     * @param info {Object} record for logined user
     */
    addLoginedUser(uid, info) {
        if (!this.logined[uid]) {
            this.loginedCount++;
        }
        info.uid = uid;
        this.logined[uid] = info;
    }
    /**
     * Update user info.
     * @param uid {String} user id
     * @param info {Object} info for update.
     */
    updateUserInfo(uid, info) {
        let user = this.logined[uid];
        if (!user) {
            return;
        }
        for (let p in info) {
            if (info.hasOwnProperty(p) && typeof info[p] !== 'function') {
                user[p] = info[p];
            }
        }
    }
    /**
     * Increase connection count
     */
    increaseConnectionCount() {
        this.connCount++;
    }
    /**
     * Remote logined user
     *
     * @param uid {String} user id
     */
    removeLoginedUser(uid) {
        if (!!this.logined[uid]) {
            this.loginedCount--;
        }
        this.logined[uid] = undefined;
    }
    /**
     * Decrease connection count
     *
     * @param uid {String} uid
     */
    decreaseConnectionCount(uid) {
        if (this.connCount) {
            this.connCount--;
        }
        if (!!uid) {
            this.removeLoginedUser(uid);
        }
    }
    /**
     * Get statistics info
     *
     * @return {Object} statistics info
     */
    getStatisticsInfo() {
        let list = [];
        for (let uid in this.logined) {
            if (this.logined[uid]) {
                list.push(this.logined[uid]);
            }
        }
        return {
            serverId: this.serverId,
            totalConnCount: this.connCount,
            loginedCount: this.loginedCount,
            loginedList: list
        };
    }
}
exports.ConnectionService = ConnectionService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvblNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29tbW9uL3NlcnZpY2UvY29ubmVjdGlvblNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFTQTs7O0dBR0c7QUFFSCxNQUFhLGlCQUFpQjtJQU8xQixZQUFZLEdBQWdCO1FBTDVCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxpQkFBWSxHQUFHLENBQUMsQ0FBQztRQUNqQixZQUFPLEdBQXVDLEVBQUUsQ0FBQztRQUk3QyxJQUFJLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN0QyxDQUFDO0lBR0Q7Ozs7O09BS0c7SUFDSCxjQUFjLENBQUMsR0FBUSxFQUFFLElBQXFCO1FBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN2QjtRQUNELElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxjQUFjLENBQUMsR0FBUSxFQUFFLElBQXFCO1FBQzFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLE9BQU87U0FDVjtRQUVELEtBQUssSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO1lBQ2hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFRLElBQVksQ0FBQyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7Z0JBQ2pFLElBQVksQ0FBQyxDQUFDLENBQUMsR0FBSSxJQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkM7U0FDSjtJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILHVCQUF1QjtRQUNuQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxpQkFBaUIsQ0FBQyxHQUFRO1FBQ3RCLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3ZCO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx1QkFBdUIsQ0FBQyxHQUFRO1FBQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7WUFDUCxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDL0I7SUFDTCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlCQUFpQjtRQUNiLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0o7UUFFRCxPQUFPO1lBQ0gsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDL0IsV0FBVyxFQUFFLElBQUk7U0FDcEIsQ0FBQztJQUNOLENBQUM7Q0FDSjtBQWpHRCw4Q0FpR0MifQ==