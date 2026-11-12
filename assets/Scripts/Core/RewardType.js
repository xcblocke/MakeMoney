//事件奖励类型  消耗类型
//无1000 金钱  1001  健康1002  名声1003 
//货物1004 车子1005 房子1006 股票1007数量
//1008 股票价格
var RewardType = cc.Enum({
    NULL:1000,
    Cash:1001,
    HP:1002,
    Reputation:1003,
    Goods:1004,
    Car:1005,
    House:1006,
    Stock:1007,
    StockPrice:1008,
});
module.exports = RewardType;
