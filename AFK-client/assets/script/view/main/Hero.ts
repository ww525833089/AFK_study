// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../Global";
import ItemHero from "../../prefab/hero/ItemHero";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Hero extends cc.Component {

    @property(cc.Node)
    itemContent:cc.Node = null;

    @property(cc.Prefab)
    itemHero:cc.Prefab = null;

    onLoad(){
        let myHeros:{}[] = Global.playerControl.hero;
        myHeros.forEach(element => {
            const itemHeroNode:cc.Node = cc.instantiate(this.itemHero);
            itemHeroNode.parent = this.itemContent;
            itemHeroNode.getComponent(ItemHero).init(element);
        });
    }
}
