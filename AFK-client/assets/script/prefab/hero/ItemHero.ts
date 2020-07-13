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
export default class ItemHero extends cc.Component {

    @property(cc.Sprite)
    hero_icons:cc.Sprite = null;//英雄图标

    @property(cc.Label)
    hero_level:cc.Label = null;//英雄等级

    @property(cc.Sprite)
    hero_race:cc.Sprite = null;//英雄种族

    ele:{} = null;

    init(ele:{}){
        this.ele = ele;
        Utils._addSpritePic(this.hero_icons,ele['icons']);
        this.hero_level.string = ele['level'];
        this.node.on(cc.Node.EventType.TOUCH_START,this.showHeroInfo,this);
    }

    showHeroInfo(){
        cc.find('dataNode').getComponent(DataNode).data = this.ele;
        cc.director.loadScene("HeroInfo");
    }
}
