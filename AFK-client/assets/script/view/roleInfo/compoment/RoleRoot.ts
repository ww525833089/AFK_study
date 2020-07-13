// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataNode from "../../main/DataNode";
import {Hero} from "../../../config/ItemConfig"
import jslinq = require("jslinq");


const {ccclass, property} = cc._decorator;

@ccclass
export default class RoleRoot extends cc.Component {

    onLoad(){
        //获取页面传来的值
        const obj:{} =  cc.find('dataNode').getComponent(DataNode).getData();

        const res = jslinq(Hero).where(p => p['id'] == obj['hero_id']).firstOrDefault();
        console.log(res);
        const db = res['db'];

        let dragonDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);       
        
        cc.loader.loadResDir("role/role_db/"+db,cc.Asset,null,(err, resource)=>{
            dragonDisplay.dragonAsset = resource[0];
            dragonDisplay.dragonAtlasAsset = resource[3];
            dragonDisplay.armatureName = db;
            dragonDisplay.playAnimation("steady",0);
        });　　
    }
}
