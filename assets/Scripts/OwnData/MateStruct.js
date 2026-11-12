var ItemType = require("ItemType");
var MateUnLockType = require("MateUnLockType");
//约会对象//需要更多源码联系Q:3038745955
var MateStruct = cc.Class({
	name:"MateStruct",
	properties:{
		icon:"",
		name:"",
		Id:cc.Integer,
		sex:cc.Integer, //性别 1表示男  2 表示女
		canDate:false,// 当前是否可以直接约会了
		curLevel:cc.Integer,
		unlockCond:cc.Integer,//可约条件
		LovePoint:cc.Integer,  //好感度
		UpLv:false,//是否满级
	},

	//离婚后会让伴侣状态恢复为初始状态
	ReturnInitState:function(){
		this.LovePoint = 0;
		this.canDate = false;
		if(this.unlockCond == MateUnLockType.NULL)
			this.canDate = true;

		this.curLevel = 0;
		this.UpLv = false;
	},

	//改变当前可约状态
	ChangeCanDateState:function ( flag) {
		this.canDate = flag;
	},

	RefreshAfterLvUp:function () {
		var outpar = {};
		if(this.UpLv == true)
		{
			//cc.log("已经可以滚床单了,还约什么");
			outpar.isFull = false;
			outpar.LovePoint = 100;
			return true;
		}
		var mateData = cc.Mgr.MapDataMgr.getDataByItemTypeAndId(ItemType.Mate, this.Id);
    	var lovePointList = mateData.lovePointList;
    	var bonusList = mateData.bonusList;
    	
		this.curLevel += 1;
		var index = 0;
		for (var i = lovePointList.length - 1; i >= 0; i--) {
			if(lovePointList[i].curLevel == this.curLevel)
			{
				index = i;
				break;
			}
		}
		this.LovePoint = lovePointList[index].LovePoint;
		if(this.LovePoint == 100)
		{
			this.UpLv = true; //满级了
			outpar.isFull = true;
		}
		else
		{
			outpar.isFull = false;
		}
		outpar.LovePoint = this.LovePoint;
		return outpar;
	},
});
module.exports = MateStruct;
