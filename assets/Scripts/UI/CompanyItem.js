var ItemType = require("ItemType");
var UserState = require("UserState");
var CompanyItem = cc.Class({
    extends: cc.Component,

    properties: {
        Id:cc.Integer,
        stockNum:cc.Integer,
        LimitYear:cc.Integer,

        Atlas:cc.SpriteAtlas,
        IconSp:cc.Sprite,
        nameLbl:cc.Sprite,
        priceLbl:cc.Label,
        costLbl:cc.Label,
        numLbl:cc.Label,

        ratioLbl:cc.Label,

        InLockLbl:cc.Label,
        CreateBtn:cc.Node,
        BuySaleBtns:cc.Node,

        canGetProfit:false,

        bankRupt:false, //是否已经破产

        Data:null,
    },

    init:function (data) {
        this.Data = null;
        this.Data = data;
        this.bankRupt = false;
        this.LimitYear = data.LimitYear - 1; //限制交易年限
        this.stockNum = 0;
        this.ratioLbl.string = (data.bonusRatio * 100).toString() + "%";
        this.Id = data.Id;
        this.IconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.nameLbl.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.costLbl.string = data.stockCost;
        this.priceLbl.string = data.stockPrice;
        this.numLbl.string = Math.floor(data.stockNum / 100);
    },

    refreshPrice:function(){
        var mapdata = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Company, this.Data.Id);
        var proList = mapdata.proList;
        var unList = mapdata.unList;
        var seed = Math.random();
        var stockPrice = this.Data.stockPrice;
        ////cc.log(seed + "   ++++++++++++++++++++++++++++++++++++++++++  " + proList[0].weight);

        if(this.bankRupt == true)
        {
            stockPrice = mapdata.inPrice;
            this.bankRupt = false;
            this.InLockLbl.node.active = false;
            this.CreateBtn.active = true;
            this.BuySaleBtns.active = false;
        }
        else
        {
            if(this.stockNum > 0) //只有股票 持有量大于0时才可用 计算该股票的 上涨概率加成
            {
                //cc.log("拥有这家公司时候 --刷第一个比例");
                seed += cc.Mgr.UserDataMgr.StockUpBonus / 100;

                if(seed < proList[0].weight) //跌
                {
                    var iseed = Math.random() * (proList[0].upRatio - proList[0].lowRatio) + (1-proList[0].upRatio);
                    stockPrice = stockPrice - this.Data.stockPrice * iseed;
                }
                else //涨
                {
                    var iseed = Math.random() * (proList[1].upRatio - proList[1].lowRatio) + (proList[1].lowRatio - 1);
                    stockPrice = stockPrice + this.Data.stockPrice * iseed;
                } 
            }
            else
            {
                 //cc.log("没有这家公司时候 --刷第二个比例");
                if(seed < unList[0].weight) //跌
                {
                    var iseed = Math.random() * (unList[0].upRatio - unList[0].lowRatio) + (1 - unList[0].upRatio);
                    stockPrice = stockPrice - this.Data.stockPrice * iseed;
                }
                else //涨
                {
                    var iseed = Math.random() * (unList[1].upRatio - unList[1].lowRatio) + (unList[1].lowRatio - 1);
                    stockPrice = stockPrice + this.Data.stockPrice * iseed;
                } 
            }
        }

        
        this.Data.stockPrice = Math.floor(stockPrice * 100)/100;
        this.priceLbl.string = this.Data.stockPrice;
        this.costLbl.string = this.Data.stockCost;

        //有公司破产了
        if(this.Data.stockPrice <= this.Data.bankruptPrice)
        {
            this.bankRupt = true;
            this.InLockLbl.node.active = true;
            this.CreateBtn.active = false;
            this.BuySaleBtns.active = false;
            this.canGetProfit = false;
            cc.Mgr.UserDataMgr.CanGetStockProfit = false;
            this.InLockLbl.string = "该行业一片萧条";
            this.costLbl.string = "0";
            this.numLbl.string = "0";
            this.LimitYear = this.Data.LimitYear - 1;

            if(this.stockNum > 0)
            {
                if(cc.Mgr.UserDataMgr.BankruptAge == 0)
                {
                    cc.Mgr.UserDataMgr.BankruptAge = cc.Mgr.UserDataMgr.Age;
                }
                cc.Mgr.UserDataMgr.Cash += Math.floor(this.Data.stockPrice * 0.5 * this.stockNum); //折半出售
                var param = {};
                param.Num = this.stockNum;
                param.price = this.stockPrice;
                param.Id = this.Data.Id;
                var reData = cc.Mgr.UserDataMgr.SaleStocks(param);
                this.stockNum = reData.stockNum;
                var param = {};
                param.forWhat = "";
                var comname = cc.Mgr.global.getTranslation("company_" +this.data.Id);
                param.text = "您创办的["+"<color=#e77122>"+comname+"</c>"+"]由于经营不善,已破产处理,公司股票将折半价抛售";
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip , param);
            }
        }
        else
        {
            this.bankRupt = false;
            if(this.stockNum > 0 && this.LimitYear > 0)
            {
                if(this.LimitYear > 0)
                {
                    this.LimitYear -= 1;
                    this.InLockLbl.string = "创业期" + this.LimitYear + "年";
                }
                this.canGetProfit = false;
            }

            if(this.stockNum <= 0 && this.LimitYear <= 0)
            {
                this.InLockLbl.node.active = false;
                this.BuySaleBtns.active = false;
                this.CreateBtn.active = true;
                this.canGetProfit = false;
            }
            else if(this.LimitYear <= 0 && this.stockNum > 0)
            {
                this.InLockLbl.node.active = false;
                this.BuySaleBtns.active = true;
                this.canGetProfit = true;
            }

            var param = {};
            param.stockCost = this.Data.stockCost;
            param.stockPrice = this.Data.stockPrice;
            cc.Mgr.UserDataMgr.RefreshStockData(this.Id, param);
        }
    },

    RefreshUIShowAfter:function(){
        var num = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Company, this.Id).stockNum;
        this.numLbl.string = Math.floor(num / 100);
    },

    RefreshUIShow:function(data){
        this.stockNum = data.stockNum;

        this.priceLbl.string = data.stockPrice.toString();
        this.costLbl.string = data.stockCost.toString();
        this.numLbl.string = Math.floor(data.stockNum / 100);
        if(data.stockNum > 0 && this.LimitYear <= 0)
        {
            this.InLockLbl.node.active = false;
            this.CreateBtn.active = false;
            this.BuySaleBtns.active = true;
            this.canGetProfit = true;
        }
        else if(data.stockNum > 0 && this.LimitYear > 0)
        {
            this.InLockLbl.node.active = true;
            this.CreateBtn.active = false;
            this.BuySaleBtns.active = false;
            this.canGetProfit = false;
            this.InLockLbl.string = "创业期" + this.LimitYear + "年";
        }
        else if(data.stockNum <= 0)
        {
            this.InLockLbl.node.active = false;
            this.CreateBtn.active = true;
            this.BuySaleBtns.active = false;
            this.canGetProfit = false;
            //出售完了 需要重新创办
            this.LimitYear = this.Data.LimitYear - 1;
        }
    },
    //创办公司
    OpenCompanyCreateTip:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        if(cc.Mgr.UserDataMgr.userState == UserState.NotOK)
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("InHealDownLine");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }

        if(cc.Mgr.UserDataMgr.hasCompany == true)
        {
            var param = {};
            param.forWhat = "";
            param.text = "<color=#e77122>您已经创办一家公司</c>";
            //cc.log("===提醒下已经有一家公司在名下===");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCompanyCreate, this.Data);
    },
    //出售股票
    OpenStuckSaleTip:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        if(cc.Mgr.UserDataMgr.userState == UserState.NotOK)
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("InHealDownLine");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }

        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenStuckSaleTip, this.Data);
    },
    //购入股票
    OpenStuckBuyTip:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        if(cc.Mgr.UserDataMgr.userState == UserState.NotOK)
        {
            var param = {};
            param.text = cc.Mgr.global.getTranslation("InHealDownLine");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }

        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenStuckBuyTip, this.Data);
    },

});
module.exports = CompanyItem;
