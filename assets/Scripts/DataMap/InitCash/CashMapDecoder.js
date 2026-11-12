var CashData = require("CashData");
var CashMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"cash",
        cashList:{
            default:[],
            type:[CashData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析现金数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.cash;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var cashD = new CashData();
                cashD.Id = jsonRoot[i].Id;
                cashD.cash = jsonRoot[i].cash;
                cashD.weight = jsonRoot[i].weight;
                
                self.cashList[i] = cashD; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.cashList.length - 1; i >= 0; i--) {
            if(name == this.cashList[i].name)
            {
                data = this.cashList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.cashList.length - 1; i >= 0; i--) {
            if(itemId == this.cashList[i].Id)
            {
                data = this.cashList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.cashList.length
    },
});
module.exports = CashMapDecoder;
