var ItemType = require("ItemType");
var CarPanel = cc.Class({
    extends: cc.Component,

    properties: {
        carItemPre:cc.Prefab,
        carItemParent:cc.Node,
        hasInit:false,
    },

    ShowPanel:function () {
        if(this.hasInit == true)
        {
            //cc.log("已经初始化过了，不用重复");
            return;
        }

        var dataList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Car);
        for (var i = dataList.length - 1; i >= 0; i--) {
            var data = dataList[i];
            var obj = cc.instantiate(this.carItemPre);
            obj.parent = this.carItemParent;
            obj.active = true;
            obj.getComponent("CarItem").init(data);
        }
        this.hasInit = true;
    },
});
module.exports = CarPanel;
