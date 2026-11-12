var AdsParam = require("AdsParam");
var AdsRetirePanel = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    ShowPanel:function(){

    },

    ConfirmUseAds:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        var self = this;
        cc.Mgr.AdsMgr.ShowVideoAds(AdsParam.PointD, function(out){
            if(out == 0)
            {
                cc.Mgr.UserDataMgr.retireAge += cc.Mgr.global.tmpRetireAgeBonues;
                cc.director.GlobalEvent.emit(cc.Mgr.Event.RefreshAllUIShow, {});
                
                cc.Mgr.global.useRetireAds = true;
                self.node.active = false;
            }
        });
    },

    ShareToFriend:function(){
        cc.Mgr.PlatformController.ShareToFriend(2);
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
        cc.director.GlobalEvent.emit(cc.Mgr.Event.Retire, {});
    },
});
module.exports = AdsRetirePanel;
