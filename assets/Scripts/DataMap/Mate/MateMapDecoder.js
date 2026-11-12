var LovePointCost = require("LovePointCost");
var MateData = require("MateData");
var MateBonus = require("MateBonus");
var MateGetCond = require("MateGetCond");
var MateMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"mate",
        mateList:{
            default:[],
            type:[MateData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析伴侣数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.mate;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var mateData = new MateData();
                mateData.Id = jsonRoot[i].Id;
                mateData.icon = jsonRoot[i].icon;
                mateData.sex = jsonRoot[i].sex;
                mateData.name = jsonRoot[i].name;
                mateData.unlockCond = jsonRoot[i].unlockCond;//可以约会条件
                ////cc.log(jsonRoot[i].name + " 是否可以直接约会的" + mateData.unlockCond);
                for (var j = 0; j < jsonRoot[i].getCond.length; j++) {
                    var getCond = new MateGetCond();
                    getCond.unlockType = jsonRoot[i].getCond[j][0];
                    getCond.value = jsonRoot[i].getCond[j][1];
                    mateData.getCondList[j] = getCond;
                }

                for (var j = 0; j < jsonRoot[i].lovePointList.length; j++) {
                    var lpCost = new LovePointCost();
                    lpCost.cost = jsonRoot[i].lovePointList[j][2];
                    lpCost.LovePoint = jsonRoot[i].lovePointList[j][1];
                    lpCost.curLevel = jsonRoot[i].lovePointList[j][0];
                    mateData.lovePointList[j] = lpCost;
                }

                for (var j = 0; j < jsonRoot[i].bonusList.length; j++) {
                    var lpCost = new MateBonus();
                    lpCost.bonusType = jsonRoot[i].bonusList[j][0];
                    lpCost.bonusNum = jsonRoot[i].bonusList[j][1];
                    mateData.bonusList[j] = lpCost;
                }
                self.mateList[i] = mateData; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.mateListmateList.length - 1; i >= 0; i--) {
            if(name == this.mateList[i].name)
            {
                data = this.mateList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.mateList.length - 1; i >= 0; i--) {
            if(itemId == this.mateList[i].Id)
            {
                data = this.mateList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.mateList.length
    },

    getDataList:function(){
        return this.mateList;
    },
    
});
module.exports = MateMapDecoder;
