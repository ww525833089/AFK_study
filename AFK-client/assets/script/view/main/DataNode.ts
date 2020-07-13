// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DataNode extends cc.Component {

    data:any = {};

    onLoad(){
        cc.game.addPersistRootNode(this.node);
    }

    getData():any{
        let temp = this.data;
        this.data = {};
        return temp;
    }

    setDefault():any{
        this.data = {};
    }
}
