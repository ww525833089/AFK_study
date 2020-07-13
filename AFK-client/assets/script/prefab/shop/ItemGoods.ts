// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemGoods extends cc.Component {

    @property(cc.Sprite)
    goods_icons:cc.Sprite = null;

    @property(cc.Label)
    goods_count:cc.Label = null;

    @property(cc.Sprite)
    goods_m_type:cc.Sprite = null;

    @property(cc.Label)
    goods_price:cc.Label = null;

    init(ele:{}){
        let c:cc.Sprite= this.goods_icons;

        Utils._addSpritePic(this.goods_icons,ele['goods_icons']);

        this.goods_count.string = ele['goods_count']+'';
        
        Utils._addSpritePic(this.goods_m_type,ele['goods_m_type_pic']);

        this.goods_price.string = ele['goods_price']+'';    
        
        // cc.director.emit('showInfo',ele);
    }

}
