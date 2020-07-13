// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import PinusHelp from "../../pinus/PinusHelp";
import Utils from "../../help/Utils";
import ChatControl from "../../control/ChatControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Chat extends cc.Component {

    @property(cc.Node)
    mesContent:cc.Node = null;

    @property(cc.Prefab)
    itemMessagePrefab = null;

    @property(cc.EditBox)
    sendMessageEb:cc.EditBox = null;

    itemMessagePool:cc.NodePool = new cc.NodePool();

    chatCtrl:ChatControl = new ChatControl();

    roomId:string = '1';

    start(){
        // this.itemMessagePool = new cc.NodePool();
        this.listenServerMessage();
    }

    listenServerMessage(){
        const self = this;

        PinusHelp.listenMessage('onAdd',function(data){self.addUserShow(data,self)});
        PinusHelp.listenMessage('onLeave',function(data){self.leaveUserShow(data,self)});
        PinusHelp.listenMessage('onChat',function(data){self.chatShow(data,self) });
    }

    sendMessage(){
        let preSendMes = this.sendMessageEb.textLabel.string;
        const preData = {
            content:preSendMes,
            target:'*'
        }
        this.chatCtrl.sendChatMessage(this.roomId,preData,function(data){
            // console.log("消息发送成功");
        });
    }

 
    addUserShow(data,self){
        
        let itemMessageNode:cc.Node =  Utils.getPoolNode(self.itemMessagePool,self.itemMessagePrefab);
        itemMessageNode.getComponent(cc.Label).string = '登入消息：用户'+data['user']+'进入了聊天室';
        itemMessageNode.parent = self.mesContent;
    }

    leaveUserShow(data,self){

        let itemMessageNode:cc.Node =  Utils.getPoolNode(self.itemMessagePool,self.itemMessagePrefab);
        itemMessageNode.getComponent(cc.Label).string = '登出消息：用户'+data['user']+'离开了聊天室';
        itemMessageNode.parent = self.mesContent;
    }

    chatShow(data, self){

        let itemMessageNode:cc.Node =  Utils.getPoolNode(self.itemMessagePool,self.itemMessagePrefab);
        itemMessageNode.getComponent(cc.Label).string = '用户'+data['from']+'：'+data['msg'];
        itemMessageNode.parent = self.mesContent;
    }

    returnToMain(){
        cc.director.loadScene('main');
    }


}
