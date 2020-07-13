"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./common/handler");
const pinus_protocol_1 = require("pinus-protocol");
const EventEmitter = require("events");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let ST_INITED = 0;
let ST_WAIT_ACK = 1;
let ST_WORKING = 2;
let ST_CLOSED = 3;
class UdpSocket extends EventEmitter {
    constructor(id, socket, peer) {
        super();
        this.id = id;
        this.socket = socket;
        this.peer = peer;
        this.host = peer.address;
        this.port = peer.port;
        this.remoteAddress = {
            ip: this.host,
            port: this.port
        };
        let self = this;
        this.on('package', function (pkg) {
            if (!!pkg) {
                pkg = pinus_protocol_1.Package.decode(pkg);
                handler_1.default(self, pkg);
            }
        });
        this.state = ST_INITED;
    }
    /**
     * Send byte data package to client.
     *
     * @param  {Buffer} msg byte data
     */
    send(msg) {
        if (this.state !== ST_WORKING) {
            return;
        }
        if (msg instanceof String) {
            msg = Buffer.from(msg);
        }
        else if (!(msg instanceof Buffer)) {
            msg = Buffer.from(JSON.stringify(msg));
        }
        this.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_DATA, msg));
    }
    sendRaw(msg) {
        this.socket.send(msg, 0, msg.length, this.port, this.host, function (err, bytes) {
            if (!!err) {
                logger.error('send msg to remote with err: %j', err.stack);
                return;
            }
        });
    }
    sendForce(msg) {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.sendRaw(msg);
    }
    handshakeResponse(resp) {
        if (this.state !== ST_INITED) {
            return;
        }
        this.sendRaw(resp);
        this.state = ST_WAIT_ACK;
    }
    sendBatch(msgs) {
        if (this.state !== ST_WORKING) {
            return;
        }
        let rs = [];
        for (let i = 0; i < msgs.length; i++) {
            let src = pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_DATA, msgs[i]);
            rs.push(src);
        }
        this.sendRaw(Buffer.concat(rs));
    }
    disconnect() {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.state = ST_CLOSED;
        this.emit('disconnect', 'the connection is disconnected.');
    }
}
exports.UdpSocket = UdpSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWRwc29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvdWRwc29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOENBQXNEO0FBQ3RELG1EQUF5QztBQUN6Qyx1Q0FBdUM7QUFDdkMsK0NBQXlDO0FBR3pDLDZCQUE2QjtBQUM3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0QsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRWxCLE1BQWEsU0FBVSxTQUFRLFlBQVk7SUFTdkMsWUFBWSxFQUFVLEVBQUUsTUFBb0IsRUFBRSxJQUFzQjtRQUNoRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ2pCLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNiLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNsQixDQUFDO1FBRUYsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsR0FBRztZQUM1QixJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1AsR0FBRyxHQUFHLHdCQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixpQkFBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQzthQUN0QjtRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUdEOzs7O09BSUc7SUFDSCxJQUFJLENBQUMsR0FBUTtRQUNULElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsSUFBSSxHQUFHLFlBQVksTUFBTSxFQUFFO1lBQ3ZCLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQWEsQ0FBQyxDQUFDO1NBQ3BDO2FBQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxZQUFZLE1BQU0sQ0FBQyxFQUFFO1lBQ2pDLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUMxQztRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsd0JBQU8sQ0FBQyxNQUFNLENBQUMsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsT0FBTyxDQUFDLEdBQVE7UUFDWixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyxFQUFFLEtBQUs7WUFDM0UsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzRCxPQUFPO2FBQ1Y7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxTQUFTLENBQUMsR0FBUTtRQUNkLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDMUIsT0FBTztTQUNWO1FBQ0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBRUQsaUJBQWlCLENBQUMsSUFBUztRQUN2QixJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzFCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7SUFDN0IsQ0FBQztJQUVELFNBQVMsQ0FBQyxJQUFXO1FBQ2pCLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDM0IsT0FBTztTQUNWO1FBQ0QsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxHQUFHLEdBQUcsd0JBQU8sQ0FBQyxNQUFNLENBQUMsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNoQjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxVQUFVO1FBQ04sSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxpQ0FBaUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FDSjtBQTdGRCw4QkE2RkMifQ==