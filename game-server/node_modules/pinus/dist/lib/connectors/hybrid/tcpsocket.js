"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const pinus_protocol_1 = require("pinus-protocol");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
/**
 * Work states
 */
let ST_HEAD = 1; // wait for head
let ST_BODY = 2; // wait for body
let ST_CLOSED = 3; // closed
/**
 * Tcp socket wrapper with package compositing.
 * Collect the package from socket and emit a completed package with 'data' event.
 * Uniform with ws.WebSocket interfaces.
 *
 * @param {Object} socket origin socket from node.js net module
 * @param {Object} opts   options parameter.
 *                        opts.headSize size of package head
 *                        opts.headHandler(headBuffer) handler for package head. caculate and return body size from head data.
 */
class TcpSocket extends stream_1.Stream {
    constructor(socket, opts) {
        // stream style interfaces.
        // TODO: need to port to stream2 after node 0.9
        super();
        if (!socket || !opts) {
            throw new Error('invalid socket or opts');
        }
        if (!opts.headSize || typeof opts.headHandler !== 'function') {
            throw new Error('invalid opts.headSize or opts.headHandler');
        }
        this.readable = true;
        this.writeable = true;
        this._socket = socket;
        this.headSize = opts.headSize;
        this.closeMethod = opts.closeMethod;
        this.headBuffer = Buffer.alloc(opts.headSize);
        this.headHandler = opts.headHandler;
        this.headOffset = 0;
        this.packageOffset = 0;
        this.packageSize = 0;
        this.packageBuffer = null;
        // bind event form the origin socket
        this._socket.on('data', this.ondata.bind(this));
        this._socket.on('end', this.onend.bind(this));
        this._socket.on('error', this.emit.bind(this, 'error'));
        this._socket.on('close', this.emit.bind(this, 'close'));
        this.state = ST_HEAD;
    }
    send(msg, options, cb) {
        this._socket.write(msg, options, cb);
    }
    close() {
        if (!!this.closeMethod && this.closeMethod === 'end') {
            this._socket.end();
        }
        else {
            try {
                this._socket.destroy();
            }
            catch (e) {
                logger.error('socket close with destroy error: %j', e.stack);
            }
        }
    }
    ondata(chunk) {
        if (this.state === ST_CLOSED) {
            throw new Error('socket has closed');
        }
        if (typeof chunk !== 'string' && !Buffer.isBuffer(chunk)) {
            throw new Error('invalid data');
        }
        if (typeof chunk === 'string') {
            chunk = Buffer.from(chunk, 'utf8');
        }
        let offset = 0, end = chunk.length;
        while (offset < end && this.state !== ST_CLOSED) {
            if (this.state === ST_HEAD) {
                offset = this.readHead(chunk, offset);
            }
            if (this.state === ST_BODY) {
                offset = this.readBody(chunk, offset);
            }
        }
        return true;
    }
    onend(chunk) {
        if (chunk) {
            this._socket.write(chunk);
        }
        this.state = ST_CLOSED;
        this.reset();
        this.emit('end');
    }
    /**
     * Read head segment from data to socket.headBuffer.
     *
     * @param  {Object} socket Socket instance
     * @param  {Object} data   Buffer instance
     * @param  {Number} offset offset read star from data
     * @return {Number}        new offset of data after read
     */
    readHead(data, offset) {
        let hlen = this.headSize - this.headOffset;
        let dlen = data.length - offset;
        let len = Math.min(hlen, dlen);
        let dend = offset + len;
        data.copy(this.headBuffer, this.headOffset, offset, dend);
        this.headOffset += len;
        if (this.headOffset === this.headSize) {
            // if head segment finished
            let size = this.headHandler(this.headBuffer);
            if (size < 0) {
                throw new Error('invalid body size: ' + size);
            }
            // check if header contains a valid type
            if (checkTypeData(this.headBuffer[0])) {
                this.packageSize = size + this.headSize;
                this.packageBuffer = Buffer.alloc(this.packageSize);
                this.headBuffer.copy(this.packageBuffer, 0, 0, this.headSize);
                this.packageOffset = this.headSize;
                this.state = ST_BODY;
            }
            else {
                dend = data.length;
                logger.error('close the connection with invalid head message, the remote ip is %s && port is %s && message is %j', this._socket.remoteAddress, this._socket.remotePort, data);
                this.close();
            }
        }
        return dend;
    }
    /**
     * Read body segment from data buffer to socket.packageBuffer;
     *
     * @param  {Object} socket Socket instance
     * @param  {Object} data   Buffer instance
     * @param  {Number} offset offset read star from data
     * @return {Number}        new offset of data after read
     */
    readBody(data, offset) {
        let blen = this.packageSize - this.packageOffset;
        let dlen = data.length - offset;
        let len = Math.min(blen, dlen);
        let dend = offset + len;
        data.copy(this.packageBuffer, this.packageOffset, offset, dend);
        this.packageOffset += len;
        if (this.packageOffset === this.packageSize) {
            // if all the package finished
            let buffer = this.packageBuffer;
            this.emit('message', buffer);
            this.reset();
        }
        return dend;
    }
    reset() {
        this.headOffset = 0;
        this.packageOffset = 0;
        this.packageSize = 0;
        this.packageBuffer = null;
        this.state = ST_HEAD;
    }
}
exports.TcpSocket = TcpSocket;
let checkTypeData = function (data) {
    return data === pinus_protocol_1.Package.TYPE_HANDSHAKE || data === pinus_protocol_1.Package.TYPE_HANDSHAKE_ACK || data === pinus_protocol_1.Package.TYPE_HEARTBEAT || data === pinus_protocol_1.Package.TYPE_DATA || data === pinus_protocol_1.Package.TYPE_KICK;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGNwc29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvaHlicmlkL3RjcHNvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUE4QjtBQUc5QixtREFBdUM7QUFDdkMsK0NBQXVDO0FBR3ZDLDZCQUE2QjtBQUU3QixJQUFJLE1BQU0sR0FBRyx3QkFBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFTM0Q7O0dBRUc7QUFDSCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBTSxnQkFBZ0I7QUFDdEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQU0sZ0JBQWdCO0FBQ3RDLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFJLFNBQVM7QUFFL0I7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBYSxTQUFVLFNBQVEsZUFBTTtJQWdCakMsWUFBWSxNQUFrQixFQUFFLElBQXVCO1FBQ25ELDJCQUEyQjtRQUMzQiwrQ0FBK0M7UUFDL0MsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztTQUM3QztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxVQUFVLEVBQUU7WUFDMUQsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO1NBQ2hFO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUks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