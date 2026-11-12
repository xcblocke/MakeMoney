var ItemType = require("ItemType");
var RewardType = require("RewardType");
var MateBonusType = require("MateBonusType");
var SkillType = require("SkillType");
var MateUnLockType = require("MateUnLockType");
var MateGetType = require("MateGetType");
var UserState = require("UserState");
var AchieveCondData = require("AchieveCondData");
var AchieveCond = require("AchieveCond");

//以下的数据要做永久保存
var SkillStruct = require("SkillStruct");
var AchieveStruct = require("AchieveStruct");
var RecordStruct = require("RecordStruct");
//下面的数值是不会永久保存的  指只会当局游戏保存
var GoodsStruct = require("GoodsStruct");
var CarStruct = require("CarStruct");
var HouseStruct = require("HouseStruct");
var CompanyStruct = require("CompanyStruct");
var MateStruct = require("MateStruct");

//数据操作结构
var UserDataMgr = cc.Class({
    extends: cc.Component,

    properties:{
    	//本地保存数据
    	tutorialInBus:false,
    	tutorialInDate:false,
    	tutorialInMarket:false,
    	tutorialStockBonus:false,
    	tutorialMatePoint:false,

    	VideoLastTime:"",//每天看视频时间记录
    	VideoAdsTimes:cc.Integer,//次数

    	playTimes:cc.Integer,//游戏次数
		playerName:"Alex",
		Sex:cc.Integer, //1 man  2 woman
        SkillList:{
        	default:[],
        	type:[SkillStruct],
        },
        AchievementList:{
        	default:[],
        	type:[AchieveStruct],
        },

        RecordList:{
        	default:[],
        	type:[RecordStruct],
        },

        MarryAge:cc.Integer,
        MarryRoleId:cc.Integer,
        DivorceAge:cc.Integer,
        FundationAge:cc.Integer,
        FundationCompanyId:cc.Integer,
        BankruptAge:cc.Integer,
        MillionAge:cc.Integer,
        TenMillionAge:cc.Integer,
        HundredMillionAge:cc.Integer,

        //非本地保存数据
        RetireAge:cc.Integer, //退休年龄 这个值跟成就有关
        BetWinRatio:0.15, //賭博贏概率
        DateSuccescRatio:0.2, //約會成功概率
        //BetCost:cc.Integer,//赌博花费
        HighAssets:cc.Integer,//资产巅峰值
        InitMoney:cc.Integer,//刚出来闯荡时候的所有资产
        Cash:cc.Integer,//现金
		HpPoint:cc.Integer,//健康指数
		Age:cc.Integer,//年龄
		Honor:cc.Integer, //头衔 1 百万富翁 等等  这个在玩到一亿元之后会有新的玩意
		Reputation:cc.Integer, //名声指数
		AssetsMoney:cc.Integer, //总资产
		WareHouseCapcity:cc.Integer,//仓库剩余容量
		WareHouseAllCapcity:cc.Integer,//仓库总容量
		hasCompany:false,//是否已经创办公司
		CanGetStockProfit:false, //能否计算股票收益了
		RecoverYear:0,// 从恢复健康 剩余年限

		SkillBonusPoint:0,//技能点

		//加成点 伴侣加成  技能加成 
		TreatBonus: 0.0, //治疗花费降低百分点
		WareHouseCapcityBonus:0, //仓储加成
		CashBonus:0, //金钱加成 每年加成
		CashRationBonus:0,
		ReputationBonus:0, //名声加成 每年
		HpPointBonus:0, //健康加成
		WareHouseBonusEveryYear:0, //每年的仓储加成
		RetireBonus:0, //增加退休年限
		DateBonus:0.0, //增加约会成功概率
		InitMoneyBonus:0,//增加初始现金
		StockAddBonus:0.0, //增加公司收益
		StockUpBonus:0.0, //股票上涨 概率增加
		DateMoneyBonus:0.0, //约会花费降低
		BetBonus:0.0, //赌博赢钱概率上升
		SkillPointGetBonus:0.0 ,//结算技能点获得提升
		ReputationInitBonus:0, //初始名声加成
		CarBuyBonus:0, //购买汽车价格降低
		EventCostBonus:0, //事件消耗金钱降低
		HouseBuyBonuse:0, //购买房屋 价格降低

		HistoryHighAssets:0,// 记录历史退休最高资产

		userState:{
			default:UserState.OK,
			type:UserState,
		},// 玩家状态

		EventDataIdList:{
			default:[],
			type:[cc.Integer],
		},//事件弹出 Id列表

		GoodsList:{
			default:[],
			type:[GoodsStruct],
		},
		CarList:{
			default:[],
			type:[CarStruct],
		},
		HouseList:{
			default:[],
			type:[HouseStruct],
		},
		CompanyList:{
			default:[],
			type:[CompanyStruct],
		},
		MateList:{
			default:[],
			type:[MateStruct],
		},

		//当前显示的五个物品 每次只显示五个物品  只保存 Id
		ShowGoodsList:{
			default:[],
			type:[cc.Integer],
		},

	},

	JudeGoodsOwned:function(Id){
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(this.GoodsList[i].Id == Id && this.GoodsList[i].ownNum > 0)
			{
				return true;
			}
		}
		return false;
	},

	//清理市场显示数据
	ClearShowGoodsList:function(){
		this.ShowGoodsList.splice(0, this.ShowGoodsList.length);
	},

	//向显示数组中插入一个 显示数据 Id
	InsertGoodsIdToList:function(Id){
		this.ShowGoodsList.push(Id);
	},
	//检查Id 是否当前显示
	CheckIdIsInShowList:function(Id){
		var flag = false;
		for (var i = this.ShowGoodsList.length - 1; i >= 0; i--) {
			if(this.ShowGoodsList[i] == Id)
			{
				flag = true;
				break;
			}
		}
		return flag;
	},

	initData:function () {
		cc.Mgr.initData = false;
		this.userState = UserState.OK;//健康状态

		cc.Mgr.global.InitEventHappenAge();

		//本地存储数据
		var StorageData = cc.sys.localStorage.getItem('XMB_userdata'); //作为一个整体保存起来
		if(StorageData == null || StorageData == "")
		{
			//cc.log("还没有保存过持久数据");
			var userdata = {};
			userdata.SkillList = null;
			userdata.AchievementList = null;
			userdata.playerName = "";
			userdata.Sex = 1;
			userdata.playTimes = 0;
			userdata.SkillBonusPoint = 0;

			userdata.tutorialInBus = false;
			userdata.tutorialInDate = false;
			userdata.tutorialInMarket = false;
			userdata.tutorialStockBonus = false;
			userdata.tutorialMatePoint = false;

			userdata.VideoAdsTimes = 0;
			userdata.VideoLastTime = "";
			userdata.HistoryHighAssets = 0;

			this.VideoLastTime = "";
			this.VideoAdsTimes = 0;

			this.playerName = userdata.playerName;
			this.Sex = userdata.Sex;
			this.playTimes = userdata.playTimes;
			this.tutorialInBus = userdata.tutorialInBus;
			this.tutorialInMarket = userdata.tutorialInMarket;
			this.tutorialInDate = userdata.tutorialInDate;
			this.tutorialStockBonus = userdata.tutorialStockBonus;
			this.tutorialMatePoint = userdata.tutorialMatePoint;


			this.SkillBonusPoint = userdata.SkillBonusPoint;
			
			var SkillList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Skill);
			for (var i = 0; i < SkillList.length; i++) {
				var data = SkillList[i];
				var sk = new SkillStruct();
				sk.name = data.name;
				sk.icon = data.icon;
				sk.Id = data.Id;
				sk.desId = data.desId;
				sk.subId = data.subId;
				sk.Uplv = data.upLevel;
				sk.skillType = data.skillType;
				sk.level = 0;
				this.SkillList[i] = sk;
			}
			var AchievementList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Achieve);
			for (var i = 0; i < AchievementList.length; i++) {
				var data = AchievementList[i];
				var ac = new AchieveStruct();
				ac.Id = data.Id;
				ac.icon = data.icon;
				ac.name = data.name;
				ac.desId = data.desId;
				ac.hasFinish = false;
				this.AchievementList[i] = ac;
			}
			userdata.SkillList = this.SkillList;
			userdata.AchievementList = this.AchievementList;
			
			userdata.RecordList = this.RecordList;

			cc.sys.localStorage.setItem('XMB_userdata',JSON.stringify(userdata));
			
		}
		else
		{
			//cc.log("有之前保存的持久数据存在");
			var Data = JSON.parse(StorageData);
			this.playerName = Data.playerName;
			this.Sex = Data.Sex;
			this.playTimes = Data.playTimes;
			this.tutorialInBus = Data.tutorialInBus;
			this.tutorialInMarket = Data.tutorialInMarket;
			this.tutorialInDate = Data.tutorialInDate;
			this.tutorialStockBonus = Data.tutorialStockBonus;
			this.tutorialMatePoint = Data.tutorialMatePoint;

			this.HistoryHighAssets = Data.HistoryHighAssets;

			this.SkillList = Data.SkillList;
			this.SkillBonusPoint = Data.SkillBonusPoint;
			this.AchievementList = Data.AchievementList;
			this.VideoLastTime = Data.VideoLastTime;

			var testDate = new Date();
			
			//cc.log("++++++++++++++++++++++++++ " + testDate.toDateString());
			if(Data.VideoLastTime != testDate.toDateString())
			{
				this.VideoAdsTimes = 0;
			}
			else
			{
				this.VideoAdsTimes = Data.VideoAdsTimes;
			}

			if(Data.RecordList != null)
				this.RecordList = Data.RecordList;
		}

		//获取其实天赋点加成
		this.GetInitSkillBonus(this.SkillList);

		this.MarryAge = 0;
        this.MarryRoleId = 0;
        this.DivorceAge = 0;
        this.FundationAge = 0;
        this.FundationCompanyId = 0;
        this.BankruptAge = 0;
        this.MillionAge = 0;
        this.TenMillionAge = 0;
        this.HundredMillionAge = 0;


		//初始化 玩一局的数据
		this.retireAge = cc.Mgr.global.RetireInitAge + this.RetireBonus;
		this.BetWinRatio = cc.Mgr.global.BetWinRatio + (this.BetBonus / 100); //后面还会要加上加成
		this.DateSuccescRatio = cc.Mgr.global.DateSuccescRatio + (this.DateBonus / 100);
		this.Cash = 0;
		this.HighAssets = 0;
		this.HpPoint = 100;
		this.RecoverYear = 0;
		this.userState = UserState.OK;
		this.Age = 20;
		this.Honor = 0; //没有头衔
		this.Reputation = this.ReputationInitBonus; //名声
		this.AssetsMoney = 0;//资产

		this.WareHouseBonusEveryYear = 0;
	
		this.WareHouseCapcity = cc.Mgr.global.InitWareHouseCapcity + this.WareHouseCapcityBonus;//仓库容量初始定100  这个值到时要根据 成就定
		this.WareHouseAllCapcity = cc.Mgr.global.InitWareHouseCapcity + this.WareHouseCapcityBonus;
		this.hasCompany = false;//没有公司
		this.CanGetStockProfit = false;//还不能计算股票收益

		
		var GoodsList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Goods);
		for (var i = 0; i < GoodsList.length; i++) {
			var data = GoodsList[i];
			var ac = new GoodsStruct();
			ac.name = data.name;
			ac.Id = data.Id;
			ac.icon = data.icon;
			ac.ownNum = 0;
			ac.buyPrice = 0; //买入价格
			ac.marketPrice = 0;//市场价格
			this.GoodsList[i] = ac;
		}

		var CarList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Car);
		for (var i = 0; i < CarList.length; i++) {
			var data = CarList[i];
			var ac = new CarStruct();
			ac.Id = data.Id;
			ac.icon = data.icon;
			ac.name = data.name;
			ac.ownNum = 0;
			ac.price = data.price;
			ac.addBonus = data.addBonus;
			ac.addHp = data.addHp;
			ac.addDate = data.addDate;
			this.CarList[i] = ac;
		}

		var HouseList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.House);
		for (var i = 0; i < HouseList.length; i++) {
			var data = HouseList[i];
			var ac = new HouseStruct();
			ac.Id = data.Id;
			ac.icon = data.icon;
			ac.name = data.name;
			ac.ownNum = 0;
			ac.price = data.price;
			ac.addBonus = data.addBonus;
			ac.addHp = data.addHp;
			this.HouseList[i] = ac;
		}

		var CompanyList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Company);
		for (var i = 0; i < CompanyList.length; i++) {
			var data = CompanyList[i];
			var ac = new CompanyStruct();
			ac.Id = data.Id;
			ac.icon = data.icon;
			ac.name = data.name;
			ac.bonusRatio = data.bonusRatio;
			ac.isOwned = false;
			ac.stockNum = 0;
			ac.stockCost = 0;
			ac.bankruptPrice = data.outPrice;
			ac.stockPrice = data.inPrice;
			ac.LimitYear = data.LimitYear;
			this.CompanyList[i] = ac;
		}

		var MateList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.Mate);
		for (var i = 0; i < MateList.length; i++) {
			var data = MateList[i];
			var ac = new MateStruct();
			ac.Id = data.Id;
			ac.icon = data.icon;
			ac.name = data.name;
			ac.sex = data.sex;
			ac.LovePoint = 0;
			ac.canDate = false;
			ac.unlockCond = data.unlockCond;
			if(data.unlockCond == MateUnLockType.NULL)
			{
				ac.canDate = true;
			}
			////cc.log(data.name + " 是否可以直接约会 " + data.unlockCond);
			ac.curLevel = 0;//等级
			ac.UpLv = false;//没有满级
			this.MateList[i] = ac;
		}
		//保存下 事件Id 每次刷一次事件  就会剔除一次
		var EventList = cc.Mgr.MapDataMgr.getDataListByItemType(ItemType.EventData);
		for (var i = 0; i < EventList.length; i++) {
			var data = EventList[i];
			this.EventDataIdList[i] = data.Id;
		}

		cc.Mgr.initData = true;
	},

	//初始 天赋技能获得加成数据
	GetInitSkillBonus:function(skillList)
	{
		this.TreatBonus = 0;  //治疗花费降低百分点
		this.WareHouseCapcityBonus = 0;  //仓储加成
		this.CashBonus = 0;  //金钱加成 每年加成
		this.CashRationBonus = 0;
		this.ReputationBonus = 0;  //名声加成 每年
		this.HpPointBonus = 0;  //健康加成
		this.RetireBonus = 0;  //增加退休年限
		this.DateBonus = 0;  //增加约会成功概率
		this.InitMoneyBonus = 0; //增加初始现金
		this.StockAddBonus = 0;  //增加公司收益
		this.StockUpBonus = 0;  //股票上涨 概率增加
		this.DateMoneyBonus = 0;  //约会花费降低
		this.BetBonus = 0;  //赌博赢钱概率上升
		this.SkillPointGetBonus = 0;  //结算技能点提升
		this.ReputationInitBonus = 0;  //初始名声加成
		this.CarBuyBonus = 0;  //购买汽车价格降低
		this.EventCostBonus = 0;  //事件消耗金钱降低
		this.HouseBuyBonuse = 0; //购买房屋 价格降低

		for (var i = 0; i < skillList.length; i++) {
			var data = skillList[i];
			//获得数据
			var bonus = cc.Mgr.MapDataMgr.getSkillAddBonusByTwoIdAndLv(data.Id, data.subId, data.level);
			////cc.log(data.skillType + "++++++++++++初始技能加成+++++++++++"+bonus);
			switch (data.skillType) {
				case SkillType.WLNS:
					this.WareHouseCapcityBonus = bonus; //已經計算
					break;
				case SkillType.THY:
					this.DateBonus = bonus; //百分比  已經計算
					break;
				case SkillType.XSJY:
					this.CashRationBonus = bonus; //已经加入计算
					break;
				case SkillType.FGZJ:
					this.InitMoneyBonus = bonus; //已经计算
					break;
				case SkillType.GSGL:
					this.StockAddBonus = bonus; //百分百 已经计算
					break;
				case SkillType.TPGS:
					this.StockUpBonus = bonus; //百分比 已经计算
					break;
				case SkillType.JZCC:
					this.SkillPointGetBonus = bonus; //百分比  已經計算
					break;
				case SkillType.MLSZ:
					this.DateMoneyBonus = bonus; //百分比 一计算
					break;
				case SkillType.DS:
					this.BetBonus = bonus; //百分比 已經計算
					break;
				case SkillType.LDYZ:
					this.RetireBonus = bonus; //已經算進去
					break;
				case SkillType.NSCM:
					this.ReputationInitBonus = bonus; //已經計算
					break;
				case SkillType.QCDR:
					this.CarBuyBonus = bonus; //百分比 一計算
					break;
				case SkillType.HYLL:
					this.EventCostBonus = bonus; //百分比 一计算
					break;
				case SkillType.DCZJ:
					this.HouseBuyBonuse = bonus;  //百分比 一計算
					break;
			}
		}
	},

	//获取每年都会获得的加成数额
	GetBonusRewardEveryYear:function () {
		// 包括 金钱 名声 健康值
		this.Cash += this.CashBonus;
		this.Cash = Math.floor(this.Cash * (1+this.CashRationBonus));
		if(this.Cash < 100)
			this.Cash = 0;
		this.Reputation += this.ReputationBonus;
		if(this.Reputation < 0)
			this.Reputation = 0;
		this.HpPoint += this.HpPointBonus;
		if(this.HpPoint > 100)
		{
			this.HpPoint = 100;
		}

		this.WareHouseCapcity += this.WareHouseBonusEveryYear;
		this.WareHouseAllCapcity += this.WareHouseBonusEveryYear;
		if(this.WareHouseCapcity > 200)
			this.WareHouseCapcity = 200;
		if(this.WareHouseAllCapcity > 200)
			this.WareHouseAllCapcity = 200;
	},

	//获取一次事件id  并从数列中剔除这个 Id
	GetEventDataAndSpliceId:function(){
		var len = this.EventDataIdList.length;
		//cc.log("11 事件数据剩余个数 = " + len);
		var seed = Math.floor(Math.random() * len);
		var out = this.EventDataIdList[seed];
		this.EventDataIdList.splice(seed, 1);
		//cc.log(out + "  事件数据剩余个数 = " + this.EventDataIdList.length);
		return out;
	},

	RefreshHistoryHighAsset:function(asset){
		this.HistoryHighAssets = asset;
	},

	//保存本地数据
	SaveUserData:function(){
		var userdata = {};
		userdata.playerName = this.playerName;
		userdata.Sex = this.Sex;
		userdata.SkillList = this.SkillList;
		//引导步骤
		userdata.tutorialInMarket = this.tutorialInMarket;
		userdata.tutorialInDate = this.tutorialInDate;
		userdata.tutorialInBus = this.tutorialInBus;
		userdata.tutorialStockBonus = this.tutorialStockBonus;
		userdata.tutorialMatePoint = this.tutorialMatePoint;

		userdata.HistoryHighAssets = this.HistoryHighAssets;

		userdata.VideoAdsTimes = this.VideoAdsTimes;
		userdata.VideoLastTime = this.VideoLastTime;

		userdata.playTimes = this.playTimes;
		userdata.AchievementList = this.AchievementList;
		userdata.RecordList = this.RecordList;
		userdata.SkillBonusPoint = this.SkillBonusPoint;
		cc.sys.localStorage.setItem('XMB_userdata',JSON.stringify(userdata));
	},

	CreateRecord:function(){
		var reD = new RecordStruct();
		
		var asLv = 0;
		var td = Math.floor(this.AssetsMoney / 1000000);
		if(td > 0 && td < 10)
		{
			asLv = 1;
		}
		else if(td > 10 && td < 100)
		{
			asLv = 2;
		}
		else if(td > 100)
		{
			asLv = 3;
		}
		reD.retireAge = this.Age;
		reD.level = asLv;
		reD.assets = this.AssetsMoney;
		reD.highAssets = this.HighAssets;
		
		this.RecordList.push(reD);
		//this.SaveUserData();
	},

	//升级技能点
	UpGradeSkill:function(Id, subId, toLv){
		var isOk = false;
		var NeedCost = cc.Mgr.MapDataMgr.getUpgradeCostByTwoId(Id, subId, toLv);
        if(this.SkillBonusPoint < NeedCost)
        	return false;

        //不要求升级满技能即可升级下一个技能
		for (var i = 0; i < this.SkillList.length; i++) {
			if(this.SkillList[i].Id == Id && this.SkillList[i].subId + 1 == subId)
			{
				if(this.SkillList[i].level == 0)
				{
					//cc.log("上一个技能还没有升级到满级");
					return false;
				}
				//if(this.SkillList[i].level != this.SkillList[i].Uplv)
				//{
					//cc.log("上一个技能还没有升级到满级");
				//	return false;
				//}
			}
		}
		

		for (var i = 0; i < this.SkillList.length; i++) {
			if(this.SkillList[i].Id ==Id && this.SkillList[i].subId == subId)
			{
				if(this.SkillList[i].level < this.SkillList[i].Uplv)
				{
					this.SkillList[i].level++;
					this.SkillBonusPoint -= NeedCost;
					isOk = true;
				}
				else
				{
					isOk = false;
				}
				break;
			}
		}	
		return isOk;
	},

	CanShowUpTip:function(Id, subId, toLv){
		var isOk = false;
		var NeedCost = cc.Mgr.MapDataMgr.getUpgradeCostByTwoId(Id, subId, toLv);
        if(this.SkillBonusPoint < NeedCost)
        	return false;

     
		for (var i = 0; i < this.SkillList.length; i++) {
			if(this.SkillList[i].Id == Id && this.SkillList[i].subId + 1 == subId)
			{
				if(this.SkillList[i].level == 0)
				{
					//cc.log("上一个技能还没有升级到满级");
					return false;
				}
				//if(this.SkillList[i].level != this.SkillList[i].Uplv)
				//{
					//cc.log("上一个技能还没有升级到满级");
				//	return false;
				//}
			}
		}
		

		for (var i = 0; i < this.SkillList.length; i++) {
			if(this.SkillList[i].Id ==Id && this.SkillList[i].subId == subId)
			{
				if(this.SkillList[i].level < this.SkillList[i].Uplv)
				{
					isOk = true;
				}
				else
				{
					isOk = false;
				}
				break;
			}
		}	
		return isOk;
	},

	//完成指定成就
	FinishAchievement:function(Id){
		var isOk = false;
		for (var i = 0; i < this.AchievementList.length; i++) {
			if(this.AchievementList[i].Id == Id)
			{
				this.AchievementList[i].hasFinish = true;
				isOk = true;
				break;
			}
		}
		return isOk;
	},
	//买入物品
	BuyGoods:function(data){ //data 包含 Id buyprire buynum
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(data.Id == this.GoodsList[i].Id)
			{
				return this.GoodsList[i].RefeshDataAfterBuy(data);
			}
		}
	},
	//出售物品
	SaleGoods:function(data){
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(data.Id == this.GoodsList[i].Id)
			{
				return this.GoodsList[i].RefeshDataAfterSale(data);
			}
		}
	},

	//创办公司
	CreateCompany:function(data){
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			if(data.Id == this.CompanyList[i].Id)
			{
				return this.CompanyList[i].RefreshDataAfterOper(data);
			}
		}
	},

	//查看一下是否已经拥有五種物品
	CheckOwnedGoodsNum:function(){
		var Num = 0;
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(this.GoodsList[i].ownNum > 0)
			{
				Num += 1;
			}
		}
		var Isfull = false;
		if(Num == 5)
		{
			Isfull = true;
		}
		return Isfull;
	},

	//购买股票
	BuyStocks:function(data){
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			if(data.Id == this.CompanyList[i].Id)
			{
				return this.CompanyList[i].RefreshDataAfterOper(data);
			}
		}
	},

	//出售股票
	SaleStocks:function(data){
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			if(data.Id == this.CompanyList[i].Id)
			{
				return this.CompanyList[i].RefreshDataAfterSale(data);
			}
		}
	},

	BuySaleCommonItem:function(data){
		//cc.log("=============" + data.Type + "  Id = "+ data.Id)
		if(data.Type == ItemType.Car)
		{
			for (var i = this.CarList.length - 1; i >= 0; i--) {
				if(this.CarList[i].Id == data.Id)
				{
					this.CarList[i].RefreshData(data.addNum);
				}
			}
		}
		else if(data.Type == ItemType.House)
		{
			for (var i = this.HouseList.length - 1; i >= 0; i--) {
				if(this.HouseList[i].Id == data.Id)
				{
					this.HouseList[i].RefreshData(data.addNum);
				}
			}
		}
	},

	//刷新约会的亲密度
	RefreshMateData:function(Id){
		for (var i = this.MateList.length - 1; i >= 0; i--) {
			if(Id == this.MateList[i].Id)
			{
				return this.MateList[i].RefreshAfterLvUp();
			}
		}
	},

	//根據id解除婚姻
	DisvorceMateById:function(Id){
		for (var i = 0; i < this.MateList.length; i++) {
			if(this.MateList[i].Id == Id)
			{
				this.MateList[i].ReturnInitState();
				var data = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate, Id);
				this.DeleteMateBonusReward(data.bonusList);
				//现金 股票减少 名声 健康受损
				this.Cash = Math.floor(this.Cash * 0.8);
				this.HpPoint = Math.floor(this.HpPoint * 0.8);
				this.Reputation = Math.floor(this.Reputation * 0.8);
				this.DisvorceDelStocks();
				break;
			}
		}
	},

	DisvorceDelStocks:function(){
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			if(this.CompanyList[i].stockNum > 0)
			{
				this.CompanyList[i].RefreshDataAfterDisvorce();
				return;
			}
		}
	},

	//获得伴侣加成 结婚后获得
	getMateBonusReward:function(data){
		for (var i = 0; i < data.length; i++) {
			var dt = data[i];
			//cc.log("+++++++++++++++++++++oooooo+++++++++++++++++++++++" + dt.bonusNum);
			if(dt.bonusType == MateBonusType.NULL)
			{
				//cc.log("伴侣加成什么也没有");
			}
			else if(dt.bonusType == MateBonusType.HP)
			{
				this.HpPointBonus += dt.bonusNum;
			}
			else if(dt.bonusType == MateBonusType.Money)
			{
				this.CashBonus += dt.bonusNum;
			}
			else if(dt.bonusType == MateBonusType.Reputation)
			{
				this.ReputationBonus += dt.bonusNum;
			}
			else if(dt.bonusType == MateBonusType.WareHouseCapcity)
			{
				this.WareHouseCapcity += dt.bonusNum;
				this.WareHouseAllCapcity += dt.bonusNum;
				this.WareHouseBonusEveryYear += dt.bonusNum;

				if(this.WareHouseAllCapcity > 200)
					this.WareHouseAllCapcity = 200;
				if(this.WareHouseCapcity > 200)
					this.WareHouseCapcity = 200;
			}
			else if(dt.bonusType == MateBonusType.Treat)
			{
				this.TreatBonus += dt.bonusNum;
			}
		}
	},

	//移除伴侣获得的天赋加成
	DeleteMateBonusReward:function(data)
	{
		for (var i = 0; i < data.length; i++) {
			var dt = data[i];
			//cc.log("+++++++++++++++++++++oooooo+++++++++++++++++++++++" + dt.bonusNum);
			if(dt.bonusType == MateBonusType.NULL)
			{
				//cc.log("伴侣加成什么也没有");
			}
			else if(dt.bonusType == MateBonusType.HP)
			{
				this.HpPointBonus -= dt.bonusNum;
			}
			else if(dt.bonusType == MateBonusType.Money)
			{
				this.CashBonus -= dt.bonusNum;
			}
			else if(dt.bonusType == MateBonusType.Reputation)
			{
				this.ReputationBonus -= dt.bonusNum;
				if(this.ReputationBonus < 0)
					this.ReputationBonus = 0;
			}
			else if(dt.bonusType == MateBonusType.WareHouseCapcity)
			{
				//this.WareHouseCapcity -= dt.bonusNum;
				//this.WareHouseAllCapcity -= dt.bonusNum;
				this.WareHouseBonusEveryYear -= dt.bonusNum;
				if(this.WareHouseBonusEveryYear < 0)
					this.WareHouseBonusEveryYear = 0;
			}
			else if(dt.bonusType == MateBonusType.Treat)
			{
				this.TreatBonus -= dt.bonusNum;
			}
		}
	},

	getOwnDataListByType:function(itemType){
		var dataList = null;
		switch (itemType) {
			case ItemType.Goods:
				dataList = this.GoodsList;
				break;
			case ItemType.Skill:
				dataList = this.SkillList;
				break;
			case ItemType.Car:
				dataList = this.CarList;
				break;
			case ItemType.House:
				dataList = this.HouseList;
				break;
			case ItemType.Achieve:
				dataList = this.AchievementList;
				break;
			case ItemType.Company:
				dataList = this.CompanyList;
				break;
			case ItemType.Mate:
				dataList = this.MateList;
				break;
		}
		return dataList;
	},

	//获取已有数据 根据 类型和Id
	getDataByItemTypeAndId:function(itemType, Id){
		var dataList = null;
		switch (itemType) {
			case ItemType.Goods:
				dataList = this.GoodsList;
				break;
			case ItemType.Skill:
				dataList = this.SkillList;
				break;
			case ItemType.Car:
				dataList = this.CarList;
				break;
			case ItemType.House:
				dataList = this.HouseList;
				break;
			case ItemType.Achieve:
				dataList = this.AchievementList;
				break;
			case ItemType.Company:
				dataList = this.CompanyList;
				break;
			case ItemType.Mate:
				dataList = this.MateList;
				break;
		}
		if(dataList != null)
		{
			for (var i = dataList.length - 1; i >= 0; i--)
			{
				if(Id == dataList[i].Id)
				{
					return dataList[i];
				}
			}
		}
		//如果没有数据 为 null
		return null;
	},
	//刷新物品市场价格
	RefreshGoodsMarKetPrice:function(Id,marketPrice){
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(Id == this.GoodsList[i].Id)
			{
				this.GoodsList[i].marketPrice = marketPrice;
				break;
			}
		}
	},

	//刷新股票商场价格和成本
	RefreshStockData:function(Id, param){
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			if(Id == this.CompanyList[i].Id)
			{
				this.CompanyList[i].stockPrice = param.stockPrice;
				this.CompanyList[i].stockCost = param.stockCost;
				break;
			}
		}
	},

	//获取拥有的物品对应数据
	getGoodsDataById:function(Id){
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			if(Id == this.GoodsList[i].Id)
			{
				return this.GoodsList[i];
			}
		}
	},

	//刷新个人资产  //caculateStock 是否計算股票收益
	RefreshUserAssets:function(caculateStock){
		var lastAsset = this.AssetsMoney;
		var assets = 0;
		//计算所拥有物品总价
		for (var i = this.GoodsList.length - 1; i >= 0; i--) {
			var data = this.GoodsList[i];
			var flag = this.CheckIdIsInShowList(data.Id);
			if(flag == true)
			{
				assets += data.ownNum * data.marketPrice;
			}
			else
			{
				assets += data.ownNum * data.buyPrice;
			}
		}
		//计算房屋拥有
		for (var i = this.HouseList.length - 1; i >= 0; i--) {
			var dt = this.HouseList[i];
			if(dt.ownNum > 0)
			{
				////cc.log(dt.Id + " 房子的数量和价格 " + dt.ownNum + " " + dt.price);
				assets += dt.ownNum * dt.price;
			}
		}
		//计算车子所有
		for (var i = this.CarList.length - 1; i >= 0; i--) {
			var dt = this.CarList[i];
			if(dt.ownNum > 0)
			{
				assets += dt.ownNum * dt.price;
			}
		}

		//后面再加上 股票收益
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			var da = this.CompanyList[i];
			if(da.stockNum > 0)
			{
				//this.Reputation += cc.Mgr.global.HasCompanyReputationAdd;
				assets += Math.floor(da.stockNum * da.stockPrice);
				if(this.CanGetStockProfit == true && caculateStock == true)
				{
					this.Cash += Math.floor(da.stockNum * da.stockPrice * (da.bonusRatio + (this.StockAddBonus / 100)));
				}
			}
		}

		assets += this.Cash;
		//资产暴涨时候健康迅速下降 暴涨5倍下降30
		this.AssetsMoney = assets;

		this.JudeFinishAnyAchievement(5); //成就 Id = 5 资产相关
		this.JudeFinishAnyAchievement(4); //成就 Id = 6  

		cc.log(lastAsset + " L =========他妈的资产问题======== N " + assets);
		if(assets > this.HighAssets)
		{
			this.HighAssets = assets;
		}

		if(assets > 1000000 && this.MillionAge == 0)
		{
			this.MillionAge = this.Age;
		}

		if(assets > 10000000 && this.TenMillionAge == 0)
		{
			this.TenMillionAge = this.Age;
		}

		if(assets > 100000000 && this.HundredMillionAge == 0)
		{
			this.HundredMillionAge = this.Age;
		}

		if(Math.floor(assets / lastAsset) >= cc.Mgr.global.AssetExplorRate || (assets / lastAsset) <= cc.Mgr.global.AssetExplorDownRate)
		{
			if(this.userState == UserState.NotOK)
				return;

			this.HpPoint -= cc.Mgr.global.AssetBurden;
			if(this.HpPoint < cc.Mgr.global.HealthLine)
			{
				this.userState = UserState.NotOK;
				cc.Mgr.global.goToHospital += 1;
				this.RecoverYear = cc.Mgr.global.YearRecover;
				var param = {};
				param.forWhat = "HealthLine";
				param.text = cc.Mgr.global.getTranslation("RecoverHealth");
				cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);

				//this.UnLockMateByInHospital(MateUnLockType.InHospital, this.Sex);
			}
			else
			{
				var param = {};
				param.forWhat = "";
				param.text = cc.Mgr.global.getTranslation("RecoverHealthD");
				cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
			}
		}
	},

	JudeFinishAnyAchievement:function (Id) {
		//cc.log(this.AchievementList.length + "======================判断成就是否完成" + Id);
		for (var i = 0; i < this.AchievementList.length; i++) {
			if(this.AchievementList[i].Id == Id)
			{
				if(this.AchievementList[i].hasFinish == true)
				{
					//cc.log("该成就已经完成了");
					return;
				}
			}
		}
		var acD = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Achieve, Id);
		cc.log("======================判断成就是否完成 = " + acD.name);
		var condList = acD.condList;
		var finished = this.JudeCanFinishAchievementByCond(condList);
		if(finished)
		{
			for (var i = 0; i < this.AchievementList.length; i++) {
				if(this.AchievementList[i].Id == Id)
				{
					this.AchievementList[i].hasFinish = true;
					return;
				}
			}
		}
	},

	CaculateReputationFromCompany:function(){
		//后面再加上 股票造成的
		for (var i = this.CompanyList.length - 1; i >= 0; i--) {
			var da = this.CompanyList[i];
			if(da.stockNum > 0)
			{
				this.Reputation += cc.Mgr.global.HasCompanyReputationAdd;
				return;
			}
		}
	},

	JudeCanFinishAchievementByCond:function(condList){
		var finishedList = [];
        for (var i = 0; i < condList.length; i++) {
            var cond = condList[i];
            var finished = false;
            cc.log("类型要求 = " + cond.condType + "  数值要求 = " + cond.value);
            switch (cond.condType) {
                case AchieveCond.AssetMoneyUp:
                    finished = this.JudeAssetCond(cond.value);
                    break;
                case AchieveCond.InHospital:
                    finished = this.JudegoToHosTimesCond(cond.value);
                    break;
                case AchieveCond.Bankrupt:
                    finished = this.JudeBankruptTimesCond(cond.value);
                    break;
                case AchieveCond.CreateBusiness:
                    finished = this.JudeCreateCompanyCond(cond.value);
                    break;
                case AchieveCond.AgeCond:
                    finished = this.JudeAgeCond(cond.value);
                    break;
                case AchieveCond.HasMarryCond:
                    finished = this.JudeHasMarryCond();
                    break;
                case AchieveCond.LovePointCond:
                    finished = this.JudeLovePointCond(cond.value);
                    break;
                case AchieveCond.AssetMoneyDown:
                    finished = this.JudeAssetDownCond(cond.value);
                    break;
                case AchieveCond.NoMarryCond:
                    finished = this.JudeNotMarryCond(cond.value);
                    break;
                case AchieveCond.AgeCondUp:
                    finished = this.JudeAgeCondUp(cond.value);
                    break;
            }
            cc.log("是否完成 = " + finished);
            finishedList.push(finished);
        }
        for (var i = 0; i < finishedList.length; i++) {
        	if(finishedList[i] == false)
        		return false;
        }
        return true;
	},

	JudeAssetDownCond:function (value) {
		if(this.AssetsMoney < value * 1000000)
			return true;
		else
			return false;
	},

	//成就完成 资产限制
	JudeAssetCond:function (value) {
		if(this.AssetsMoney >= value * 1000000)
			return true;
		else
			return false;
	},

	//成就完成 年龄限制 小于
	JudeAgeCond:function (value) {
		if(this.Age <= value)
			return true;
		else
			return false;
	},

	JudeAgeCondUp:function(value){
		if(this.Age >= value)
			return true;
		else
			return false;
	}, 


	//成就完成 进医院次数
	JudegoToHosTimesCond:function (value) {
		if(cc.Mgr.global.goToHospital > value)
			return true;
		else
			return false;
	},

	//成就完成 破产次数
	JudeBankruptTimesCond:function (value) {
		if(cc.Mgr.global.BankruptTimes > value)
			return true;
		else
			return false;
	},

	//成就完成 创业次数
	JudeCreateCompanyCond:function (value) {
		if(cc.Mgr.global.CreateCompanyTimes > value)
			return true;
		else
			return false;
	},

	//成就完成 是否已婚
	JudeHasMarryCond:function () {
		for (var i = 0; i < this.MateList.length; i++) {
			if(this.MateList[i].LovePoint == 100)
			{
				return true;
			}
		}
		return false;
	},

	JudeHasCar:function(){
		for (var i = this.CarList.length - 1; i >= 0; i--) {
			if(this.CarList[i].ownNum > 0)
			{
				return true;
			}
		}
		return false;
	},

	JudeHasCarById:function(Id){
		for (var i = this.CarList.length - 1; i >= 0; i--) {
			if(this.CarList[i].ownNum > 0 && this.CarList[i].Id == Id)
			{
				return true;
			}
		}
		return false;
	},

	JudeHasHouse:function(){
		for (var i = this.HouseList.length - 1; i >= 0; i--) {
			if(this.HouseList[i].ownNum > 0)
			{
				return true;
			}
		}
		return false;
	},

	JudeHasHouseById:function(Id){
		for (var i = this.HouseList.length - 1; i >= 0; i--) {
			if(this.HouseList[i].ownNum > 0 && this.HouseList[i].Id == Id)
			{
				return true;
			}
		}
		return false;
	},

	//成就完成 是否未婚
	JudeNotMarryCond:function () {
		for (var i = 0; i < this.MateList.length; i++) {
			if(this.MateList[i].LovePoint == 100)
			{
				return false;
			}
		}
		return true;
	},

	//成就完成 亲密度人数
	JudeLovePointCond:function(value){
		var num = 0;
		for (var i = 0; i < this.MateList.length; i++) {
			if(this.MateList[i].LovePoint == 99)
			{
				num += 1;
			}
		}
		if(num >= value)
			return true;
		else
			return false;
	},

	//刷新用户年龄
	RefreshUserAge:function(){
		this.Age += 1;
		if(this.Age == (this.retireAge + 1) && cc.Mgr.global.useRetireAds == false)
		{
			cc.director.GlobalEvent.emit(cc.Mgr.Event.UseRetireAdsSkill, {});
		}
		else if(this.Age > this.retireAge && cc.Mgr.global.useRetireAds == true)
		{
			cc.director.GlobalEvent.emit(cc.Mgr.Event.Retire, {});
		}

		this.CaculateReputationFromCompany();
	},

	//刷新个人健康指数
	RefreshHealthHp:function(){
		if(this.RecoverYear > 0 && this.userState == UserState.NotOK)
		{
			this.RecoverYear -= 1;
			return;
		}
		else if(this.RecoverYear == 0 && this.userState == UserState.NotOK)
		{
			this.RecoverYear = 0;
			this.userState = UserState.OK;
			this.HpPoint = 100;
			return;
		}

		if(this.Age >= cc.Mgr.global.HealthSubAge && this.HpPoint > 0)
		{
			var seed = 2 + Math.floor(Math.random()*3);
			this.HpPoint -= seed;
			if(this.HpPoint < cc.Mgr.global.HealthLine)
			{
				this.userState = UserState.NotOK;
				cc.Mgr.global.goToHospital += 1;
				this.RecoverYear = cc.Mgr.global.YearRecover;

				var param = {};
				param.forWhat = "HealthLine";
				param.text = cc.Mgr.global.getTranslation("RecoverHealth");
				cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenCommonTip, param);
				//this.UnLockMateByInHospital(MateUnLockType.InHospital, this.Sex);
			}
		}
	},

	//技能天赋数据获取
    getSkillDataByTwoId:function(Id, subId){
        var dt = null;
        for (var i = this.SkillList.length - 1; i >= 0; i--) {
            var data = this.SkillList[i];
            if(data.Id == Id && data.subId == subId)
            {
                dt = data;
                return data;
            }
        }
        return dt;
    },

    getSkillListById:function(Id){
        var param = [];
        for (var i = this.SkillList.length - 1; i >= 0; i--) {
            var data = this.SkillList[i];
            if(data.Id == Id)
            {
                param.push(data);
            }
        }
        return param;
    },

    //花销和获得根据 
    GetOrCostDataByRewardType:function(rewardType, num, subId) //对于物品  会有一个subId
    {
    	var Pdata = {};
    	Pdata.Id = -1;
    	Pdata.companyId = -1;
    	//cc.log("++++++rewardType++++++" + rewardType);
		if(rewardType == RewardType.NULL)
    	{
    		//cc.log("啥也没有");
    	}
    	else if(rewardType == RewardType.Cash)
    	{
    		if(num < 0) //好运连连
    		{
    			num = num + Math.floor((-num)* this.EventCostBonus);
    		}
    		else
    		{
    			num + Math.floor(num* this.EventCostBonus);
    		}
    		this.Cash += num;
    		if(this.Cash < 0)
    			this.Cash = 0;
    	}
    	else if(rewardType == RewardType.HP)
    	{
    		this.HpPoint += num;
    		if(this.HpPoint >100)
    			this.HpPoint =100;
    	}
    	else if(rewardType == RewardType.Reputation)
    	{
    		this.Reputation += num;
    		if(this.Reputation < 0)
    			this.Reputation = 0;
    	}
    	else if(rewardType == RewardType.Goods)
    	{
    		for (var i = 0; i < this.GoodsList.length; i++) {
    			if(this.GoodsList[i].Id == subId)
    			{
    				if(this.WareHouseCapcity >= num)
    				{
    					var averagePrice = Math.floor((this.GoodsList[i].buyPrice * this.GoodsList[i].ownNum) / (this.GoodsList[i].ownNum + num));
	    				this.GoodsList[i].ownNum += num;
	    				//仓库减少数值
	    				this.WareHouseCapcity -= num;

	    				Pdata.Id = subId;
	    				Pdata.buyPrice = averagePrice;//this.GoodsList[i].buyPrice;
	    				Pdata.ownNum = this.GoodsList[i].ownNum;
    				}
    				break;
    			}
    		}
    	}
    	else if(rewardType == RewardType.Car)
    	{
    		for (var i = 0; i < this.CarList.length; i++) {
    			if(this.CarList[i].Id == subId)
    			{
    				this.CarList[i].ownNum += num;
    				this.Reputation += this.CarList[i].addBonus;
    				this.HpPoint += this.CarList[i].addHp;
    				if(this.HpPoint > 100)
    					this.HpPoint = 100;
    				break;
    			}
    		}
    	}
    	else if(rewardType == RewardType.House)
    	{
    		for (var i = 0; i < this.HouseList.length; i++) {
    			if(this.HouseList[i].Id == subId)
    			{
    				this.HouseList[i].ownNum += num;
    				this.Reputation += this.HouseList[i].addBonus;
    				this.HpPoint += this.HouseList[i].addHp;
    				if(this.HpPoint > 100)
    					this.HpPoint = 100;
    				break;
    			}
    		}
    	}
    	else if(rewardType == RewardType.Stock)
    	{
    		for (var i = 0; i < this.CompanyList.length; i++) {
    			if(this.CompanyList[i].Id == subId)
    			{
    				this.CompanyList[i].stockNum += num;
    				Pdata.companyId = subId;
    				break;
    			}
    		}
    	}
    	else if(rewardType == RewardType.StockPrice)
    	{
    		for (var i = 0; i < this.CompanyList.length; i++) {
    			if(this.CompanyList[i].Id == subId)
    			{
    				if(this.CompanyList[i].stockNum > 0)
    				{
    					this.CompanyList[i].stockPrice += num;
    					Pdata.companyId = subId;
    					break;
    				}
    			}
    		}
    	}
	    return Pdata;
    },

    //判断是否有房
    JudeHasHouse:function(value){
    	var flag = false;
    	if(value == 0)
    	{
	    	for (var i = 0; i < this.HouseList.length; i++) {
	    		if(this.HouseList[i].ownNum > 0)
	    		{
	    			return true;
	    		}
	    	}
    	}
    	else
    	{
    		for (var i = 0; i < this.HouseList.length; i++) {
	    		if(this.HouseList[i].ownNum > 0 && value == this.HouseList[i].Id)
	    		{
	    			return true;
	    		}
	    	}
    	}
    	return flag;
    },
    //判断是否有车
    JudeHasCar:function(value){
    	var flag = false;
    	if(value == 0)
    	{
	    	for (var i = 0; i < this.CarList.length; i++) {
	    		if(this.CarList[i].ownNum > 0)
	    		{
	    			return true;
	    		}
	    	}
    	}
    	else
    	{
    		for (var i = 0; i < this.CarList.length; i++) {
	    		if(this.CarList[i].ownNum > 0 && this.CarList[i].Id == value)
	    		{
	    			return true;
	    		}
	    	}
    	}
    	return flag;
    },

    //判断资产是否满足一定要求
    JudeAsset:function(needNum)
    {
    	var flag = false;
    	if(needNum <= this.AssetsMoney)
    	{
    		return true;
    	}
    	return flag;
    },

    //判断名声是否满足要求
    JudeReputation:function(needNum){
    	var flag = false;
    	if(needNum <= this.Reputation)
    	{
    		return true;
    	}
    	return flag;
    },

    //判断健康是否满足要求
    JudeHpPoint:function(needNum){
    	var flag = false;
    	if(needNum <= this.HpPoint)
    	{
    		return true;
    	}
    	return flag;
    },

    //判断是否有公司
    JudeHasCompany:function(){
    	return this.hasCompany;
    },

    //开放该条件下的一个 可约会对象
    UnLockOneMate:function(unlockCond, offSex){
    	var Id = -1;
    	for (var i = 0; i < this.MateList.length; i++) {
    		//var dt = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate , this.MateList[i].Id);
    		if(this.MateList[i].sex == offSex && this.MateList[i].canDate == false && this.MateList[i].unlockCond == unlockCond)
    		{
    			this.MateList[i].canDate = true;
    			Id = this.MateList[i].Id;

				var param = {};
				param.icon = this.MateList[i].icon;
				param.des = cc.Mgr.global.getTranslation("UnLockMate_" + Id);
				cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenUnLockMate, param);
    			return Id;
    		}
    	}
    	return Id;
    },

    UnLockMateByInHospital:function(unlockCond, offSex){
    	var Id = -1;
    	for (var i = 0; i < this.MateList.length; i++) {
    		//var dt = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate , this.MateList[i].Id);
    		if(this.MateList[i].sex == offSex && this.MateList[i].canDate == false && this.MateList[i].unlockCond == unlockCond)
    		{
    			this.MateList[i].canDate = true;
    			Id = this.MateList[i].Id;

				var param = {};
				param.icon = this.MateList[i].icon;
				param.des = cc.Mgr.global.getTranslation("UnLockMateByInHos");
				cc.director.GlobalEvent.emit(cc.Mgr.Event.OpenUnLockMate, param);
    			return Id;
    		}
    	}
    	return Id;
    },
    //判断是否已经拥有一个伴侣
    JudeHasAnyMate:function(){
    	var flag = false;
    	for (var i = 0; i < this.MateList.length; i++) {
    		//cc.log("是否已经结婚了 "+ this.MateList[i].Uplv);
    		if(this.MateList[i].UpLv == true)
    		{
    			flag = true;
    			return flag;
    		}
    	}
    	return flag;
    },

});

module.exports = UserDataMgr
