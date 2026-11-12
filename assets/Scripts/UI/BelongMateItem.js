var ItemType = require("ItemType");
var MateBonusType = require("MateBonusType");
var BelongMateItem = cc.Class({
    extends: cc.Component,

    properties: {
        Atals:cc.SpriteAtlas,
        Icon:cc.Sprite,
        nameSp:cc.Sprite,
        desLbl:cc.Label,
        itemType:{
            default:ItemType.Car,
            type:ItemType,
        },
        Data:null,
    },

    init:function(data, itemType){
        this.itemType = itemType
        this.Data = data;
        this.Icon.spriteFrame = this.Atals.getSpriteFrame(data.icon);
        this.nameSp.spriteFrame = this.Atals.getSpriteFrame(data.name);
        var bonusList = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate ,data.Id).bonusList;
        var str = "";
        for (var i = 0; i < bonusList.length; i++) {
            switch(bonusList[i].bonusType)
            {
                case MateBonusType.HP:
                    if(bonusList[i].bonusNum>0)
                        str = str+" " + "每年健康:+" + bonusList[i].bonusNum;
                    else
                        str = str+" " + "每年健康:" + bonusList[i].bonusNum;
                    break;
                case MateBonusType.Reputation:
                    str = str+" "  + "每年名声:+" + bonusList[i].bonusNum;
                    break;
                case MateBonusType.Money:
                    str = str+" "  + "每年现金:+" + bonusList[i].bonusNum;
                    break;
                case MateBonusType.WareHouseCapcity:
                    str = str+" "  + "仓储:+" + bonusList[i].bonusNum;
                    break;
                case MateBonusType.Treat:
                    str = str+" "  + "治疗降费:+" + bonusList[i].bonusNum*100 + "%";
                    break;
            }
        }
        this.desLbl.string = str;
    },

    clickOpen:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        var param = {};
        param.icon = this.Data.icon;
        param.name = this.Data.name;
        param.Id = this.Data.Id;
        param.Type = ItemType.Mate;
        param.price = 0;
        param.flag = "Sale";
        cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonBuy, param);
    },
});
module.exports = BelongMateItem;
