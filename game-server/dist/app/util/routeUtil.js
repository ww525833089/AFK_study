"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dispatcher_1 = require("./dispatcher");
function chat(session, mag, app, cb) {
    let chatServers = app.getServersByType('chat');
    if (!chatServers || chatServers.length === 0) {
        cb(new Error('找不到chat服务器'));
        return;
    }
    let chatServer = dispatcher_1.dispatch(session.get('rid'), chatServers);
    cb(null, chatServer.id);
}
exports.chat = chat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVVdGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3V0aWwvcm91dGVVdGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNkNBQXdDO0FBRXhDLFNBQWdCLElBQUksQ0FBQyxPQUFlLEVBQUMsR0FBTyxFQUFDLEdBQWUsRUFBQyxFQUFxQztJQUM5RixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0MsSUFBRyxDQUFDLFdBQVcsSUFBRSxXQUFXLENBQUMsTUFBTSxLQUFHLENBQUMsRUFBQztRQUNwQyxFQUFFLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFRO0tBQ1g7SUFFRCxJQUFJLFVBQVUsR0FBRyxxQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDM0QsRUFBRSxDQUFDLElBQUksRUFBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQVRELG9CQVNDIn0=