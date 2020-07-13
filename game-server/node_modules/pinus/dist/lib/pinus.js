"use strict";
/*!
 * Pinus
 * Copyright(c) 2012 xiechengchao <xiecc@163.com>
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
const hybridconnector_1 = require("./connectors/hybridconnector");
const udpconnector_1 = require("./connectors/udpconnector");
const mqttconnector_1 = require("./connectors/mqttconnector");
const sioconnector_1 = require("./connectors/sioconnector");
const direct_1 = require("./pushSchedulers/direct");
const buffer_1 = require("./pushSchedulers/buffer");
const connection_1 = require("./components/connection");
const connector_1 = require("./components/connector");
const dictionary_1 = require("./components/dictionary");
const master_1 = require("./components/master");
const monitor_1 = require("./components/monitor");
const protobuf_1 = require("./components/protobuf");
const proxy_1 = require("./components/proxy");
const pushScheduler_1 = require("./components/pushScheduler");
const remote_1 = require("./components/remote");
const server_1 = require("./components/server");
const session_1 = require("./components/session");
const toobusy_1 = require("./filters/rpc/toobusy");
const rpcLog_1 = require("./filters/rpc/rpcLog");
const toobusy_2 = require("./filters/handler/toobusy");
const time_1 = require("./filters/handler/time");
const serial_1 = require("./filters/handler/serial");
const timeout_1 = require("./filters/handler/timeout");
let Package = require('../../package');
const events_1 = require("./util/events");
const backendSession_1 = require("./components/backendSession");
const channel_1 = require("./components/channel");
/**
 * Expose `createApplication()`.
 *
 * @module
 */
class Pinus {
    constructor() {
        /**
         * Framework version.
         */
        this.version = Package.version;
        /**
         * Event definitions that would be emitted by app.event
         */
        this.events = events_1.default;
        /**
         * auto loaded components
         */
        this.components = {
            backendSession: backendSession_1.BackendSessionComponent,
            channel: channel_1.ChannelComponent,
            connection: connection_1.ConnectionComponent,
            connector: connector_1.ConnectorComponent,
            dictionary: dictionary_1.DictionaryComponent,
            master: master_1.MasterComponent,
            monitor: monitor_1.MonitorComponent,
            protobuf: protobuf_1.ProtobufComponent,
            proxy: proxy_1.ProxyComponent,
            pushScheduler: pushScheduler_1.PushSchedulerComponent,
            remote: remote_1.RemoteComponent,
            server: server_1.ServerComponent,
            session: session_1.SessionComponent,
        };
        /**
         * auto loaded filters
         */
        this.filters = {
            serial: serial_1.SerialFilter,
            time: time_1.TimeFilter,
            timeout: timeout_1.TimeoutFilter,
            toobusy: toobusy_2.ToobusyFilter,
        };
        /**
         * auto loaded rpc filters
         */
        this.rpcFilters = {
            rpcLog: rpcLog_1.RpcLogFilter,
            toobusy: toobusy_1.RpcToobusyFilter,
        };
        /**
         * connectors
         */
        this.connectors = {
            sioconnector: sioconnector_1.SIOConnector,
            hybridconnector: hybridconnector_1.HybridConnector,
            udpconnector: udpconnector_1.UDPConnector,
            mqttconnector: mqttconnector_1.MQTTConnector,
        };
        /**
         * pushSchedulers
         */
        this.pushSchedulers = {
            direct: direct_1.DirectPushScheduler,
            buffer: buffer_1.BufferPushScheduler,
        };
    }
    /**
     * Create an pinus application.
     *
     * @return {Application}
     * @memberOf Pinus
     * @api public
     */
    createApp(opts) {
        let app = new application_1.Application();
        app.init(opts);
        this._app = app;
        return app;
    }
    /**
     * Get application
     */
    get app() {
        return this._app;
    }
}
exports.Pinus = Pinus;
exports.pinus = new Pinus();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGludXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9saWIvcGludXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7O0FBT0gsK0NBQWdFO0FBR2hFLGtFQUErRDtBQUMvRCw0REFBeUQ7QUFDekQsOERBQTJEO0FBQzNELDREQUF5RDtBQUN6RCxvREFBOEQ7QUFDOUQsb0RBQThEO0FBRzlELHdEQUE4RDtBQUM5RCxzREFBNEQ7QUFDNUQsd0RBQThEO0FBQzlELGdEQUFzRDtBQUN0RCxrREFBd0Q7QUFDeEQsb0RBQTBEO0FBQzFELDhDQUFvRDtBQUNwRCw4REFBb0U7QUFDcEUsZ0RBQXNEO0FBQ3RELGdEQUFzRDtBQUN0RCxrREFBdUQ7QUFHdkQsbURBQXlEO0FBQ3pELGlEQUFvRDtBQUNwRCx1REFBMEQ7QUFDMUQsaURBQW9EO0FBQ3BELHFEQUF3RDtBQUN4RCx1REFBMEQ7QUFDMUQsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRXZDLDBDQUFnRDtBQUNoRCxnRUFBc0U7QUFDdEUsa0RBQXdEO0FBQ3hEOzs7O0dBSUc7QUFFSCxNQUFhLEtBQUs7SUEwRWQ7UUF4RUE7O1dBRUc7UUFFSCxZQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUUxQjs7V0FFRztRQUNILFdBQU0sR0FBRyxnQkFBTSxDQUFDO1FBRWhCOztXQUVHO1FBQ0gsZUFBVSxHQUNWO1lBQ0ksY0FBYyxFQUFHLHdDQUF1QjtZQUN4QyxPQUFPLEVBQUcsMEJBQWdCO1lBQzFCLFVBQVUsRUFBRyxnQ0FBbUI7WUFDaEMsU0FBUyxFQUFHLDhCQUFrQjtZQUM5QixVQUFVLEVBQUcsZ0NBQW1CO1lBQ2hDLE1BQU0sRUFBRyx3QkFBZTtZQUN4QixPQUFPLEVBQUcsMEJBQWdCO1lBQzFCLFFBQVEsRUFBRyw0QkFBaUI7WUFDNUIsS0FBSyxFQUFHLHNCQUFjO1lBQ3RCLGFBQWEsRUFBRyxzQ0FBc0I7WUFDdEMsTUFBTSxFQUFHLHdCQUFlO1lBQ3hCLE1BQU0sRUFBRyx3QkFBZTtZQUN4QixPQUFPLEVBQUcsMEJBQWdCO1NBQzdCLENBQUM7UUFFRjs7V0FFRztRQUNILFlBQU8sR0FDUDtZQUNJLE1BQU0sRUFBRyxxQkFBWTtZQUNyQixJQUFJLEVBQUcsaUJBQVU7WUFDakIsT0FBTyxFQUFHLHVCQUFhO1lBQ3ZCLE9BQU8sRUFBRyx1QkFBYTtTQUMxQixDQUFDO1FBRUY7O1dBRUc7UUFDSCxlQUFVLEdBQ1Q7WUFDRyxNQUFNLEVBQUcscUJBQVk7WUFDckIsT0FBTyxFQUFHLDBCQUFnQjtTQUM3QixDQUFDO1FBR0Y7O1dBRUc7UUFDSCxlQUFVLEdBQ1Q7WUFDRyxZQUFZLEVBQUcsMkJBQVk7WUFDM0IsZUFBZSxFQUFHLGlDQUFlO1lBQ2pDLFlBQVksRUFBRywyQkFBWTtZQUMzQixhQUFhLEVBQUcsNkJBQWE7U0FDaEMsQ0FBQztRQUVGOztXQUVHO1FBQ0gsbUJBQWMsR0FDZDtZQUNJLE1BQU0sRUFBRyw0QkFBbUI7WUFDNUIsTUFBTSxFQUFHLDRCQUFtQjtTQUMvQixDQUFDO0lBR0YsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQVMsQ0FBQyxJQUEwQjtRQUNoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztRQUM1QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLEdBQUc7UUFDSCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztDQUNKO0FBakdELHNCQWlHQztBQUVVLFFBQUEsS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMifQ==