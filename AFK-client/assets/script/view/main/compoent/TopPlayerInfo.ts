// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerControl from "../../../control/PlayerControl";
import Global from "../../../Global";
import Utils from "../../../help/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopPlayerInfo extends cc.Component {

    @property(cc.Sprite)
    tx:cc.Sprite = null;

    @property(cc.Label)
    player_name:cc.Label = null;

    @property(cc.Label)
    level:cc.Label = null;

    @property(cc.Label)
    fightNumber:cc.Label = null;

    @property(cc.Label)
    goldCount:cc.Label = null;

    @property(cc.Label)
    diamondCount:cc.Label = null;

    @property(cc.ProgressBar)
    experienceBar :cc.ProgressBar = null;

    playerControl:PlayerControl = null;

    onLoad(){
        this.playerControl = Global.playerControl;

        if(Global.playerControl == null){
            this.playerControl = new PlayerControl();
            this.playerControl.getUserData();
            Global.playerControl = this.playerControl;
        }

        this.node.zIndex = 2;        
    }

    showInfo(){
        
        var player = this.playerControl;
        
        this.player_name.string = player.name;
        // cc.loader.loadRes('player_txs/'+ player.tx,cc.SpriteFrame,function(err,spriteFrame){
        //     this.tx.spriteFrame = spriteFrame;
        // })
        this.level.string = player.level+'级';
        this.fightNumber.string = Utils.convertNumber2Str(player.fightNumber);
        this.goldCount.string = Utils.convertNumber2Str(player.gold_count)+'';
        this.diamondCount.string = player.diamond_count+'';
        this.experienceBar.progress = player.cLevelExp/(10*player.level*player.level);
    }

    update(){
        this.showInfo();
    }
}
