var ItemType = require("ItemType");
var TempBonus = require("TempBonus");
var CompanySaleTipPanel = cc.Class({
    extends: cc.Component,
    properties: {
        Atlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        TitleName:cc.Sprite,
        SaleNumLbl:cc.Label,
        EarnLbl:cc.Label,
        Slider:cc.Slider,
        InPutBox:cc.EditBox,
        Progress:cc.ProgressBar,
        SaleNum:0,
        Data:null,
    },

    ShowPanel:function (data) {
        this.Data = data;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.TitleName.spriteFrame = this.Atlas.getSpriteFrame(data.name);

        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Company,this.Data.Id);
        var marketPrice = data.stockPrice;
        var cost = data.stockCost;
        this.SaleNum = Math.floor(this.Data.stockNum / 100);
        var money = Math.floor(this.Data.stockNum * (marketPrice - cost));
        if(cc.Mgr.global.TempAdsStockBonus == TempBonus.StockBonus)
        {
            if(money > 0)
                money = Math.floor(money * 1.2); //有之前看过广告
        }
        this.EarnLbl.string = cc.Mgr.global.FormatNum(money);
        this.SaleNumLbl.string = this.SaleNum;
        this.InPutBox.string = this.SaleNum;
        this.Slider.progress = 1;
        this.Progress.progress = 1;
    },

    OnSliderChange:function(){
        this.SaleNum = Math.floor(this.Slider.progress * (this.Data.stockNum / 100));
        this.Progress.progress = this.Slider.progress;
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Company,this.Data.Id);
        var marketPrice = data.stockPrice;
        var cost = data.stockCost;
        var money = Math.floor(this.SaleNum * 100 * (marketPrice - cost));
        if(cc.Mgr.global.TempAdsStockBonus == TempBonus.StockBonus)
        {
            if(money > 0)
                money = Math.floor(money *1.2); //有之前看过广告
        }
        this.EarnLbl.string = cc.Mgr.global.FormatNum(money);
        this.SaleNumLbl.string = this.SaleNum;
        this.InPutBox.string = this.SaleNum;
    },

    OnInputBoxEnd:function(){
        if(this.InPutBox.string != "")
        {
            if(Number(this.InPutBox.string) != null)
            {
                if(Number(this.InPutBox.string) > Math.floor(this.Data.stockNum / 100)) 
                {
                    this.InPutBox.string = Math.floor(this.Data.stockNum / 100);
                    this.SaleNum = Math.floor(this.Data.stockNum / 100);
                    this.Progress.progress = 1;
                    this.Slider.progress = 1;
                }
                else
                {
                    this.SaleNum = Number(this.InPutBox.string);
                    this.Slider.progress =  Math.floor(this.SaleNum / (this.Data.stockNum / 100));
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
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Company,this.Data.Id);
        var marketPrice = data.stockPrice;
        var cost = data.stockCost;
        var money = Math.floor(this.SaleNum * 100 * (marketPrice - cost));
        if(cc.Mgr.global.TempAdsStockBonus == TempBonus.StockBonus)
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
        
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Company,this.Data.Id);
        var marketPrice = data.stockPrice;
        var cost = data.stockCost;
        var getMoney = Math.floor(marketPrice * this.SaleNum * 100);
        if(cc.Mgr.global.TempAdsStockBonus == TempBonus.StockBonus)
        {
            var money = this.SaleNum * (marketPrice - cost);
            if(money > 0)
                getMoney = Math.floor(getMoney *1.2); //有之前看过广告
            //cc.Mgr.global.TempAdsBonus = TempBonus.NULL;
        }
        cc.Mgr.UserDataMgr.Cash += getMoney;
        var param = {};
        param.Num = this.SaleNum * 100;
        param.price = marketPrice;
        param.Id = this.Data.Id;
        var data = cc.Mgr.UserDataMgr.SaleStocks(param);
        //通知刷新
        cc.director.GlobalEvent.emit(cc.Mgr.Event.SaleStockSuccess, data);
        this.ClosePanel();
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
    
});
module.exports = CompanySaleTipPanel;