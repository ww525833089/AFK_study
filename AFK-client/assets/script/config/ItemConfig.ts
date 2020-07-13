export const  BottomMenuItems = [
        {name:'Area', icon:'btn_home',sence_index:0},
        {name:'Field', icon:'btn_raid',sence_index:1},
        {name:'War', icon:'btn_level',sence_index:2},
        {name:'Hero', icon:'btn_friends',sence_index:3},
        {name:'chat', icon:'btn_chat',sence_index:4},
]

export const  SenceIndex={
        Area:0,Field:1,War:2,Hero:3,Chat:4
}


export const Levels = [
        {id:1,name:'勇士降生',monsters:[{hero_id:1,level:1}],rewards:[{type:'exp',count:10}]},
        {id:2,name:'勇士成长',monsters:[{hero_id:1,level:2},{hero_id:1,level:2}],rewards:[{type:'exp',count:20}]},
        {id:3,name:'勇士训练1',monsters:[{hero_id:1,level:3},{hero_id:1,level:3}],rewards:[{type:'exp',count:30}]},
        {id:4,name:'勇士训练2',monsters:[{hero_id:1,level:4},{hero_id:1,level:4}],rewards:[{type:'exp',count:40}]},
        {id:5,name:'勇士训练3',monsters:[{hero_id:1,level:5},{hero_id:1,level:5}],rewards:[{type:'exp',count:50}]},
        {id:6,name:'勇士训练4',monsters:[{hero_id:1,level:6},{hero_id:1,level:6}],rewards:[{type:'exp',count:60}]},
        {id:7,name:'勇士训练5',monsters:[{hero_id:1,level:7},{hero_id:1,level:7}],rewards:[{type:'exp',count:70}]},
        {id:8,name:'勇士竞选1',monsters:[{hero_id:1,level:8},{hero_id:1,level:8}],rewards:[{type:'exp',count:80}]},
        {id:9,name:'勇士竞选2',monsters:[{hero_id:1,level:9},{hero_id:1,level:9}],rewards:[{type:'exp',count:90}]},
        {id:10,name:'勇士诞生',monsters:[{hero_id:1,level:10},{hero_id:1,level:10}],rewards:[{type:'exp',count:100}]}
]

export const Hero=[
        {id:1,name:'剑男',icons:'goods/ic_塞壬女妖',type:'英雄',detail:'一只巨大的蜘蛛，塞壬种族的女王',db:'SwordsMan',skill:[
                {skill_id:3},{skill_id:4}
        ],props:{blood:10,attack:1,defense:5},propsUp:{blood:5,attack:1,defense:5}},
        {id:5,name:'梦魇',icons:'goods/ic_梦魇',type:'英雄',detail:'一只巨大的蜘蛛，塞壬种族的女王',db:'Demon',skill:[
                {skill_id:1},{skill_id:2},{skill_id:5}
        ],props:{blood:5,attack:10,defense:2},propsUp:{blood:3,attack:5,defense:1}},
]

export const Skill = [
        {skill_id:1,level:1,name:'攻击1',icon:'role/skill_icon/skill_icon0',detail:'攻击1',damange:0.8,db_anim:'attack1',distance:200},
        {skill_id:2,level:1,name:'攻击2',icon:'role/skill_icon/skill_icon1',detail:'攻击2',damange:1,db_anim:'attack3',distance:200},
        {skill_id:3,level:1,name:'攻击1',icon:'role/skill_icon/skill_icon0',detail:'攻击1',damange:1,db_anim:'attack1',distance:10},
        {skill_id:4,level:1,name:'攻击2',icon:'role/skill_icon/skill_icon1',detail:'攻击2',damange:1.2,db_anim:'attack2',distance:10},
        {skill_id:5,level:1,name:'攻击3',icon:'role/skill_icon/skill_icon1',detail:'攻击3',damange:1.8,db_anim:'attack2',distance:200},
];

export const Equipment = [
        {e_id:1,star:0,name:'新手武器',type:'e1',icon:'equipment/weapon/weapon1',props:{attack:100,defense:5}},
        {e_id:2,star:0,name:'新手头盔',type:'e2',icon:'equipment/hat/hat1',props:{blood:100,defense:5}},
        {e_id:3,star:0,name:'新手衣服',type:'e3',icon:'equipment/clothe/clothe1',props:{attack:10,blood:200,defense:10}},
        {e_id:4,star:0,name:'新手鞋子',type:'e4',icon:'equipment/shoe/shoe1',props:{attack:10,blood:100,defense:5}},
        {e_id:5,star:0,name:'神器',type:'e5',icon:'equipment/zs/ring1',props:{attack:100,blood:500}},
        {e_id:6,star:0,name:'专属',type:'e6',icon:'equipment/zs/ring1',props:{attack:50,blood:200}},
]

export const  Goods=[
        {id:1,icons:'goods/ic_塞壬女妖',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
        {id:2,icons:'goods/ic_巨型蜘蛛',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
        {id:3,icons:'goods/ic_木乃伊',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
        {id:4,icons:'goods/ic_木乃伊变色',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
        {id:5,icons:'goods/ic_炮台龟',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
        {id:6,icons:'goods/ic_甲壳虫黄',type:'灵魂石',detail:'收集60个精英灵魂石，可召唤一个英雄'},
]

export const ShopHero=[
        {hero_id:1,goods_icons:'goods/ic_塞壬女妖',goods_count:1,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'hero'},
        {hero_id:5,goods_icons:'goods/ic_巨型蜘蛛',goods_count:1,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'hero'},
]

export const  ShopGoods=[
        {goods_id:1,goods_icons:'goods/ic_塞壬女妖',goods_count:2,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'prop'},
        {goods_id:1,goods_icons:'goods/ic_塞壬女妖',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:2,goods_icons:'goods/ic_巨型蜘蛛',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:2,goods_icons:'goods/ic_巨型蜘蛛',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:3,goods_icons:'goods/ic_木乃伊',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:3,goods_icons:'goods/ic_木乃伊',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:4,goods_icons:'goods/ic_木乃伊变色',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:4,goods_icons:'goods/ic_木乃伊变色',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:5,goods_icons:'goods/ic_炮台龟',goods_count:2,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'prop'},
]


export const  ShopEquiment=[
        {goods_id:1,goods_icons:'goods/ic_塞壬女妖',goods_count:2,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'prop'},
        {goods_id:1,goods_icons:'goods/ic_塞壬女妖',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:2,goods_icons:'goods/ic_巨型蜘蛛',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:2,goods_icons:'goods/ic_巨型蜘蛛',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:3,goods_icons:'goods/ic_木乃伊',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:3,goods_icons:'goods/ic_木乃伊',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:4,goods_icons:'goods/ic_木乃伊变色',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:4,goods_icons:'goods/ic_木乃伊变色',goods_count:2,goods_m_type_pic:'icons/money/icon_gold',goods_price:10,type:'prop'},
        {goods_id:5,goods_icons:'goods/ic_炮台龟',goods_count:2,goods_m_type_pic:'icons/money/icon_diamond',goods_price:10,type:'prop'},
]
