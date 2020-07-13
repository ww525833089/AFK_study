// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";
import Global from "../../Global";
import jslinq = require("jslinq");
import { Equipment } from "../../config/ItemConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CEquimpentItem extends cc.Component {
    @property(cc.Node)
    icon:cc.Node = null;
    @property(cc.Label)
    lblEName:cc.Label = null;
    myRole:{} = null
    eJsonObj:{} = null;
    packageObj :{} =null;

    init(pE:{},myRole:{}){
        // console.log(pE);
        this.packageObj = pE;
        const tEq = jslinq(Equipment).where(p=>p['e_id']==pE['goods_id']).firstOrDefault();
        this.myRole = myRole;
        this.eJsonObj = tEq;

        const cNode = new cc.Node();
        const cnSprite:cc.Sprite = cNode.addComponent(cc.Sprite);
        Utils._addSpritePic(cnSprite,tEq['icon']);

        this.icon.addChild(cNode);

        this.lblEName.string = tEq['name'];
    }
    
    putOn(){
        this.myRole[this.eJsonObj['type']] = this.eJsonObj['e_id'];

        console.log(this.myRole);
        //将脱下的装备放到到背包
        const myPackage:{}[] = Global.playerControl.package;
        const singLeObj = jslinq(myPackage).where(p=>p['id']==this.packageObj['id']).singleOrDefault();
        Global.playerControl.package = jslinq(myPackage).remove(singLeObj).toList();
        Global.playerControl.saveUserData();
        this.node.dispatchEvent(new cc.Event.EventCustom('putOn',true));
    }
}
