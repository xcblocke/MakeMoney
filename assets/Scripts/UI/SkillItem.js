
var SkillItem = cc.Class({
    extends: cc.Component,

    properties: {
    	StartAtlas:cc.SpriteAtlas,
        Atlas:cc.SpriteAtlas,
        icon:cc.Sprite,
        maskSp:cc.Sprite,
        lvLbl:cc.Label,
        Line:cc.Sprite,
        UpTip:cc.Node,
        Data:null,
    },

    ShowData:function (data ,len) {
        this.UpTip.active = false;
        this.Data = data;
        this.lvLbl.string = data.level;
        this.icon.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        if(data.level != 0)
        {
            //this.icon.setState(0);
            this.maskSp.node.active = false;
            this.Line.setState(0);
        }
        else
        {
            //this.icon.setState(1);
            this.maskSp.node.active = true;
            this.Line.setState(1);
        }
        this.Line.node.active = false;
        if(data.subId != len)
        {
            this.Line.node.active = true;
        } 

        this.JudeShowUpTip();
    },

    JudeShowUpTip:function(){
        var isOk = cc.Mgr.UserDataMgr.CanShowUpTip(this.Data.Id, this.Data.subId, (this.Data.level + 1));
        this.UpTip.active = isOk;
    },

    ClickOpenUp:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenUpgradeSkill, this.Data);
    },
});
module.exports = SkillItem;
