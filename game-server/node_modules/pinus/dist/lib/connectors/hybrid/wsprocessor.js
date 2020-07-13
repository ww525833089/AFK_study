"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const events_1 = require("events");
const WebSocket = require("ws");
let ST_STARTED = 1;
let ST_CLOSED = 2;
/**
 * websocket protocol processor
 */
class WSProcessor extends events_1.EventEmitter {
    constructor() {
        super();
        this.httpServer = new http_1.Server();
        let self = this;
        this.wsServer = new WebSocket.Server({ server: this.httpServer });
        this.wsServer.on('connection', function (socket) {
            // emit socket to outside
            self.emit('connection', socket);
        });
        this.state = ST_STARTED;
    }
    add(socket, data) {
        if (this.state !== ST_STARTED) {
            return;
        }
        this.httpServer.emit('connection', socket);
        if (typeof socket.ondata === 'function') {
            // compatible with stream2
            socket.ondata(data, 0, data.length);
        }
        else {
            // compatible with old stream
            socket.emit('data', data);
        }
    }
    close() {
        if (this.state !== ST_STARTED) {
            return;
        }
        this.state = ST_CLOSED;
        this.wsServer.close();
        this.wsServer = null;
        this.httpServer = null;
    }
}
exports.WSProcessor = WSProcessor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3Nwcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29ubmVjdG9ycy9oeWJyaWQvd3Nwcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBNEM7QUFDNUMsbUNBQXNDO0FBR3RDLGdDQUFnQztBQUVoQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBRWxCOztHQUVHO0FBQ0gsTUFBYSxXQUFZLFNBQVEscUJBQVk7SUFLekM7UUFDSSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxhQUFVLEVBQUUsQ0FBQztRQUVuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFFbEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFVBQVUsTUFBTTtZQUMzQyx5QkFBeUI7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztJQUM1QixDQUFDO0lBR0QsR0FBRyxDQUFDLE1BQWtCLEVBQUUsSUFBWTtRQUNoQyxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQzNCLE9BQU87U0FDVjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMzQyxJQUFJLE9BQVEsTUFBYyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDOUMsMEJBQTBCO1lBQ3pCLE1BQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEQ7YUFBTTtZQUNILDZCQUE2QjtZQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3QjtJQUNMLENBQUM7SUFFRCxLQUFLO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLFVBQVUsRUFBRTtZQUMzQixPQUFPO1NBQ1Y7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQTVDRCxrQ0E0Q0MifQ==