//角色类
export default class Role {

    //角色代号（外部引用）
    Code:string = '';

    //角色名称（米雪拉）
    Name:string = '';

    //角色最高等级
    MaxLeval:number = 0;

    //角色最大血量
    MaxBlood:number = 0;

    //角色最大攻击
    MaxAttack:number = 0;

    //角色最大防御
    MaxDefence:number = 0;

    OwnWeapon:{} = {};

    //技能集合
    Skill:{}[] = [];

    //种族
    Race:string = '';

    //职业
    Vocation :number =1;

    //主要职责
    MainDuty:string = '';

    //次要职责
    SecondaryDuty:string = '';
}
