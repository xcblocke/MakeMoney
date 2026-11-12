
var CarData = cc.Class({
	name:"CarData",
    properties: {
        Id:cc.Integer,
        icon:"",
        name:"",
        price:cc.Integer,
        addBonus:cc.Integer, //增加名声
		addHp:cc.Integer,//增加健康值
		addDate:0,//增加约会成功率
    },
});
module.exports = CarData;
