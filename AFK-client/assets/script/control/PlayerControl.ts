// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerModel from '../model/PlayerModel';

export default class PlayerControl{

    playerModel:PlayerModel = new PlayerModel();
    
    tx:string;//头像

    name:string;//昵称

    level:number;//级别

    gold_count:number;//金子数量

    diamond_count:number;//钻石数量

    fightNumber:number;//战斗力

    package:{}[];//背包

    hero:{}[];//英雄

    myDefaultHero:number[];//我的默认英雄组合


    capture_level_id = 0;

    cLevelExp = 0; //当前级别获得的经验

    cUserData:{} = {}; 
    constructor(){
        
    }

    getUserData(){
        //初始化时，生成默认属性
        let userData =  this.playerModel.getUserData();
        if(userData == null||userData['name']==undefined){
            userData = {
                name:'极限',
                tx:'4',
                level: 0,
                gold_count:0,
                diamond_count:0,
                fightNumber:0,
                package:[],//背包
                hero:[],//英雄
                myDefaultHero:[],//常用英雄组合
                capture_level_id:0,
                cLevelExp:0,
            };
            
            this.playerModel.saveUserData(userData);
        }
        this.tx = userData['tx'];
        this.name = userData['name'];
        this.level = userData['level'];
        this.gold_count = userData['gold_count'];
        this.diamond_count = userData['diamond_count'];
        this.fightNumber = userData['fightNumber'];
        this.package = userData['package'];
        this.hero = userData['hero'];
        this.myDefaultHero = userData['myDefaultHero'];
        this.capture_level_id = userData['capture_level_id'];
        this.cLevelExp = userData['cLevelExp'];
        this.cUserData = userData;
        return userData;
    }


    saveUserData(){
        while(this.cLevelExp>10*this.level*this.level){
            this.level ++;
            this.cLevelExp  -= 10*this.level*this.level;
        }

        this.playerModel.saveUserData({
            name:this.name,
            tx:this.tx,
            level: this.level,
            gold_count:this.gold_count,
            diamond_count:this.diamond_count,
            fightNumber:this.fightNumber,
            package:this.package,//背包
            hero:this.hero,//英雄
            myDefaultHero:this.myDefaultHero,
            capture_level_id:this.capture_level_id,
            cLevelExp:this.cLevelExp,
        });
    }


}
