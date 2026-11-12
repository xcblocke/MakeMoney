
//公司
var CompanyStruct = cc.Class({
	name:"CompanyStruct",
	properties:{
		icon:"",
		name:"",
		Id:cc.Integer,
		LimitYear:cc.Integer, //交易收益开发年限
		isOwned:false,
		bonusRatio:0.02,//收益回报率
		stockNum:cc.Integer, //股票数量
		stockCost:0.00,//股票成本
		bankruptPrice:0.00, //破产价格
		stockPrice:15.25,//股票单价
	},

	//创办或者购买完成后
	RefreshDataAfterOper:function (data) {
		var allAss = (this.stockCost * this.stockNum) + (data.price * data.Num);
		this.stockNum += data.Num;
		this.stockCost = Math.floor(allAss / this.stockNum * 100)/100;
		this.stockPrice = data.price
		if(this.stockNum > 0)
			this.isOwned = true;
		else
			this.isOwned = false;

		cc.Mgr.UserDataMgr.hasCompany = true;
		var param = {};
		param.Id = this.Id;
		param.stockNum = this.stockNum;
		param.stockPrice = this.stockPrice;
		param.stockCost = this.stockCost;
		return param;
	},
	//出售操作刷新
	RefreshDataAfterSale:function (data) {
		this.stockNum -= data.Num;
		this.stockPrice = data.price
		if(this.stockNum > 0)
		{
			this.isOwned = true;
			cc.Mgr.UserDataMgr.hasCompany = true;
		}
		else
		{
			//cc.log("破产或者卖光了");
			this.stockCost = 0;//全部賣光
			cc.Mgr.UserDataMgr.hasCompany = false;
			cc.Mgr.UserDataMgr.CanGetStockProfit = false;
			this.isOwned = false;
		}

		var param = {};
		param.Id = this.Id;
		param.stockNum = this.stockNum;
		param.stockPrice = this.stockPrice;
		param.stockCost = this.stockCost;
		return param;
	},

	//离婚后操作刷新
	RefreshDataAfterDisvorce:function () {
		this.stockNum = Math.floor(this.stockNum * 0.8);
	},


});
module.exports = CompanyStruct;
