import { pinus, Application, FrontendOrBackendSession, HandlerCallback } from 'pinus';
import { preload } from './preload';
import * as routeUtil from './app/util/routeUtil';

/**
 *  替换全局Promise
 *  自动解析sourcemap
 *  捕获全局错误
 */
preload();

/**
 * Init app for client.
 */
let app = pinus.createApp();
app.set('name', 'AFK_study');

// app configuration
app.configure('production|development', 'connector', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            heartbeat: 60,
            useDict: true,
            useProtobuf: true
        });
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
        {
            connector: pinus.connectors.hybridconnector,
            useProtobuf: true
        });
});

app.configure('production|development',function(){
    app.route('chat',routeUtil.chat);
    // app.filter(new pinus.filters.timeout);
})

// app.configure('development', function () {
//     // enable the system monitor modules
//     app.enable('systemMonitor');
// });

function errorHandler(err: Error, msg: any, resp: any,
    session: FrontendOrBackendSession, cb: HandlerCallback) {
console.error(`${ pinus.app.serverId } error handler msg[${ JSON.stringify(msg) }] ,resp[${ JSON.stringify(resp) }] ,
to resolve unknown exception: sessionId:${ JSON.stringify(session.export()) } ,
error stack: ${ err.stack }`);
if (!resp) {
resp = { code: 1003 };
}
cb(err, resp);
}

export function globalErrorHandler(err: Error, msg: any, resp: any,
                 session: FrontendOrBackendSession, cb: HandlerCallback) {
console.error(`${ pinus.app.serverId } globalErrorHandler msg[${ JSON.stringify(msg) }] ,resp[${ JSON.stringify(resp) }] ,
to resolve unknown exception: sessionId:${ JSON.stringify(session.export()) } ,
error stack: ${ err.stack }`);


if (cb) {
cb(err, resp ? resp : { code: 503 });
}
}


// start app
app.start();

