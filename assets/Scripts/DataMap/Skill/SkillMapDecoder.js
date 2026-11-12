var SkillData = require("SkillData");
var CostData = require("CostData");
var SkillMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"skill",
        skillList:{
            default:[],
            type:[SkillData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析技能数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.skill;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var skillData = new SkillData();
                skillData.Id = jsonRoot[i].Id;
                skillData.subId = jsonRoot[i].subId;
                skillData.icon = jsonRoot[i].icon;
                skillData.desId = jsonRoot[i].desId;
                skillData.name = jsonRoot[i].name;
                skillData.skillType = jsonRoot[i].skillType;
                skillData.upLevel = jsonRoot[i].upCostList.length;//jsonRoot[i].upLevel;
                for (var j = 0; j < jsonRoot[i].upCostList.length; j++) {
                    var costD = new CostData();
                    costD.cost = jsonRoot[i].upCostList[j][2];
                    costD.toLevel = jsonRoot[i].upCostList[j][0];
                    costD.addBonus = jsonRoot[i].upCostList[j][1];
                    skillData.upCostList[j] = costD;
                }
                self.skillList[i] = skillData; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            if(name == this.skillList[i].name)
            {
                data = this.skillList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            if(itemId == this.skillList[i].Id)
            {
                data = this.skillList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.skillList.length
    },

    getDataList:function(){
        return this.skillList;
    },

    //获取升级技能消费数据 需要提供两个 Id
    getUpgradeCostByTwoId:function(Id,subId,tolv){
        var Cost = 20;
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            var data = this.skillList[i];
            if(data.Id == Id && data.subId == subId)
            {
                for (var i = data.upCostList.length - 1; i >= 0; i--) {
                    var dt = data.upCostList[i];
                    if(dt.toLevel == tolv)
                    {
                        //cc.log("Id subId toLv 花费技能点===================" + dt.cost + " " + tolv);
                        Cost = dt.cost;
                        return dt.cost;
                    }
                }
            }
        }
        return Cost;
    },

    getSkillAddBonusByTwoIdAndLv:function(Id,subId,lv){
        var bonus = 0;
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            var data = this.skillList[i];
            if(data.Id == Id && data.subId == subId)
            {
                for (var i = data.upCostList.length - 1; i >= 0; i--) {
                    var dt = data.upCostList[i];
                    if(dt.toLevel == lv)
                    {
                        bonus = dt.addBonus;
                        return dt.addBonus;
                    }
                }
            }
        }
        return bonus;
    },

    getSkillDataByTwoId:function(Id, subId){
        var dt = null;
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            var data = this.skillList[i];
            if(data.Id == Id && data.subId == subId)
            {
                dt = data;
                return data;
            }
        }
        return dt;
    },

    getSkillListById:function(Id){
        var param = [];
        for (var i = this.skillList.length - 1; i >= 0; i--) {
            var data = this.skillList[i];
            if(data.Id == Id)
            {
                param.push(data);
            }
        }
        return param;
    },

});
module.exports = SkillMapDecoder;