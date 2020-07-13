// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MenuItem from "../../../prefab/MenuItem";
import { BottomMenuItems } from "../../../config/ItemConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BottomMenu extends cc.Component {

    @property(cc.Prefab)
    menuItem:cc.Prefab = null
    
    onLoad(){
        const bottomMenuItems = BottomMenuItems;
        bottomMenuItems.forEach(element => {
            let menuItem:cc.Node = cc.instantiate(this.menuItem);
            menuItem.getComponent(MenuItem).init(element.name,element.icon,element.sence_index);
            menuItem.parent = this.node;
        });

        this.node.zIndex = 2;

    }
}
