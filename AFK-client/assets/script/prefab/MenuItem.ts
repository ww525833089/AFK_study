// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../Global";
import GameControl from "../view/GameControl";
import { SenceIndex } from "../config/ItemConfig";

const {ccclass, property} = cc._decorator;
//菜单按钮预制类
@ccclass
export default class MenuItem extends cc.Component {

    name:string = "";
    bg_name:string ='';
    sence_index:number = 0;

    init(name:string,bg_name:string,sence_index:number){
        this.name = name;
        this.bg_name = bg_name;
        this.sence_index = sence_index;
        let bg_sprite:cc.Sprite= this.node.getComponentInChildren(cc.Sprite);

        cc.loader.loadRes('btns/'+bg_name,cc.SpriteFrame,function(err,spriteFrame){
            bg_sprite.spriteFrame = spriteFrame;
        })

        // this.node.on(cc.Node.EventType.TOUCH_END,this._touchEnd,this);
        // this.node.on(cc.Node.EventType.MOUSE_DOWN,this._touchEnd,this);
        // this.node.on('menuitem_touch',function(event){
        //     this._reStoreBg(event);
        // })
    }

    Touch(event:EventSource){
        Global.gameControl.showSence(this.sence_index);
        // if(this.sence_index==SenceIndex.Chat){
        //     cc.director.loadScene('ChatRoom');
        // }else{
        //     Global.gameControl.curr_Sence_index = this.sence_index;
        //     //更换点击后背景图
        //     Global.gameControl.showSence();
        // }
    }

    _reStoreBg(event:EventSource){
        //还原背景图
        // this.node.children[0];
    }
}
