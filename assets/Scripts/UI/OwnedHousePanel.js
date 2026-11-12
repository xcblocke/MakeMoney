var ItemType = require("ItemType");
var OwnedHousePanel = cc.Class({
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
            this.tipLbl.string = "居无定所,不是您的所想,去房产市场购买一套房产吧";
            //return;
        }

        var houseList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.House);
        if(this.ownedParent.children.length != 0)
        {
            //cc.log("不用再实例化，已经有了");
            var children = this.ownedParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var sc = children[i].getComponent("BelongItem");
                if(sc != null)
                {
                    for (var j = 0; j < houseList.length; j++) {
                        if(houseList[j].Id == sc.Id)
                        {
                            sc.Refresh(houseList[j]);
                            if(houseList[j].ownNum > 0)
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
            for (var i = houseList.length - 1; i >= 0; i--) {
                //cc.log("实例化房子");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongItem").init(houseList[i], ItemType.House);
                if(houseList[i].ownNum > 0)
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
        var mateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.House);
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
module.exports = OwnedHousePanel;
