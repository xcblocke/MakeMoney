var Event = require("Event");
var MateUnLockType = require("MateUnLockType");
var CommonTipPanel = cc.Class({
    extends: cc.Component,

    properties: {
        titleLbl:cc.Sprite,
        TipLbl:cc.RichText,
        forWhat:"",
        cost:cc.Integer,
    },

    ShowPanel:function (data) {
        if(data.forWhat != null && data.forWhat != "")
            this.forWhat = data.forWhat;
        else
            this.forWhat = "";

        //this.titleLbl.string = "提示说明";


        this.cost = 0;
        if(this.forWhat == "StockBonus")
        {
            var companyName = cc.Mgr.global.getTranslation("company_" +data.Id);
            this.TipLbl.string = "<color=#696969>股票市场-"+companyName+"-获得收益</c>"+"<color=#e77122>" + data.bonus +"</c>"+"<color=#696969>元</c>";
        }
        else if(this.forWhat == "Treat")
        {
            this.cost = data.needMoney - Math.floor(data.needMoney * cc.Mgr.UserDataMgr.TreatBonus);
            this.TipLbl.string = "花费" + this.cost + "治疗，以恢复健康";
        }
        else
        {
            this.TipLbl.string = "<color=#696969>"+ data.text +"</c>";
        }
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");

        if(this.forWhat == "HealthLine")
        {
            cc.Mgr.UserDataMgr.UnLockMateByInHospital(MateUnLockType.InHospital, cc.Mgr.UserDataMgr.Sex);
        }
        else if(this.forWhat == "DateLater")
        {
            if(cc.Mgr.UserDataMgr.tutorialMatePoint == false)
                cc.director.GlobalEvent.emit(cc.Mgr.Event.DateLater, {});
        }
        this.forWhat = "";
        this.node.active = false;
        //cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenEventTip, {});
    },

    ClickConfirm:function(){
        if(this.forWhat == "Treat")
        {
            //计算下所需要的钱 消耗金额=2000*1.18^(当前年龄-20)*（1-当前健康度/100），向上取整
            var needMoney = this.cost; //Math.floor(2000* Math.pow(1.18, cc.Mgr.UserDataMgr.Age-20) *(1-cc.Mgr.UserDataMgr.HpPoint/100));
            if(cc.Mgr.UserDataMgr.Cash < needMoney)
            {
                this.TipLbl.string = "你的钱不够啊,等有钱了再来吧";
                return;
            }
            cc.Mgr.UserDataMgr.Cash -= needMoney;
            cc.Mgr.UserDataMgr.HpPoint = 100;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.TreatSuccess, {});
        }
        else if(this.forWhat == "Retire")
        {
            cc.director.GlobalEvent.emit(cc.Mgr.Event.Retire, {});
        }
        else if(this.forWhat == "HealthLine")
        {
            cc.Mgr.UserDataMgr.UnLockMateByInHospital(MateUnLockType.InHospital, cc.Mgr.UserDataMgr.Sex);
        }
        else if(this.forWhat == "OpenDate")
        {
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenEnjoy, {});
        }
        else if(this.forWhat == "Login")
        {
            cc.Mgr.PlatformController.Login();
        }

        this.ClosePanel();
    },

});
module.exports = CommonTipPanel;
