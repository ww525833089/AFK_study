"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinus_1 = require("pinus");
const preload_1 = require("./preload");
const routeUtil = require("./app/util/routeUtil");
/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload_1.preload();
/**
 * Init app for client.
 */
let app = pinus_1.pinus.createApp();
app.set('name', 'AFK_study');
// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        heartbeat: 60,
        useDict: true,
        useProtobuf: true
    });
});
app.configure('production|development', 'gate', function () {
    app.set('connectorConfig', {
        connector: pinus_1.pinus.connectors.hybridconnector,
        useProtobuf: true
    });
});
app.configure('production|development', function () {
    app.route('chat', routeUtil.chat);
    // app.filter(new pinus.filters.timeout);
});
// app.configure('development', function () {
//     // enable the system monitor modules
//     app.enable('systemMonitor');
// });
function errorHandler(err, msg, resp, session, cb) {
    console.error(`${pinus_1.pinus.app.serverId} error handler msg[${JSON.stringify(msg)}] ,resp[${JSON.stringify(resp)}] ,
to resolve unknown exception: sessionId:${JSON.stringify(session.export())} ,
error stack: ${err.stack}`);
    if (!resp) {
        resp = { code: 1003 };
    }
    cb(err, resp);
}
function globalErrorHandler(err, msg, resp, session, cb) {
    console.error(`${pinus_1.pinus.app.serverId} globalErrorHandler msg[${JSON.stringify(msg)}] ,resp[${JSON.stringify(resp)}] ,
to resolve unknown exception: sessionId:${JSON.stringify(session.export())} ,
error stack: ${err.stack}`);
    if (cb) {
        cb(err, resp ? resp : { code: 503 });
    }
}
exports.globalErrorHandler = globalErrorHandler;
// start app
app.start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQXNGO0FBQ3RGLHVDQUFvQztBQUNwQyxrREFBa0Q7QUFFbEQ7Ozs7R0FJRztBQUNILGlCQUFPLEVBQUUsQ0FBQztBQUVWOztHQUVHO0FBQ0gsSUFBSSxHQUFHLEdBQUcsYUFBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQzVCLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRTdCLG9CQUFvQjtBQUNwQixHQUFHLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFLFdBQVcsRUFBRTtJQUNqRCxHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUNyQjtRQUNJLFNBQVMsRUFBRSxhQUFLLENBQUMsVUFBVSxDQUFDLGVBQWU7UUFDM0MsU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUUsSUFBSTtRQUNiLFdBQVcsRUFBRSxJQUFJO0tBQ3BCLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBRSxNQUFNLEVBQUU7SUFDNUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFDckI7UUFDSSxTQUFTLEVBQUUsYUFBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlO1FBQzNDLFdBQVcsRUFBRSxJQUFJO0tBQ3BCLENBQUMsQ0FBQztBQUNYLENBQUMsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsRUFBQztJQUNuQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMseUNBQXlDO0FBQzdDLENBQUMsQ0FBQyxDQUFBO0FBRUYsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsTUFBTTtBQUVOLFNBQVMsWUFBWSxDQUFDLEdBQVUsRUFBRSxHQUFRLEVBQUUsSUFBUyxFQUNqRCxPQUFpQyxFQUFFLEVBQW1CO0lBQzFELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBSSxhQUFLLENBQUMsR0FBRyxDQUFDLFFBQVMsc0JBQXVCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLFdBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUU7MENBQ3RFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFFO2VBQzVELEdBQUcsQ0FBQyxLQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQyxJQUFJLEVBQUU7UUFDWCxJQUFJLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUM7S0FDckI7SUFDRCxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2QsQ0FBQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLEdBQVUsRUFBRSxHQUFRLEVBQUUsSUFBUyxFQUNqRCxPQUFpQyxFQUFFLEVBQW1CO0lBQ3ZFLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBSSxhQUFLLENBQUMsR0FBRyxDQUFDLFFBQVMsMkJBQTRCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFFLFdBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUU7MENBQzNFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFFO2VBQzVELEdBQUcsQ0FBQyxLQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRzlCLElBQUksRUFBRSxFQUFFO1FBQ1IsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNwQztBQUNELENBQUM7QUFWRCxnREFVQztBQUdELFlBQVk7QUFDWixHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMifQ==