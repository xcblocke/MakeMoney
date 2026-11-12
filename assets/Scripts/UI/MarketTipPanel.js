var MarketTipItem = require("MarketTipItem");
var MarketTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
       TipList:{
        default:[],
        type:[MarketTipItem],
       },
       DesLbl:cc.Label,
       IntoNode:cc.Node,
       IntoDes:cc.Label,
       IntoDesNull:cc.Node,
    },

    ClosePanel:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;

        //弹出计算股票收益
        if(cc.Mgr.UserDataMgr.CanGetStockProfit == true && cc.Mgr.global.showStockProfit == true)
        {
            var bonus = 0;
            var Id = -1;
            for (var i = cc.Mgr.UserDataMgr.CompanyList.length - 1; i >= 0; i--) {
                var da = cc.Mgr.UserDataMgr.CompanyList[i];
                if(da.stockNum > 0)
                { 
                    Id = da.Id;
                    bonus += Math.floor(da.stockNum * da.stockPrice * (da.bonusRatio + (cc.Mgr.UserDataMgr.StockAddBonus / 100)));
                }
            }
            var param = {};
            param.forWhat = "StockBonus";
            param.bonus = bonus;
            param.Id = Id;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip , param);
            cc.Mgr.global.showStockProfit = false;
        }
        if(cc.Mgr.global.tutorialStep == 11 && cc.Mgr.UserDataMgr.tutorialInMarket == false)  //引导步骤 采用 11 表示第一个大步骤 第一小步
        {
            var dt = {};
            dt.step = 11;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenTutorial, dt);
        }
    },

    ShowPanel:function(param){
        for (var i = this.TipList.length - 1; i >= 0; i--)
        {
            this.TipList[i].node.active = false;
        }
        this.IntoDes.string = "";
        this.IntoDesNull.active = false;
        //-2表示暴跌 -1表示跌了  0 表示稳定  1有所增长 2表示暴涨
        var list = this.CheckShowDes(param);
        if(list.length == 0)
        {
            this.DesLbl.node.active = true;
            this.DesLbl.string = cc.Mgr.global.getTranslation("Market_25");
        }
        else
        {
            this.DesLbl.node.active = false;
            for (var i = 0; i <= list.length - 1; i++)
            {   
                var des = this.DickDes(list[i].State, list[i].name, list[i].Id);
                this.TipList[i].node.active = true;
                var par = {};
                par.des = des;
                par.Id = list[i].Id;
                this.TipList[i].SetData(par);
            }
            
        } 
    },

    DickDes:function(State, name, Id)
    {
        var des = "";
        if(State == 0)
        {
            var desId = "Market_" + (2*Id -1);
            //des = cc.Mgr.global.getTranslation(desId);
        }
        else if(State == 2)
        {
            var desId = "Market_" + (2*Id);
            //des = cc.Mgr.global.getTranslation(desId);;
        }
        var re = {};
        re.State = State;
        re.desId = desId;
        return re;
    },

    CheckShowDes:function(param){
        var list = [];
        var checkNum = 0;
        var rem =[];
        for (var i = param.length - 1; i >= 0; i--) {
            if(param[i].State != null)
            {
                if(param[i].State != 1)
                {
                    list.push(param[i]);
                    checkNum += 1;
                }
                if(param[i].State != 2 && param[i].Id != 3) //Id 为3 是字画还是黄金来着
                {
                    rem.push(param[i]);
                }
            }      
        }
        cc.Mgr.global.GoodsForeId = -1;
        if(checkNum <= 3 && cc.Mgr.UserDataMgr.Age >= 30 && rem.length > 0)
        {
            var seed = Math.random();
            if (seed < 0.4)
            {
                var d = Math.floor(Math.random() * rem.length);
                cc.Mgr.global.GoodsForeId = rem[d].Id;
                this.IntoDes.string = cc.Mgr.global.getTranslation("goods_"+rem[d].Id) + "下一年可能出现涨价" +"\n(前瞻有风险,盈亏自负)";
            }
            else
            {
                this.IntoDesNull.active = true;
            }
        }
        else
        {
            this.IntoDesNull.active = true;
        }
        return list;
    },
});
module.exports = MarketTipPanel;
