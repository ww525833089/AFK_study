// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../Global";
import jslinq = require("jslinq");
import { Equipment } from "../../config/ItemConfig";
import CEquimpentItem from "./CEquipmentItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseEquipmentBox extends cc.Component {

    @property(cc.Prefab)
    chooseItem:cc.Prefab = null;
    @property(cc.Node)
    content:cc.Node = null;

    init(sType,myRole){
        const myPackage = Global.playerControl.package;
        const tEList= jslinq(myPackage).where(p=>p['sType']==sType).toList();
        tEList.forEach(element => {
            const chooseItemNode = cc.instantiate(this.chooseItem);
            // console.log(element);
            chooseItemNode.getComponent(CEquimpentItem).init(element,myRole);
            chooseItemNode.parent = this.content;
        });
        //关注穿装时间
        this.node.on('putOn',this.close, this);
    }

    close(){
        this.node.destroy();
    }
    
}
