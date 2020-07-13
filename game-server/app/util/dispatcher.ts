import * as crc from 'crc';
import { ServerInfo } from 'pinus';


//根据用户id，自动分配服务器
export function dispatch(uid:string,connectors:ServerInfo[]){
    const index = Math.abs(crc.crc32(uid)) % connectors.length;
	return connectors[index];
}