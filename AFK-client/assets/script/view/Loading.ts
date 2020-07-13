// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../Global";
import PlayerControl from "../control/PlayerControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.ProgressBar)
    loadingBar:cc.ProgressBar = null;

    loadingProgress:number = 1;


    onLoad(){
        this.init();
    }

    //初始化数据
    init(){
        if(Global.playerControl == null){
            Global.playerControl =  new PlayerControl();
            Global.playerControl.getUserData();
        }
        cc.director.getScheduler().schedule(this.loadCompeleted, this, 1);

    }

    loadCompeleted(){        
        if(this.loadingProgress>=10){
            cc.director.loadScene("main");
        }else{
            this.loadingProgress+=10;
        }
        this.loadingBar.progress = this.loadingProgress/10;
    }
}
