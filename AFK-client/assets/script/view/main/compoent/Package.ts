// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../../Global";
import PropItem from "../../../prefab/package/PropItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Package extends cc.Component {

    @property(cc.Node)
    btnClose:cc.Node = null;

    @property(cc.Prefab)
    itemProp:cc.Prefab =null;

    @property(cc.Node)
    itemContent:cc.Node = null;

    cl_count:number = 5;

    onLoad(){
        this.btnClose.on(cc.Node.EventType.TOUCH_START,this.closePackage,this)
        this.showPackage();
        this.node.zIndex = 0;
    }

    closePackage(){
        console.log('关闭背包');
        this.node.zIndex = 0;
    }

    showPackage(){
        let itemContentLayout:cc.Layout = this.itemContent.getComponent(cc.Layout);
        
        let itemSize:number = this.itemContent.width/5;
        let myPackage:{}[] =  Global.playerControl.package;
        
        myPackage.forEach(element => {
            console.log(element);
            const propItemNode = cc.instantiate(this.itemProp);
            propItemNode.getComponent(PropItem).init(itemSize,element['icons'],element['count']);
            propItemNode.parent = this.itemContent;
        });

    }
}
