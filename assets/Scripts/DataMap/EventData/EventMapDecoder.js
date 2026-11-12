var EventData = require("EventTipData");
var EventCost = require("EventCost");
var EventResult = require("EventResult");
var EventMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"events",
        eventList:{
        	default:[],
        	type:[EventData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析事件数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.events;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var eventData = new EventData();
                eventData.Id = jsonRoot[i].Id;
                //eventData.icon = jsonRoot[i].icon;
                eventData.name = jsonRoot[i].name;
                eventData.desId = jsonRoot[i].desId;

                //消耗
                for (var j = 0; j < jsonRoot[i].cost.length ; j++) {
                	var cData = new EventCost();
                	var dt = jsonRoot[i].cost[j];
                	cData.costType = dt[0];
                	cData.costNum = dt[1];
                	cData.desId = dt[2];
                	eventData.cost[j] = cData;
                }
                //正向两种结果
                for (var j = 0; j < jsonRoot[i].Yresult.length; j++) {
                    var cData = new EventResult();
                    var data = jsonRoot[i].Yresult[j];
                    cData.rewardType = data[0];
                    cData.rewardNum = data[1];
                    cData.rewardId = data[2]; //如果奖励的是金钱等  则id 为0
                    cData.desId = data[3];
                    eventData.YResults[j] =  cData;
                }
                //负向两种结果
                for (var j = 0; j < jsonRoot[i].Nresult.length; j++) {
                    var cData = new EventResult();
                    var data = jsonRoot[i].Nresult[j];
                    cData.rewardType = data[0];
                    cData.rewardNum = data[1];
                    cData.rewardId = data[2]; //如果奖励的是金钱等  则id 为0
                    cData.desId = data[3];
                    eventData.NResults[j] =  cData;
                }
                self.eventList[i] = eventData; 
            }
            self.reCb(true);
        });
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.eventList.length - 1; i >= 0; i--) {
            if(itemId == this.eventList[i].Id)
            {
                data = this.eventList[i];
                break;
            }
        }
        return data;
    },

     getJsonLength:function(){
        return this.eventList.length
    },

    getDataList:function(){
        return this.eventList;
    },
   
});
module.exports = EventMapDecoder;
