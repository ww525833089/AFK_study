"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const tls = require("tls");
const events_1 = require("events");
const hybridsocket_1 = require("./hybridsocket");
const switcher_1 = require("./hybrid/switcher");
const handshake_1 = require("./commands/handshake");
const heartbeat_1 = require("./commands/heartbeat");
const Kick = require("./commands/kick");
const coder = require("./common/coder");
const pinus_1 = require("../pinus");
let curId = 1;
/**
 * Connector that manager low level connection and protocol bewteen server and client.
 * Develper can provide their own connector to switch the low level prototol, such as tcp or probuf.
 */
class HybridConnector extends events_1.EventEmitter {
    constructor(port, host, opts) {
        super();
        this.decode = coder.decode;
        this.encode = coder.encode;
        this.opts = opts || {};
        this.port = port;
        this.host = host;
        this.useDict = opts.useDict;
        this.useProtobuf = opts.useProtobuf;
        this.handshake = new handshake_1.HandshakeCommand(opts);
        this.heartbeat = new heartbeat_1.HeartbeatCommand(opts);
        this.distinctHost = opts.distinctHost;
        this.ssl = opts.ssl;
        this.switcher = null;
    }
    /**
     * Start connector to listen the specified port
     */
    start(cb) {
        let app = pinus_1.pinus.app;
        let self = this;
        let gensocket = function (socket) {
            let hybridsocket = new hybridsocket_1.HybridSocket(curId++, socket);
            hybridsocket.on('handshake', self.handshake.handle.bind(self.handshake, hybridsocket));
            hybridsocket.on('heartbeat', self.heartbeat.handle.bind(self.heartbeat, hybridsocket));
            hybridsocket.on('disconnect', self.heartbeat.clear.bind(self.heartbeat, hybridsocket.id));
            hybridsocket.on('closing', Kick.handle.bind(null, hybridsocket));
            self.emit('connection', hybridsocket);
        };
        this.connector = app.components.__connector__.connector;
        this.dictionary = app.components.__dictionary__;
        this.protobuf = app.components.__protobuf__;
        this.decodeIO_protobuf = app.components.__decodeIO__protobuf__;
        if (!this.ssl) {
            this.listeningServer = net.createServer();
        }
        else {
            this.listeningServer = tls.createServer(this.ssl);
        }
        this.switcher = new switcher_1.HybridSwitcher(this.listeningServer, self.opts);
        this.switcher.on('connection', function (socket) {
            gensocket(socket);
        });
        if (!!this.distinctHost) {
            this.listeningServer.listen(this.port, this.host);
        }
        else {
            this.listeningServer.listen(this.port);
        }
        process.nextTick(cb);
    }
    stop(force, cb) {
        this.switcher.close();
        this.listeningServer.close();
        process.nextTick(cb);
    }
}
exports.HybridConnector = HybridConnector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHlicmlkY29ubmVjdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvaHlicmlkY29ubmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQTJCO0FBQzNCLDJCQUEyQjtBQUUzQixtQ0FBc0M7QUFFdEMsaURBQThDO0FBQzlDLGdEQUFzRjtBQUN0RixvREFBd0Q7QUFDeEQsb0RBQXdEO0FBQ3hELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFLeEMsb0NBQWlDO0FBT2pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQVFkOzs7R0FHRztBQUNILE1BQWEsZUFBZ0IsU0FBUSxxQkFBWTtJQW1CN0MsWUFBWSxJQUFZLEVBQUUsSUFBWSxFQUFFLElBQThCO1FBQ2xFLEtBQUssRUFBRSxDQUFDO1FBOERaLFdBQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRXRCLFdBQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBOURsQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksNEJBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLDRCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN0QyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFFcEIsSUFBSSxD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