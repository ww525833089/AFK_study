"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(app) {
    return new AuthRemoter(app);
}
exports.default = default_1;
class AuthRemoter {
    constructor(app) {
        this.app = app;
    }
    /**
     *
     * @param username
     * @param password
     */
    async auth(username, password) {
        return true;
    }
    // 私有方法不会加入到RPC提示里
    async privateMethod(testarg, arg2) {
    }
}
exports.AuthRemoter = AuthRemoter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aFJlbW90ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcHAvc2VydmVycy9jb25uZWN0b3IvcmVtb3RlL2F1dGhSZW1vdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsbUJBQXlCLEdBQWdCO0lBQ3JDLE9BQU8sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELDRCQUVDO0FBYUQsTUFBYSxXQUFXO0lBQ3BCLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFFcEMsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQWdCLEVBQUcsUUFBZ0I7UUFDakQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGtCQUFrQjtJQUNWLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBYyxFQUFDLElBQVc7SUFFdEQsQ0FBQztDQUNKO0FBbEJELGtDQWtCQyJ9