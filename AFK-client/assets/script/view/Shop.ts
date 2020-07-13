// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ItemGoods from "../prefab/shop/ItemGoods";
import GoodsBox from "../prefab/shop/GoodsBox";
import { ShopGoods, ShopHero } from "../config/ItemConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shop extends cc.Component {

    @property(cc.Node)
    goods_content :cc.Node = null;

    @property(cc.Prefab)
    itemGoods:cc.Prefab = null;

    @property(cc.Prefab)
    goodsBox:cc.Prefab = null;

    @property(cc.Button)
    btns:cc.Button[] = [];

    onLoad(){
        
        this.showGoodsList();
        // cc.director.on('showInfo',function(eve){

        // });
    }

    showGoodsList(){
        this.changeGoodsTab();
        const shopGoods:{}[] = ShopGoods;
        console.log('showGoodsList');
        shopGoods.forEach(element => {
            let itemGoodsNode:cc.Node = cc.instantiate(this.itemGoods);
            itemGoodsNode.parent = this.goods_content;
            itemGoodsNode.getComponent(ItemGoods).init(element);
            itemGoodsNode.on(cc.Node.EventType.TOUCH_START,function(){
                this.ShowInfo(element);
            },this)
        });
    }

    showHeroList(){
        this.changeGoodsTab();
        const shopHeros:{}[] = ShopHero;
        console.log('showHeroList');
        shopHeros.forEach(element => {
            let itemGoodsNode:cc.Node = cc.instantiate(this.itemGoods);
            itemGoodsNode.parent = this.goods_content;
            itemGoodsNode.getComponent(ItemGoods).init(element);
            itemGoodsNode.on(cc.Node.EventType.TOUCH_START,function(){
                this.ShowInfo(element);
            },this)
        });
    }

    showEquipmentList(){
        this.changeGoodsTab();
        
    }

    ShowInfo(ele:{}){
        console.log(ele['type']);
        // if(ele['type']=='prop'){
        let goodsBoxNode:cc.Node = cc.instantiate(this.goodsBox);
        goodsBoxNode.parent = this.node;
        goodsBoxNode.getComponent(GoodsBox).init(ele);
    }

    closeShop(){
        cc.director.loadScene('main');
    }


    changeGoodsTab(){
        //可以设置改变当前按钮的状态和一些信息显示
        this.goods_content.removeAllChildren();
    }
}
