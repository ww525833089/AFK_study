"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const handler_1 = require("./common/handler");
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let ST_INITED = 0;
let ST_WAIT_ACK = 1;
let ST_WORKING = 2;
let ST_CLOSED = 3;
/**
 * Socket class that wraps socket and websocket to provide unified interface for up level.
 */
class HybridSocket extends events_1.EventEmitter {
    constructor(id, socket) {
        super();
        this.id = id;
        this.socket = socket;
        if (!socket._socket) {
            this.remoteAddress = {
                ip: socket.address().address,
                port: socket.address().port
            };
        }
        else {
            this.remoteAddress = {
                ip: socket._socket.remoteAddress,
                port: socket._socket.remotePort
            };
        }
        let self = this;
        socket.once('close', this.emit.bind(this, 'disconnect'));
        socket.on('error', this.emit.bind(this, 'error'));
        socket.on('message', function (msg) {
            if (msg) {
                msg = pinus_protocol_1.Package.decode(msg);
                handler_1.default(self, msg);
            }
        });
        this.state = ST_INITED;
        // TODO: any other events?
    }
    /**
     * Send raw byte data.
     *
     * @api private
     */
    sendRaw(msg) {
        if (this.state !== ST_WORKING) {
            return;
        }
        let self = this;
        this.socket.send(msg, { binary: true }, (err) => {
            if (!!err) {
                logger.error('websocket send binary data failed: %j', err.stack);
                return;
            }
        });
    }
    /**
     * Send byte data package to client.
     *
     * @param  {Buffer} msg byte data
     */
    send(msg) {
        if (msg instanceof String) {
            msg = Buffer.from(msg);
        }
        else if (!(msg instanceof Buffer)) {
            msg = Buffer.from(JSON.stringify(msg));
        }
        this.sendRaw(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_DATA, msg));
    }
    /**
     * Send byte data packages to client in batch.
     *
     * @param  {Buffer} msgs byte data
     */
    sendBatch(msgs) {
        let rs = [];
        for (let i = 0; i < msgs.length; i++) {
            let src = pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_DATA, msgs[i]);
            rs.push(src);
        }
        this.sendRaw(Buffer.concat(rs));
    }
    /**
     * Send message to client no matter whether handshake.
     *
     * @api private
     */
    sendForce(msg) {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.socket.send(msg, { binary: true });
    }
    /**
     * Response handshake request
     *
     * @api private
     */
    handshakeResponse(resp) {
        if (this.state !== ST_INITED) {
            return;
        }
        this.socket.send(resp, { binary: true });
        this.state = ST_WAIT_ACK;
    }
    /**
     * Close the connection.
     *
     * @api private
     */
    disconnect() {
        if (this.state === ST_CLOSED) {
            return;
        }
        this.state = ST_CLOSED;
        this.socket.emit('close');
        this.socket.close();
    }
}
exports.HybridSocket = HybridSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHlicmlkc29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvaHlicmlkc29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsbUNBQW9DO0FBQ3BDLDhDQUFvRDtBQUNwRCxtREFBdUM7QUFDdkMsK0NBQXVDO0FBS3ZDLDZCQUE2QjtBQUU3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFHM0QsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztBQUNwQixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRWxCOztHQUVHO0FBQ0gsTUFBYSxZQUFhLFNBQVEscUJBQVk7SUFNMUMsWUFBWSxFQUFVLEVBQUUsTUFBcUI7UUFDekMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXJCLElBQUksQ0FBRSxNQUFvQixDQUFDLE9BQU8sRUFBRTtZQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHO2dCQUNqQixFQUFFLEVBQUcsTUFBYyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU87Z0JBQ3JDLElBQUksRUFBRyxNQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSTthQUN2QyxDQUFDO1NBQ0w7YUFBTTtZQUNILElBQUksQ0FBQyxhQUFhLEdBQUc7Z0JBQ2pCLEVBQUUsRUFBRyxNQUFvQixDQUFDLE9BQU8sQ0FBQyxhQUFhO2dCQUMvQyxJQUFJLEVBQUcsTUFBb0IsQ0FBQyxPQUFPLENBQUMsVUFBVTthQUNqRCxDQUFDO1NBQ0w7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIs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