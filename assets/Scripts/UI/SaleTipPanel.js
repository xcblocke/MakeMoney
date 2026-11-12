var Event = require("Event");
var AdsParam = require("AdsParam");
var TempBonus = require("TempBonus");
var SaleTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        IconSp:cc.Sprite,
        nameSp:cc.Sprite,
        Atlas:cc.SpriteAtlas,
        GoodsName:cc.Label,
        SaleNumLbl:cc.Label,
        EarnLbl:cc.Label,
        CBLbl:cc.Label,
        Slider:cc.Slider,
        InPutBox:cc.EditBox,
        Progress:cc.ProgressBar,
        SaleNum:0,
        Data:null,

        needDouble:1,//是否收益翻倍
    },

    ShowPanel:function (data) {
        this.needDouble = 1;
        this.Data = null;
        this.SaleNum = data.ownNum;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.nameSp.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        var marketPrice = cc.Mgr.UserDataMgr.getGoodsDataById(data.Id).marketPrice;
        var money = data.ownNum * (marketPrice - data.buyPrice);
        var chengben = data.ownNum * marketPrice;
        if(cc.Mgr.global.TempAdsAssetBonus == TempBonus.AssetBonus)
        {
            if(money > 0)
                money = Math.floor(money * 1.2); //有之前看过广告
        }
        this.EarnLbl.string = cc.Mgr.global.FormatNum(money);
        this.CBLbl.string = cc.Mgr.global.FormatNum(chengben);
        this.SaleNumLbl.string = data.ownNum;
        this.InPutBox.string = data.ownNum;
        this.Slider.progress = 1;
        this.Progress.progress = 1;
        this.Data = data;
    },

    OnSliderChange:function(){
        this.SaleNum = Math.floor(this.Slider.progress * this.Data.ownNum);
        this.Progress.progress = this.Slider.progress;
        var marketPrice = cc.Mgr.UserDataMgr.getGoodsDataById(this.Data.Id).marketPrice;
        var money = this.SaleNum * (marketPrice - this.Data.buyPrice);

        var chengben = this.SaleNum * marketPrice;
        this.CBLbl.string = cc.Mgr.global.FormatNum(chengben);

        this.InPutBox.string = this.SaleNum;
        if(cc.Mgr.global.TempAdsAssetBonus == TempBonus.AssetBonus)
        {
            if(money > 0)
                money = Math.floor(money *1.2); //有之前看过广告
        }
        this.EarnLbl.string = cc.Mgr.global.FormatNum(money);
        this.SaleNumLbl.string = this.SaleNum;
    },

    OnInputBoxEnd:function(){
        if(this.InPutBox.string != "")
        {
            if(Number(this.InPutBox.string) != null)
            {
                if(Number(this.InPutBox.string) > this.Data.ownNum) 
                {
                    this.InPutBox.string = this.Data.ownNum;
                    this.SaleNum = this.Data.ownNum;
                    this.Progress.progress = 1;
                    this.Slider.progress = 1;
                }
                else
                {
                    this.SaleNum = Number(this.InPutBox.string);
                    this.Slider.progress =  this.SaleNum / this.Data.ownNum;
                    this.Progress.progress = this.Slider.progress;
                }
            }
        }
        else
        {
            this.InPutBox.string = "0";
            this.SaleNum = 0;
            this.Progress.progress = 0;
            this.Slider.progress = 0;
        }
        var marketPrice = cc.Mgr.UserDataMgr.getGoodsDataById(this.Data.Id).marketPrice;
        var money = this.SaleNum * (marketPrice - this.Data.buyPrice);

        var chengben = this.SaleNum * marketPrice;
        this.CBLbl.string = cc.Mgr.global.FormatNum(chengben);

        if(cc.Mgr.global.TempAdsAssetBonus == TempBonus.AssetBonus)
        {
            if(money > 0)
                money = Math.floor(money *1.2); //有之前看过广告
        }
        this.EarnLbl.string = cc.Mgr.global.FormatNum(money);
    },

    ClickSaleBtn:function(){
        if(this.SaleNum <= 0)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            return;
        }
        
        cc.Mgr.UserDataMgr.WareHouseCapcity += this.SaleNum;

        var marketPrice = cc.Mgr.UserDataMgr.getGoodsDataById(this.Data.Id).marketPrice;
        var getMoney = (marketPrice * this.SaleNum);
        if(cc.Mgr.global.TempAdsAssetBonus == TempBonus.AssetBonus)
        {
            var money = this.SaleNum * (marketPrice - this.Data.buyPrice);
            if(money > 0)
                getMoney = Math.floor(getMoney * 1.2) * this.needDouble;
            //cc.Mgr.global.TempAdsBonus = TempBonus.NULL;
        }
        cc.Mgr.UserDataMgr.Cash += getMoney;
        var param = {};
        param.Num = this.SaleNum;
        param.price = this.Data.buyPrice;
        param.Id = this.Data.Id;
        var data = cc.Mgr.UserDataMgr.SaleGoods(param);
        if(marketPrice > this.Data.buyPrice)
            cc.Mgr.UserDataMgr.Reputation += 2;
        //通知刷新现金
        cc.director.GlobalEvent.emit(cc.Mgr.Event.SaleSuccess, data);
        this.ClosePanel();
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

    DoubleGetByVedio:function(){
        if(this.SaleNum <= 0)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            return;
        }
        var self = this;
        cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointC, function(out){
            if(out == 0)
            {
                self.needDouble = 2;
                self.ClickSaleBtn();
            }
        });
    },

});
module.exports = SaleTipPanel;
