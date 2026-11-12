var ItemType = require("ItemType");
var OwnedMatePanel = cc.Class({
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
            this.tipLbl.string = "您还未与任何一位喜结良缘,去约会圣地约起来吧";
            //return;
        }

        var mateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Mate);
        if(this.ownedParent.children.length != 0)
        {
            //cc.log("不用再实例化，已经有了");
            var children = this.ownedParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                var sc = children[i].getComponent("BelongMateItem");
                if(sc != null)
                {
                    for (var j = 0; j < mateList.length; j++) {
                        if(mateList[j].Id == sc.Data.Id)
                        {
                            //cc.log("+++++++++++++++++++++" + mateList[j].UpLv);
                            if(mateList[j].UpLv == true)
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
            for (var i = mateList.length - 1; i >= 0; i--) {
                //cc.log("实例化伴侣");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongMateItem").init(mateList[i], ItemType.Mate);
                if(mateList[i].UpLv == true)
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
        var mateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Mate);
        var hasAny = false;
        for (var i = 0; i < mateList.length; i++) {
            if(mateList[i].UpLv == true)
            {
                hasAny = true;
                return true;
            }
        }
        return hasAny;
    },
});
module.exports = OwnedMatePanel;
