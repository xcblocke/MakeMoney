var GoodsData = require("GoodsData");
var PriceData = require("PriceData");
var GoodMapDecoder = cc.Class({
    extends: cc.Component,

    properties: {
        jsonName:"goods",
        goodsList:{
            default:[],
            type:[GoodsData],
        },
    },

    //解析数据
    DecodeJson:function (event) {
        //cc.log("===解析物品数据===");
        var self = this;
        self.reCb = event;
        cc.loader.loadRes("json/"+self.jsonName, function (error, obj) {
            if(error)
            {
                //cc.log("+++解析出错，查下json+++" + error);
                self.reCb(false);
                return;
            }
            
            var jsonRoot = obj.json.goods;
            //cc.log("===数据长度===" + jsonRoot.length);
            for (var i = 0; i < jsonRoot.length; i++) {
                var goodsData = new GoodsData();
                goodsData.sex = jsonRoot[i].sex;
                goodsData.Id = jsonRoot[i].itemId;
                goodsData.icon = jsonRoot[i].icon;
                goodsData.name = jsonRoot[i].name;
                for (var j = 0; j < jsonRoot[i].priceList.length; j++) {
                    var price = new PriceData();
                    var data = jsonRoot[i].priceList[j];
                    price.lowprice = data[0];
                    price.highprice = data[1];
                    price.probability = data[2];
                    goodsData.priceList[j] =  price;
                }
                self.goodsList[i] = goodsData; 
            }
            self.reCb(true);
        });
    },

    //通过名字拿到当前的数据 不建议用，你要用我也没办法
    getDataByName:function (name) {
        var data = null;
        for (var i = this.goodsList.length - 1; i >= 0; i--) {
            if(name == this.goodsList[i].name)
            {
                data = this.goodsList[i];
                break;
            }
        }
        return data;
    },

    //通过itemid获取数据
    getDataByItemId:function(itemId){
        var data = null;
        for (var i = this.goodsList.length - 1; i >= 0; i--) {
            if(itemId == this.goodsList[i].Id)
            {
                data = this.goodsList[i];
                break;
            }
        }
        return data;
    },

    getJsonLength:function(){
        return this.goodsList.length
    },

    getDataList:function(){
        return this.goodsList;
    },

    getDataListBySex:function(Sex){
        var dataList = [];
        //var index = 0;
        for (var i = 0; i < this.goodsList.length; i++) {
            if(this.goodsList[i].sex == Sex || this.goodsList[i].sex == 0)
            {
                //dataList[index] = this.goodsList[i];
                //index += 1;
                dataList.push(this.goodsList[i])
            }
        }
        //cc.log("对应性别的玩家展示物品种类 ====== " + dataList.length);
        return dataList;
    },
});
module.exports = GoodMapDecoder;
