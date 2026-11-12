var ProData = require("ProData");
var CompanyData = cc.Class({
    name:"CompanyData",
    properties: {
        Id:cc.Integer,
        icon:"",
        name:"",
        inPrice:15.20,// 价格
        outPrice:15.20,//破产点
        LimitYear:cc.Integer, //限制交易年限
        bonusRatio:0.02,
        proList:[ProData], //盈亏
        unList:[ProData],//没有买到时候的盈亏刷新比例
    },
});
