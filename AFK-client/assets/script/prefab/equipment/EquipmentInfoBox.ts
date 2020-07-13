// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";
import Global from "../../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EquipmentInfoBox extends cc.Component {

    @property(cc.Label)
    eName:cc.Label = null;

    @property(cc.Sprite)
    eIcon:cc.Sprite = null;

    @property(cc.Label)
    eBlood:cc.Label = null;

    @property(cc.Label)
    eAttack:cc.Label = null;

    @property(cc.Label)
    eDefense:cc.Label = null;

    eJsonObj:{} = null;

    myRole:{} = null

    eventNode:cc.Node = null;

    init(eJsonObj:{},myRole:{},eventNode:cc.Node){
        this.myRole = myRole;
        this.eventNode = eventNode;
        this.eJsonObj = eJsonObj;
        this.eName.string = eJsonObj['name'];
        Utils._addSpritePic(this.eIcon,eJsonObj['icon']);
        const props:{} = eJsonObj['props']
        this.eBlood.string ='血量：'+(props.hasOwnProperty('blood')? props['blood']:0);
        this.eAttack.string = '攻击：'+(props.hasOwnProperty('attack')? props['attack']:0);
        this.eDefense.string = '防御：'+(props.hasOwnProperty('defense')? props['defense']:0);
    }

    takeOff(){
        this.myRole[this.eventNode.name] = 0;
        //将脱下的装备放到到背包
        let myPackage:{}[] = Global.playerControl.package;
        myPackage.push(
            {id:myPackage.length+1, goods_id:this.eJsonObj['e_id'],icons:this.eJsonObj['icon'],type:'e',sType:this.eventNode.name, detail:'',count:1}
        );
        Global.playerControl.saveUserData();
        this.node.parent.emit('takeOff');
        this.node.destroy();
    }

    close(){
        this.node.destroy();
    }
}
