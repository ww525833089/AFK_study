// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class FightItemRole extends cc.Component {

    @property(cc.Node)
    roleNode:cc.Node = null;

    dragonDisplay = null;

    //初始化英雄显示
    init(roleObj){
        console.log(1);
         //绑定龙骨动画
         this.dragonDisplay = this.roleNode.getComponent(dragonBones.ArmatureDisplay);       
         
         cc.loader.loadResDir("role/role_db/"+roleObj,cc.Asset,null,(err, resource)=>{
             this.dragonDisplay.dragonAsset = resource[0];
             this.dragonDisplay.dragonAtlasAsset = resource[3];
             this.dragonDisplay.armatureName = roleObj;
             this.dragonDisplay.playAnimation("steady",0);
         });
    }
}
