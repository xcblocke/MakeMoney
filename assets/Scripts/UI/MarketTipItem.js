var ItemType = require("ItemType");
var MarketTipItem = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        iconAtlas:cc.SpriteAtlas,
        Des:cc.Label,
        Icon: cc.Sprite,
        updown:cc.Sprite,
    },

    SetData:function(param)
    {
        var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(ItemType.Goods,param.Id);
        this.Des.string = cc.Mgr.global.getTranslation(param.des.desId);
        this.Icon.spriteFrame = this.iconAtlas.getSpriteFrame(data.icon);
        //this.Icon.setState(1);
        if(param.des.State == 0)
            this.updown.spriteFrame = this.Atlas.getSpriteFrame("sdown");
        else
            this.updown.spriteFrame = this.Atlas.getSpriteFrame("dup");
    },
});
module.exports = MarketTipItem;