
var AchieveCond = cc.Enum({
    AssetMoneyUp:1, //资产超过
    InHospital:2,//住院
    Bankrupt:3, //公司破产
    CreateBusiness:4, //创办公司
    AgeCond:5,//年龄限制

    HasMarryCond:6,//是否已婚
    LovePointCond:7,//亲密度要求
    AssetMoneyDown:8,//资产低于
    NoMarryCond:9, //没结婚
    AgeCondUp:10,//年龄限制
});
module.exports = AchieveCond;
