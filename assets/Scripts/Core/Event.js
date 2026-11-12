
var Event = cc.Class({
    extends: cc.Component,
    statics:{
        ParseFinish:"ParseFinish",//解析数据完毕
        //StartScene
        AchieveTip:"AchieveTip",
        OpenUpgradeSkill:"OpenUpgradeSkill",
        AddWareHouseCapacity:"AddWareHouseCapacity",//增加仓储容量
        OpenEventTip:"OpenEventTip",
        OpenStockBonus:"OpenStockBonus",


        RefreshCashAsset:"RefreshCashAsset",//提醒刷新 现金和资产

        //GameScene
        OpenBuyTip:"OpenBuyTip",//打开购买窗口
        OpenSaleTip:"OpenSaleTip",//打开出售窗口
        OpenCommonTip:"OpenCommonTip",
        OpenCompanyCreate:"OpenCompanyCreate",//创办公司
        OpenStuckBuyTip:"OpenStuckBuyTip",//买入公司股票
        OpenStuckSaleTip:"OpenStuckSaleTip",//出售公司股票
        BuySuccess:"BuySuccess",//
        SaleSuccess:"SaleSuccess",//
        CreateCompanySuccess:"CreateCompanySuccess",//创办公司成立
        BuyStockSuccess:"BuyStockSuccess",//购买股票成立
        SaleStockSuccess:"SaleStockSuccess",//抛售股票成立
        OpenMateTip:"OpenMateTip", //打开约会提示
        DateSuccess:"DateSuccess",//约上了
        OpenCommonBuy:"OpenCommonBuy",//打开公用购买 汽车和房子
        CommonBuySaleSuccess:"CommonBuySuccess",//通用购买 出售成功
        TreatSuccess:"TreatSuccess",//治疗成功
        OpenBetTip:"OpenBetTip",//打开赌博
        BetOk:"BetOk",//赌博完成
        Retire:"Retire",//退休
        OpenEventResult:"OpenEventResult",

        OpenMarry:"OpenMarry",

        OpenTutorial:"OpenTutorial", //通知打开引导窗口

        ClockEnd:"ClockEnd",//时间转圈结束
        UseRetireAdsSkill:"UseRetireAdsSkill",//使用退休广告加持

        RefreshAllUIShow:"RefreshAllUIShow", //刷新全部Ui
        OpenUnLockMate:"OpenUnLockMate",

        DateLater:"DateLater",

        ShowRank:"ShowRank",

        OpenEnjoy:"OpenEnjoy",//打开花钱面板
    },
});
module.exports = Event;
