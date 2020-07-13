// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Fight from "../../view/fightRoom/Fight";
import Utils from "../../help/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class hitEffect extends cc.Component {

    fightObj :Fight = null;

    @property(cc.Label)
    lblDamage:cc.Label = null;

    init(fightObj:Fight,damage:number){
        this.lblDamage.string = damage+'';
        this.fightObj= fightObj;
        this.node.getComponent(cc.Animation).play('hit');
    }

    selfDestory(){
        Utils.putPoolNode(this.node,this.fightObj.hitEffefPool);
    }
    
}
