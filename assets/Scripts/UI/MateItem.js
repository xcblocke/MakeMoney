var ItemType = require("ItemType");
var MateItem = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        NameLbl:cc.Sprite,
        iconSp:cc.Sprite,
        LovePointBar:cc.ProgressBar,
        LovePoint:cc.Integer,
        Id:cc.Integer,

        dateBtnSp:cc.Sprite,

        unlock:false,
    },

    ChangeUnLockState:function(data){
        if(!data.canDate)
        {
            this.dateBtnSp.setState(1);
            this.NameLbl.node.active = false;
            if(cc.Mgr.UserDataMgr.Sex == 1)
                this.iconSp.spriteFrame = this.Atlas.getSpriteFrame("nowoman");
            else
                this.iconSp.spriteFrame = this.Atlas.getSpriteFrame("noman");
        }
        else
        {
            this.NameLbl.node.active = true;
            this.dateBtnSp.setState(0);
            this.iconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        }
        this.unlock = data.canDate;
    },

    init:function (data) {
        this.LovePoint = 0;
        this.NameLbl.spriteFrame = this.Atlas.getSpriteFrame(data.name);
        this.iconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.LovePointBar.progress = this.LovePoint/100;
        this.Id = data.Id;
        this.unlock = data.canDate;
        this.ChangeUnLockState(data);
    },

    RefreshLovePoint:function(data){
        this.LovePoint = data.LovePoint;
        this.LovePointBar.progress = this.LovePoint/100;
        if(this.LovePoint >= 100)
            this.dateBtnSp.node.active = false;
        else
            this.dateBtnSp.node.active = true;
    },

    OpenMateItemPanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Mate, this.Id);
        if(data.UpLv == true)
        {
            //var param = {};
            //param.text = cc.Mgr.global.getTranslation("MateHas_" + cc.Mgr.UserDataMgr.Sex);
            //cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        if(data.canDate == false)
        {
            var param = {};
            param.forWhat = "OpenDate";//打开约会面板
            param.text = cc.Mgr.global.getTranslation("MateUnlockTip");
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }
        
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenMateTip, data);
    },
});
module.exports = MateItem;
