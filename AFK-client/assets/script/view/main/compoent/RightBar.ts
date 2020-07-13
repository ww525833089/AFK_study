// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../../Global";
import PlayerControl from "../../../control/PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RightBar extends cc.Component {

    @property(cc.Node)
    packageNode:cc.Node = null;

    playerControl:PlayerControl = null;
    
    
    onLoad(){
        this.playerControl = Global.playerControl;
        this.node.zIndex = 2;
    }

    test(){
        // console.log("重置数据");
        // cc.sys.localStorage.setItem('userData',JSON.stringify({}));

        console.log('加100金币');
        this.playerControl.gold_count+=100;
        this.playerControl.saveUserData();

    }

    openPackage(){
        this.packageNode.zIndex = 3;
    }
}
