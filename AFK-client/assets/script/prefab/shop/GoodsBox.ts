// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Utils from "../../help/Utils";
import Global from "../../Global";
import jslinq = require("jslinq");
const {ccclass, property} = cc._decorator;

@ccclass
export default class GoodsBox extends cc.Component {
    @property(cc.Node)
    bg_mask:cc.Node = null;

    @property(cc.Sprite)
    pic:cc.Sprite = null;

    @property(cc.Label)
    count:cc.Label = null;

    @property(cc.RichText)
    rtDetail:cc.RichText = null;

    @property(cc.Label)
    goods_price:cc.Label = null;

    @property(cc.Sprite)
    goods_m_type:cc.Sprite = null;

    goodsJsonObj:{} = null;

    ele:{} = null;

    init(ele:{}){
        this.goodsJsonObj = ele;
        Utils._addSpritePic(this.pic,ele['goods_icons']);
        this.count.string = ele['goods_count']+'';
        this.rtDetail.string = ele['type']+':我是一名中华人民共和国军人';
        this.goods_price.string = ele['goods_price']+'';   
        Utils._addSpritePic(this.goods_m_type,ele['goods_m_type_pic']);
        this.ele = ele;

        this.bg_mask.on(cc.Node.EventType.TOUCH_START,function(){
            console.log('goodsBox');
        },this)
    }

    closeBox(){
        this.node.destroy();
    }

    buy(){
        console.log("购买此物品，并关闭窗口");

        if(Global.playerControl.gold_count< this.ele['goods_price']) {console.log('金币不足');return;}
        //默认用金币结账
        Global.playerControl.gold_count-=this.ele['goods_price'];

        //购买道具
        if(this.ele['type']=='prop'){

            //将物品添加到背包
            let myPackage:{}[] = Global.playerControl.package;
            
            // myPackage.push(
            //     {goods_id:this.ele["goods_id"],icons:'goods/ic_塞壬女妖',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄',count:this.ele['goods_count']},
            //     {goods_id:9,icons:'goods/ic_塞壬女妖1',type:'灵魂石2',detail:'收集60个精英灵魂石，可召唤一个英雄',count:this.ele['goods_count']}
            //     );
                
            let res = jslinq(myPackage).where(p => p['goods_id'] == this.ele['goods_id']).firstOrDefault();
            
            if(res == null){
                myPackage.push(
                    {id:myPackage.length+1, goods_id:this.ele["goods_id"],icons:this.ele['goods_icons'],type:'props',sType:'lhs',detail:'收集60个精英灵魂石，可召唤一个英雄',count:this.ele['goods_count']}
                );
            }else{
                res['count']+= this.ele['goods_count'];
            }
        }//购买英雄
        else if(this.ele['type'] == 'hero'){
            //将物品添加到背包
            let myHero:{}[] = Global.playerControl.hero;
            myHero.push(
                //初始化我的英雄（等级，品质，装备栏）
                {id:myHero.length+1,hero_id:this.ele["hero_id"],icons:this.ele['goods_icons'],level:1,Grade:1,e1:1,e2:2,e3:3,e4:4,e5:5,e6:6}
            );
        }
        Global.playerControl.saveUserData();
        console.log(Global.playerControl.package);

        this.closeBox();
    }
    
}
