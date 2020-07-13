"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dispatcher_1 = require("../../../util/dispatcher");
function default_1(app) {
    return new GateHandler(app);
}
exports.default = default_1;
class GateHandler {
    constructor(app) {
        this.app = app;
    }
    async entry(msg, session) {
        let uid = msg.uid;
        if (!uid) {
            return {
                code: 500
            };
        }
        let connectors = this.app.getServersByType("connector");
        if (!connectors || connectors.length === 0) {
            return {
                code: 500
            };
        }
        let connector = dispatcher_1.dispatch(uid, connectors);
        return {
            code: 200,
            host: connector.host,
            port: connector.clientPort
        };
    }
}
exports.GateHandler = GateHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2F0ZUhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9hcHAvc2VydmVycy9nYXRlL2hhbmRsZXIvZ2F0ZUhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5REFBa0Q7QUFFbEQsbUJBQXlCLEdBQWdCO0lBQ3JDLE9BQU8sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELDRCQUVDO0FBRUQsTUFBYSxXQUFXO0lBQ3BCLFlBQW9CLEdBQWdCO1FBQWhCLFFBQUcsR0FBSCxHQUFHLENBQWE7SUFFcEMsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBaUIsRUFBQyxPQUF1QjtRQUNqRCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ2xCLElBQUcsQ0FBQyxHQUFHLEVBQUM7WUFDSixPQUFNO2dCQUNGLElBQUksRUFBQyxHQUFHO2FBQ1gsQ0FBQTtTQUNKO1FBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV4RCxJQUFHLENBQUMsVUFBVSxJQUFFLFVBQVUsQ0FBQyxNQUFNLEtBQUcsQ0FBQyxFQUFDO1lBQ2xDLE9BQU07Z0JBQ0YsSUFBSSxFQUFDLEdBQUc7YUFDWCxDQUFBO1NBQ0o7UUFHRCxJQUFJLFNBQVMsR0FBRyxxQkFBUSxDQUFDLEdBQUcsRUFBQyxVQUFVLENBQUMsQ0FBQztRQUN6QyxPQUFPO1lBQ0gsSUFBSSxFQUFDLEdBQUc7WUFDUixJQUFJLEVBQUMsU0FBUyxDQUFDLElBQUk7WUFDbkIsSUFBSSxFQUFDLFNBQVMsQ0FBQyxVQUFVO1NBQzVCLENBQUE7SUFDTCxDQUFDO0NBRUo7QUE5QkQsa0NBOEJDIn0=