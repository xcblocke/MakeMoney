var MateUnLockType = require("MateUnLockType");
var JoyTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        desLbl:cc.RichText,
        forWhat:"",
        cost:cc.Integer,
    },

    ShowPanel:function(data){
        if(data.forWhat == "ToDate")
        {
            this.desLbl.string = "<color=#696969>"+data.text + "\n花费</c>" +"<color=#e77122>"+ cc.Mgr.global.DateInitCost+"</c>" + "<color=#696969>元</c>";
        }
        else if(data.forWhat == "ToBet")
        {
            this.desLbl.string = "<color=#696969>"+data.text + "\n投注</c>" +"<color=#e77122>"+ cc.Mgr.global.BetInitCost + "</c>" + "<color=#696969>元</c>";
        }
        if(data.forWhat != null)
            this.forWhat = data.forWhat;
        else
            this.forWhat = "";
    },

    ConfirmClick:function()
    {
        if(this.forWhat == "ToDate")
        {
            if(cc.Mgr.UserDataMgr.Cash < cc.Mgr.global.DateInitCost)
            {
                var param = {};
                var sd = Math.floor(Math.random()*2);
                param.text = cc.Mgr.global.getTranslation("NoMoneyDate_"+sd);
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
                this.ClosePanel();
                return;
            }

            var seed = Math.random();
            cc.Mgr.UserDataMgr.Cash -= cc.Mgr.global.DateInitCost;
            cc.Mgr.global.DateInitCost *= 2;
            if(seed < cc.Mgr.UserDataMgr.DateSuccescRatio)
            {
                cc.Mgr.UserDataMgr.UnLockOneMate(MateUnLockType.ToDate, cc.Mgr.UserDataMgr.Sex);
            }
            else
            {
                var param = {};
                var sd = Math.floor(Math.random()*2);
                param.text = cc.Mgr.global.getTranslation("DateFail_"+sd);
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            }
            cc.director.GlobalEvent.emit(cc.Mgr.Event.RefreshCashAsset, {});
        }
        else if(this.forWhat == "ToBet")
        {
            if(cc.Mgr.UserDataMgr.Cash < cc.Mgr.global.BetInitCost)
            {
                var param = {};
                param.text = cc.Mgr.global.getTranslation("MoneyNotEnough");
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
                this.ClosePanel();
                return;
            }

            var seed = Math.random();
            cc.Mgr.UserDataMgr.Cash -= cc.Mgr.global.BetInitCost;

            if(seed < cc.Mgr.global.BetWinRation)
            {
                var param = {};
                cc.Mgr.UserDataMgr.Cash += (cc.Mgr.global.BetInitCost * 3);
                var str = cc.Mgr.global.getTranslation("BetWin");
                param.text = str+ (cc.Mgr.global.BetInitCost * 3);
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
                //cc.Mgr.UserDataMgr.UnLockOneMate(MateUnLockType.ToDate, cc.Mgr.UserDataMgr.Sex);
            }
            else
            {
                var param = {};
                param.text = cc.Mgr.global.getTranslation("BetLose");
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            }
            cc.Mgr.global.BetInitCost *= 2;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.RefreshCashAsset, {});
        }
        this.ClosePanel();
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.forWhat = "";
        this.node.active = false;
    },
});
module.exports = JoyTipPanel;
