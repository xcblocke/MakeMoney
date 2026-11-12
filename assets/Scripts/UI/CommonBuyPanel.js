var ItemType = require("ItemType");
var UserState = require("UserState");
var CommonBuyPanel = cc.Class({
    extends: cc.Component,

    properties: {
        MainAtlas:cc.SpriteAtlas,
        Atlas:cc.SpriteAtlas,
        titleLbl:cc.Sprite,
        carhosueDes:cc.Node,

        des1:cc.Label,
        des2:cc.Label,
        des3:cc.Label,
        des4:cc.Label,

        disdesLbl:cc.Label,
        iconSp:cc.Sprite,
        nameSp:cc.Sprite,
        price:cc.Integer,
        Id:cc.Integer,
        flag:"",
        Type:{
            default:ItemType.Car,
            type:ItemType,
        },
    },

    ShowPanel:function (param) {
        var data = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(param.Type, param.Id)
        this.nameSp.spriteFrame = this.Atlas.getSpriteFrame(param.name)
        var price = param.price;
        if(param.flag == "Buy")
        {
            if(param.Type == ItemType.Car)
            {
                this.des4.node.active = true;
                this.des1.node.active = false;
                this.des4.string = "+" + (data.addDate * 100) + "%";
                this.titleLbl.spriteFrame = this.MainAtlas.getSpriteFrame("text_buycar");
                price = param.price - Math.floor(param.price * cc.Mgr.UserDataMgr.CarBuyBonus);
            }
            else if(param.Type == ItemType.House)
            {
                this.des4.node.active = false;
                this.des1.node.active = true;
                this.des1.string = "+" + data.addHp;
                this.titleLbl.spriteFrame = this.MainAtlas.getSpriteFrame("text_buyhouse");
                price= param.price - Math.floor(param.price * cc.Mgr.UserDataMgr.HouseBuyBonuse);
            }

            this.des2.string = "+" + data.addBonus;
            this.des3.string = cc.Mgr.global.FormatNum(price);
            this.carhosueDes.active = true;
            this.disdesLbl.node.active = false;
        }
        else if(param.flag == "Sale")
        {
            if(param.Type == ItemType.Car || param.Type == ItemType.House)
            {
                this.titleLbl.spriteFrame = this.MainAtlas.getSpriteFrame("sale_txt");
                
                if(param.Type == ItemType.Car)
                {
                    this.des4.node.active = true;
                    this.des1.node.active = false;
                    this.des4.string = "+" + (data.addDate * 100) + "%";
                }
                else
                {
                    this.des1.string = "+" + data.addHp;
                    this.des4.node.active = false;
                    this.des1.node.active = true;
                }

                this.des2.string = "+" + data.addBonus;
                this.des3.string = Math.floor(price/2);
                this.carhosueDes.active = true;
                this.disdesLbl.node.active = false;
            }
            else if(param.Type == ItemType.Mate)
            {
                var name = cc.Mgr.global.getTranslation("role_"+param.Id);
                this.carhosueDes.active = false;
                this.disdesLbl.node.active = true;
                this.titleLbl.spriteFrame = this.MainAtlas.getSpriteFrame("dis_marry");
                var dd = 1 + Math.floor(Math.random() * 5);
                this.disdesLbl.string = name+"说:"+cc.Mgr.global.getTranslation("Disvorce_" + dd);
            }

        }
        this.price = price;
        this.Type = param.Type;
        this.Id = param.Id;
        this.iconSp.spriteFrame = this.Atlas.getSpriteFrame(param.icon);
        if(param.flag != null)
            this.flag = param.flag;
        else
            this.flag = "";
    },

    ClickBuy:function(){
        if(this.flag == "Buy")
        {
            if(cc.Mgr.UserDataMgr.Cash < this.price)
            {
                cc.Mgr.AudioMgr.playSFX("click");
                var param = {};
                param.forWhat = "";
                param.text = "<color=#e77122>你的钱不够啊,买不起</c>";
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
                return;
            }
        }
        
        if(this.flag != null && this.flag != "")
        {
            if(this.Type == ItemType.Car || this.Type == ItemType.House)
            {
                var par = {};
                par.Type = this.Type;
                par.addNum = 0;
                if(this.flag == "Buy")
                {
                    var data = cc.Mgr.UserDataMgr.getDataByItemTypeAndId(this.Type, this.Id);
                    //cc.log("加成属性 ====== 健康 " + data.addHp +"  名声 " + data.addBonus);
                    cc.Mgr.UserDataMgr.Reputation += data.addBonus;
                    cc.Mgr.UserDataMgr.HpPoint += data.addHp;
                    if(cc.Mgr.UserDataMgr.HpPoint > 100)
                        cc.Mgr.UserDataMgr.HpPoint = 100;

                    if(cc.Mgr.UserDataMgr.HpPoint >= cc.Mgr.global.HealthLine)
                    {
                        cc.Mgr.UserDataMgr.userState = UserState.OK;
                        cc.Mgr.UserDataMgr.RecoverYear = 0;
                    }
                    //cc.log("价格 === " + this.price + " 对应Id " + this.Id);
                    cc.Mgr.UserDataMgr.Cash -= this.price;
                    par.addNum = 1;

                    if(this.Type == ItemType.Car)
                    {
                        cc.Mgr.UserDataMgr.DateSuccescRatio += data.addDate;
                    }
                }
                else if(this.flag == "Sale")
                {
                    par.addNum = -1;
                    cc.Mgr.UserDataMgr.Cash += Math.floor(this.price/2);
                }
                par.Id = this.Id;
                par.flag = this.flag;
                cc.Mgr.UserDataMgr.BuySaleCommonItem(par);
                cc.director.GlobalEvent.emit(cc.Mgr.Event.CommonBuySaleSuccess, par);
            }
            else if(this.Type == ItemType.Mate)
            {
                if(this.flag == "Sale")
                {
                    if(cc.Mgr.UserDataMgr.DivorceAge == 0)
                    {
                        cc.Mgr.UserDataMgr.DivorceAge = cc.Mgr.UserDataMgr.Age;
                    }
                    var par = {};
                    par.flag = this.flag;
                    par.Disvorce = true;
                    cc.Mgr.UserDataMgr.DisvorceMateById(this.Id);
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.CommonBuySaleSuccess, par);
                }
            }
        }
        this.ClosePanel();
    },



    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
        this.flag = "";
        this.node.active = false;
    },

});
module.exports = CommonBuyPanel;
