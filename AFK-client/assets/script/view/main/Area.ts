// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 领地场景内的逻辑处理
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Area extends cc.Component {

    @property(cc.Node)
    shop:cc.Node = null;

    @property(cc.Node)
    wineBar:cc.Node = null;

    onLoad(){
        this.shop.on(cc.Node.EventType.TOUCH_START,this.openShop,this);
        this.wineBar.on(cc.Node.EventType.TOUCH_START,this.openWineBar,this);
    }

    //打开商店
    openShop(){
        cc.director.loadScene('shop');
        console.log("打开商店");
    }

    //打开酒馆
    openWineBar(){
        console.log("打开酒馆");
    }
}
