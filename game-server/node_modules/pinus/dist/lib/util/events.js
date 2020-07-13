"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppEvents;
(function (AppEvents) {
    AppEvents["ADD_SERVERS"] = "add_servers";
    AppEvents["REMOVE_SERVERS"] = "remove_servers";
    AppEvents["REPLACE_SERVERS"] = "replace_servers";
    AppEvents["BIND_SESSION"] = "bind_session";
    AppEvents["UNBIND_SESSION"] = "unbind_session";
    AppEvents["CLOSE_SESSION"] = "close_session";
    AppEvents["ADD_CRONS"] = "add_crons";
    AppEvents["REMOVE_CRONS"] = "remove_crons";
    AppEvents["START_SERVER"] = "start_server";
    AppEvents["START_ALL"] = "start_all";
    // ProtobufComponent 组件，当协议文件热更新时 通知  参数： type(server|client)
    AppEvents["PROTO_CHANGED"] = "proto_changed";
})(AppEvents = exports.AppEvents || (exports.AppEvents = {}));
exports.default = AppEvents;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL3V0aWwvZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBWSxTQWFYO0FBYkQsV0FBWSxTQUFTO0lBQ2pCLHdDQUEwQixDQUFBO0lBQzFCLDhDQUFnQyxDQUFBO0lBQ2hDLGdEQUFrQyxDQUFBO0lBQ2xDLDBDQUE0QixDQUFBO0lBQzVCLDhDQUFnQyxDQUFBO0lBQ2hDLDRDQUE4QixDQUFBO0lBQzlCLG9DQUFzQixDQUFBO0lBQ3RCLDBDQUE0QixDQUFBO0lBQzVCLDBDQUE0QixDQUFBO0lBQzVCLG9DQUFzQixDQUFBO0lBQ3RCLDZEQUE2RDtJQUM3RCw0Q0FBOEIsQ0FBQTtBQUNsQyxDQUFDLEVBYlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUFhcEI7QUFDRCxrQkFBZSxTQUFTLENBQUMifQ==