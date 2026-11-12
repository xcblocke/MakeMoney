
var Global = cc.Class({
    extends: cc.Component,

    statics: {
        InitGetMoneyId:1,//初始获得金钱 是第几个等级

    	CompanyCreateCost:1000,//创办公司消耗1000手 1手= 100
    	InitWareHouseCapcity:100,//仓库初始容量
    	AssetExplorRate:5,//资产暴涨定位 5倍
        AssetExplorDownRate:0.6,//资产暴涨定位 5倍
    	AssetBurden:30, //财富暴涨造成健康指数下降
    	YearRecover:1, //需要两年恢复健康
    	DateSuccescRatio:0.3, //约会到人的概率是 0.2
        LastEventAge:27,//上一次事件发生的年龄
        AddCapacityCost:10000,//扩充一个仓储容量 消耗的金钱
    	BetWinRatio:0.3,//赌博赢钱比例 先设定为 15%
        RetireInitAge:70,//退休基础年龄
        HealthLine:50,//健康值红线

        showStockProfit:false,//显示股票收益

        HasCompanyReputationAdd:4, //拥有公司时候 会增加的名声 每年

        GoodsForeId:-1, //市场前瞻用的保留数据 Id
        //以下是可变动数据

        TempAdsBonus:0, //临时广告加成
        TempAdsBetBonus:0,
        TempAdsAssetBonus:0,
        TempAdsStockBonus:0,

        BetInitCost:1000,//赌博初始花费
        DateInitCost:1000, //约会的最低起价 今后每次递增 2 倍

        tmpRetireAgeBonues:5,//临时广告退休年龄加成
        useRetireAds:false,
        
        //成就完成所需数据记录
        goToHospital:0, //进入医院次数
        BankruptTimes:0, //破产次数
        CreateCompanyTimes:0,//创业次数

        tutorialGoodsId:-1,
        tutorialStep:-1,// -1 表示不在引导序列  采用 11 表示第一个大步骤 第一小步
        tutorialInDate:false,
        tutorialInBus:false,

        HealthSubAge:40, //多少岁开始健康随年龄下降
        //健康状态
        HpStateA:80,
        HpStateB:55,
        HpStateC:54,

        //赌博赢钱的概率 累加形式
        BetWinNullRatio:0.69,
        BetWinThreeRatio:0.85,
        BetWinFourRatio:0.95,
        BetWinFiveRatio:1.0,


        //是否激活了什么
        hasActiveGuShen:false,
        hasActiveCaiShen:false,
        hasActiveDuShen:false,
        hasActiveAiShen:false,

        InitChangeData:function(){
            this.GoodsForeId = -1;
            this.tutorialGoodsId = -1;
            this.tutorialInBus = false;
            this.tutorialInDate = false;
            this.tutorialStep = -1;
            this.BetInitCost = 1000;//赌博初始花费
            this.DateInitCost = 1000; //约会的最低起价 今后每次递增 2 倍

            this.showStockProfit = false;
            this.useRetireAds = false,
            this.tmpRetireAgeBonues = 5;

            this.BetWinRatio = 0.25;

            this.TempAdsBonus = 0;
            this.TempAdsStockBonus = 0;
            this.TempAdsAssetBonus = 0;
            this.TempAdsBetBonus = 0;
            
            //成就完成所需数据记录
            this.goToHospital = 0; //进入医院次数
            this.BankruptTimes = 0; //破产次数
            this.CreateCompanyTimes = 0;//创业次数

            //之前激活
            this.hasActiveAiShen = false;
            this.hasActiveDuShen = false;
            this.hasActiveCaiShen = false;
            this.hasActiveGuShen = false;
        },

        InitEventHappenAge:function()
        {
            this.LastEventAge = 25 + Math.floor(Math.random() * 6);
        },

        //生成一个随机整数  在 index1 - index2之间
        SpawnSeedBetweenTwoNum:function(index1, index2){
            var seed = index1 + Math.floor(Math.random() * (index2 - index1 + 1));
            return seed;
        },


        getTranslation:function(desId){
            for (var prop in cc.director.NoticeText) {
                if(prop.toString() == desId)
                {
                    return cc.director.NoticeText[prop];
                }
            }
            var des = "翻译字段null";
            return des;
        },

        FormatNum:function(num){
            num = num +'';
            var str = "";
            for(var i=num.length- 1,j=1;i>=0;i--,j++){  
                if(j%3==0 && i!=0){//每隔三位加逗号，过滤正好在第一个数字的情况  
                    str+=num[i]+",";//加千分位逗号  
                    continue;  
                }  
                str+=num[i];//倒着累加数字
            }  
            var out = str.split('').reverse().join("");//字符串=>数组=>反转=>字符串
            if(out[0] == ',')
                return out.splice(0,1)
            return out;
        },
    },
});
module.exports = Global;
