
//房子
var HouseStruct = cc.Class({
	name:"HouseStruct",
	properties:{
		icon:"",
		name:"",
		Id:cc.Integer,
		ownNum:cc.Integer,//拥有数量
		price:cc.Integer,
		addBonus:cc.Integer, //增加名声
		addHp:cc.Integer,//增加健康值
	},

	RefreshData:function(addNum) { //为负值表示卖出去
		this.ownNum += addNum;
	},
});
module.exports = HouseStruct;
