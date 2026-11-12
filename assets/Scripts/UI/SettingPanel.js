
var SettingPanel = cc.Class({
    extends: cc.Component,

    properties: {
        togMan:cc.Toggle,
        togWoMan:cc.Toggle,
    },

    ShowPanel:function(){
        if(cc.Mgr.UserDataMgr.Sex == 1)
            this.togMan.isChecked = true;
        else
            this.togWoMan.isChecked = true;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

    ConfrimSexMan:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UserDataMgr.Sex = 1;
    },

    ConfrimSexWoMan:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.Mgr.UserDataMgr.Sex = 2;
    },

    OpenSound:function(){
        cc.Mgr.AudioMgr.resumeAll();
        cc.Mgr.AudioMgr.playSFX("click");
    },

    OffSound:function(){
        cc.Mgr.AudioMgr.pauseAll();
    },

});
module.exports = SettingPanel;
