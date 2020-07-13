"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
let ST_INITED = 0;
let ST_CLOSED = 1;
/**
 * Socket class that wraps socket.io socket to provide unified interface for up level.
 */
class SioSocket extends events_1.EventEmitter {
    constructor(id, socket) {
        super();
        this.sendRaw = this.send;
        this.id = id;
        this.socket = socket;
        this.remoteAddress = {
            ip: socket.handshake.address
        };
        let self = this;
        socket.on('disconnect', this.emit.bind(this, 'disconnect'));
        socket.on('error', this.emit.bind(this, 'error'));
        socket.on('message', function (msg) {
            self.emit('message', msg);
        });
        this.state = ST_INITED;
        // TODO: any other events?
    }
    send(msg) {
        if (this.state !== ST_INITED) {
            return;
        }
        if (typeof msg !== 'string') {
            msg = JSON.stringify(msg);
        }
        this.socket.send(msg);
    }
    disconnect() {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.state = ST_CLOSED;
        this.socket.disconnect();
    }
    sendBatch(msgs) {
        this.send(encodeBatch(msgs));
    }
}
exports.SioSocket = SioSocket;
/**
 * Encode batch msg to client
 */
let encodeBatch = function (msgs) {
    let res = '[', msg;
    for (let i = 0, l = msgs.length; i < l; i++) {
        if (i > 0) {
            res += ',';
        }
        msg = msgs[i];
        if (typeof msg === 'string') {
            res += msg;
        }
        else {
            res += JSON.stringify(msg);
        }
    }
    res += ']';
    return res;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lvc29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvc2lvc29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQXNDO0FBR3RDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFFbEI7O0dBRUc7QUFDSCxNQUFhLFNBQVUsU0FBUSxxQkFBWTtJQU12QyxZQUFZLEVBQVUsRUFBRSxNQUF1QjtRQUMzQyxLQUFLLEVBQUUsQ0FBQztRQWlDWixZQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQWhDaEIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ2pCLEVBQUUsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU87U0FDL0IsQ0FBQztRQUVGLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUVoQixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztRQUU1RCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUVsRCxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLEdBQUc7WUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUV2QiwwQkFBMEI7SUFDOUIsQ0FBQztJQUlELElBQUksQ0FBQyxHQUFRO1FBQ1QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1Y7UUFDRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtRQUNELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBVztRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7Q0FDSjtBQXJERCw4QkFxREM7QUFFRDs7R0FFRztBQUNILElBQUksV0FBVyxHQUFHLFVBQVUsSUFBVztJQUNuQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDO0lBQ25CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDekMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ1AsR0FBRyxJQUFJLEdBQUcsQ0FBQztTQUNkO1FBQ0QsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLEdBQUcsSUFBSSxHQUFHLENBQUM7U0FDZDthQUFNO1lBQ0gsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDOUI7S0FDSjtJQUNELEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDWCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUMsQ0FBQyJ9