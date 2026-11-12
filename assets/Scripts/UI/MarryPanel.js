
var MarryPanel = cc.Class({
    extends: cc.Component,

    properties: {
       RoleAtlas:cc.SpriteAtlas,
       roleSp:cc.Sprite,
       TipLbl:cc.Label,
       MarryLbl1:cc.Label,
       MarryLbl2:cc.Label,
    },

    ShowPanel:function(data)
    {
        if(cc.Mgr.UserDataMgr.MarryAge == 0)
        {
          cc.Mgr.UserDataMgr.MarryRoleId = data.Id;
          cc.Mgr.UserDataMgr.MarryAge = cc.Mgr.UserDataMgr.Age;
        }
        this.roleSp.spriteFrame = this.RoleAtlas.getSpriteFrame(data.icon);
        var name = cc.Mgr.global.getTranslation("role_"+data.Id);
        this.TipLbl.string = "恭喜"+cc.Mgr.UserDataMgr.playerName +"&&"+name +"结成伴侣";
        this.MarryLbl1.string = cc.Mgr.UserDataMgr.playerName;
        this.MarryLbl2.string = name;
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.node.active = false;
    },

    ShareToFriend:function(){
      cc.Mgr.PlatformController.ShareToFriend(1);
    },

});
module.exports = MarryPanel;
