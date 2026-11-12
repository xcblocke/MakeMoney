var AdsParam = require("AdsParam");
var TreatPanel = cc.Class({
    extends: cc.Component,

    properties: {
        costLbl:cc.Label,
    },

    ShowPanel:function(){
        this.costLbl.string = Math.floor(2000* Math.pow(1.18, cc.Mgr.UserDataMgr.Age-20) *(1-cc.Mgr.UserDataMgr.HpPoint/100));
    },

    callbackFunc:function(){
        var self = this;
        cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointB, function(out){
            if(out == 0)
            {
                cc.Mgr.UserDataMgr.HpPoint = 100;
                cc.director.GlobalEvent.emit(cc.Mgr.Event.TreatSuccess, {});
                self.ClosePanel();
            }
        }); 
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active =false;
    },

    ClickOpen:function () {
        var needMoney = Math.floor(2000* Math.pow(1.18, cc.Mgr.UserDataMgr.Age-20) *(1-cc.Mgr.UserDataMgr.HpPoint/100));
        if(cc.Mgr.UserDataMgr.Cash < needMoney)
        {
            var param = {};
            param.forWhat = "";
            param.text = "金钱不够,连住院接受治疗都是奢侈";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        cc.Mgr.UserDataMgr.Cash -= needMoney;
        cc.Mgr.UserDataMgr.HpPoint = 100;
        ////cc.log("---------------------------------------" + cc.Mgr.UserDataMgr.HpPoint);
	    cc.director.GlobalEvent.emit(cc.Mgr.Event.TreatSuccess, {});
        this.ClosePanel();
    },
});
module.exports = TreatPanel;
