var ItemType = require("ItemType");
var OwnedCarPanel = cc.Class({
    extends: cc.Component,

    properties: {
        ownedPre:cc.Prefab,
        ownedParent:cc.Node,
        tipLbl:cc.Label,
    },

    ShowPanel:function () {
        this.tipLbl.string = "";
        if(this.JudeHasAny() == false)
        {
            this.tipLbl.string = "您还未拥有任何一辆属于您的座驾,去汽车市场购买吧";
            //return;
        }

        var carList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Car);
        if(this.ownedParent.children.length != 0)
        {
            //cc.log("不用再实例化，已经有了");
            var children = this.ownedParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var sc = children[i].getComponent("BelongItem");
                if(sc != null)
                {
                    for (var j = 0; j < carList.length; j++) {
                        if(carList[j].Id == sc.Id)
                        {
                            sc.Refresh(carList[j]);
                            if(carList[j].ownNum > 0)
                                children[i].active = true;
                            else
                                children[i].active = false;    
                        }
                    }
                }
            }
        }
        else
        {
            for (var i = carList.length - 1; i >= 0; i--) {
                //cc.log("实例化汽车");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongItem").init(carList[i], ItemType.Car);
                if(carList[i].ownNum > 0)
                {
                    obj.active = true;
                }
                else
                {
                    obj.active = false;
                }
            }
        }
    },

    JudeHasAny:function(){
        var mateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Car);
        var hasAny = false;
        for (var i = 0; i < mateList.length; i++) {
            if(mateList[i].ownNum > 0)
            {
                hasAny = true;
                return true;
            }
        }
        return hasAny;
    },
});
module.exports = OwnedCarPanel;
