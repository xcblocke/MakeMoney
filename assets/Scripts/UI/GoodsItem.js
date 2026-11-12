var Event = require("Event");
var UserState = require("UserState");
var GoodsItem = cc.Class({
    extends: cc.Component,

    properties: {
        //UI
        Atlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        NameLbl:cc.Sprite,
        PriceLbl:cc.Label,
        State:1, //状态
        //Data
        Id:cc.Integer,
        price:cc.Integer,
        Data:null,
    },
    
    init:function (data) {
        this.Data = data;
        this.Id = data.Id;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.NameLbl.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.priceId = 0; //所在的价格区间
        this.refreshPrice();
    },

    refreshLowPrice:function(){
        var priceList = this.Data.priceList;
        var price = priceList[0].lowprice;
        this.priceId = 0;
        var d = Math.random();
        price = priceList[0].lowprice + d*(priceList[0].highprice - priceList[0].lowprice);
        this.price = Math.floor(price);
        this.Data.price = this.price;
        cc.Mgr.UserDataMgr.RefreshGoodsMarKetPrice(this.Id, this.price);
        this.PriceLbl.string = this.price.toString();
        var param = {};
        this.State = 0;
        param.State = 0; //-2表示暴跌 -1表示跌了  0 表示稳定  1有所增长 2表示暴涨
        param.Id = this.Id;
        param.icon = this.Data.icon;
        param.name = this.Data.name;
        param.price = this.price;
        return param;
    },

    refreshMidPrice:function(){
        var priceList = this.Data.priceList;
        var price = priceList[0].lowprice;
        this.priceId = 1;
        var d = Math.random();
        price = priceList[1].lowprice + d*(priceList[1].highprice - priceList[1].lowprice);
        this.price = Math.floor(price);
        this.Data.price = this.price;
        cc.Mgr.UserDataMgr.RefreshGoodsMarKetPrice(this.Id, this.price);
        this.PriceLbl.string = this.price.toString();
        var param = {};
        this.State = 1;
        param.State = 1; //-2表示暴跌 -1表示跌了  0 表示稳定  1有所增长 2表示暴涨
        param.Id = this.Id;
        param.icon = this.Data.icon;
        param.name = this.Data.name;
        param.price = this.price;
        return param;
    },

    refreshUpPrice:function(){
        var priceList = this.Data.priceList;
        var price = priceList[0].lowprice;
        /*
        var seed = 0.99999;
        if(seed < priceList[0].probability)
        {
            change = 0; //-this.priceId;
            this.priceId = 0;
            var d = Math.random();
            price = priceList[0].lowprice + d*(priceList[0].highprice - priceList[0].lowprice);
        }
        else if(seed <= priceList[0].probability + priceList[1].probability)
        {
            change = 1; //-this.priceId;
            this.priceId = 1;
            var d = Math.random();
            price = priceList[1].lowprice + d*(priceList[1].highprice - priceList[1].lowprice);
        }
        else
        {
            change = 2;//-this.priceId;
            this.priceId = 2;
            var d = Math.random();
            price = priceList[2].lowprice + (priceList[2].highprice - priceList[2].lowprice);
        }
        */
        this.priceId = 2;
        var d = Math.random();
        price = priceList[2].lowprice + d*(priceList[2].highprice - priceList[2].lowprice);
        this.State = 2;
        this.price = Math.floor(price);
        this.Data.price = this.price;
        cc.Mgr.UserDataMgr.RefreshGoodsMarKetPrice(this.Id, this.price);
        this.PriceLbl.string = this.price.toString();
        var param = {};
        param.State = 2; //-2表示暴跌 -1表示跌了  0 表示稳定  1有所增长 2表示暴涨
        param.Id = this.Id;
        param.icon = this.Data.icon;
        param.name = this.Data.name;
        param.price = this.price;
        return param; 
    },

    //刷新价格信息
    refreshPrice:function(){
        var priceList = this.Data.priceList;
        var price = priceList[0].lowprice;
        var change = 0;

        var seed = Math.random();
        if(seed < priceList[0].probability)
        {
            change = 0; //-this.priceId;
            this.priceId = 0;
            var d = Math.random();
            price = priceList[0].lowprice + d*(priceList[0].highprice - priceList[0].lowprice);
        }
        else if(seed <= priceList[0].probability + priceList[1].probability)
        {
            change = 1; //-this.priceId;
            this.priceId = 1;
            var d = Math.random();
            price = priceList[1].lowprice + d*(priceList[1].highprice - priceList[1].lowprice);
        }
        else
        {
            change = 2;//-this.priceId;
            this.priceId = 2;
            var d = Math.random();
            price = priceList[2].lowprice + d*(priceList[2].highprice - priceList[2].lowprice);
        }
        this.State = change;
        this.price = Math.floor(price);
        this.Data.price = this.price;
        cc.Mgr.UserDataMgr.RefreshGoodsMarKetPrice(this.Id, this.price);
        this.PriceLbl.string = this.price.toString();
        var param = {};
        param.State = change; //-2表示暴跌 -1表示跌了  0 表示稳定  1有所增长 2表示暴涨
        param.Id = this.Id;
        param.icon = this.Data.icon;
        param.name = this.Data.name;
        param.price = this.price;
        return param; 
    },

    OpenBuyTipPanel:function(){
        cc.Mgr.AudioMgr.playSFX("goods_" + this.Id);
        if(cc.Mgr.UserDataMgr.userState == UserState.NotOK)
        {
            var param = {};
            param.text = "您还处在恢复阶段，目前不能交易";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        //cc.log("打开购买窗口 = " + this.Data.name);
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenBuyTip, this.Data);
    },
});
module.exports = GoodsItem;
