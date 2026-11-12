var ItemType = require("ItemType");
var CarItem = cc.Class({
    extends: cc.Component,

    properties: {
        nameLbl:cc.Label,
        icon:cc.Sprite,
        Atlas:cc.SpriteAtlas,
        Data:null,
    },

    init:function (data) {
        this.icon.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        this.Data = data;
    },

    ClickBuy:function () {
        cc.Mgr.AudioMgr.playSFX("click");
        var param = {};
        param.name = this.Data.name;
        param.icon = this.Data.icon;
        param.Id = this.Data.Id;
        param.Type = ItemType.Car;
        param.price = this.Data.price;
        param.flag = "Buy";
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonBuy, param);
    },

});
module.exports = CarItem;
