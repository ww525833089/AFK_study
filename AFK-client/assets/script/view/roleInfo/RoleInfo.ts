// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from "../../Global";
import { SenceIndex, Hero, Skill, Equipment } from "../../config/ItemConfig";
import DataNode from "../main/DataNode";
import jslinq = require("jslinq");
import Utils from "../../help/Utils";
import RolePreafab from "../../prefab/fightRoom/RolePreafab";
import EquipmentInfoBox from "../../prefab/equipment/EquipmentInfoBox";
import ChooseEquipmentBox from "../../prefab/equipment/ChooseEquimpentBox";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RoleInfo extends cc.Component {

    @property(cc.Label)
    roleName:cc.Label = null

    @property(cc.Node)
    roleRootNode:cc.Node = null;

    @property(cc.Node)
    equipment_root:cc.Node = null; //装备根节点

    @property(cc.Node)
    skill_root:cc.Node = null;//技能根节点
    @property(cc.Node)
    btn_showEqui:cc.Node = null
    @property(cc.Node)
    btn_showSkill:cc.Node = null;

    dragonDisplay:dragonBones.ArmatureDisplay = null;

    
    @property(cc.Prefab)
    rolePrefab:cc.Prefab = null;

    @property(cc.Prefab)
    equipmentInfoBoxPrefab :cc.Prefab = null;

    @property(cc.Prefab)
    chooseEquipmentBox:cc.Prefab = null;

    @property(cc.Label)
    lblLevel:cc.Label = null;
    @property(cc.Label)
    lblBlood:cc.Label = null;
    @property(cc.Label)
    lblAttack:cc.Label = null;
    @property(cc.Label)
    lblDefense:cc.Label = null;

    myRoleObj:{} = {};
    roleObj:{} = {};

    roleClassObj:RolePreafab = null;

    onLoad(){
        this.equipment_root.active=false;
        this.init();

    }

    init(){

        //默认显示装备
        this.showEquip();

        //获取页面传来的值
        this.myRoleObj =  cc.find('dataNode').getComponent(DataNode).getData();
        // cc.find('dataNode').getComponent(DataNode).setDefault();
        this.roleObj = jslinq(Hero).where(p => p['id'] == this.myRoleObj['hero_id']).firstOrDefault();
         
        //绑定角色名
        this.roleName.string = this.roleObj['name'];
        //绑定龙骨动画
        // this.dragonDisplay = this.roleNode.getComponent(dragonBones.ArmatureDisplay);       
        // const db = res['db'];
        // cc.loader.loadResDir("role/role_db/"+db,cc.Asset,null,(err, resource)=>{
        //     this.dragonDisplay.dragonAsset = resource[0];
        //     this.dragonDisplay.dragonAtlasAsset = resource[3];
        //     this.dragonDisplay.armatureName = db;
        //     this.dragonDisplay.playAnimation("steady",0);
        // });
        //初始化角色
        const roleNode =  cc.instantiate(this.rolePrefab);
        this.roleClassObj = roleNode.getComponent(RolePreafab);
        this.roleClassObj.init(1,this.roleObj,null,this.myRoleObj);
        roleNode.setPosition(cc.v2(0,0));
        roleNode.parent = this.roleRootNode;

        //显示角色属性面板
        this.lblLevel.string = this.myRoleObj['level']+'级'
        this.lblBlood.string ='血量：'+ this.roleClassObj.blood;
        this.lblAttack.string ='攻击：'+ this.roleClassObj.attack;
        this.lblDefense.string ='防御：'+ this.roleClassObj.defense;
        

        //绑定技能
        const skillList =  this.roleObj['skill'];
        let skillNodes:cc.Node[] = this.skill_root.children;
        let index = 0;
        skillList.forEach(element => {
            const cnode =  skillNodes[index];
            index++;
            const skillObj = jslinq(Skill).where(p => p['skill_id'] == element['skill_id']).firstOrDefault();
            let cnSprite:cc.Sprite = cnode.getComponent(cc.Sprite);
            Utils._addSpritePic(cnSprite,skillObj['icon']);
            
            cnode.on(cc.Node.EventType.TOUCH_START,function(){
                roleNode.getComponent(RolePreafab).doAttack(skillObj,true);
            },this)
            // this.dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, this.onFrameEvent, this);
        },);

        //绑定装备
        let eNodes:cc.Node[] = this.equipment_root.children;
        eNodes.forEach(element => {
            const equipmentObj = jslinq(Equipment).where(e => e['e_id'] == this.myRoleObj[element.name]).firstOrDefault();
            if(equipmentObj!=null){
                const spriteNode:cc.Node =  new cc.Node(element.name+'_sp');                 
                let cnSprite:cc.Sprite = spriteNode.addComponent(cc.Sprite);
                Utils._addSpritePic(cnSprite,equipmentObj['icon']);
                element.addChild(spriteNode);
            }
            
            const that = this;
            element.on(cc.Node.EventType.TOUCH_START,function(event){
                if(event.target.children.length == 0){
                    const chooseEquipmentBoxNode =  cc.instantiate(that.chooseEquipmentBox);
                    chooseEquipmentBoxNode.getComponent(ChooseEquipmentBox).init(event.target.name,that.myRoleObj);
                    chooseEquipmentBoxNode.parent = that.node;

                }
                else{
                    //弹出装备说明框
                    const equipmentInfoBoxNode =  cc.instantiate(that.equipmentInfoBoxPrefab);
                    equipmentInfoBoxNode.getComponent(EquipmentInfoBox).init(equipmentObj,that.myRoleObj,event.target);
                    equipmentInfoBoxNode.parent = that.node;
                }

            },that);
        });

        
        //关注脱装事件
        this.node.on('takeOff',this.refreashProps, this);
        //关注穿装时间
        this.node.on('putOn',function(event){
            // 终止自定义冒泡事件派发
            event.stopPropagation();
            this.refreashProps();
        }, this);
    }


    showEquip(){
        this.btn_showEqui.getChildByName('bg').color = cc.Color.GREEN;
        this.btn_showSkill.getChildByName('bg').color = cc.Color.WHITE;
        this.equipment_root.active= true;
        this.skill_root.active =false;
    }

    showSkill(){
        this.btn_showSkill.getChildByName('bg').color = cc.Color.GREEN;
        this.btn_showEqui.getChildByName('bg').color = cc.Color.WHITE;
        this.equipment_root.active= false;
        this.skill_root.active =true;
    }

    upLevel(){
        this.myRoleObj['level'] += 1;
        Global.playerControl.saveUserData();

        this.refreashProps();
    }

    //更新属性和装备显示
    refreashProps(){

        this.roleClassObj.initProps(this.roleObj,this.myRoleObj)
        //显示角色属性面板
        this.lblLevel.string = this.myRoleObj['level']+'级'
        this.lblBlood.string ='血量：'+ this.roleClassObj.blood;
        this.lblAttack.string ='攻击：'+ this.roleClassObj.attack;
        this.lblDefense.string ='防御：'+ this.roleClassObj.defense;

        //绑定装备
        let eNodes:cc.Node[] = this.equipment_root.children;
        eNodes.forEach(element => {
            const equipmentObj = jslinq(Equipment).where(e => e['e_id'] == this.myRoleObj[element.name]).firstOrDefault();
            if(equipmentObj!=null){
                const spriteNode:cc.Node =  new cc.Node(element.name+'_sp');                 
                let cnSprite:cc.Sprite = spriteNode.addComponent(cc.Sprite);
                Utils._addSpritePic(cnSprite,equipmentObj['icon']);
                element.addChild(spriteNode);                
            }else{
                element.removeAllChildren();
            }
        });
    }


    returnHeroList(){
        cc.find('dataNode').getComponent(DataNode).data ={'backMain':true,'senceIndex': SenceIndex['Hero']};
        cc.director.loadScene("main");
    }

}
