var CarData = require("CarData");
var CarMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"car",
        carList:{
            default:[],
            type:[CarData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析汽车数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.car;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var carD = new CarData();
                carD.Id = jsonRoot[i].Id;
                carD.icon = jsonRoot[i].icon;
                carD.name = jsonRoot[i].name;
                carD.price = jsonRoot[i].price;
                carD.addBonus = jsonRoot[i].addBonus;
                carD.addHp = jsonRoot[i].addHp;
                carD.addDate = jsonRoot[i].addDate;
                self.carList[i] = carD; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.carList.length - 1; i >= 0; i--) {
            if(name == this.carList[i].name)
            {
                data = this.carList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.carList.length - 1; i >= 0; i--) {
            if(itemId == this.carList[i].Id)
            {
                data = this.carList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.carList.length
    },

    getDataList:function(){
        return this.carList;
    },
});
module.exports = CarMapDecoder;
