var Event = require("Event");
var UserState = require("UserState");
var ItemType = require("ItemType");
var OwnItem = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        udAtlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        stateSp:cc.Sprite,
        NameLbl:cc.Sprite,
        PriceLbl:cc.Label,
        NumLbl:cc.Label,
        Id:cc.Integer,
        buyPrice:cc.Integer,
        Data:null,
    },
    
    init:function (data) {
        this.Id = data.Id;
        this.Data = data;
        this.buyPrice = data.buyPrice;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.NameLbl.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.NumLbl.string = data.ownNum.toString();
        this.PriceLbl.string = data.buyPrice.toString();
    },

    refreshData:function(data){
        this.PriceLbl.string = data.buyPrice.toString();
        this.NumLbl.string = data.ownNum.toString();
        this.buyPrice = data.buyPrice;
        this.stateSp.node.active = false;
    },

    RefreshState:function(){
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Goods, this.Id);
        var marketPrice = data.marketPrice;
        var ownNum = data.ownNum;
        var flag = cc.Mgr.UserDataMgr.CheckIdIsInShowList(this.Id);
        if(data != null && ownNum > 0 && flag == true)
        {
            this.stateSp.node.active = true;
            if(marketPrice > this.buyPrice)
            {
                this.stateSp.spriteFrame = this.udAtlas.getSpriteFrame("up");
            }
            else if(marketPrice < this.buyPrice)
            {
                this.stateSp.spriteFrame = this.udAtlas.getSpriteFrame("down");
            }
            else
            {
                this.stateSp.node.active = false;
            }
        }
        else
        {
            this.stateSp.node.active = false;
        }
    },

    OpenSaleTipPanel:function(){
        cc.Mgr.AudioMgr.playSFX("goods_" + this.Id);
        if(cc.Mgr.UserDataMgr.userState == UserState.NotOK)
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("InHealDownLine");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }

        var flag = cc.Mgr.UserDataMgr.CheckIdIsInShowList(this.Data.Id);
        if(flag == true)
        {  
            //cc.log("准备出售东西 = " + this.Data.name);
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenSaleTip, this.Data);
        }
        else
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("goods_"+this.Data.Id)+ "沒有市場需求";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            //cc.log("當前該物品不參與交易");
        }
    },
});
module.exports = OwnItem;