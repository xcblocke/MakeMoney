var CarMapDecoder = require("CarMapDecoder"); 
var CompanyMapDecoder = require("CompanyMapDecoder");
var GoodMapDecoder = require("GoodMapDecoder");
var HouseMapDecoder = require("HouseMapDecoder");
var MateMapDecoder = require("MateMapDecoder");
var SkillMapDecoder = require("SkillMapDecoder");
var CashMapDecoder = require("CashMapDecoder");
var AchieveMapDecoder = require("AchieveMapDecoder");
var EventMapDecoder = require("EventMapDecoder");

var ItemType = require("ItemType");

var MapDataMgr = cc.Class({
    extends: cc.Component,

    properties: {
        carMap:null,  
        companyMap:null,
        goodsMap:null,
        houseMap:null,
        mateMap:null,
        skillMap:null,
        cashMap:null,
        achieveMap:null,
        eventDataMap:null,

        decodeAll:0,
    },

    checkInitMapSuc:function(){
        if(this.decodeAll == 100)
        {
            //cc.log("数据解析完了");
        }
    },

    //初始化解析数据表
    initMaps:function () {
        cc.log("开始解析数据了");
        cc.Mgr.Parse = false;
        this.goodsMap = new GoodMapDecoder();
        this.cashMap = new CashMapDecoder();
        this.houseMap = new HouseMapDecoder();
        this.companyMap = new CompanyMapDecoder();
        this.carMap = new CarMapDecoder();
        this.mateMap = new MateMapDecoder();
        this.skillMap = new SkillMapDecoder();
        this.achieveMap = new AchieveMapDecoder();
        this.eventDataMap = new EventMapDecoder();

        var self = this;
        
        this.decodeAll = 0;

        this.carMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 汽车" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.companyMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 公司" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.houseMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 房子"+ self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.mateMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 小伙伴" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.skillMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 技能" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.cashMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 现金" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.achieveMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 成就" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.eventDataMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=10;
                //cc.log("===解析数据成功=== 事件" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });

        this.goodsMap.DecodeJson(function(result){
            if(result)
            {
                self.decodeAll +=20;
                //cc.log("===解析数据成功=== 货物" + self.decodeAll);
                if(self.decodeAll == 100)
                {
                    cc.Mgr.Parse = true;
                    cc.director.GlobalEvent.emit(cc.Mgr.Event.ParseFinish, {});
                }
            }
        });
    },

    getDataByItemTypeAndId:function(itemType, itemId){
        var data = null;
        //cc.log("ItemType = " + itemType + "  Id = " + itemId);
        switch(itemType)
        {
            case ItemType.Cash:
                data = this.cashMap.getDataByItemId(itemId);
                break;
            case ItemType.Goods:
                data = this.goodsMap.getDataByItemId(itemId);
                break;
            case ItemType.Skill:
                data = this.skillMap.getDataByItemId(itemId);
                break;
            case ItemType.Company:
                data = this.companyMap.getDataByItemId(itemId);
                break;
            case ItemType.House:
                data = this.houseMap.getDataByItemId(itemId);
                break;
            case ItemType.Car:
                data = this.carMap.getDataByItemId(itemId);
                break;
            case ItemType.Mate:
                data = this.mateMap.getDataByItemId(itemId);
                break;
            case ItemType.Achieve:
                data = this.achieveMap.getDataByItemId(itemId);
                break;
            case ItemType.EventData:
                data = this.eventDataMap.getDataByItemId(itemId);
                break;
        }
        return data;
    },

    getDataLengthByItemType:function(itemType){
        var len = 0;
        switch(itemType)
        {
            case ItemType.Cash:
                len = this.cashMap.getJsonLength();
                break;
            case ItemType.Goods:
                len = this.goodsMap.getJsonLength();
                break;
            case ItemType.Skill:
                len = this.skillMap.getJsonLength();
                break;
            case ItemType.Company:
                len = this.companyMap.getJsonLength();
                break;
            case ItemType.House:
                len = this.houseMap.getJsonLength();
                break;
            case ItemType.Car:
                len = this.carMap.getJsonLength();
                break;
            case ItemType.Mate:
                len = this.mateMap.getJsonLength();
                break;
            case ItemType.Achieve:
                len = this.achieveMap.getJsonLength();
                break;
            case ItemType.EventData:
                len = this.eventDataMap.getJsonLength();
                break;
        }
        return len;
    },

    getDataListByItemType:function(itemType){
        var dataList = null;
        //cc.log("拿数据 = " + itemType);
        switch(itemType)
        {
            case ItemType.Cash:
                dataList = this.cashMap.getDataList();
                break;
            case ItemType.Goods:
                dataList = this.goodsMap.getDataList();
                break;
            case ItemType.Skill:
                dataList = this.skillMap.getDataList();
                break;
            case ItemType.Company:
                dataList = this.companyMap.getDataList();
                break;
            case ItemType.House:
                dataList = this.houseMap.getDataList();
                break;
            case ItemType.Car:
                dataList = this.carMap.getDataList();
                break;
            case ItemType.Mate:
                dataList = this.mateMap.getDataList();
                break;
            case ItemType.Achieve:
                dataList = this.achieveMap.getDataList();
                break;
            case ItemType.EventData:
                dataList = this.eventDataMap.getDataList();
                break;
        }
        //cc.log("取得数据 " + dataList.length);
        return dataList;
    },

    //专门给技能的数据获取用
    getSkillListById:function(Id)
    {
        return this.skillMap.getSkillListById(Id);
    },

    getSkillDataByTwoId:function(Id, subId){
        return this.skillMap.getSkillDataByTwoId(Id);
    },

    getUpgradeCostByTwoId:function(Id, subId, tolv)
    {
        return this.skillMap.getUpgradeCostByTwoId(Id, subId, tolv);
    },

    getSkillAddBonusByTwoIdAndLv:function (Id, subId, tolv) {
        return this.skillMap.getSkillAddBonusByTwoIdAndLv(Id, subId, tolv);
    },

    //获取对应性别的购买物品
    getDataListBySex:function(Sex){
        return this.goodsMap.getDataListBySex(Sex);
    },
    
});
module.exports = MapDataMgr;
