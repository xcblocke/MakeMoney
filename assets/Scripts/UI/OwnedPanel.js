var ItemType = require("ItemType");
var OwnedCarPanel = require("OwnedCarPanel");
var OwnedMatePanel = require("OwnedMatePanel");
var OwnedHousePanel = require("OwnedHousePanel");

var OwnedPanel = cc.Class({
    extends: cc.Component,

    properties: {
       ownedCarScroll:OwnedCarPanel,
       ownedMateScroll:OwnedMatePanel,
       ownedHouseScroll:OwnedHousePanel,

       togMate:cc.Toggle,
       togCar:cc.Toggle,
       togHouse:cc.Toggle,
    },

    OpenMatePanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.ownedMateScroll.node.active = true;
        this.ownedHouseScroll.node.active = false;
        this.ownedCarScroll.node.active = false;

        this.ownedMateScroll.ShowPanel();
    },

    OpenHousePanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.ownedMateScroll.node.active = false;
        this.ownedHouseScroll.node.active = true;
        this.ownedCarScroll.node.active = false;

        this.ownedHouseScroll.ShowPanel();
    },

    OpenCarPanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.ownedMateScroll.node.active = false;
        this.ownedHouseScroll.node.active = false;
        this.ownedCarScroll.node.active = true;

        this.ownedCarScroll.ShowPanel();
    },

    ShowPanel:function () {
        if(this.togMate.isChecked == true)
        {
            this.OpenMatePanel();
        }
        else if(this.togHouse.isChecked == true)
        {
            this.OpenHousePanel();
        }
        else if(this.togCar.isChecked == true)
        {
            this.OpenCarPanel();
        }

        /*
        var carList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Car);
        for (var i = carList.length - 1; i >= 0; i--) {
            if(this.judeIsInitAndRefresh(ItemType.Car, carList[i]))
            {
                //cc.log("不用再实例化，已经有了");
            }
            else
            {
                //cc.log("实例化车子");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongItem").init(carList[i], ItemType.Car);
            }
        }

        var houseList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.House);
        for (var i = houseList.length - 1; i >= 0; i--) {
            if(this.judeIsInitAndRefresh(ItemType.House, houseList[i]))
            {
                //cc.log("不用再实例化，已经有了");
            }
            else
            {
                //cc.log("实例化房子");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongItem").init(houseList[i], ItemType.House);
            }
        }

        var mateList = cc.Mgr.UserDataMgr.getOwnDataListByType(ItemType.Mate);
        for (var i = mateList.length - 1; i >= 0; i--) {
            if(this.judeIsInitAndRefresh(ItemType.Mate, mateList[i]))
            {
                //cc.log("不用再实例化，已经有了");
            }
            else
            {
                //cc.log("实例化伴侣");
                var obj = cc.instantiate(this.ownedPre);
                obj.parent = this.ownedParent;
                obj.getComponent("BelongItem").init(mateList[i], ItemType.Mate);
            }
        }
        */
    },

    //判断这个 obj是否已经实例化了
    judeIsInitAndRefresh:function(itemType,data){
        var flag = false;
        if(itemType == ItemType.Car)
        {
            if(data.ownNum > 0)
                flag = true;
        }
        else if(itemType == ItemType.House)
        {
            //cc.log("+++++++++++" + data.ownNum);
            if(data.ownNum > 0)
                flag = true;
        }
        else if(itemType == ItemType.Mate)
        {
            if(data.UpLv == true)
                flag = true;
        }

        var children = this.ownedParent.children;
        for (var i = children.length - 1; i >= 0; i--) { 
            var sc = children[i].getComponent("BelongItem");
            if(sc != null)
            {
                if(itemType == sc.itemType && data.Id == sc.Id)
                {
                    if(itemType == ItemType.Car || itemType == ItemType.House)
                    {
                        if(data.ownNum > 0)
                        {
                            children[i].active = true;
                            sc.Refresh(data);
                        }
                        else
                        {
                            children[i].active = false;
                        }
                    }
                    else if(itemType == ItemType.Mate)
                    {
                        if(data.UpLv == true)
                            children[i].active = true;
                        else
                            children[i].active = false;
                    }
                    return true;
                }
            }
        }
        if(flag == true)
            return false;
        else
            return true;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },  
});
module.exports = OwnedPanel;