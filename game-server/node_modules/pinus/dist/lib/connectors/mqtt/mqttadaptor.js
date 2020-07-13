"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MqttAdaptor {
    constructor(opts) {
        this.subReqs = {};
        opts = opts || {};
        this.publishRoute = opts.publishRoute;
        this.subscribeRoute = opts.subscribeRoute;
    }
    onPublish(client, packet) {
        let route = this.publishRoute;
        if (!route) {
            throw new Error('unspecified publish route.');
        }
        let payload = packet.payload;
        if (payload instanceof Buffer) {
            payload = payload.toString('utf8');
        }
        let req = {
            id: packet.messageId,
            route: route,
            body: packet
        };
        client.emit('message', req);
        if (packet.qos === 1) {
            client.socket.puback({ messageId: packet.messageId });
        }
    }
    onSubscribe(client, packet) {
        let route = this.subscribeRoute;
        if (!route) {
            throw new Error('unspecified subscribe route.');
        }
        let req = {
            id: packet.messageId,
            route: route,
            body: {
                subscriptions: packet.subscriptions
            }
        };
        this.subReqs[packet.messageId] = packet;
        client.emit('message', req);
    }
    onPubAck(client, packet) {
        let req = {
            id: packet.messageId,
            route: 'connector.mqttHandler.pubAck',
            body: {
                mid: packet.messageId
            }
        };
        this.subReqs[packet.messageId] = packet;
        client.emit('message', req);
    }
    /**
     * Publish message or subscription ack.
     *
     * if packet.id exist and this.subReqs[packet.id] exist then packet is a suback.
     * Subscription is request/response mode.
     * packet.id is pass from client in packet.messageId and record in Pinus context and attached to the subscribe response packet.
     * packet.body is the context that returned by subscribe next callback.
     *
     * if packet.id not exist then packet is a publish message.
     *
     * otherwise packet is a illegal packet.
     */
    publish(client, packet) {
        let mid = packet.id;
        let subreq = this.subReqs[mid];
        if (subreq) {
            // is suback
            client.socket.suback({ messageId: mid, granted: packet.body });
            delete this.subReqs[mid];
            return;
        }
        client.socket.publish(packet.body);
    }
}
exports.MqttAdaptor = MqttAdaptor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXF0dGFkYXB0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY29ubmVjdG9ycy9tcXR0L21xdHRhZGFwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBb0JBLE1BQWEsV0FBVztJQUlwQixZQUFZLElBQTBCO1FBSHRDLFlBQU8sR0FBMkMsRUFBRSxDQUFDO1FBSWpELElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUN0QyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7SUFDOUMsQ0FBQztJQUVELFNBQVMsQ0FBQyxNQUFrQixFQUFFLE1BQXFCO1FBQy9DLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFFOUIsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUNqRDtRQUVELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDN0IsSUFBSSxPQUFPLFlBQVksTUFBTSxFQUFFO1lBQzNCLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsSUFBSSxHQUFHLEdBQUc7WUFDTixFQUFFLEVBQUUsTUFBTSxDQUFDLFNBQVM7WUFDcEIsS0FBSyxFQUFFLEtBQUs7WUFDWixJQUFJLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUU1QixJQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFrQixFQUFFLE1BQXVCO1FBQ25ELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7UUFFaEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksR0FBRyxHQUFHO1lBQ04sRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQ3BCLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFO2dCQUNGLGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYTthQUN0QztTQUNKLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUM7UUFFeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVELFFBQVEsQ0FBQyxNQUFrQixFQUFFLE1BQXVCO1FBQ2hELElBQUksR0FBRyxHQUFHO1lBQ04sRUFBRSxFQUFFLE1BQU0sQ0FBQyxTQUFTO1lBQ3BCLEtBQUssRUFBRSw4QkFBOEI7WUFDckMsSUFBSSxFQUFFO2dCQUNGLEdBQUcsRUFBRSxNQUFNLENBQUMsU0FBUzthQUN4QjtTQUNKLENBQUM7UUFFRixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxNQUFNLENBQUM7UUFFeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOzs7Ozs7Ozs7OztPQVdHO0lBQ0gsT0FBTyxDQUFDLE1BQWtCLEVBQUUsTUFBZ0M7UUFDeEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNwQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksTUFBTSxFQUFFO1lBQ1IsWUFBWTtZQUNaLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDL0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLE9BQU87U0FDVjtRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0o7QUE3RkQsa0NBNkZDIn0=