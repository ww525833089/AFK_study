// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Fight from "../../view/fightRoom/Fight";
import Utils from "../../help/Utils";
import hitEffect from "./hitEffect";
import jslinq = require("jslinq");
import { Skill, Equipment } from "../../config/ItemConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RolePreafab extends cc.Component {

    //角色所属
    belongs = 1;//0电脑1自己

    hero_id = 0;
    blood = 10;//血量
    MaxBlood = 10;//最大血量
    @property(cc.ProgressBar)
    bloodBar :cc.ProgressBar = null;
    rolename:string = '';
    attack = 1; //基础攻击
    defense = 0;//基础防御
    moveSpeed = 50;


    skill:{}[] = [];

    status:string = 'stop';

    targetNode:cc.Node = null;

    dragonDisplay:dragonBones.ArmatureDisplay = null;

    selfNodeArr:cc.Node[]= [];
    enumyNodeArr:cc.Node[] = [];
    fightObj:Fight = null;  


    minXDistanceWtatget = 0; //和目标的最近距离
    minYDistanceWtatget = 0; //和目标的最近距离

    cDistanceX = 0;//当前和目标的X轴距离
    cDistanceY = 0;//当前和目标的y轴距离

    //初始化英雄显示
    init(belongs:number,roleObj,fightObj:Fight,myRole){
        this.fightObj = fightObj;
        this.belongs= belongs;
        this.hero_id = myRole['id'];
        this.skill = roleObj['skill'];
        this.initProps(roleObj,myRole);
         //绑定龙骨动画
         this.dragonDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);       

         cc.loader.loadResDir("role/role_db/"+roleObj['db'],cc.Asset,null,(err, resource)=>{
             this.dragonDisplay.dragonAsset = resource[0];
             this.dragonDisplay.dragonAtlasAsset = resource[3];
             this.dragonDisplay.armatureName = roleObj['db'];
             this.dragonDisplay.playAnimation("steady",0);
         });

        if(fightObj!=null){
            if(belongs==1){
                this.selfNodeArr = fightObj.heroNodeArr;
                this.enumyNodeArr = fightObj.monsterNodeArr;
            }else{
                this.selfNodeArr = fightObj.monsterNodeArr;
                this.enumyNodeArr = fightObj.heroNodeArr;
            }
        
            this.node.scale = 0.2;
            this.node.height = this.node.height*0.2;
        }else{
            this.bloodBar.node.active =false;
        }
        
         //这里拓展可以new 自定义的对象来操作对应的英雄。暂时写成比较固定的

    }

    //初始化英雄属性
    initProps(roleObj:{},myRole:{}){

        //获取英雄初始血量+装备血量+成长血量
        let initBlood = roleObj['props']['blood']+myRole['level']*roleObj['propsUp']['blood'];
        let initAttack = roleObj['props']['attack']+myRole['level']*roleObj['propsUp']['attack'];
        let initDefense = roleObj['props']['attack']+myRole['level']*roleObj['propsUp']['attack'];

        let equipBlood = 0;
        let equipAttack = 0;
        let equipDefense = 0;
        for (let index = 0; index < 6; index++) {
            const equipmentObj:{} = jslinq(Equipment).where(e => e['e_id'] == myRole['e'+(index+1)]).firstOrDefault();
            // console.log(equipmentObj);
            if(equipmentObj==null) break;
            const eProps = equipmentObj['props'];
            if(eProps.hasOwnProperty('blood')){
                equipBlood+= eProps['blood'];
            }
            if(eProps.hasOwnProperty('attack')){
                equipAttack+= eProps['attack'];
            }
            if(eProps.hasOwnProperty('defense')){
                equipDefense+= eProps['defense'];
            }
            
        }
        
        this.MaxBlood = initBlood+equipBlood;
        this.blood = initBlood+equipBlood;
        this.attack = initAttack+equipAttack;
        this.defense = initDefense +equipDefense;
    }
    

    AI(){
        
        // //模拟一个思考过程
        // this.schedule(function(){
        //     console.log("ai");
        //     if(this.status=='dead'){ 
        //         return ;
        //     }

        //     const distance = this.findAttackObj();
        //     if(this.targetNode ==null||this.targetNode.name == '') { 
        //         if(this.status!='freeing'){
        //             this.status = 'free';
        //         }
        //         return
        //     };
        //     console.log(this.targetNode);
        //     //思考用什么技能，根据技能释放距离判断要不要移动
        //     if(this.status != 'attacking'){
        //         const cSkill = this.skill[Math.floor( Math.random()*this.skill.length)]

        //         const skillObj = jslinq(Skill).where(p => p['skill_id'] == cSkill['skill_id']).firstOrDefault();
        //         this.minXDistanceWtatget += skillObj['distance'];
        //         if(this.cDistanceX<this.minXDistanceWtatget && this.cDistanceY<this.minYDistanceWtatget){
        //             this.doAttack(skillObj);
        //         }else{
        //             this.walk();
        //         }
        //     }

        // },1,cc.macro.REPEAT_FOREVER,0)

        this.schedule(this.AI_thought,1/60,cc.macro.REPEAT_FOREVER,0);
    }

    AI_thought(){
        if(this.status=='dead'||this.status=='deading'){ 
            this.unschedule(this.AI_thought);
            return ;
        }

        const distance = this.findAttackObj();
        if(this.targetNode ==null||this.targetNode.name == '') { 
            if(this.status!='freeing'){
                this.status = 'free';
            }
            return
        };
        //思考用什么技能，根据技能释放距离判断要不要移动
        if(this.status != 'attacking'){
            const cSkill = this.skill[Math.floor( Math.random()*this.skill.length)]

            const skillObj = jslinq(Skill).where(p => p['skill_id'] == cSkill['skill_id']).firstOrDefault();
            this.minXDistanceWtatget += skillObj['distance'];
            this.minYDistanceWtatget += skillObj['distance'];
            if(this.cDistanceX<this.minXDistanceWtatget && this.cDistanceY<this.minYDistanceWtatget){
                this.doAttack(skillObj,false);
            }else{
                this.walk();
            }
        }
    }


    lineNodeArr:cc.Node[] =[];
    //角色选择攻击对象
    findAttackObj(){
        
        this.lineNodeArr.forEach(element => {
            element.destroy();
        });
        this.lineNodeArr=[];

        // console.log(this.rolename);
        let distance_temp = 0;
        this.enumyNodeArr.forEach(element => {
            if(cc.isValid(element)){
                const distance = cc.Vec2.distance(this.node.position,element.position);
                if(distance<distance_temp||distance_temp==0){
                    this.targetNode = element;
                    distance_temp =distance;
                }
            }
        });
        

        let tNode =new cc.Node();
        tNode.parent = this.node.parent;
        this.lineNodeArr.push(tNode);
        if(this.targetNode!=null&&this.targetNode.name!=''){
            var g = tNode.addComponent(cc.Graphics);
            g.clear();
            g.lineWidth=5;
            if(this.belongs==1){
                g.fillColor = new cc.Color(255,0,0,255);
                g.moveTo(this.node.position.x+5,this.node.position.y+5);
                g.lineTo(this.targetNode.position.x+5,this.targetNode.position.y+5);
            }else{
                g.fillColor = new cc.Color(0,0,255,255);
                g.moveTo(this.node.position.x-5,this.node.position.y-5);
                g.lineTo(this.targetNode.position.x-5,this.targetNode.position.y-5);
            }
            g.close();
            g.stroke();
            g.fill();

            this.minXDistanceWtatget = (this.node.width + this.targetNode.width)*0.2/2;
            this.minYDistanceWtatget = (this.targetNode.height)*0.2/2;
            this.cDistanceX = Math.abs(this.node.x - this.targetNode.x);
            this.cDistanceY = Math.abs(this.node.y - this.targetNode.y);
        }
        

        return distance_temp;//返回离我最近的目标距离
    }

    update(dt){

        this.isDead();

        //在执行攻击动画时，目标死完了，终止攻击动画，等待下一次思考
        if(this.targetNode == null&&this.enumyNodeArr.length>0&&this.status=='attacking'){
            this.dragonDisplay.playAnimation('stead',0);
            this.status = 'free';
        }

        if(this.status=='deading'||this.status=='dead'||!cc.isValid(this.node)){return};

        if(this.status == 'free'){
            this.status = 'freeing';
            this.steadyAction();
        }
        else if(this.status == 'start'){
            this.status = 'free';
            this.AI();
        }
        else if(this.status == 'stop'){
            // this.status = 'stoping';
            //停止schedule
        }
        else if(this.status == 'walking'&&this.targetNode!=null&&cc.isValid(this.targetNode)){
            //计算出朝向
            var dx = this.targetNode.x - this.node.x;
            var dy = this.targetNode.y - this.node.y;
            var dir = cc.v2(dx,dy);
            //单位化向量
            dir.normalizeSelf();

            this.cDistanceX = Math.abs(this.node.x - this.targetNode.x);
            this.cDistanceY = Math.abs(this.node.y - this.targetNode.y);

            if(this.cDistanceX > this.minXDistanceWtatget){
                this.node.x += dt * dir.x * this.moveSpeed;
            }
            if(this.cDistanceY > this.minYDistanceWtatget){
                this.node.y += dt * dir.y * this.moveSpeed;
            }
        }
    }

    //开始行动
    
    startAction(){
        this.status = 'start'
    };

    //停止行动
    stopAction(){
        this.status = 'stop'
    }

    steadyAction(){
        this.dragonDisplay.playAnimation('steady',0);
    }

    //角色释放指定技能
    playTheSkill(skillObj){
        //方案1：生成技能效果对象，碰撞检测

        //方案2：计算伤害时机和对象
        
    }

    walk(){
        if(this.targetNode!=null&&this.status!='walking'){
            this.status = 'walking';
            this.dragonDisplay.playAnimation('walk',0);
        }
    }

    /**
     * 
     * @param skillObj 
     * @param isshow 是否为展示技能效果
     */
    doAttack(skillObj,isshow:boolean){
        if(isshow){
            this.status = 'attacking';
            this.dragonDisplay.playAnimation(skillObj['db_anim'],1);
            this.dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, function(eve){
                if(this.status == 'attacking'){
                    this.status ='free';
                }
            }, this);
        }
        else if(this.status!='attacking'&&this.targetNode!=null){
            this.status = 'attacking';
            //不同的攻击使用不同的技能效果,这里可以用继承和多态的方式写
            this.dragonDisplay.playAnimation(skillObj['db_anim'],1);

            const skillDamage = Math.floor(skillObj['damange']*this.attack);

            const targetNodeObj = this.targetNode.getComponent(RolePreafab);
            
            targetNodeObj.getHurt(skillDamage,this);
            this.dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, function(eve){
                if(this.status == 'attacking'){
                    this.status ='free';
                }
            }, this);
        }
    }



    getHurt(damage,attackObj){
        if(cc.isValid(this.node)&&this.node!=null&&attackObj.status=='attacking'){
            this.blood -= (damage - this.defense);
            this.bloodBar.progress = this.blood/this.MaxBlood;
            //判断是否死亡

            //显示伤害信息
            let effectNode:cc.Node =  Utils.getPoolNode(this.fightObj.hitEffefPool,this.fightObj.hitEffectPrefab);
            effectNode.y = this.node.height+10;
            effectNode.position = this.node.position;
            effectNode.parent = this.node.parent;
            effectNode.getComponent(hitEffect).init(this.fightObj,damage);
            this.isDead();
        }
    }


    isDead(){
        if(this.blood<1){

            if(this.status!='deading'){
                //播放死亡动画
                this.status = 'deading';

                this.dragonDisplay.playAnimation('dead',1);

                this.dragonDisplay.addEventListener(dragonBones.EventObject.COMPLETE, function(){
                    if(this.status == 'deading'){
                        this.status ='dead';
                        this.node.destroy();
                    }
                }, this);
            }
            
            //从数组中删除
            if(this.belongs==1){
                this.fightObj.heroNodeArr=this.fightObj.heroNodeArr.filter(item => item !== this.node);
            }else{  
                this.fightObj.monsterNodeArr=this.fightObj.monsterNodeArr.filter(item => item !== this.node);
            }


            this.lineNodeArr.forEach(element => {
                element.destroy();
            });

        }
    }

    getFightNumber(){
        return this.MaxBlood+this.attack+this.defense;
    }

}
