export default class Utils {
    /**
     * 从对象池中取节点
     * @param nodePool 节点池
     * @param prefab 预制体
     */
    public static getPoolNode(nodePool: cc.NodePool, prefab: cc.Prefab): cc.Node {
        let node: cc.Node = null;
        if (nodePool.size() > 0) {
            node = nodePool.get();
        } else {
            node = cc.instantiate(prefab);
        }
        return node;
    }

    /**
     * 把对象放回池中
     * @param node 节点
     * @param nodePool 对象池
     */
    public static putPoolNode(node: cc.Node, nodePool: cc.NodePool): void {
        nodePool.put(node);
    }


    static convertNumber2Str(num:number):string{
        const m_unit:number = num/1000000;
        const k_unit:number = num/1000;
        if(m_unit>10){
            return Math.floor(m_unit)+'M';
        }else if(k_unit>10){
            return Math.floor(k_unit)+'K';
        }
        return num+'';
    }

    static _addSpritePic(container:any,addres:any){
        cc.loader.loadRes(addres, cc.SpriteFrame, function (err, spFrame) {
            container.spriteFrame = spFrame           
        });
    }


}

