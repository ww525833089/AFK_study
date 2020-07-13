"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const dgram = require("dgram");
const utils = require("../util/utils");
const Constants = require("../util/constants");
const udpsocket_1 = require("./udpsocket");
const Kick = require("./commands/kick");
const handshake_1 = require("./commands/handshake");
const heartbeat_1 = require("./commands/heartbeat");
const coder = require("./common/coder");
const events_1 = require("events");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let curId = 1;
class UDPConnector extends events_1.EventEmitter {
    constructor(port, host, opts) {
        super();
        this.decode = coder.decode;
        this.encode = coder.encode;
        this.opts = opts || {};
        this.type = opts.udpType || 'udp4';
        this.handshake = new handshake_1.HandshakeCommand(opts);
        if (!opts.heartbeat) {
            opts.heartbeat = Constants.TIME.DEFAULT_UDP_HEARTBEAT_TIME;
            opts.timeout = Constants.TIME.DEFAULT_UDP_HEARTBEAT_TIMEOUT;
        }
        this.heartbeat = new heartbeat_1.HeartbeatCommand(utils.extendsObject(opts, { disconnectOnTimeout: true }));
        this.clients = {};
        this.host = host;
        this.port = port;
    }
    start(cb) {
        let self = this;
        this.tcpServer = net.createServer();
        this.socket = dgram.createSocket(this.type, function (msg, peer) {
            let key = genKey(peer);
            if (!self.clients[key]) {
                let udpsocket = new udpsocket_1.UdpSocket(curId++, self.socket, peer);
                self.clients[key] = udpsocket;
                udpsocket.on('handshake', self.handshake.handle.bind(self.handshake, udpsocket));
                udpsocket.on('heartbeat', self.heartbeat.handle.bind(self.heartbeat, udpsocket));
                udpsocket.on('disconnect', self.heartbeat.clear.bind(self.heartbeat, udpsocket.id));
                udpsocket.on('disconnect', function () {
                    delete self.clients[genKey(udpsocket.peer)];
                });
                udpsocket.on('closing', Kick.handle.bind(null, udpsocket));
                self.emit('connection', udpsocket);
            }
        });
        this.socket.on('message', function (data, peer) {
            let socket = self.clients[genKey(peer)];
            if (!!socket) {
                socket.emit('package', data);
            }
        });
        this.socket.on('error', function (err) {
            logger.error('udp socket encounters with error: %j', err.stack);
            return;
        });
        this.socket.bind(this.port, this.host);
        this.tcpServer.listen(this.port);
        process.nextTick(cb);
    }
    stop(force, cb) {
        this.socket.close();
        process.nextTick(cb);
    }
}
exports.UDPConnector = UDPConnector;
let genKey = function (peer) {
    return peer.address + ':' + peer.port;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWRwY29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvdWRwY29ubmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTJCO0FBRTNCLCtCQUErQjtBQUMvQix1Q0FBdUM7QUFDdkMsK0NBQStDO0FBQy9DLDJDQUFzQztBQUN0Qyx3Q0FBd0M7QUFDeEMsb0RBQWlGO0FBQ2pGLG9EQUFpRjtBQUVqRix3Q0FBd0M7QUFDeEMsbUNBQXNDO0FBQ3RDLCtDQUF5QztBQUd6Qyw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBVzNELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQUVkLE1BQWEsWUFBYSxTQUFRLHFCQUFZO0lBVzFDLFlBQVksSUFBWSxFQUFFLElBQVksRUFBRSxJQUF5QjtRQUM3RCxLQUFLLEVBQUUsQ0FBQztRQTJEWixXQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUV0QixXQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQTVEbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUM7UUFDbkMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDRCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQztZQUMzRCxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUM7U0FDL0Q7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFH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