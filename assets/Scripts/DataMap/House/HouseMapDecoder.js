var HouseData = require("HouseData");
var HouseMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"house",
        houseList:{
            default:[],
            type:[HouseData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析房屋数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.house;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var houseD = new HouseData();
                houseD.Id = jsonRoot[i].Id;
                houseD.icon = jsonRoot[i].icon;
                houseD.name = jsonRoot[i].name;
                houseD.price = jsonRoot[i].price;
                houseD.addBonus = jsonRoot[i].addBonus;
                houseD.addHp = jsonRoot[i].addHp;
                
                self.houseList[i] = houseD; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.houseList.length - 1; i >= 0; i--) {
            if(name == this.houseList[i].name)
            {
                data = this.houseList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.houseList.length - 1; i >= 0; i--) {
            if(itemId == this.houseList[i].Id)
            {
                data = this.houseList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.houseList.length
    },

    getDataList:function(){
        return this.houseList;
    },

});
module.exports = HouseMapDecoder;