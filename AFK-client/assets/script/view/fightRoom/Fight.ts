// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../Global";
import ItemRole from "../../prefab/fightRoom/ItemRole";
import DataNode from "../main/DataNode";
import { SenceIndex, Hero } from "../../config/ItemConfig";
import jslinq = require("jslinq");
import Utils from "../../help/Utils";
import RolePreafab from "../../prefab/fightRoom/RolePreafab";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fight extends cc.Component {

    @property(cc.Node)
    preRoot:cc.Node = null;

    @property(cc.Label)
    myFightNumner:cc.Label = null;

    @property(cc.Label)
    LevelName:cc.Label = null;

    @property(cc.Label)
    enumyFightNumber:cc.Label = null;

    @property(cc.Node)
    myHeroList :cc.Node = null;

    @property(cc.Prefab)
    itemRole:cc.Prefab = null;

    @property(cc.Prefab)
    rolePrefab:cc.Prefab = null;

    @property(cc.Node)
    middlePlace : cc.Node = null;

    @property(cc.Node)
    fightRoot:cc.Node = null;

    @property(cc.Node)
    fightSence:cc.Node = null;

    heroPool :cc.NodePool = new cc.NodePool();

    heroNodeArr:cc.Node[] = [];
    monsterNodeArr:cc.Node[] = [];

    chooseCnt = 0;

    monsters:{}[] = [];

    hitEffefPool:cc.NodePool = new cc.NodePool();

    @property(cc.Prefab)
    hitEffectPrefab : cc.Prefab = null;

    @property(cc.Node)
    tips:cc.Node = null;


    status = 'pre'; //状态阶段
    @property(cc.Label)
    winMessage:cc.Label = null;


    //关卡信息
    levelObj:{}= {};
    rewards:{}[] = [];
    exps:number = 0;
    level_id :number=0;
    myHeros:{}[] = [];
    onLoad(){
        //获取传递来的关卡信息，包括关卡怪物。
        // this.monsters = [
        //     {hero_id:1,level:200}
        // ];

        this.fightRoot.active = !this.fightRoot.active;

        this.init();
    }

    init(){
        //获取用户准备进行的关卡信息
        const nodeData = cc.find('dataNode').getComponent(DataNode).getData();
        if(nodeData.hasOwnProperty("monsters")){
            this.rewards = nodeData['rewards'];
            if(this.rewards.hasOwnProperty('exp')){
                this.exps = this.rewards['exp'];
            }
            this.monsters = nodeData["monsters"];
            this.level_id = nodeData['id'];
            this.LevelName.string = nodeData['name'];
        }

        this.refrashFightNumber();
        cc.director.on('showInMiddleSence',function(myRole){
            const res = jslinq(Hero).where(p => p['id'] == myRole['hero_id']).firstOrDefault();
            this.showHeroInMiddle(res,myRole);
        },this);

        cc.director.on('removeInMiddleSence',function(myRole){
            this.removeInMiddleSence(myRole);
        },this);

        this.myHeros = Global.playerControl.hero;
        this.myHeros.forEach(element => {
            const itemHeroNode:cc.Node = cc.instantiate(this.itemRole);
            itemHeroNode.parent = this.myHeroList;
            itemHeroNode.getComponent(ItemRole).init(element);
        });

        this.showMonster();
        this.showDefaultHero();
    }

    showMonster(){
        let index = 0;
        this.monsters.forEach(element => {
            index++;
            const res = jslinq(Hero).where(p => p['id'] == element['hero_id']).firstOrDefault();
            const itemHeroNode = Utils.getPoolNode(this.heroPool,this.rolePrefab);
            itemHeroNode.getComponent(RolePreafab).init(0,res,this,element);
            itemHeroNode.setPosition(this.middlePlace.width/4,this.middlePlace.height*(4-index)/4 - this.middlePlace.height/2);
            itemHeroNode.scaleX = - itemHeroNode.scaleX;
            itemHeroNode.parent = this.middlePlace;
            this.monsterNodeArr.push(itemHeroNode);
        });
    }

    showDefaultHero(){
        const myDefaultHero = Global.playerControl.myDefaultHero;
        // myDefaultHero.forEach(h_id => {
        //     const res = jslinq(Hero).where(p => p['id'] == h_id).firstOrDefault();
        //     const myRole = jslinq(this.myHeros).where(p => p['hero_id'] == h_id).firstOrDefault();
            
        // });
        
        this.myHeroList.children.forEach(element => {
            const ItemRoleClassObj = element.getComponent(ItemRole);
            const h_id = ItemRoleClassObj.heroId;
            if(myDefaultHero.indexOf(h_id)>=0){
                const myRole = jslinq(this.myHeros).where(p => p['id'] == h_id).firstOrDefault();
                ItemRoleClassObj.clickTNode(myRole);
            }
        });
    }

    showHeroInMiddle(res,myRole){
        this.chooseCnt++;
        const itemHeroNode = Utils.getPoolNode(this.heroPool,this.rolePrefab);
        itemHeroNode.getComponent(RolePreafab).init(1,res,this,myRole);
        // itemHeroNode.getComponent(RolePreafab).rolename = '玩家';
        itemHeroNode.setPosition(-this.middlePlace.width/4,this.middlePlace.height*(4-this.chooseCnt)/4 - this.middlePlace.height/2);
        itemHeroNode.parent = this.middlePlace;
        this.heroNodeArr.push(itemHeroNode);

        this.refrashFightNumber();
    }

    removeInMiddleSence(myRole){
        this.chooseCnt--;
        let index = 0;
        const tempArr:cc.Node[] = this.heroNodeArr;

        tempArr.forEach(element => {
            if(element.getComponent(RolePreafab).hero_id == myRole['id']){
                this.heroNodeArr.splice(index,1);
                Utils.putPoolNode(element,this.heroPool);
            }
            index++;
        });

        this.refrashFightNumber();
    }

    returnWar(){
        cc.find('dataNode').getComponent(DataNode).data ={'backMain':true,'senceIndex': SenceIndex['War']};
        cc.director.loadScene("main");
    }

    startFight(){
        this.status = 'fighting';
        this.fightRoot.active = !this.fightRoot.active;
        this.preRoot.active = !this.preRoot.active;
        //获取我方选定角色

        //记录我常用英雄组合
        let myDefaultHero:number[] = Global.playerControl.myDefaultHero;

        myDefaultHero = [];
        //把准备界面新建的对象移动到战斗画面来,并开始战斗
        this.heroNodeArr.forEach(element => {
            element.parent = this.fightSence;
            const eleObj = element.getComponent(RolePreafab);
            eleObj.startAction();
            myDefaultHero.push(eleObj.hero_id);
        });

        Global.playerControl.myDefaultHero = myDefaultHero;
        Global.playerControl.fightNumber = parseInt( this.myFightNumner.string);
        //保存我的常用英雄
        Global.playerControl.saveUserData();

        this.monsterNodeArr.forEach(element => {
            element.parent = this.fightSence;
            const eleObj = element.getComponent(RolePreafab);
            eleObj.startAction();
        });

    }


    update(){
        if(this.status == 'fighting'){
            this.isWin();
        }
    }

    //判断胜利条件
    isWin(){
        let monsetCnt = 0;
        this.winMessage.string='失败了';
        //判断哪一方人员已全部死亡
        this.monsterNodeArr.forEach(element => {
            if(element != null){
                monsetCnt++;
            }
        });

        let heroCnt = 0;
        //判断哪一方人员已全部死亡
        this.heroNodeArr.forEach(element => {
            if(element != null){
                heroCnt++;
                
                
            }
        });


        if(monsetCnt*heroCnt <1){
            this.status = 'finished';
            this.scheduleOnce(function(){
                this.tips.active = true;
                if(heroCnt>0){
                    this.winMessage.string='胜利了';
                    Global.playerControl.capture_level_id = this.level_id;
                    Global.playerControl.cLevelExp  += this.exps;
                    Global.playerControl.saveUserData();
                }
            },2);
        }
    }

    returnToWar(){
        cc.find('dataNode').getComponent(DataNode).data ={'backMain':true,'senceIndex': SenceIndex.War};
        cc.director.loadScene('main');
    }

    refrashFightNumber(){
        let mNumberTemp = 0;
        if(this.monsterNodeArr.length>0){
            this.monsterNodeArr.forEach(element => {
                mNumberTemp+=element.getComponent(RolePreafab).getFightNumber();
            });
        }
        this.enumyFightNumber.string = mNumberTemp+'';

        let hNumberTemp = 0;
        if(this.heroNodeArr.length > 0){
            this.heroNodeArr.forEach(element => {
                hNumberTemp+=element.getComponent(RolePreafab).getFightNumber();
            });
        }
        this.myFightNumner.string = hNumberTemp+'';
    }

}
