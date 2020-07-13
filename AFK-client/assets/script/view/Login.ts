// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PinusHelp from "../pinus/PinusHelp";
import LoginControl from "../control/LoginControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {

    loginCtrl:LoginControl =  new LoginControl();

    @property(cc.EditBox)
    lblUName:cc.EditBox = null;
    
    @property(cc.EditBox)
    lblUPsw:cc.EditBox = null;

    //请求登录
    queryLogin(){

        const username = this.lblUName.textLabel.string;
        const psw = this.lblUPsw.textLabel.string;

        if(!username||!psw){
            return;
        }

        const roomId = '1';

        this.loginCtrl.queryEntry({username:username,psw:psw,rid:roomId},this.gotoChat);        
    }

    gotoChat(data?:any){
        // console.log(data);
        cc.director.loadScene("Loading");
    }
}
