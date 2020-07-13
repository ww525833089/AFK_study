// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import War from "../../view/main/War";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CaptureItem extends cc.Component {

    @property(cc.Label)
    btnName:cc.Label = null;

    captureId:number = 0;

    warClassObj:War = null;

    init(i:number,warClassObj){
        this.captureId = i;
        this.warClassObj = warClassObj;
        this.btnName.string = "第"+i+"章";
    }

    chooseCapture(){

        this.node.parent.children.forEach(element => {
            element.getChildByName("Background").color = cc.Color.WHITE;
        });

        this.warClassObj.showCapture = this.captureId;
        this.node.getChildByName("Background").color = cc.Color.GREEN;
        this.node.dispatchEvent(new cc.Event.EventCustom('chooseCapture',true));
    }
}
