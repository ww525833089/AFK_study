"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const wsprocessor_1 = require("./wsprocessor");
const tcpprocessor_1 = require("./tcpprocessor");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let HTTP_METHODS = [
    'GET', 'POST', 'DELETE', 'PUT', 'HEAD'
];
let ST_STARTED = 1;
let ST_CLOSED = 2;
let DEFAULT_TIMEOUT = 90;
/**
 * Switcher for tcp and websocket protocol
 *
 * @param {Object} server tcp server instance from node.js net module
 */
class HybridSwitcher extends events_1.EventEmitter {
    constructor(server, opts) {
        super();
        this.server = server;
        this.wsprocessor = new wsprocessor_1.WSProcessor();
        this.tcpprocessor = new tcpprocessor_1.TCPProcessor(opts.closeMethod);
        this.id = 1;
        this.timeout = (opts.timeout || DEFAULT_TIMEOUT) * 1000;
        this.setNoDelay = opts.setNoDelay;
        if (!opts.ssl) {
            this.server.on('connection', this.newSocket.bind(this));
        }
        else {
            this.server.on('secureConnection', this.newSocket.bind(this));
            this.server.on('clientError', function (e, tlsSo) {
                logger.warn('an ssl error occured before handshake established: ', e);
                tlsSo.destroy();
            });
        }
        this.wsprocessor.on('connection', this.emit.bind(this, 'connection'));
        this.tcpprocessor.on('connection', this.emit.bind(this, 'connection'));
        this.state = ST_STARTED;
    }
    newSocket(socket) {
        if (this.state !== ST_STARTED) {
            return;
        }
        socket.on('error', (err) => {
            logger.debug('connection error:%s, the remote ip is %s && port is %s', err.message, socket.remoteAddress, socket.remotePort);
            socket.destroy();
        });
        socket.on('close', () => {
            socket.destroy();
        });
        socket.setTimeout(this.timeout, function () {
            logger.warn('connection is timeout without communication, the remote ip is %s && port is %s', socket.remoteAddress, socket.remotePort);
            socket.destroy();
        });
        let self = this;
        socket.once('data', (data) => {
            // FIXME: handle incomplete HTTP method
            if (isHttp(data)) {
                this.processHttp(self.wsprocessor, socket, data);
            }
            else {
                if (!!self.setNoDelay) {
                    socket.setNoDelay(true);
                }
                this.processTcp(self.tcpprocessor, socket, data);
            }
        });
    }
    close() {
        if (this.state !== ST_STARTED) {
            return;
        }
        this.state = ST_CLOSED;
        this.wsprocessor.close();
        this.tcpprocessor.close();
    }
    processHttp(processor, socket, data) {
        processor.add(socket, data);
    }
    processTcp(processor, socket, data) {
        processor.add(socket, data);
    }
}
exports.HybridSwitcher = HybridSwitcher;
let isHttp = function (data) {
    let head = data.toString('utf8', 0, 4);
    for (let i = 0, l = HTTP_METHODS.length; i < l; i++) {
        if (head.indexOf(HTTP_METHODS[i]) === 0) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29ubmVjdG9ycy9oeWJyaWQvc3dpdGNoZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBc0M7QUFFdEMsK0NBQTRDO0FBQzVDLGlEQUE4QztBQUM5QywrQ0FBeUM7QUFPekMsNkJBQTZCO0FBQzdCLElBQUksTUFBTSxHQUFHLHdCQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUczRCxJQUFJLFlBQVksR0FBRztJQUNmLEtBQUssRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNO0NBQ3pDLENBQUM7QUFFRixJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRWxCLElBQUksZUFBZSxHQUFHLEVBQUUsQ0FBQztBQVl6Qjs7OztHQUlHO0FBQ0gsTUFBYSxjQUFlLFNBQVEscUJBQVk7SUFVNUMsWUFBWSxNQUFrQixFQUFFLElBQTJCO1FBQ3ZELEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDeEQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBRWxDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1gsSUFBSSxDQUFD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