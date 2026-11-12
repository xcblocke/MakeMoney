var ItemType = require("ItemType");
var MateTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
       mateItem:cc.Prefab,
       mateParent:cc.Node,
       hasInit:false,
    },

    ShowPanel:function () {
        if(this.hasInit == true)
        {
            this.RefreshPanelItems();
            //cc.log("已经初始化了，返回");
            return;
        }
        var MateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Mate);
        var dataList = this.getMateListBySex(cc.Mgr.UserDataMgr.Sex, MateList);
        for (var i = 0; i <= dataList.length - 1; i++) {
            //if() 判断解锁条件  我们会有男女的区别
            var data = dataList[i];
            var obj = cc.instantiate(this.mateItem);
            obj.parent = this.mateParent;
            obj.getComponent("MateItem").init(data);
            
        }
        this.hasInit = true;
    },

    getMateListBySex:function(Sex, dataList){
        var param = [];
        for (var i = 0; i < dataList.length; i++) {
            if(Sex == dataList[i].sex)
            {
                param.push(dataList[i]);
            }
        }
        return param;
    },

    RefreshPanelItems:function(){
        var children = this.mateParent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var sc = children[i].getComponent("MateItem");
            if(sc != null)
            {
                var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Mate, sc.Id);
                sc.RefreshLovePoint(data);
                if(data.canDate)
                {
                    sc.ChangeUnLockState(data);
                    //children[i].active = true;
                }  
            }
        }
    },

    RefreshPanel:function(Id){
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Mate, Id);
        //cc.log("============" + data.LovePoint);
        var children = this.mateParent.children;
        for (var i = children.length - 1; i >= 0; i--) {
            var sc = children[i].getComponent("MateItem");
            if(sc != null)
            {
                if(sc.Id == Id)
                {
                    if(data.canDate)
                    {
                        children[i].active = true;
                        sc.RefreshLovePoint(data);
                    }
                    break;
                }
            }
        }
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
    
});
module.exports = MateTipPanel;
