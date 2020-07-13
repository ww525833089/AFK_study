// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PropItem extends cc.Component {

    @property(cc.Sprite)
    pic:cc.Sprite = null;

    @property(cc.Label)
    count:cc.Label = null;

    init(size:number,pic_url:string,count:string){
        this.node.width = this.node.height = size;
        Utils._addSpritePic(this.pic,pic_url);
        this.count.string = count+'';
        this.node.on(cc.Node.EventType.TOUCH_START,this.showInfo,this)
    }

    showInfo(){
        console.log(this.node.width);
    }
   
}
