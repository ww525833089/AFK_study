"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_protocol_1 = require("pinus-protocol");
const Constants = require("../../util/constants");
const pinus_logger_1 = require("pinus-logger");
const path = require("path");
let logger = pinus_logger_1.getLogger('pinus', path.basename(__filename));
let encode = function (reqId, route, msg) {
    if (!!reqId) {
        return composeResponse(this, reqId, route, msg);
    }
    else {
        return composePush(this, route, msg);
    }
};
exports.encode = encode;
let decode = function (msg) {
    msg = pinus_protocol_1.Message.decode(msg.body);
    let route = msg.route;
    // decode use dictionary
    if (!!msg.compressRoute) {
        if (!!this.connector.useDict) {
            let abbrs = this.dictionary.getAbbrs();
            if (!abbrs[route]) {
                logger.error('dictionary error! no abbrs for route : %s', route);
                return null;
            }
            route = msg.route = abbrs[route];
        }
        else {
            logger.error('fail to uncompress route code for msg: %j, server not enable dictionary.', msg);
            return null;
        }
    }
    // decode use protobuf
    if (!!this.protobuf && !!this.protobuf.getProtos().client[route]) {
        msg.body = this.protobuf.decode(route, msg.body);
    }
    else if (!!this.decodeIO_protobuf && !!this.decodeIO_protobuf.check(Constants.RESERVED.CLIENT, route)) {
        msg.body = this.decodeIO_protobuf.decode(route, msg.body);
    }
    else {
        try {
            msg.body = JSON.parse(msg.body.toString('utf8'));
        }
        catch (ex) {
            msg.body = {};
        }
    }
    return msg;
};
exports.decode = decode;
let composeResponse = function (server, msgId, route, msgBody) {
    if (!msgId || !route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    return pinus_protocol_1.Message.encode(msgId, pinus_protocol_1.Message.TYPE_RESPONSE, false, null, msgBody);
};
let composePush = function (server, route, msgBody) {
    if (!route || !msgBody) {
        return null;
    }
    msgBody = encodeBody(server, route, msgBody);
    // encode use dictionary
    let compressRoute = false;
    if (!!server.dictionary) {
        let dict = server.dictionary.getDict();
        if (!!server.connector.useDict && !!dict[route]) {
            route = dict[route];
            compressRoute = true;
        }
    }
    return pinus_protocol_1.Message.encode(0, pinus_protocol_1.Message.TYPE_PUSH, compressRoute, route, msgBody);
};
let encodeBody = function (server, route, msgBody) {
    // encode use protobuf
    if (!!server.protobuf && !!server.protobuf.getProtos().server[route]) {
        msgBody = server.protobuf.encode(route, msgBody);
    }
    else if (!!server.decodeIO_protobuf && !!server.decodeIO_protobuf.check(Constants.RESERVED.SERVER, route)) {
        msgBody = server.decodeIO_protobuf.encode(route, msgBody);
    }
    else {
        msgBody = Buffer.from(JSON.stringify(msgBody), 'utf8');
    }
    return msgBody;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29ubmVjdG9ycy9jb21tb24vY29kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFDekMsa0RBQW1EO0FBQ25ELCtDQUF5QztBQUV6Qyw2QkFBNkI7QUFDN0IsSUFBSSxNQUFNLEdBQUcsd0JBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBRzNELElBQUksTUFBTSxHQUFHLFVBQThCLEtBQWEsRUFBRSxLQUFhLEVBQUUsR0FBUTtJQUM3RSxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFDVCxPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNuRDtTQUFNO1FBQ0gsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN4QztBQUNMLENBQUMsQ0FBQztBQTRFRSx3QkFBTTtBQTFFVixJQUFJLE1BQU0sR0FBRyxVQUF1QixHQUFRO0lBQ3hDLEdBQUcsR0FBRyx3QkFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDL0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUV0Qix3QkFBd0I7SUFDeEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRTtRQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtZQUMxQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsRUFBRSxLQUFLLENBQUMsQ0FBQztn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