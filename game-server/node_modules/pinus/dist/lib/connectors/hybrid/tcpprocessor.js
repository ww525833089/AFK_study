"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const utils = require("../../util/utils");
const tcpsocket_1 = require("./tcpsocket");
let ST_STARTED = 1;
let ST_CLOSED = 2;
// private protocol, no need exports
let HEAD_SIZE = 4;
/**
 * websocket protocol processor
 */
class TCPProcessor extends events_1.EventEmitter {
    constructor(closeMethod) {
        super();
        this.closeMethod = closeMethod;
        this.state = ST_STARTED;
    }
    add(socket, data) {
        if (this.state !== ST_STARTED) {
            return;
        }
        let tcpsocket = new tcpsocket_1.TcpSocket(socket, {
            headSize: HEAD_SIZE,
            headHandler: utils.headHandler,
            closeMethod: this.closeMethod
        });
        this.emit('connection', tcpsocket);
        socket.emit('data', data);
    }
    close() {
        if (this.state !== ST_STARTED) {
            return;
        }
        this.state = ST_CLOSED;
    }
}
exports.TCPProcessor = TCPProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGNwcHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvaHlicmlkL3RjcHByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFzQztBQUd0QywwQ0FBMEM7QUFDMUMsMkNBQXdDO0FBRXhDLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztBQUNuQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFFbEIsb0NBQW9DO0FBQ3BDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUVsQjs7R0FFRztBQUNILE1BQWEsWUFBYSxTQUFRLHFCQUFZO0lBRzFDLFlBQVksV0FBbUI7UUFDM0IsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztJQUM1QixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUNoQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQzNCLE9BQU87U0FDVjtRQUNELElBQUksU0FBUyxHQUFHLElBQUkscUJBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDbEMsUUFBUSxFQUFFLFNBQVM7WUFDbkIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVztTQUNoQyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsS0FBSztRQUNELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBM0JELG9DQTJCQyJ9