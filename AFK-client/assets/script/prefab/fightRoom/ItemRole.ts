// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";
import DataNode from "../../view/main/DataNode";
import Global from "../../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemRole extends cc.Component {

    @property(cc.Sprite)
    hero_icons:cc.Sprite = null;//英雄图标

    @property(cc.Label)
    hero_level:cc.Label = null;//英雄等级

    @property(cc.Sprite)
    hero_race:cc.Sprite = null;//英雄种族

    heroId:number = 0;//英雄id

    choosed:boolean =false;

    ele:{} = null;

    init(ele:{}){
        this.ele = ele;
        this.heroId = ele['id'];
        Utils._addSpritePic(this.hero_icons,ele['icons']);
        this.hero_level.string = ele['level'];
        this.node.on(cc.Node.EventType.TOUCH_START,function(){
                this.clickTNode(ele);
        },this);
    }

    clickTNode(ele){
        console.log(ele);
        if(this.choosed){
            this.choosed =false;
            cc.director.emit('removeInMiddleSence',ele);
            this.node.color = cc.Color.WHITE;
        }else{
            this.choosed =true;
            cc.director.emit('showInMiddleSence',ele);
            this.node.color = cc.Color.RED;
        }
    }

}
