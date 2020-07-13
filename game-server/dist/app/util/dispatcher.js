"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crc = require("crc");
//根据用户id，自动分配服务器
function dispatch(uid, connectors) {
    const index = Math.abs(crc.crc32(uid)) % connectors.length;
    return connectors[index];
}
exports.dispatch = dispatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzcGF0Y2hlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC91dGlsL2Rpc3BhdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQkFBMkI7QUFJM0IsZ0JBQWdCO0FBQ2hCLFNBQWdCLFFBQVEsQ0FBQyxHQUFVLEVBQUMsVUFBdUI7SUFDdkQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUM5RCxPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBSEQsNEJBR0MifQ==