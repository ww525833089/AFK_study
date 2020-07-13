// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import DataNode from "../../view/main/DataNode";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelItem extends cc.Component {

    isPass:boolean = false;

    @property(cc.Node)
    lBg:cc.Node = null;

    @property(cc.Label)
    lName:cc.Label = null;

    level_id:number=0;

    init(element:{},id:number){
        // this.lBg.color = cc.Color.GREEN;
        this.level_id = id;
        this.lName.string = element['name'];
        this.lBg.on(cc.Node.EventType.TOUCH_START,function(){
            
            this.node.dispatchEvent(new cc.Event.EventCustom('showLevelInfo',true));

        },this);
    }
}
