var ItemType = require("ItemType");
var MateGetType = require("MateGetType");
var MateBonusType = require("MateBonusType");
var MateItemPanel = cc.Class({
    extends: cc.Component,

    properties: {
        Atlas:cc.SpriteAtlas,
        cost:cc.Integer,
        nameLbl:cc.Sprite,
        iconSp:cc.Sprite,
        desLbl:cc.Label,
        MarryCond:cc.Node,
        MarryCondLbl:cc.Label,
        Id:cc.Integer,
        LovePoint:cc.Integer,
        PdesLbl:cc.Label,
    },

    ShowPanel:function (data) {
    	this.Id = data.Id;
        this.LovePoint = data.LovePoint;
    	this.iconSp.spriteFrame = this.Atlas.getSpriteFrame(data.icon);
    	//this.nameLbl.string = data.name;
    	var mateData = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate, data.Id);
    	var lovePointList = mateData.lovePointList;
    	var index = 0;
    	for (var i = lovePointList.length - 1; i >= 0; i--) {
    		if(lovePointList[i].curLevel == data.curLevel)
    		{
    			index = i;
    			break;
    		}
    	}
        var idex = 1 + Math.floor(Math.random() * 6);
        this.PdesLbl.string = cc.Mgr.global.getTranslation("date_"+this.Id);
        this.cost = lovePointList[index].cost - Math.floor(lovePointList[index].cost * cc.Mgr.UserDataMgr.DateMoneyBonus);
    	this.desLbl.string = this.cost;

        this.MarryCond.active = true;
        if(this.LovePoint == 99)
        {
            var DD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate, this.Id);
            this.PdesLbl.string = "结婚后:"+this.getMateBonusDes();
            this.MarryCondLbl.string = this.getUnlockTypes(DD.getCondList);
        }
        else
        {
            this.MarryCondLbl.string = "亲密度达到99显示";
        }
    },

    ClosePanel:function(){
        cc.Mgr.AudioMgr.playSFX("click");
    	this.node.active = false;
    },

    getMateBonusDes:function () {
        var bonusList = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate ,this.Id).bonusList;
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
                    str = str+" "  + "治疗降费:" + bonusList[i].bonusNum*100 + "%";
                    break;
            }
        }
        return str;
    },

    //约起来
    DateClick:function(){
        var flag = cc.Mgr.UserDataMgr.JudeHasAnyMate();
        if(flag && this.LovePoint == 99)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            var param = {};
            var seed = Math.floor(Math.random() * 2);
            param.text = cc.Mgr.global.getTranslation("HasMarray_" + seed);
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            return;
        }

    	if(cc.Mgr.UserDataMgr.Cash < this.cost)
    	{
            cc.Mgr.AudioMgr.playSFX("click");
    		var param = {};
            var seed = Math.floor(Math.random() * 2);
    		param.text = cc.Mgr.global.getTranslation("NoMoneyDate_" + seed);
    		cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
    		return;
    	}

        var DD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate, this.Id);
        var result = this.JudeCanMarry(DD.getCondList);
        if(this.LovePoint == 99 && !result.canMarry)
        {
            cc.Mgr.AudioMgr.playSFX("click");
            var param = {};
            var des = "";
            //cc.log("=======================" + result.desList.length);
            for (var i = 0; i < result.desList.length; i++) {
                des = des+"\n" + cc.Mgr.global.getTranslation("MateMarryCond_" + this.Id);
            }
            param.text = des;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
        }
        else
        {
            cc.Mgr.UserDataMgr.Cash -= this.cost;
            var outpar = cc.Mgr.UserDataMgr.RefreshMateData(this.Id);
            if(outpar.isFull == true)
            {
                var bonusList = DD.bonusList;
                this.getBonus(bonusList);
                //var param = {};
                //param.text = cc.Mgr.global.getTranslation("MarryTxt_" + cc.Mgr.UserDataMgr.Sex);
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenMarry, DD);
            }
            else
            {
                var seed = Math.floor(Math.random() * 6);
                var param = {};
                param.forWhat = "DateLater";
                param.text = cc.Mgr.global.getTranslation("DateOut_" + seed) + "\n" + "<color=#e77122>亲密度达到:"+ outpar.LovePoint+"</c>";
                cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
            }
            var dt = {};
            dt.Id = this.Id;
            cc.director.GlobalEvent.emit(cc.Mgr.Event.DateSuccess, dt);
            this.ClosePanel();
        }
    },

    JudeCanMarry:function(getCondList){
        var canMarry = false;
        var result = {};
        var txt = [];
        for (var i = 0; i < getCondList.length; i++) {
            var cond = getCondList[i];
            switch (cond.unlockType) {
                case MateGetType.Money:
                    canMarry = true;
                    break;
                case MateGetType.House:
                    canMarry = cc.Mgr.UserDataMgr.JudeHasHouse(cond.value);
                    break;
                case MateGetType.Car:
                    canMarry = cc.Mgr.UserDataMgr.JudeHasCar(cond.value);
                    break;
                case MateGetType.Asset:
                    canMarry = cc.Mgr.UserDataMgr.JudeAsset(cond.value);
                    break;
                case MateGetType.Reputation:
                    canMarry = cc.Mgr.UserDataMgr.JudeReputation(cond.value);
                    break;
                case MateGetType.HP:
                    canMarry = cc.Mgr.UserDataMgr.JudeHpPoint(cond.value);
                    break;
                case MateGetType.Company:
                    canMarry = cc.Mgr.UserDataMgr.JudeHasCompany();
                    break;
            }
            
            if(canMarry == false)
            {
                txt.push(cond.unlockType);
                result.canMarry = canMarry;
                result.desList = txt;
                return result;
                break;
            }
        }
        result.canMarry = canMarry;
        result.desList = txt;
        return result;
    },

    getUnlockTypes:function(getCondList)
    {
        var txt = "";
        for (var i = 0; i < getCondList.length; i++) {
            var cond = getCondList[i];
            txt += this.getCondDes(cond.unlockType, cond.value) + " ";
        }
        return txt;
    },

    getCondDes:function(type, value)
    {
        var txt = "";
        if(value == 0)
        {
            switch (type) {
            case MateGetType.Money:
                txt = "腰缠万贯";
                break;
            case MateGetType.House:
                txt = "房子一套";
                break;
            case MateGetType.Car:
                txt = "小车一辆";
                break;
            case MateGetType.Asset:
                txt = "资产百万";
                break;
            case MateGetType.Reputation:
                txt = "声名鹊起";
                break;
            case MateGetType.HP:
                txt = "身体健康";
                break;
            case MateGetType.Company:
                txt = "拥有任意一家公司";
                break;
            }
        }
        else
        {
            switch (type) {
            case MateGetType.Money:
                txt = "现金"+value;
                break;
            case MateGetType.House:
                var DD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.House, value);
                txt = DD.name + "一套";
                break;
            case MateGetType.Car:
                var DD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Car, value);
                txt = DD.name + "一辆";
                break;
            case MateGetType.Asset:
                txt = "资产达到:"+value;
                break;
            case MateGetType.Reputation:
                txt = "名声达到:"+value;
                break;
            case MateGetType.HP:
                txt = "健康值达到:"+value;
                break;
            case MateGetType.Company:
                var DD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Company, value);
                txt = DD.name + "一家";
                break;
            }
        } 
        return txt;
    },

    getBonus:function(bonusList)
    {
        cc.Mgr.UserDataMgr.getMateBonusReward(bonusList);
    },
});
module.exports = MateItemPanel;