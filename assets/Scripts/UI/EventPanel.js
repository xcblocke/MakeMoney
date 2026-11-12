var ItemType = require("ItemType");
var RewardType = require("RewardType");
var UserState = require("UserState");
var EventPanel = cc.Class({
    extends: cc.Component,
    properties: {
        desLbl:cc.Label,

        btnLbl:[cc.Label],

        btnTip:[cc.Node],
        btnDesLbl:[cc.Label],
        Data:null,
    },

    ShowPanel:function (Id) {
        //cc.log("根据事件来处理问题  Id = " + Id);
        var data = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.EventData, Id);
        this.Data = data;
        this.desLbl.string  = cc.Mgr.global.getTranslation("event_"+data.desId);

        for (var i = 0; i < 2; i++) {
            this.btnLbl[i].string = cc.Mgr.global.getTranslation("event_"+data.cost[i].desId);
            this.btnTip[i].active = true;
            if(data.cost[i].costType == RewardType.NULL)
            {
                this.btnTip[i].active = false;
            }
            else if(data.cost[i].costType == RewardType.Cash)
            {
                var costNum = Math.floor(data.cost[i].costNum * (1-cc.Mgr.UserDataMgr.EventCostBonus));
                this.btnDesLbl[i].string = "花费现金:"+costNum;
            }
            else if(data.cost[i].costType == RewardType.HP)
            {
                this.btnDesLbl[i].string = "消耗体力:"+data.cost[i].costNum;
            }
            else if(data.cost[i].costType == RewardType.Reputation)
            {
                this.btnDesLbl[i].string = "名声损失:"+data.cost[i].costNum;
            }
        }
    },

    ClickConfirmY:function(){
        var param = {};
        param.text = "";
        param.des = "";
        param.forWhat = "Event_No";
        if(cc.Mgr.UserDataMgr.userState == UserState.OK)
        {
            if(this.Data.cost[0].costType == RewardType.NULL)
            {
                param.forWhat = "Event_Yes";
            }
            else if(this.Data.cost[0].costType == RewardType.Cash)
            {
                if(cc.Mgr.UserDataMgr.Cash >= this.Data.cost[0].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.Cash -= this.Data.cost[0].costNum;
                }
                else
                {
                    param.text = "钱不够,无法参与";
                    param.forWhat = "Event_No";
                }
            }
            else if(this.Data.cost[0].costType == RewardType.HP)
            {
                if(cc.Mgr.UserDataMgr.HpPoint >= this.Data.cost[0].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.HpPoint -= this.Data.cost[0].costNum;
                }
                else
                {
                    param.text = "你的健康状态已无法支持你进入本次活动";
                    param.forWhat = "Event_No";
                }
            }
            else if(this.Data.cost[0].costType == RewardType.Reputation)
            {
                if(cc.Mgr.UserDataMgr.Reputation >= this.Data.cost[0].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.Reputation -= this.Data.cost[0].costNum;
                }
                else
                {
                    param.text = "你的名声已无法支持你进入本次活动";
                    param.forWhat = "Event_No";
                }
            }
        }
        else
        {
            param.text = "尚在治疗过程中,停止一切活动";
            param.forWhat = "Event_No";
        }
        if(param.forWhat != "Event_No")
        {
            param.forWhat = "Event_Yes";
            var result = null;
            var seed = Math.random();
            if(seed > 0.5)
            {
                result = this.Data.YResults[1];
                param.text = cc.Mgr.global.getTranslation("event_"+result.desId);
            }
            else
            {
                result = this.Data.YResults[0];
                param.text = cc.Mgr.global.getTranslation("event_"+result.desId);
            }

            if(result != null)
            {
                param.Pdata = cc.Mgr.UserDataMgr.GetOrCostDataByRewardType(result.rewardType, result.rewardNum, result.rewardId);
                var des = this.GetEventReward(result.rewardType, result.rewardId);
                if(des != "")
                {
                    if(result.rewardNum > 0 && result.rewardType == RewardType.Goods)
                    {
                        if(param.Pdata.Id == -1)
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = "仓库已满，无法获得";//"+" + result.rewardNum;
                        }
                        else
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = param.text + "\n";//"+" + result.rewardNum;
                        }  
                    }
                    else if(result.rewardNum > 0 && (result.rewardType == RewardType.Stock || result.rewardType == RewardType.StockPrice))
                    {
                        if(param.Pdata.companyId == -1)
                        {
                            if(this.Data.cost[0].costType == RewardType.Cash)
                                cc.Mgr.UserDataMgr.Cash += this.Data.cost[0].costNum;
                            
                            param.des = des + "+" + result.rewardNum;
                            param.text = "该公司尚未创立,奖励无法获得,花费现金返回";//"+" + result.rewardNum;
                        }
                        else
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = param.text + "\n";//"+" + result.rewardNum;
                        }
                    }
                    else
                    {
                        if(result.rewardNum > 0)
                            param.des = des + "+" + result.rewardNum;
                        else
                            param.des = des + result.rewardNum;
                        param.text = param.text + "\n" ;//+ result.rewardNum;
                    }
                }    
            }
        }
        else
        {
            
        }
        //cc.log("___________________________" + param.forWhat);
        //cc.log(" ====事件最终描述 ============= " + param.text);
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenEventResult , param);

        this.ClosePanel();
    },

    ClickConfirmN:function(){
        var param = {};
        param.forWhat = "Event_No";
        param.text = "";
        param.des = "";
        if(cc.Mgr.UserDataMgr.userState == UserState.OK)
        {
            if(this.Data.cost[1].costType == RewardType.NULL)
            {
                param.forWhat = "Event_Yes";
            }
            else if(this.Data.cost[1].costType == RewardType.Cash)
            {
                if(cc.Mgr.UserDataMgr.Cash >= this.Data.cost[1].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.Cash -= this.Data.cost[1].costNum;
                }
                else
                {
                    param.text = "钱不够,无法参与";
                    param.forWhat = "Event_No";
                }
            }
            else if(this.Data.cost[1].costType == RewardType.HP)
            {
                if(cc.Mgr.UserDataMgr.HpPoint >= this.Data.cost[1].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.HpPoint -= this.Data.cost[1].costNum;
                }
                else
                {
                    param.text = "你的健康状态已无法支持你进入本次活动";
                    param.forWhat = "Event_No";
                }
                
            }
            else if(this.Data.cost[1].costType == RewardType.Reputation)
            {
                if(cc.Mgr.UserDataMgr.Reputation >= this.Data.cost[1].costNum)
                {
                    param.forWhat = "Event_Yes";
                    cc.Mgr.UserDataMgr.Reputation -= this.Data.cost[1].costNum;
                }
                else
                {
                    param.text = "你的名声已无法支持你进入本次活动";
                    param.forWhat = "Event_No";
                }
            }
        }
        else
        {
            param.text = "尚在治疗过程中,停止一切活动";
            param.forWhat = "Event_No";
        }

        if(param.forWhat != "Event_No")
        {
            param.forWhat = "Event_Yes";
            var seed = Math.random();
            var result = null;
            if(seed > 0.5)
            {
                result = this.Data.NResults[1];
                param.text = cc.Mgr.global.getTranslation("event_"+result.desId);
            }
            else
            {
                result = this.Data.NResults[0];
                param.text = cc.Mgr.global.getTranslation("event_"+result.desId);
            }

            if(result != null)
            {
                param.Pdata = cc.Mgr.UserDataMgr.GetOrCostDataByRewardType(result.rewardType, result.rewardNum, result.rewardId);
                var des = this.GetEventReward(result.rewardType, result.rewardId);
                if(des != "")
                {
                    if(result.rewardNum > 0 && result.rewardType == RewardType.Goods )
                    {
                        if(param.Pdata.Id == -1)
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = "仓库已满，无法获得";//"+" + result.rewardNum;
                        }
                        else
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = param.text + "\n";//"+" + result.rewardNum;
                        }  
                    }
                    else if(result.rewardNum > 0 && (result.rewardType == RewardType.Stock || result.rewardType == RewardType.StockPrice))
                    {
                        if(param.Pdata.companyId == -1)
                        {
                             if(this.Data.cost[0].costType == RewardType.Cash)
                                cc.Mgr.UserDataMgr.Cash += this.Data.cost[0].costNum;
                            
                            param.des = des + "+" + result.rewardNum;
                            param.text = "该公司尚未创立,奖励无法获得,花费现金返回";//"+" + result.rewardNum;
                        }
                        else
                        {
                            param.des = des + "+" + result.rewardNum;
                            param.text = param.text + "\n";//"+" + result.rewardNum;
                        }
                    }
                    else
                    {
                        if(result.rewardNum > 0)
                            param.des = des + "+" + result.rewardNum;
                        else
                            param.des = des + result.rewardNum;
                        param.text = param.text + "\n";//+ result.rewardNum;
                    }
                }
            }
        }
        else
        {
            
        }
        //cc.log("事件最终描述 ============= " + param.text);
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenEventResult , param);
        this.ClosePanel();
    },

    GetEventReward:function(rewardType, rewardId){
        var des = "";
        switch (rewardType) {
            case RewardType.NULL:
                des = "";
                break;
            case RewardType.Cash:
                des = "现金";
                break;
            case RewardType.Car:
                des = "汽车";
                break;
            case RewardType.House:
                des = "房子";
                break;
            case RewardType.HP:
                des = "健康值";
                break;
            case RewardType.Goods:
                des = "商品";
                break;
            case RewardType.Reputation:
                des = "名声";
                break;
            case RewardType.Stock:
                var companyName = cc.Mgr.global.getTranslation("company_" + rewardId);
                des = companyName + "股票";
                break;
            case RewardType.StockPrice:
                var companyName = cc.Mgr.global.getTranslation("company_" + rewardId);
                des = companyName + "股票价格";
                break;
        }
        return des;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },
});
module.exports = EventPanel;
