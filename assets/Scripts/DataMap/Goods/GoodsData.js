var PriceData = require("PriceData");
var GoodsData = cc.Class({
	name:"GoodsData",
    properties: {
    	icon:"",
    	name:"",
    	Id:cc.Integer,
        priceList:[PriceData],
    },
});
module.exports = GoodsData;
