"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
function handle(socket, reason) {
    // websocket close code 1000 would emit when client close the connection
    if (typeof reason === 'string') {
        let res = {
            reason: reason
        };
        socket.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_KICK, Buffer.from(JSON.stringify(res))));
    }
}
exports.handle = handle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2ljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb25uZWN0b3JzL2NvbW1hbmRzL2tpY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsU0FBZ0IsTUFBTSxDQUFDLE1BQWUsRUFBRSxNQUFjO0lBQ2xELHdFQUF3RTtJQUN4RSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtRQUM1QixJQUFJLEdBQUcsR0FBRztZQUNOLE1BQU0sRUFBRSxNQUFNO1NBQ2pCLENBQUM7UUFDRixNQUFNLENBQUMsT0FBTyxDQUFDLHdCQUFPLENBQUMsTUFBTSxDQUFDLHdCQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN2RjtBQUNMLENBQUM7QUFSRCx3QkFRQyJ9