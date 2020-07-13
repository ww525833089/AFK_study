// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import jslinq = require('jslinq');

export default class PlayerModel {
    constructor(){
       
    }

    getUserData():{}{
        return JSON.parse(cc.sys.localStorage.getItem('userData'));
    }


    saveUserData(userData:{}){
        cc.sys.localStorage.setItem('userData',JSON.stringify(userData));
    }
}
