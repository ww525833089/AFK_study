"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_1 = require("../../pinus");
const pinus_protocol_1 = require("pinus-protocol");
let CODE_OK = 200;
let CODE_USE_ERROR = 500;
let CODE_OLD_CLIENT = 501;
/**
 * Process the handshake request.
 *
 * @param {Object} opts option parameters
 *                      opts.handshake(msg, cb(err, resp)) handshake callback. msg is the handshake message from client.
 *                      opts.hearbeat heartbeat interval (level?)
 *                      opts.version required client level
 */
class HandshakeCommand {
    constructor(opts) {
        opts = opts || {};
        this.userHandshake = opts.handshake;
        if (opts.heartbeat) {
            this.heartbeatSec = opts.heartbeat;
            this.heartbeat = opts.heartbeat * 1000;
        }
        this.checkClient = opts.checkClient;
        this.useDict = opts.useDict;
        this.useProtobuf = opts.useProtobuf;
        this.useCrypto = opts.useCrypto;
    }
    handle(socket, msg) {
        if (!msg.sys) {
            processError(socket, CODE_USE_ERROR);
            return;
        }
        if (typeof this.checkClient === 'function') {
            if (!msg || !msg.sys || !this.checkClient(msg.sys.type, msg.sys.version)) {
                processError(socket, CODE_OLD_CLIENT);
                return;
            }
        }
        let opts = {
            heartbeat: setupHeartbeat(this)
        };
        if (this.useDict) {
            let dictVersion = pinus_1.pinus.app.components.__dictionary__.getVersion();
            if (!msg.sys.dictVersion || msg.sys.dictVersion !== dictVersion) {
                // may be deprecated in future
                opts.dict = pinus_1.pinus.app.components.__dictionary__.getDict();
                // 用不到这个。
                //    opts.routeToCode = pinus.app.components.__dictionary__.getDict();
                //     opts.codeToRoute = pinus.app.components.__dictionary__.getAbbrs();
                opts.dictVersion = dictVersion;
            }
            opts.useDict = true;
        }
        if (this.useProtobuf) {
            let protoVersion = pinus_1.pinus.app.components.__protobuf__.getVersion();
            if (!msg.sys.protoVersion || msg.sys.protoVersion !== protoVersion) {
                opts.protos = pinus_1.pinus.app.components.__protobuf__.getProtos();
            }
            opts.useProto = true;
        }
        if (!!pinus_1.pinus.app.components.__decodeIO__protobuf__) {
            if (!!this.useProtobuf) {
                throw new Error('protobuf can not be both used in the same project.');
            }
            let component = pinus_1.pinus.app.components.__decodeIO__protobuf__;
            let version = component.getVersion();
            if (!msg.sys.protoVersion || msg.sys.protoVersion < version) {
                opts.protos = component.getProtos();
            }
            opts.useProto = true;
        }
        if (this.useCrypto) {
            pinus_1.pinus.app.components.__connector__.setPubKey(socket.id, msg.sys.rsa);
        }
        if (typeof this.userHandshake === 'function') {
            this.userHandshake(msg, function (err, resp) {
                if (err) {
                    process.nextTick(function () {
                        processError(socket, CODE_USE_ERROR);
                    });
                    return;
                }
                process.nextTick(function () {
                    response(socket, opts, resp);
                });
            }, socket);
            return;
        }
        process.nextTick(function () {
            response(socket, opts);
        });
    }
}
exports.HandshakeCommand = HandshakeCommand;
let setupHeartbeat = function (self) {
    return self.heartbeatSec;
};
let response = function (socket, sys, resp) {
    let res = {
        code: CODE_OK,
        sys: sys
    };
    if (resp) {
        res.user = resp;
    }
    socket.handshakeResponse(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_HANDSHAKE, Buffer.from(JSON.stringify(res))));
};
let processError = function (socket, code) {
    let res = {
        code: code
    };
    socket.sendForce(pinus_protocol_1.Package.encode(pinus_protocol_1.Package.TYPE_HANDSHAKE, Buffer.from(JSON.stringify(res))));
    process.nextTick(function () {
        socket.disconnect();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZHNoYWtlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbGliL2Nvbm5lY3RvcnMvY29tbWFuZHMvaGFuZHNoYWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW9DO0FBQ3BDLG1EQUF5QztBQUd6QyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDbEIsSUFBSSxjQUFjLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLElBQUksZUFBZSxHQUFHLEdBQUcsQ0FBQztBQWMxQjs7Ozs7OztHQU9HO0FBQ0gsTUFBYSxnQkFBZ0I7SUFTekIsWUFBWSxJQUE2QjtRQUNyQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFcEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNuQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQzFDO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXBDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBZSxFQUFFLEdBQVE7UUFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUU7WUFDVixZQUFZLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3JDLE9BQU87U0FDVjtRQUVELElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtZQUN4QyxJQUFJ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