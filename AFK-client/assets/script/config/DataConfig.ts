
export default class DataConfig {


    userData = [{
        name:'极限',
        tx : '4',
        level : 80,
        gold_count : 610000,
        diamond_count : 4010,
        fightNumber : 1300000,
        mobile:18571500723,
        pwd:111111
    }];

    //种族
    roleRaceData=[
        {code:'1',name:'耀光'},
        {code:'2',name:'蛮血'},
        {code:'3',name:'绿裔'},
        {code:'4',name:'亡灵'},
    ];
    //种族
    roleVocationData=[
        {code:'1',name:'法师'},
        {code:'2',name:'战士'},
        {code:'3',name:'坦克'},
        {code:'4',name:'刺客'},
        {code:'5',name:'辅助'},
    ];

    roleData = [
        {code:1,name:'雪米拉',maxLevel:240,maxBlood:524000,maxAttack:49181,maxDefence:49181,race_id:4,vocation_id:1,mainDuty:'法师',secondaryDuty:'群伤',skill:[
            {name:'幽魂环绕',isAuto:false,icon:'',desc:'雪米拉释放大量幽魂环绕自身，对附近敌人持续造成伤害，持续12秒,持续时间结束后，期间造成总伤害的50%将转化为自身的生命恢复。'},
            {name:'生命汲取',isAuto:false,icon:'',desc:'雪米拉释放大量幽魂环绕自身，对附近敌人持续造成伤害，持续12秒,持续时间结束后，期间造成总伤害的50%将转化为自身的生命恢复。'},
            {name:'灵魂枷锁',isAuto:false,icon:'',desc:'雪米拉释放大量幽魂环绕自身，对附近敌人持续造成伤害，持续12秒,持续时间结束后，期间造成总伤害的50%将转化为自身的生命恢复。'},
            {name:'灵体',isAuto:true,icon:'',desc:'雪米拉生命越多时，获得至多30%的额外攻击力。'},
        ]}
    ]



    
  
}
