// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Levels, SenceIndex } from "../../config/ItemConfig";
import LevelItem from "../../prefab/war/LevelItem";
import DataNode from "./DataNode";
import CaptureItem from "../../prefab/war/CaptureItem";
import Global from "../../Global";

const {ccclass, property} = cc._decorator;

@ccclass
export default class War extends cc.Component {

    @property(cc.Prefab)
    levelItemPrefab :cc.Prefab = null;

    @property(cc.Node)
    levelItemRoot:cc.Node = null;

    @property(cc.ScrollView)
    srCapture:cc.ScrollView = null;

    @property(cc.Node)
    srContentNode:cc.Node = null;

    @property(cc.Prefab)
    itemCaptureBtnPrefab:cc.Prefab = null;

    @property(cc.Node)
    LevelInfoBox:cc.Node = null

    @property(cc.Label)
    lblTitle:cc.Label = null;

    @property(cc.Node)
    btnCg:cc.Node = null;

    @property(cc.Label)
    benLbl:cc.Label = null;

    levelEleArr = [];

    showCapture:number = 1;

    player_level_id:number = 0;

    chooseLevelObj = {};
    onLoad(){
        this.init();
    }

    init(){
        this.player_level_id = Global.playerControl.capture_level_id;

        let cCapture = Math.ceil(this.player_level_id/10);

        for (let i = 1; i <= 100; i++) {
            const itemCaptureBtn =  cc.instantiate(this.itemCaptureBtnPrefab);
            itemCaptureBtn.parent = this.srContentNode;
            itemCaptureBtn.getComponent(CaptureItem).init(i,this);
            if(cCapture == i){
                itemCaptureBtn.getComponent(CaptureItem).chooseCapture();
            }
        }

        this.srCapture.scrollToLeft(1,true);

        //关注选章事件
        this.node.on('chooseCapture',function(event){
            // 终止自定义冒泡事件派发
            event.stopPropagation();
            this.showCaptureLevel();
        }, this);

        this.showCaptureLevel();

        //关注选关事件
        this.node.on('showLevelInfo',function(event){
            // 终止自定义冒泡事件派发
            event.stopPropagation();
            this.showLevelInfo(event);
        }, this);

    }

    showCaptureLevel(){
        this.levelEleArr = [];
        this.levelItemRoot.removeAllChildren();
        let element = {};
        let index = 1+(10*(this.showCapture-1));
        const maxIndex =10*this.showCapture;
        for (; index <= maxIndex; index++) {
            element = {id:index,name:'关卡'+index,monsters:[{hero_id:1,level:index},{hero_id:1,level:index},{hero_id:1,level:index}],rewards:{exp:10*index}};
            let levelItemNode = cc.instantiate(this.levelItemPrefab);
            levelItemNode.getComponent(LevelItem).init(element,index);
            
            if(index<=this.player_level_id){
                levelItemNode.getChildByName('bg').color = cc.Color.GREEN;
            }
            levelItemNode.parent = this.levelItemRoot;
            this.levelEleArr.push(element);
        }
    }

    showLevelInfo(event){
        this.LevelInfoBox.active = true;
        
        this.chooseLevelObj = this.levelEleArr[event.target.getComponent(LevelItem).level_id-1 -(this.showCapture-1)*10];

        if(this.chooseLevelObj["id"]>this.player_level_id+1){
            this.lblTitle.string = this.chooseLevelObj["name"]+'[无法挑战]';
            // this.btnCg.active =false;
            this.benLbl.string = '关闭';
            this.btnCg.on(cc.Node.EventType.TOUCH_START,this.closeLevelInfo,this);
        }else{
            this.lblTitle.string = this.chooseLevelObj["name"];
            this.btnCg.active =true;
            this.benLbl.string = '前去闯关';
            this.btnCg.on(cc.Node.EventType.TOUCH_START,this.goToFight,this);
        }
    }

    goToFight(element){
        cc.find('dataNode').getComponent(DataNode).data = this.chooseLevelObj;
        cc.director.loadScene("Fight_Room");
    }

    closeLevelInfo(){
        this.LevelInfoBox.active =false;
    }
}
