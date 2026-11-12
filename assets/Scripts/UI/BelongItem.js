var ItemType = require("ItemType");
var BelongItem = cc.Class({
    extends: cc.Component,

    properties: {
        itemType:{
            default:ItemType.Car,
            type:ItemType,
        },
        Id:cc.Integer,
        ItemName:"",
        icon:cc.Sprite,
        Atlas:cc.SpriteAtlas,
        price:cc.Integer,
        nameLbl:cc.Label,
        desLbl:cc.Label,
        Data:null,
    },

    init:function (data, itemType) {
        this.Id = data.Id;
        this.Data = data;
        this.itemType = itemType;
        this.icon.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
        //this.nameLbl.string = data.name;
        this.ItemName = data.name;
        if(data.price == null)
            this.price = 0;
        else
            this.price = data.price;
        
        if(this.itemType == ItemType.Car || this.itemType == ItemType.House)
        {
            this.desLbl.string = "x" + data.ownNum;
        }
        else if(this.itemType == ItemType.Mate)
        {
            this.desLbl.string = "";
        }
    },

    ClickOpen:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        if(this.itemType == ItemType.Car || this.itemType == ItemType.House)
        {
            var param = {};
            if(this.itemType == ItemType.Car)
                param.name = cc.Mgr.global.getTranslation("car_" + this.Id);
            else
                param.name = cc.Mgr.global.getTranslation("company_"+this.Id);
            param.Id = this.Id;
            param.Type = ItemType.House;
            if(this.itemType == ItemType.Car)
                param.Type = ItemType.Car;
            param.price = this.price;
            param.icon = this.Data.icon;
            param.flag = "Sale";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonBuy, param);
        }
        else if(this.itemType == ItemType.Mate)
        {
            var param = {};
            param.name = param.name = cc.Mgr.global.getTranslation("role_"+this.Id);
            param.Id = this.Id;
            param.Type = ItemType.Mate;
            param.price = this.price;
            param.flag = "Sale";
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonBuy, param);
        }

    },

    Refresh:function(data){
        if(this.itemType == ItemType.Car || this.itemType == ItemType.House)
        {
            this.desLbl.string = "x" + data.ownNum;
        }
    },

});
module.exports = BelongItem;