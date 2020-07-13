// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Global from '../Global';
import PlayerControl from '../control/PlayerControl'
import DataNode from './main/DataNode';
import { SenceIndex } from '../config/ItemConfig';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameControl extends cc.Component {

    @property(cc.Node)
    senceList:cc.Node[] = [];//场景集合

    @property
    curr_Sence_index = 0;//当前场景

    onLoad(){
        Global.gameControl = this;
        this.showSence();
        this.node.zIndex = 1;
    }

    //展示当前场景
    showSence(senceId?:number){
        if(senceId>0){
            if(senceId==SenceIndex.Chat){
                cc.director.loadScene('ChatRoom');
            }else{
                this.curr_Sence_index = senceId;
            }
        }

        // cc.find('dataNode').getComponent(DataNode).data = {name:'Json'};
        const nodeData = cc.find('dataNode').getComponent(DataNode).getData();
        // console.log(nodeData);
        // console.log(cc.find('dataNode').getComponent(DataNode).data);
        if(nodeData['backMain']&&nodeData['senceIndex']!=undefined){
            this.curr_Sence_index = nodeData['senceIndex'];
            // cc.find('dataNode').getComponent(DataNode).setDefault();
        }

        this.senceList.forEach(ele=>{
            ele.zIndex = -1;
        });
        this.senceList[this.curr_Sence_index].zIndex = 1; 
    }
}
