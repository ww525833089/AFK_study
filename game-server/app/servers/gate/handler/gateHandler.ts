import { Application, FrontendSession } from 'pinus';
import {dispatch} from '../../../util/dispatcher';

export default function (app: Application) {
    return new GateHandler(app);
}

export class GateHandler {
    constructor(private app: Application) {

    }

    async entry(msg:{uid: string},session:FrontendSession){
        let uid = msg.uid;
        if(!uid){
            return{
                code:500
            }
        }
        
        let connectors = this.app.getServersByType("connector");

        if(!connectors||connectors.length===0){
            return{
                code:500
            } 
        }

        
        let connector = dispatch(uid,connectors);
        return {
            code:200,
            host:connector.host,
            port:connector.clientPort
        }
    }

}