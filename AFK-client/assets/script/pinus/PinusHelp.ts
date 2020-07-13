
export default class PinusHelp{

    public static request(route:string,msg:any,callback:Function){
        
        this.gateQuery(msg,function(host,port){
            var pinus = window.pinus;
            pinus.init({
                host: host,
                port: port,
                log: true
            }, function() {
                pinus.request("connector.entryHandler.entry", msg, function(data) {
                    callback(data);
                });
            });
        })
    }

    // query connector
    public static gateQuery(msg, callback:Function) {
        var route = 'gate.gateHandler.entry';
        var pinus = window.pinus;
        pinus.init({
            host: '127.0.0.1',
            port: '3012',
            log: true
        }, function() {
            pinus.request(route,{uid:'1'}, function(data) {
                // pinus.disconnect();
                if(data.code === 500) {
                    console.log('gate服务器出问题了');
                    return;
                }
                callback(data.host, data.port);
            });
        });
    }


    public static listenMessage(action,callback:Function){
        var pinus = window.pinus;
        pinus.on(action,function(data){
            callback(data);
        })
    }

    public static sendData(route,rid,preSendData:any, callback:Function){
        var pinus = window.pinus;
        pinus.request(route,
			preSendData
		,data=>{
            // console.warn("!!?? ",data)
            callback(data);
		})
    }

}
