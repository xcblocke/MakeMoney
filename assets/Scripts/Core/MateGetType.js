//伴侣解锁条件
var MateGetType = cc.Enum({
    Money:1, //花钱                  1111
    House:2, //有房
    Car:3,//有车
    Asset:4,//资产要求  会对应一定数额   1111
    Reputation:5,//名声达到数值 对应数值
    HP:6, //健康值达到多少
    Company:7, //是否有一家公司
});
module.exports = MateGetType;